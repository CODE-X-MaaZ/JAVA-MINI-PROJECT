# Test Plan — Food Rescue Connect

## 1. Test objectives

Verify the main donor-to-recipient flow, data persistence, validation, claim integrity, frontend states, and repeatable startup.

## 2. Test levels

- **Frontend checks:** navigation, forms, filters, loading/error states, production build.
- **Backend unit tests:** service rules, validation, error mapping.
- **API integration tests:** controller routes, JSON serialization, status codes.
- **Database checks:** persistence, foreign keys, duplicate-claim protection.
- **End-to-end checks:** create → list → claim → verify status.

## 3. Manual test cases

| ID | Setup/action | Expected result | Result |
|---|---|---|---|
| TC-01 | Start frontend | App opens without runtime error | Not run |
| TC-02 | Open listings with no data | Empty state appears | Not run |
| TC-03 | Create valid food listing | Created listing is returned and displayed | Not run |
| TC-04 | Submit blank food name | Validation error; no record created | Not run |
| TC-05 | Submit quantity `0` | Rejected by frontend and backend | Not run |
| TC-06 | Submit negative quantity | Rejected by backend | Not run |
| TC-07 | Submit malformed date/time | Rejected with useful error | Not run |
| TC-08 | Request unknown food ID | HTTP 404 | Not run |
| TC-09 | Claim available item | Claim succeeds and status becomes `CLAIMED` | Not run |
| TC-10 | Claim same item again | HTTP 409; no duplicate successful claim | Not run |
| TC-11 | Send concurrent claims | At most one succeeds | Not run |
| TC-12 | Refresh after creating item | Listing remains present | Not run |
| TC-13 | Restart backend | Data remains in MySQL | Not run |
| TC-14 | Stop backend and use UI | Clear API error; no fake success | Not run |
| TC-15 | Search by food name | Matching items are shown | Not run |
| TC-16 | Filter available items | Claimed items are excluded | Not run |
| TC-17 | Inspect Git-tracked files | No real secrets are committed | Not run |
| TC-18 | Run frontend build | Build exits successfully | Not run |
| TC-19 | Run backend tests | Maven tests exit successfully | Not run |

Change each `Not run` only after executing the test. Use `Pass`, `Fail`, or `Blocked` with notes.

## 4. Example API checks

Use Postman, a REST client, or PowerShell. Ensure the backend is running and substitute the actual port if different.

Create a listing:

```powershell
$body = @{
  foodName = "Vegetable Pulao"
  description = "Sample surplus meals"
  quantity = 20
  unit = "meals"
  pickupLocation = "College Hostel"
  pickupDeadline = "2026-10-22T14:00:00"
  donorName = "Sample Hostel"
  donorType = "HOSTEL"
} | ConvertTo-Json

Invoke-RestMethod -Method Post `
  -Uri "http://localhost:8080/api/food" `
  -ContentType "application/json" `
  -Body $body
```

List food:

```powershell
Invoke-RestMethod -Method Get -Uri "http://localhost:8080/api/food"
```

Claim item ID 1:

```powershell
Invoke-RestMethod -Method Post -Uri "http://localhost:8080/api/food/1/claim"
```

PowerShell may throw an exception for expected non-2xx responses such as 409; inspect the returned HTTP status rather than treating every exception as an application crash.

## 5. Release gate

Do not call the MVP ready until:
- The main flow passes end to end.
- Duplicate claim protection is verified.
- Frontend production build passes.
- Backend tests pass, or any blocked tests are explicitly disclosed.
- Database persistence is verified.
- Setup documentation has been tested.
- No secrets are committed.
