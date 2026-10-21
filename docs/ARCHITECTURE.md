# Architecture — Food Rescue Connect

## 1. High-level design

```text
User
  |
  v
React + Vite frontend
  |  HTTP/JSON
  v
Spring Boot REST API
  |
  v
Service layer (validation + business rules + transaction)
  |
  v
Spring Data JPA repositories
  |
  v
MySQL
```

## 2. Frontend responsibilities

- Render pages and reusable components.
- Validate fields for user experience.
- Call backend through one centralized API service.
- Display API results and errors.
- Refresh listing state after a successful claim.
- Use mock data only in an explicitly enabled development/demo mode.

Suggested structure (adapt to the existing repository instead of forcing this layout):

```text
frontend/src/
├── components/
├── pages/
├── services/api.js
├── hooks/
├── styles/
└── App.jsx
```

## 3. Backend responsibilities

- Validate request DTOs.
- Apply business rules in services.
- Persist data with JPA repositories.
- Use transactions for claim operations.
- Return appropriate HTTP status codes.
- Handle errors consistently.
- Never trust client-supplied status or quantity values without validation.

Suggested structure:

```text
backend/src/main/java/com/foodrescue/
├── controller/
├── dto/
├── entity/
├── repository/
├── service/
├── exception/
└── config/
```

## 4. Claim flow

1. Frontend sends `POST /api/food/{id}/claim`.
2. Controller validates the path and request.
3. Service starts a transaction and obtains a lock or uses an atomic conditional update.
4. Service verifies the listing exists and is `AVAILABLE`.
5. Service creates the claim and changes the listing to `CLAIMED`.
6. Transaction commits.
7. API returns the updated result.
8. Frontend refreshes the listing and shows success.

A disabled button is not enough to prevent duplicate claims. The database/backend must enforce the rule under concurrent requests.

## 5. Error handling

Use a consistent error response, for example:

```json
{
  "timestamp": "2026-10-21T10:30:00",
  "status": 409,
  "error": "CONFLICT",
  "message": "This food listing has already been claimed.",
  "path": "/api/food/1/claim"
}
```

The exact error DTO can differ if the project already has one, but frontend and backend must agree.

## 6. Environment configuration

- Frontend API base URL: `VITE_API_BASE_URL`
- Backend database URL/user/password: environment variables or ignored local configuration
- Local frontend origin is commonly `http://localhost:5173`.
- Local backend port is commonly `8080`.

Verify actual ports and values in the implementation. Do not hardcode secrets.

## 7. Trust boundaries

- Browser validation is for usability; server validation is authoritative.
- Client-provided role names do not establish real identity.
- Do not use AI or a client-supplied status to decide whether a claim is valid.
- The database/backend is authoritative for claim status.
- The application does not certify food safety.
