# Project Overview — Food Rescue Connect

## 1. Problem statement

Restaurants, hostels, and event caterers can have edible surplus food at the end of service or an event. Potential recipients may not know that the food is available, while the donor may have limited time to coordinate collection. This can contribute to avoidable food waste.

Food Rescue Connect provides a simple digital listing and claiming workflow. It is a coordination tool—not a food-safety certification system.

## 2. Proposed solution

Donors create listings containing the food description, quantity, pickup location, and pickup deadline. Recipients browse available listings and claim one. The application changes the listing status so other recipients cannot claim the same item.

## 3. Goals for the MVP

- Make the donor-to-recipient flow easy to demonstrate.
- Store listings in MySQL rather than only in browser memory.
- Use a React UI and a Java Spring Boot REST API.
- Prevent duplicate claims at the backend.
- Validate submitted data and communicate errors clearly.
- Keep the setup repeatable for a student team and college evaluator.

## 4. Users and roles

### Donor
A restaurant, hostel, or caterer that posts surplus food.

### Recipient
An NGO or authorized individual that browses and claims food.

### Demo operator
For the first-day MVP, a team member may operate the demo. If real authentication is not implemented, the selected role is only a demonstration aid and does not establish identity or permissions.

## 5. Core user journeys

### Journey A — Post food
1. Open **Post Food**.
2. Enter food name, description, quantity, unit, pickup location, deadline, donor name, and donor type.
3. Submit the form.
4. The backend validates and saves the listing.
5. The listing appears with `AVAILABLE` status.

### Journey B — Claim food
1. Open available listings.
2. Select an available listing.
3. Click **Claim**.
4. The backend verifies the listing is still available.
5. The backend records the claim and changes the listing status to `CLAIMED`.
6. The UI displays success and the listing is no longer claimable.

### Journey C — Handle a conflict
1. Two claim attempts target the same listing.
2. The backend allows at most one successful claim.
3. The other attempt receives a conflict response.
4. The UI explains that the listing is no longer available and refreshes the listing.

## 6. MVP boundaries

### In scope
- Food listing creation and retrieval
- Basic listing search/filter
- Claim workflow
- MySQL persistence
- Input validation
- Error handling
- Responsive frontend
- Demo-mode identity if necessary
- README and test checklist

### Out of scope for the first version
- Real OTP/email authentication
- Identity verification for NGOs
- Payments
- Delivery logistics or live tracking
- Maps and route optimization
- Push notifications
- AI food safety assessment
- Automated expiry/safety certification
- Production deployment and legal/compliance claims

## 7. Success criteria

The MVP is ready to demonstrate when a team member can create a listing, see it after refresh, claim it, see the status change, and prove that a duplicate claim is rejected. The frontend production build and backend tests should pass, and setup instructions should work on a fresh machine.

## 8. Food safety note

The application must not declare food safe merely because a listing exists. Donors remain responsible for providing accurate information and following applicable food handling requirements. Display pickup deadlines and encourage recipients to confirm handling and suitability directly with the donor.
