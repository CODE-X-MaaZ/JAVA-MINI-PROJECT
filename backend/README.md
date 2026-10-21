# Food Rescue Connect — Backend (Spring Boot)

## Technology Stack
- **Language:** Java 17+ (Compiled and tested on OpenJDK 26.0.1)
- **Framework:** Spring Boot 3.4.3
- **Data Access:** Spring Data JPA / Hibernate ORM
- **Database:** MySQL 8.x (Driver: `com.mysql:mysql-connector-j:9.1.0`), H2 in-memory (test scope)
- **Validation:** Jakarta Bean Validation (`spring-boot-starter-validation`)
- **Build Tool:** Apache Maven (Wrapper included: `mvnw`, `mvnw.cmd`)

---

## Architecture and Layering
Package: `com.foodrescue`

- `com.foodrescue.entity`: JPA Entities (`FoodItem`, `Claim`, `FoodStatus`, `DonorType`)
- `com.foodrescue.repository`: Spring Data JPA repositories with pessimistic locking support (`FoodItemRepository`, `ClaimRepository`)
- `com.foodrescue.service`: Transactional business logic and concurrency-safe operations (`FoodService`, `ClaimService`)
- `com.foodrescue.controller`: REST API Controllers (`FoodController`, `ClaimController`)
- `com.foodrescue.dto`: Data Transfer Objects decoupling JPA entities from API contracts (`FoodItemRequestDto`, `FoodItemResponseDto`, `ClaimResponseDto`, `ErrorResponseDto`)
- `com.foodrescue.exception`: Custom exceptions and `@RestControllerAdvice` global error handler (`ResourceNotFoundException`, `FoodAlreadyClaimedException`, `GlobalExceptionHandler`)
- `com.foodrescue.config`: Cross-Origin Resource Sharing configuration (`CorsConfig`)

---

## Concurrency Protection (Preventing Double Claims)
1. **Pessimistic Row Lock (`SELECT FOR UPDATE`):**
   `FoodItemRepository.findByIdForUpdate(id)` acquires an exclusive row-level lock on the `FoodItem` row before reading its status.
2. **Conditional Check:**
   `ClaimService.claimFood(id)` verifies `status == FoodStatus.AVAILABLE`. If the item has already been claimed, it throws `FoodAlreadyClaimedException`, which the global exception handler maps to `409 Conflict`.
3. **Database Unique Constraint:**
   `claims.food_item_id` has a unique database constraint (`@UniqueConstraint(name = "uk_claims_food_item", columnNames = {"food_item_id"})`), ensuring the database will reject any duplicate claim attempt even under unexpected race conditions.

---

## MySQL Setup Instructions

1. **Start MySQL Server:**
   Ensure MySQL 8.0+ server is running on `localhost:3306`.

2. **Create Database:**
   Connect using your MySQL client (e.g. MySQL CLI or Workbench) and run:
   ```sql
   CREATE DATABASE food_rescue_connect CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
   ```

3. **Configure Connection:**
   You can provide credentials via environment variables:
   ```powershell
   $env:SPRING_DATASOURCE_URL="jdbc:mysql://localhost:3306/food_rescue_connect?useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC"
   $env:SPRING_DATASOURCE_USERNAME="root"
   $env:SPRING_DATASOURCE_PASSWORD="your_password"
   ```
   Or copy `application.properties.example` to `src/main/resources/application-local.properties` (which is git-ignored).

4. **Schema Initialization:**
   In local development, `spring.jpa.hibernate.ddl-auto=update` is configured to create/update tables (`food_items`, `claims`) automatically.

---

## How to Run

### Run Tests
```powershell
cd backend
.\mvnw.cmd test
```

### Run Application
```powershell
cd backend
.\mvnw.cmd spring-boot:run
```

### Build Executable JAR
```powershell
cd backend
.\mvnw.cmd clean package
java -jar target/backend-0.0.1-SNAPSHOT.jar
```

---

## REST API Endpoints

### 1. List Food Items
- **Endpoint:** `GET /api/food`
- **Optional Query Parameter:** `?status=AVAILABLE`
- **Response:** `200 OK`
```json
[
  {
    "id": 1,
    "foodName": "Vegetable Pulao",
    "description": "Freshly prepared surplus meals",
    "quantity": 20.00,
    "unit": "meals",
    "pickupLocation": "College Hostel Mess",
    "pickupDeadline": "2026-10-22T14:00:00",
    "donorName": "Green Hostel",
    "donorType": "HOSTEL",
    "status": "AVAILABLE",
    "createdAt": "2026-10-21T10:30:00"
  }
]
```

### 2. Get Food Item by ID
- **Endpoint:** `GET /api/food/{id}`
- **Response:** `200 OK` or `404 Not Found`

### 3. Create Food Listing
- **Endpoint:** `POST /api/food`
- **Headers:** `Content-Type: application/json`
- **Request Body:**
```json
{
  "foodName": "Vegetable Pulao",
  "description": "Freshly prepared surplus meals",
  "quantity": 20,
  "unit": "meals",
  "pickupLocation": "College Hostel Mess",
  "pickupDeadline": "2026-10-22T14:00:00",
  "donorName": "Green Hostel",
  "donorType": "HOSTEL"
}
```
- **Response:** `201 Created`

### 4. Claim Food Item
- **Endpoint:** `POST /api/food/{id}/claim`
- **Response:** `200 OK` with Claim details
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
- **Conflict Response (Already Claimed):** `409 Conflict`
```json
{
  "timestamp": "2026-10-21T10:35:01",
  "status": 409,
  "error": "CONFLICT",
  "message": "Food item with id 1 has already been claimed.",
  "path": "/api/food/1/claim"
}
```

### 5. Get Claims
- **Endpoint:** `GET /api/claims`
- **Response:** `200 OK` with list of claims for the demo recipient.

---

## CORS Configuration
Allowed origins:
- `http://localhost:5173`
- `http://127.0.0.1:5173`

Configurable via `app.cors.allowed-origins` in `application.properties`.
