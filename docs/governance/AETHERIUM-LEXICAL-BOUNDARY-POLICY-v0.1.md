# AETHERIUM Lexical CI/CD Boundary Policy v0.1

**Status:** CANONICAL GOVERNANCE POLICY
**Authority:** Aetherium Epistemic & Truth Governance Framework
**Scope:** Repository Working Documents, Source Code, and CI/CD Pipelines
**Enforcement Engine:** `tools/lexical/aetherium-interaction-linter-v2.py`

---

## 1. Purpose of the Lexical Boundary

The Aetherium Lexical CI/CD Boundary Gate exists to prevent **architectural terminology drift** across working documents and source code. As the Aetherium framework evolves, precise architectural phrasing is required to preserve epistemic alignment with standard specifications (including SAD v4.2 and Presence IR Spec).

The Lexical Gate enforces hard boundary constraints against prohibited legacy or inaccurate interaction phrasing (such as phrasing that implies raw intent transmission rather than governed manifestation).

---

## 2. Canonical Terminology

The canonical mental model and operational phrase for user interaction within Aetherium is:

> **Receive Message → Process → Manifest as Light**
> *(Thai: รับข้อความ → ประมวลผล → ส่งออกเป็นอานุภาพแสง)*

### Guidelines for Interaction Phrasing
- Use **"Receive Message"** or **"Message Processing"** when referring to incoming interaction.
- Use **"Manifestation"** or **"Manifest as Light"** when referring to renderer output generation.
- Terminology such as "intent schema", "intent evaluation", or "intent interpretation" is valid when describing internal architectural components, provided it does not form prohibited interaction phrases.

---

## 3. Prohibited Terminology Rules

The policy defines strict case-insensitive prohibited regex rules.

### Rule Group: `PROHIBITED_EN`

| Rule ID | Regex Pattern | Description | Severity |
| :--- | :--- | :--- | :--- |
| `LEX-EN-001` | `\bsending\s+intent\b` | Prohibits phrasing implying raw intent sending | ERROR |
| `LEX-EN-002` | `\btransmitting\s+intent\b` | Prohibits phrasing implying intent transmission | ERROR |
| `LEX-EN-003` | `\bintent\s+transmission\b` | Prohibits phrasing referring to intent transmission | ERROR |
| `LEX-EN-004` | `\bsending\s+intention\b` | Prohibits phrasing referring to sending intention | ERROR |

### Rule Group: `PROHIBITED_TH`
Currently reserved for future Thai lexical rule definitions as canonical Thai terms evolve.

---

## 4. Exemption Policy (Path-Based Exemptions)

To prevent false-negative security vulnerabilities, **content-based skip heuristics (e.g., checking if a line contains `prohibited_terms` or is inside a JSON array) are strictly prohibited**.

Exemptions are **path-based** and explicitly configured in `tools/lexical/aetherium-lexical-policy.json`.

### Declared Exempt Paths
1. `tools/lexical/aetherium-interaction-linter-v2.py` (Linter Engine implementation)
2. `tools/lexical/aetherium-lexical-policy.json` (Policy configuration declaration)

All other `.md`, `.js`, `.html`, `.css`, `.json`, `.yml`, `.yaml`, and `.py` files in the repository are subject to deterministic lexical boundary scan.

---

## 5. CI/CD Enforcement & Strict Mode

The Lexical Boundary Gate is executed as a **blocking CI step** in `.github/workflows/deploy.yml`:

```bash
python3 tools/lexical/aetherium-interaction-linter-v2.py \
  --root . \
  --policy tools/lexical/aetherium-lexical-policy.json \
  --output reports/lexical/latest.json \
  --strict
```

If any violation is detected, the linter exits with exit code `1` and blocks subsequent pipeline stages (such as testing and deployment).

---

## 6. Evidence Artifact & Provenance

Every run generates a machine-readable JSON evidence report at `reports/lexical/latest.json`.

### Evidence Structure
```json
{
  "status": "PASS",
  "policy_version": "0.2",
  "linter_version": "2",
  "repository": "Aetherium-Manifest",
  "commit": "<git-commit-hash>",
  "timestamp": "<rfc3339-timestamp>",
  "scanned_files_count": 89,
  "scanned_extensions": [".css", ".html", ".js", ".json", ".md", ".py", ".yaml", ".yml"],
  "violations": [],
  "skipped_files_count": 3,
  "exempt_files": [
    "tools/lexical/aetherium-interaction-linter-v2.py",
    "tools/lexical/aetherium-lexical-policy.json"
  ]
}
```

---

## 7. Relationship to Aetherium Truth Governance

An important epistemic rule applies to the Lexical CI/CD Boundary Gate:

$$\text{Lexical Gate PASS} \neq \text{Architecture PASS} \neq \text{Implementation PASS}$$

- **Lexical Gate PASS** proves solely that no prohibited lexical terminology patterns were detected under the declared policy.
- **Lexical Gate PASS** does NOT imply that Phase 0/Phase 1 architectural systems (such as AETH Compiler, Governor A/B, or Dynamic SDF) are fully implemented or verified.
