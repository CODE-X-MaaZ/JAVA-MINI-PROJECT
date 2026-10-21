# API Contract — Food Rescue Connect

This file is the shared agreement between Bhavika (React) and Swara (Spring Boot). Agree on changes here before changing either side. The examples describe the intended MVP contract; adjust once if the implementation has already established a different contract, then keep both sides consistent.

Base URL in local development: `http://localhost:8080/api`

Content type: `application/json`

## 1. Data model

### Food item

```json
{
  "id": 1,
  "foodName": "Vegetable Pulao",
  "description": "Freshly prepared surplus meals",
  "quantity": 20,
  "unit": "meals",
  "pickupLocation": "College Hostel",
  "pickupDeadline": "2026-10-22T14:00:00",
  "donorName": "Sample Hostel",
  "donorType": "HOSTEL",
  "status": "AVAILABLE",
  "createdAt": "2026-10-21T10:30:00"
}
```

`id`, `status`, and `createdAt` are server-controlled. Do not accept a client-selected initial status.

### Enums

`status`: `AVAILABLE`, `CLAIMED`, optionally `PICKED_UP` if that flow is actually implemented.

`donorType`: `RESTAURANT`, `HOSTEL`, `CATERER`, `OTHER`.

`unit`: free text for the MVP (for example, `meals`, `containers`, `kg`) or a documented enum. Frontend and backend must use the same approach.

## 2. Endpoints

### GET `/food`

Returns food items. Optional query parameter: `status=AVAILABLE`.

Successful response: `200 OK`

```json
[
  {
    "id": 1,
    "foodName": "Vegetable Pulao",
    "description": "Freshly prepared surplus meals",
    "quantity": 20,
    "unit": "meals",
    "pickupLocation": "College Hostel",
    "pickupDeadline": "2026-10-22T14:00:00",
    "donorName": "Sample Hostel",
    "donorType": "HOSTEL",
    "status": "AVAILABLE",
    "createdAt": "2026-10-21T10:30:00"
  }
]
```

### GET `/food/{id}`

Returns one food item.

- `200 OK`: found
- `404 Not Found`: no item with that ID

### POST `/food`

Creates a food listing.

Request:

```json
{
  "foodName": "Vegetable Pulao",
  "description": "Freshly prepared surplus meals",
  "quantity": 20,
  "unit": "meals",
  "pickupLocation": "College Hostel",
  "pickupDeadline": "2026-10-22T14:00:00",
  "donorName": "Sample Hostel",
  "donorType": "HOSTEL"
}
```

Success: `201 Created` with the created `FoodItem` in the response.

Validation failure: `400 Bad Request`.

### POST `/food/{id}/claim`

Claims an available listing. The first version may use a documented demo recipient identity if real authentication is not implemented. Do not accept arbitrary identity claims as secure authentication.

Success: `200 OK` (or `201 Created` if that convention is selected consistently) with a claim/updated listing response.

Conflict: `409 Conflict` if already claimed.

Not found: `404 Not Found`.

The backend must ensure that simultaneous requests cannot both claim the same item.

### GET `/claims`

Returns claims for the demo identity in demo mode, or the authenticated user in a properly authenticated implementation.

Success: `200 OK`.

Do not expose all users' private claims in a future authenticated application.

## 3. Claim response example

```json
{
  "id": 1,
  "foodItemId": 1,
  "foodName": "Vegetable Pulao",
  "recipientName": "Demo Recipient",
  "status": "CLAIMED",
  "claimedAt": "2026-10-21T10:35:00"
}
```

## 4. Error response

Recommended consistent shape:

```json
{
  "timestamp": "2026-10-21T10:30:00",
  "status": 400,
  "error": "BAD_REQUEST",
  "message": "Quantity must be greater than zero.",
  "path": "/api/food"
}
```

Example status codes:

| Code | Meaning |
|---|---|
| 200 | Successful read or operation |
| 201 | Resource created |
| 400 | Invalid request |
| 404 | Resource not found |
| 409 | Claim conflict |
| 500 | Unexpected server error |

## 5. Contract rules

- JSON field names use camelCase.
- Date-time format is ISO-8601 local date-time for this local MVP; keep timezone handling consistent.
- The server generates IDs, timestamps, and initial status.
- Backend validation is mandatory even if React validates.
- Never treat a failed API request as a successful mock operation.
- Any change to route, field, enum, or response shape must be reflected here and communicated before implementation.
