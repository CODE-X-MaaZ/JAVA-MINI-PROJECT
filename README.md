# Food Rescue Connect

A Java mini-project that connects food donors—such as restaurants, hostels, and event caterers—with recipients such as NGOs or authorized individuals, so surplus food can be listed and claimed before its pickup deadline.

## Technology stack

- **Frontend:** React, Vite, JavaScript, React Router
- **Backend:** Java, Spring Boot, Maven
- **Database:** MySQL
- **Communication:** JSON over REST APIs

## MVP scope

The first version should support:
1. View available surplus-food listings.
2. Create a food listing.
3. Claim an available listing.
4. Change the listing status so it cannot be claimed twice.
5. View claims in a simple demo workflow.
6. Persist listings and claims in MySQL.
7. Display useful validation, loading, success, empty, and error states.

Authentication may be demo-only if the deadline is one day. If so, the UI and documentation must clearly label it as demo mode; do not claim that role selection or a frontend-only login is secure authentication.

## Quick start

See [`docs/SETUP.md`](docs/SETUP.md) for the full setup. The expected local layout is:

```text
food-rescue-connect/
├── frontend/
├── backend/
├── docs/
└── README.md
```

Do not reorganize an existing repository just to match this layout. Update the docs if the actual structure differs.

## Documentation index

| File | Purpose |
|---|---|
| [`docs/PROJECT_OVERVIEW.md`](docs/PROJECT_OVERVIEW.md) | Problem, solution, goals, scope, and non-goals |
| [`docs/REQUIREMENTS.md`](docs/REQUIREMENTS.md) | Functional and non-functional requirements |
| [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) | Frontend/backend/database design and request flow |
| [`docs/API_CONTRACT.md`](docs/API_CONTRACT.md) | Shared REST routes and JSON shapes for Bhavika and Swara |
| [`docs/DATABASE_SCHEMA.md`](docs/DATABASE_SCHEMA.md) | Tables, fields, relationships, and integrity rules |
| [`docs/SETUP.md`](docs/SETUP.md) | Environment prerequisites and local startup |
| [`docs/TEAM_WORKFLOW.md`](docs/TEAM_WORKFLOW.md) | Sequential workflow for Bhavika, Swara, and Maaz on `main` |
| [`docs/AI_AGENT_RULES.md`](docs/AI_AGENT_RULES.md) | Instructions and guardrails for Antigravity agents |
| [`docs/TEST_PLAN.md`](docs/TEST_PLAN.md) | Manual and automated verification checklist |
| [`docs/DEMO_SCRIPT.md`](docs/DEMO_SCRIPT.md) | College demo flow and viva talking points |
| [`docs/DECISIONS_AND_LIMITATIONS.md`](docs/DECISIONS_AND_LIMITATIONS.md) | Agreed decisions, assumptions, and honest MVP limitations |

## Source of truth

- The code is the source of truth for implemented behavior.
- `API_CONTRACT.md` is the shared agreement between frontend and backend.
- Update docs when implementation changes; never document a feature as complete until it has been tested.
- Never commit real passwords, API keys, personal data, or production credentials.
