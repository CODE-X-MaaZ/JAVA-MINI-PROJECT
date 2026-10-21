# AI Agent Rules — Antigravity

Use these instructions as the shared guardrails for every Antigravity session on Food Rescue Connect.

## Project context

Food Rescue Connect is a React + Vite frontend, Spring Boot + Maven backend, and MySQL database. The MVP allows donors to post surplus food and recipients to claim it.

Team sequence:
1. Bhavika — frontend
2. Swara — backend and API integration
3. Maaz — integration QA and final delivery

All work uses a single `main` branch, sequentially.

## Mandatory rules

1. Inspect repository files and Git status before making changes.
2. Read `README.md` and relevant files in `docs/`.
3. Follow `docs/API_CONTRACT.md`; if a change is necessary, update the contract and explain it.
4. Do not regenerate or replace working parts of the project.
5. Do not delete files, reset Git, clean the working tree, or overwrite teammate work without explicit approval.
6. Do not create branches.
7. Do not install dependencies without checking whether they are already present and needed.
8. Never commit secrets, `.env` files with real values, passwords, tokens, or private data.
9. Do not describe mock login as real authentication.
10. Backend validation and database rules are authoritative.
11. The backend must reject duplicate claims, including concurrent requests.
12. Never declare food safe or verified merely because it is listed.
13. Execute tests/builds and report real outcomes.
14. Clearly label any untested, blocked, or assumed behavior.
15. Keep changes within the current owner's assigned phase.

## Required working style

Before editing:
- Summarize the existing architecture.
- Identify the files to change.
- Identify risks or dependency mismatches.
- Ask for confirmation if a change could delete data, rewrite architecture, expose secrets, or disrupt another phase.

After editing:
- List files changed.
- Summarize behavior.
- List commands executed and their actual results.
- Report known limitations.
- Confirm Git status and commit status.
- Provide a handover note for the next owner.

## Prompting protocol

If an agent reaches a blocker:
- Explain the exact blocker and relevant error.
- Offer the smallest safe fix.
- Do not fabricate files, command output, test results, or dependency versions.
- Do not continue unrelated implementation while the blocker prevents validation.
