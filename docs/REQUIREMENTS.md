# Requirements — Food Rescue Connect

## 1. Functional requirements

### FR-01: Browse food
The user can view food listings and identify whether each listing is available or claimed.

**Acceptance criteria**
- Each card shows food name, quantity/unit, pickup location, pickup deadline, donor type, and status.
- Empty results display a useful empty state.
- API failure is shown as an error; it must not silently display mock data as if it were real.

### FR-02: View one listing
The user can request details for one listing.

**Acceptance criteria**
- A valid ID returns the listing.
- An unknown ID returns a not-found response.

### FR-03: Create a listing
The donor can submit a new surplus-food listing.

**Required fields**
- `foodName`
- `description`
- `quantity`
- `unit`
- `pickupLocation`
- `pickupDeadline`
- `donorName`
- `donorType`

**Acceptance criteria**
- Food name, quantity, unit, location, deadline, donor name, and donor type are validated.
- Quantity must be greater than zero.
- Deadline must be a valid date/time; the UI should warn about a past deadline and the backend must enforce the agreed rule.
- A valid listing is persisted and initially has `AVAILABLE` status.
- The client cannot choose its own initial status.

### FR-04: Claim a listing
A recipient can claim a listing that is currently available.

**Acceptance criteria**
- A successful claim creates a claim record and changes the food status to `CLAIMED`.
- Claiming a missing listing returns not found.
- Claiming a claimed listing returns conflict.
- Concurrent requests cannot both successfully claim the same listing.

### FR-05: View claims
The user can view claims for the demo identity or authenticated account, depending on the implemented authentication model.

**Acceptance criteria**
- The endpoint and UI clearly indicate whether claims belong to a demo identity.
- Do not expose another user's private claims in a future authenticated implementation.

### FR-06: Search and filter
The user can search listings by food name and filter by availability.

**Acceptance criteria**
- Search/filter behavior is documented and works with the current data source.
- The UI does not treat stale client state as authoritative after a claim.

### FR-07: UI states
The frontend displays loading, success, empty, validation-error, and server-error states.

### FR-08: Data persistence
Listings and claims remain after restarting the backend, provided the MySQL database is retained.

## 2. Non-functional requirements

- **Usability:** Clear navigation and labels; usable on common laptop and mobile widths.
- **Reliability:** Errors are visible and do not appear as successful operations.
- **Maintainability:** Controllers, services, repositories, and DTOs are separated in the backend; reusable components and a centralized API client are used in the frontend.
- **Validation:** Validate on both client and server. Server validation is authoritative.
- **Security:** No credentials committed to Git. Demo login must not be described as secure authentication.
- **Integrity:** A food listing can have at most one successful active claim in the MVP.
- **Performance:** For the small demo dataset, endpoints should respond promptly without unnecessary calls.
- **Accessibility:** Use semantic HTML, labels, keyboard-friendly controls, and adequate contrast.

## 3. Definition of Done

A feature is done only when:
1. Code exists and is committed.
2. It builds or starts successfully.
3. The expected behavior has been executed and verified.
4. Error behavior is checked.
5. Relevant docs are updated.
6. Known limitations are reported honestly.

## 4. Acceptance test summary

| ID | Action | Expected result |
|---|---|---|
| AT-01 | Open food listings | Listings or an empty state appear |
| AT-02 | Submit valid food | Created listing appears as `AVAILABLE` |
| AT-03 | Submit quantity `0` | Request is rejected |
| AT-04 | Claim available item | Claim succeeds; status becomes `CLAIMED` |
| AT-05 | Claim same item again | Conflict; no duplicate claim |
| AT-06 | Request unknown ID | Not found |
| AT-07 | Restart backend and reload | Saved listing still exists |
| AT-08 | Stop backend and load UI | Clear API error; no fake success |
