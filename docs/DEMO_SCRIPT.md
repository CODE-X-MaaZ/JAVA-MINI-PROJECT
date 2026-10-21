# Demo Script and Viva Notes — Food Rescue Connect

## 1. Suggested 3–5 minute demo

### Opening (20 seconds)
“Food Rescue Connect is a surplus-food coordination application. It allows a donor such as a restaurant or hostel to list food that needs to be collected before a pickup deadline, and allows a recipient to claim an available listing.”

### Show the listing page (30 seconds)
- Open the app.
- Point out the food name, quantity, pickup location, deadline, and status.
- Explain that the backend is the source of truth for availability.

### Create a listing (45 seconds)
- Open **Post Food**.
- Enter sample data such as Vegetable Pulao, 20 meals, College Hostel, and a future pickup deadline.
- Submit the form.
- Show the newly created listing.

### Demonstrate persistence (20 seconds)
- Refresh the browser.
- Show that the listing remains because it is stored in MySQL, not just browser memory.

### Claim the listing (45 seconds)
- Click **Claim**.
- Show the status change to `CLAIMED`.
- Refresh the listing and show that it is no longer available.

### Demonstrate a business rule (30 seconds)
- Attempt to claim the same item again using an API client or the UI.
- Show the conflict response.
- Explain that backend/database logic prevents duplicate claims; disabling the button alone would not be enough.

### Architecture explanation (30 seconds)
Explain the flow:
React → Spring Boot REST API → service/business rules → JPA repository → MySQL.

### Limitations (20 seconds)
State honestly whether login is demo-only, whether notifications are absent, and that the system does not certify food safety.

## 2. Viva questions and concise answers

### Why React?
It supports reusable UI components and interactive forms and listings.

### Why Spring Boot?
It provides a structured way to build Java REST APIs and integrate with persistence and validation libraries.

### Why MySQL?
Food listings and claims are structured relational data, and claims need integrity constraints and transactional updates.

### Why use a service layer?
It keeps business rules separate from HTTP handling and data-access code, making the behavior easier to test.

### Why is backend validation needed if React validates?
A client can be bypassed or modified. Server-side validation is the authoritative check.

### How do you prevent duplicate claims?
The backend performs a transactional/atomic availability check and status update, with suitable database constraints or locking. Only one claim can succeed.

### Is login secure?
Only say yes if real authentication, password handling, session/token management, and authorization are actually implemented and tested. If the MVP uses a demo identity, say so clearly.

### Does the app ensure food is safe?
No. It coordinates listings and claims; it does not certify food safety.

### What would you add next?
Real authentication and authorization, NGO verification, notifications, pickup confirmation, audit history, and deployment hardening.

## 3. Demo preparation checklist

- Start MySQL, backend, and frontend before the presentation.
- Use sample data only.
- Keep a backup screenshot or short screen recording if allowed.
- Confirm the duplicate-claim test works.
- Do not show credentials or `.env` files.
- Be ready to explain any unimplemented feature honestly.
