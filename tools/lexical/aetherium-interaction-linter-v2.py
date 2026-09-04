#!/usr/bin/env python3
"""
Aetherium Lexical CI/CD Boundary Gate Linter Engine (v2)

Enforces lexical boundary policy against prohibited architectural terminology drift
in working documents and source code.
"""

import argparse
import datetime
import json
import os
import re
import subprocess
import sys

LINTER_VERSION = "2"

def get_git_commit(root_dir):
    try:
        commit = subprocess.check_output(
            ["git", "rev-parse", "HEAD"],
            cwd=root_dir,
            stderr=subprocess.DEVNULL
        ).decode("utf-8").strip()
        return commit if commit else "UNAVAILABLE"
    except Exception:
        return "UNAVAILABLE"

def normalize_path(path):
    return os.path.normpath(path).replace("\\", "/")

def load_policy(policy_file):
    try:
        with open(policy_file, "r", encoding="utf-8") as f:
            return json.load(f)
    except Exception as e:
        print(f"ERROR: Failed to load policy file {policy_file}: {e}", file=sys.stderr)
        sys.exit(1)

def compile_rules(policy):
    compiled = []
    rules_obj = policy.get("rules", {})
    for group_name, rule_list in rules_obj.items():
        for rule in rule_list:
            rule_id = rule.get("id", "UNKNOWN")
            raw_regex = rule.get("raw_regex") or rule.get("pattern")
            if not raw_regex:
                continue
            # Clean up potential whitespace around boundary assertions in regex string
            pattern_str = raw_regex.strip()
            try:
                compiled_regex = re.compile(pattern_str, re.IGNORECASE)
                compiled.append({
                    "id": rule_id,
                    "group": group_name,
                    "regex": compiled_regex,
                    "description": rule.get("description", ""),
                    "severity": rule.get("severity", "ERROR")
                })
            except re.error as e:
                print(f"ERROR: Invalid regex pattern '{pattern_str}' in rule {rule_id}: {e}", file=sys.stderr)
                sys.exit(1)
    return compiled

def is_path_exempt(rel_path, exempt_paths):
    normalized_rel = normalize_path(rel_path)
    for exempt in exempt_paths:
        normalized_exempt = normalize_path(exempt)
        if normalized_rel == normalized_exempt:
            return True
        if normalized_rel.startswith(normalized_exempt.rstrip("/") + "/"):
            return True
    return False

def scan_repository(root_dir, policy_file_path):
    policy = load_policy(policy_file_path)
    policy_version = policy.get("policy_version", "0.2")
    exempt_paths = policy.get("exempt_paths", [])

    # Collect allowed extensions
    ext_groups = policy.get("scanned_extension_groups", {})
    allowed_extensions = set()
    for ext_list in ext_groups.values():
        for ext in ext_list:
            allowed_extensions.add(ext.lower())

    compiled_rules = compile_rules(policy)

    scanned_files = []
    exempt_files = []
    skipped_files = []
    violations = []

    root_dir_abs = os.path.abspath(root_dir)

    for dirpath, dirnames, filenames in os.walk(root_dir_abs):
        # Skip .git directory
        if ".git" in dirnames:
            dirnames.remove(".git")
        # Skip node_modules if present
        if "node_modules" in dirnames:
            dirnames.remove("node_modules")

        for fname in filenames:
            abs_file_path = os.path.join(dirpath, fname)
            rel_file_path = normalize_path(os.path.relpath(abs_file_path, root_dir_abs))

            _, ext = os.path.splitext(fname)
            ext_lower = ext.lower()

            if is_path_exempt(rel_file_path, exempt_paths):
                exempt_files.append(rel_file_path)
                continue

            if ext_lower not in allowed_extensions:
                skipped_files.append(rel_file_path)
                continue

            scanned_files.append(rel_file_path)

            # Scan file lines
            try:
                with open(abs_file_path, "r", encoding="utf-8", errors="replace") as f:
                    for line_num, line in enumerate(f, start=1):
                        for rule in compiled_rules:
                            match = rule["regex"].search(line)
                            if match:
                                violations.append({
                                    "file": rel_file_path,
                                    "line": line_num,
                                    "rule_id": rule["id"],
                                    "matched_text": match.group(0),
                                    "severity": rule["severity"]
                                })
            except Exception as e:
                print(f"WARNING: Could not read file {rel_file_path}: {e}", file=sys.stderr)

    # Sort results deterministically
    scanned_files.sort()
    exempt_files.sort()
    skipped_files.sort()
    violations.sort(key=lambda x: (x["file"], x["line"], x["rule_id"]))

    status = "PASS" if len(violations) == 0 else "FAIL"
    commit = get_git_commit(root_dir_abs)
    timestamp = datetime.datetime.now(datetime.timezone.utc).isoformat()

    report = {
        "status": status,
        "policy_version": policy_version,
        "linter_version": LINTER_VERSION,
        "repository": "Aetherium-Manifest",
        "commit": commit,
        "timestamp": timestamp,
        "scanned_files_count": len(scanned_files),
        "scanned_extensions": sorted(list(allowed_extensions)),
        "violations": violations,
        "skipped_files_count": len(skipped_files),
        "exempt_files": exempt_files
    }

    return report, policy

def main():
    parser = argparse.ArgumentParser(description="Aetherium Lexical CI/CD Boundary Gate Linter")
    parser.add_argument("--root", default=".", help="Root directory of the repository to scan")
    parser.add_argument("--policy", default="tools/lexical/aetherium-lexical-policy.json", help="Path to policy JSON file")
    parser.add_argument("--output", default="reports/lexical/latest.json", help="Path to output JSON evidence artifact")
    parser.add_argument("--strict", action="store_true", help="Exit with non-zero code on policy violation")

    args = parser.parse_args()

    report, policy = scan_repository(args.root, args.policy)

    # Ensure output directory exists
    output_dir = os.path.dirname(args.output)
    if output_dir:
        os.makedirs(output_dir, exist_ok=True)

    with open(args.output, "w", encoding="utf-8") as f:
        json.dump(report, f, indent=2, ensure_ascii=False)

    print(f"Lexical Boundary Gate Scan Complete.")
    print(f"Status: {report['status']}")
    print(f"Scanned Files: {report['scanned_files_count']}")
    print(f"Violations: {len(report['violations'])}")
    print(f"Exempt Files: {len(report['exempt_files'])}")
    print(f"Evidence Report Written To: {args.output}")

    if report["status"] != "PASS":
        print("\nViolations Detected:")
        for v in report["violations"]:
            print(f"  [{v['rule_id']}] {v['file']}:{v['line']} - Matched: '{v['matched_text']}'")
        if args.strict:
            sys.exit(1)

if __name__ == "__main__":
    main()
