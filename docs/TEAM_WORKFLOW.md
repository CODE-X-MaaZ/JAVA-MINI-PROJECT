# Team Workflow — Bhavika → Swara → Maaz

## 1. Team roles

### Bhavika — Frontend owner
- React pages, components, forms, routing, responsive styles.
- Centralized API service and explicitly isolated mock mode.
- Frontend validation and UI states.
- Must document the API contract required by the UI.

### Swara — Backend owner
- Spring Boot application and Maven dependencies.
- DTOs, entities, repositories, services, controllers.
- MySQL persistence and validation.
- Claim transaction/concurrency rule.
- API integration with Bhavika's frontend.

### Maaz — Integration and QA owner
- Verify setup and dependencies.
- Test the end-to-end donor/recipient flow.
- Find API mismatches, persistence bugs, duplicate claim issues, and error-state defects.
- Prepare README, test report, demo, and final release.

## 2. Sequential workflow

### Handover 1: Bhavika → Swara
Bhavika must provide:
- A successful frontend build result.
- File-change summary.
- Startup instructions.
- `API_CONTRACT.md` updated to match frontend requests.
- Mock-mode explanation.
- Commit hash and a clean working tree.

Swara must read the handover before coding.

### Handover 2: Swara → Maaz
Swara must provide:
- Backend startup instructions.
- Database configuration template.
- Endpoint list and example JSON.
- Maven test/build results.
- Known limitations.
- Commit hash and a clean working tree.

Maaz then performs the end-to-end verification.

## 3. Single-main-branch rules

The team intentionally uses one branch and works sequentially.

Before starting:

```powershell
git status
git branch --show-current
git log -1 --oneline
git pull --ff-only origin main
```

Use `git pull` only after the remote is configured and the team has verified that `origin/main` is the intended shared repository. If working locally without a remote, skip that command.

Before committing:

```powershell
git status
git diff
```

Stage only files you own. For example:

```powershell
git add frontend/
git commit -m "Build Food Rescue Connect frontend"
```

Use the appropriate path for the files you changed. Never blindly run `git add .` if another teammate's uncommitted changes may exist.

After committing:

```powershell
git status
git log -1 --oneline
```

Expected: the correct branch is `main`, the commit exists, and the working tree is clean except for intentionally untracked work that is clearly understood.

## 4. Antigravity agent rules

Every agent must:
- Inspect before editing.
- Preserve existing work.
- Avoid destructive Git operations.
- Avoid creating branches.
- Avoid installing unnecessary packages.
- Run the relevant build/tests and report actual output.
- Never claim tests passed if they were not run.
- Never commit secrets.
- Stop at its assigned phase and produce a handover report.

## 5. Conflict prevention

Since all work lands on `main`, only one teammate should edit the repository at a time. Do not let two Antigravity sessions independently modify the same working tree. Keep one agreed copy of the repository and communicate before the next person starts.

## 6. Handover template

```text
Owner:
Phase:
Branch:
Latest commit:
Files created/modified:
Commands executed:
Build result:
Tests executed and results:
Environment variables required:
Known bugs/limitations:
Next owner action:
Working tree status:
```
