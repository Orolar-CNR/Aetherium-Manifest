import json
import os
import shutil
import tempfile
import unittest
import importlib.util

# Import tools/lexical/aetherium-interaction-linter-v2.py dynamically
LINTER_PATH = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "aetherium-interaction-linter-v2.py"))
spec = importlib.util.spec_from_file_location("linter_module", LINTER_PATH)
linter = importlib.util.module_from_spec(spec)
spec.loader.exec_module(linter)

class TestLexicalLinter(unittest.TestCase):

    def setUp(self):
        self.test_dir = tempfile.mkdtemp()
        self.policy = {
            "policy_version": "0.2",
            "policy_name": "Test Policy",
            "exempt_paths": [
                "test_policy.json",
                "exempt_folder/exempt_file.md",
                "exempt_linter.py"
            ],
            "scanned_extension_groups": {
                "docs_and_code": [".md", ".js", ".html", ".css", ".json"],
                "ci_and_gov": [".yml", ".yaml", ".py"]
            },
            "rules": {
                "PROHIBITED_EN": [
                    {
                        "id": "LEX-EN-001",
                        "raw_regex": "\\bsending\\s+intent\\b",
                        "description": "Prohibits sending intent",
                        "severity": "ERROR"
                    },
                    {
                        "id": "LEX-EN-002",
                        "raw_regex": "\\btransmitting\\s+intent\\b",
                        "description": "Prohibits transmitting intent",
                        "severity": "ERROR"
                    },
                    {
                        "id": "LEX-EN-003",
                        "raw_regex": "\\bintent\\s+transmission\\b",
                        "description": "Prohibits intent transmission",
                        "severity": "ERROR"
                    },
                    {
                        "id": "LEX-EN-004",
                        "raw_regex": "\\bsending\\s+intention\\b",
                        "description": "Prohibits sending intention",
                        "severity": "ERROR"
                    }
                ]
            }
        }
        self.policy_file = os.path.join(self.test_dir, "test_policy.json")
        with open(self.policy_file, "w", encoding="utf-8") as f:
            json.dump(self.policy, f)

    def tearDown(self):
        shutil.rmtree(self.test_dir)

    def _create_file(self, rel_path, content):
        full_path = os.path.join(self.test_dir, rel_path)
        os.makedirs(os.path.dirname(full_path), exist_ok=True)
        with open(full_path, "w", encoding="utf-8") as f:
            f.write(content)

    def test_prohibited_phrases_must_fail(self):
        prohibited_samples = [
            ("test.md", "This system is sending intent to the server."),
            ("test.js", "const action = 'SENDING INTENT';"),
            ("test.html", "<p>sending intent here</p>"),
            ("test.css", "/* Transmitting Intent in comments */"),
            ("test.json", '{"note": "intent transmission"}'),
            ("test.yml", "step: sending intention"),
            ("test.yaml", "step: Sending Intention"),
            ("test.py", "# sending intent in python")
        ]
        for filename, content in prohibited_samples:
            sub_dir = tempfile.mkdtemp(dir=self.test_dir)
            file_path = os.path.join(sub_dir, filename)
            with open(file_path, "w", encoding="utf-8") as f:
                f.write(content)
            # Create a policy inside sub_dir exempting policy.json
            sub_policy_file = os.path.join(sub_dir, "policy.json")
            sub_policy = dict(self.policy)
            sub_policy["exempt_paths"] = ["policy.json"]
            with open(sub_policy_file, "w", encoding="utf-8") as f:
                json.dump(sub_policy, f)

            report, _ = linter.scan_repository(sub_dir, sub_policy_file)
            self.assertEqual(report["status"], "FAIL", f"Expected FAIL for phrase in {filename}: {content}")
            self.assertTrue(len(report["violations"]) > 0)

    def test_allowed_intent_usages_must_pass(self):
        allowed_samples = [
            ("test.md", "User intent interpretation module"),
            ("test.js", "const intentSchema = { type: 'object' };"),
            ("test.html", "<div>intent model representation</div>"),
            ("test.py", "intent_state = 'active'"),
            ("test.json", '{"intent": "canonical_message"}')
        ]
        for filename, content in allowed_samples:
            sub_dir = tempfile.mkdtemp(dir=self.test_dir)
            file_path = os.path.join(sub_dir, filename)
            with open(file_path, "w", encoding="utf-8") as f:
                f.write(content)
            sub_policy_file = os.path.join(sub_dir, "policy.json")
            sub_policy = dict(self.policy)
            sub_policy["exempt_paths"] = ["policy.json"]
            with open(sub_policy_file, "w", encoding="utf-8") as f:
                json.dump(sub_policy, f)

            report, _ = linter.scan_repository(sub_dir, sub_policy_file)
            self.assertEqual(report["status"], "PASS", f"Expected PASS for allowed phrasing in {filename}: {content}")
            self.assertEqual(len(report["violations"]), 0)

    def test_path_based_exemptions_work(self):
        # Create an exempt file with prohibited content
        self._create_file("exempt_linter.py", "prohibited_terms = ['sending intent']")
        self._create_file("exempt_folder/exempt_file.md", "This is sending intent inside exempt file.")
        # Create a non-exempt file with clean content
        self._create_file("clean.md", "Receive Message -> Process -> Manifest as Light")

        report, _ = linter.scan_repository(self.test_dir, self.policy_file)
        self.assertEqual(report["status"], "PASS")
        self.assertEqual(len(report["violations"]), 0)
        self.assertIn("exempt_linter.py", report["exempt_files"])
        self.assertIn("exempt_folder/exempt_file.md", report["exempt_files"])

    def test_regression_prohibited_terms_keyword_does_not_suppress_violation(self):
        # Line contains 'prohibited_terms' AND a prohibited phrase 'sending intent'
        content = "prohibited_terms = ['sending intent']\nThis line has prohibited_terms and sending intent."
        self._create_file("doc.md", content)

        report, _ = linter.scan_repository(self.test_dir, self.policy_file)
        self.assertEqual(report["status"], "FAIL")
        self.assertTrue(len(report["violations"]) >= 1)

    def test_multiple_violations_and_determinism(self):
        content = "Line 1: sending intent\nLine 2: transmitting intent\nLine 3: clean\nLine 4: sending intention"
        self._create_file("multi.md", content)

        report1, _ = linter.scan_repository(self.test_dir, self.policy_file)
        report2, _ = linter.scan_repository(self.test_dir, self.policy_file)

        self.assertEqual(report1["status"], "FAIL")
        self.assertEqual(len(report1["violations"]), 3)
        # Check sorting determinism
        self.assertEqual(report1["violations"], report2["violations"])

if __name__ == "__main__":
    unittest.main()
