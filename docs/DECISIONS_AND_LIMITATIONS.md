# Decisions and Limitations — Food Rescue Connect

## 1. Current design decisions

| Topic | MVP decision | Reason |
|---|---|---|
| Frontend | React + Vite + JavaScript | Fast setup and straightforward component development |
| Backend | Java + Spring Boot + Maven | Java mini-project requirement and structured REST API |
| Database | MySQL | Relational storage for listings and claims |
| API format | JSON over REST | Simple frontend/backend integration |
| Git workflow | One `main` branch, sequential contributors | Matches the team's chosen workflow |
| Authentication | Demo mode unless real auth is explicitly completed | Keeps one-day scope realistic |
| Claim integrity | Backend transaction/atomic update plus database safeguard | Prevents duplicate claims |
| Food safety | Not certified by the application | Avoids unsafe or unsupported claims |

## 2. Explicit assumptions to confirm

- The frontend and backend live in one repository.
- The frontend is Vite-based unless the current repository proves otherwise.
- Local backend port is `8080`; Vite is commonly `5173`.
- A listing can be successfully claimed once in the MVP.
- A recipient identity may be a demo identity for the first presentation.
- Pickup deadlines are entered by the donor and are not independently verified.

Update this document when assumptions become confirmed implementation decisions.

## 3. Known limitations of the one-day MVP

- Demo-mode login is not identity verification.
- A claim does not prove that food was collected.
- A listing does not prove food is safe or suitable.
- The donor may enter inaccurate quantity or deadline information.
- There may be no notification system to tell recipients when a listing is added.
- The app may not support multiple organizations or production authorization.
- Deployment, backups, monitoring, privacy review, and production security may not be complete.

## 4. Future improvements — only after MVP works

1. Real authentication and role-based authorization.
2. Organization verification for NGOs and donors.
3. Pickup confirmation and claim lifecycle.
4. Email or push notifications.
5. Search by distance and map-based pickup locations.
6. Audit log and reporting.
7. Database migrations and deployment automation.
8. Rate limiting, security review, monitoring, and backup strategy.

Do not start these improvements while core posting, persistence, claiming, and duplicate-claim rejection are broken.
