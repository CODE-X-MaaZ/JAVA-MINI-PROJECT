package com.foodrescue;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.foodrescue.dto.FoodItemRequestDto;
import com.foodrescue.entity.DonorType;
import com.foodrescue.entity.FoodItem;
import com.foodrescue.entity.FoodStatus;
import com.foodrescue.repository.ClaimRepository;
import com.foodrescue.repository.FoodItemRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import static org.hamcrest.Matchers.*;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
class FoodControllerIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private FoodItemRepository foodItemRepository;

    @Autowired
    private ClaimRepository claimRepository;

    @BeforeEach
    void setUp() {
        claimRepository.deleteAll();
        foodItemRepository.deleteAll();
    }

    private FoodItem createSampleFoodItem(String name, FoodStatus status) {
        FoodItem item = new FoodItem();
        item.setFoodName(name);
        item.setDescription("Fresh surplus food");
        item.setQuantity(new BigDecimal("15.00"));
        item.setUnit("meals");
        item.setPickupLocation("Campus Dining Hall");
        item.setPickupDeadline(LocalDateTime.now().plusDays(1));
        item.setDonorName("Green Hostel");
        item.setDonorType(DonorType.HOSTEL);
        item.setStatus(status);
        item.setCreatedAt(LocalDateTime.now());
        return foodItemRepository.save(item);
    }

    @Test
    @DisplayName("POST /api/food - Valid food creation succeeds with 201 Created")
    void testCreateFoodListing_Valid() throws Exception {
        FoodItemRequestDto request = new FoodItemRequestDto(
                "Vegetable Biryani",
                "Fresh surplus food from dinner banquet",
                new BigDecimal("25.00"),
                "meals",
                "Community Center Kitchen",
                LocalDateTime.now().plusHours(12),
                "City Caterers",
                DonorType.CATERER
        );

        mockMvc.perform(post("/api/food")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").isNotEmpty())
                .andExpect(jsonPath("$.foodName", is("Vegetable Biryani")))
                .andExpect(jsonPath("$.quantity", is(25.00)))
                .andExpect(jsonPath("$.unit", is("meals")))
                .andExpect(jsonPath("$.status", is("AVAILABLE")))
                .andExpect(jsonPath("$.donorType", is("CATERER")))
                .andExpect(jsonPath("$.createdAt").isNotEmpty());

        assertEquals(1, foodItemRepository.count());
    }

    @Test
    @DisplayName("POST /api/food - Missing foodName returns 400 Bad Request")
    void testCreateFoodListing_InvalidMissingName() throws Exception {
        FoodItemRequestDto request = new FoodItemRequestDto(
                "", // Blank name
                "Fresh surplus food",
                new BigDecimal("10.00"),
                "kg",
                "Main Street Bakery",
                LocalDateTime.now().plusHours(6),
                "Bakery Owner",
                DonorType.RESTAURANT
        );

        mockMvc.perform(post("/api/food")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.status", is(400)))
                .andExpect(jsonPath("$.error", is("BAD_REQUEST")))
                .andExpect(jsonPath("$.message", containsString("Food name is required.")));
    }

    @Test
    @DisplayName("POST /api/food - Non-positive quantity returns 400 Bad Request")
    void testCreateFoodListing_InvalidQuantity() throws Exception {
        FoodItemRequestDto request = new FoodItemRequestDto(
                "Paneer Rolls",
                "Fresh rolls",
                new BigDecimal("0.00"), // Zero quantity
                "pieces",
                "Central Cafeteria",
                LocalDateTime.now().plusHours(4),
                "Campus Cafe",
                DonorType.HOSTEL
        );

        mockMvc.perform(post("/api/food")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.status", is(400)))
                .andExpect(jsonPath("$.error", is("BAD_REQUEST")))
                .andExpect(jsonPath("$.message", containsString("Quantity must be greater than zero.")));
    }

    @Test
    @DisplayName("POST /api/food - Past pickup deadline returns 400 Bad Request")
    void testCreateFoodListing_PastDeadline() throws Exception {
        FoodItemRequestDto request = new FoodItemRequestDto(
                "Sandwiches",
                "Freshly prepared sandwiches",
                new BigDecimal("5.00"),
                "packets",
                "Deli counter",
                LocalDateTime.now().minusHours(2), // Past deadline
                "City Deli",
                DonorType.RESTAURANT
        );

        mockMvc.perform(post("/api/food")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.status", is(400)))
                .andExpect(jsonPath("$.error", is("BAD_REQUEST")));
    }

    @Test
    @DisplayName("GET /api/food - Listing retrieval returns all food items")
    void testGetFoodListings_All() throws Exception {
        createSampleFoodItem("Dal Makhani", FoodStatus.AVAILABLE);
        createSampleFoodItem("Jeera Rice", FoodStatus.CLAIMED);

        mockMvc.perform(get("/api/food"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(2)))
                .andExpect(jsonPath("$[0].foodName").isNotEmpty());
    }

    @Test
    @DisplayName("GET /api/food?status=AVAILABLE - Status filtering returns only matching items")
    void testGetFoodListings_FilterByStatus() throws Exception {
        createSampleFoodItem("Chapati", FoodStatus.AVAILABLE);
        createSampleFoodItem("Samosas", FoodStatus.CLAIMED);

        mockMvc.perform(get("/api/food").param("status", "AVAILABLE"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(1)))
                .andExpect(jsonPath("$[0].foodName", is("Chapati")))
                .andExpect(jsonPath("$[0].status", is("AVAILABLE")));
    }

    @Test
    @DisplayName("GET /api/food/{id} - Existing food item returns 200 OK")
    void testGetFoodListingById_Found() throws Exception {
        FoodItem saved = createSampleFoodItem("Pav Bhaji", FoodStatus.AVAILABLE);

        mockMvc.perform(get("/api/food/" + saved.getId()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id", is(saved.getId().intValue())))
                .andExpect(jsonPath("$.foodName", is("Pav Bhaji")))
                .andExpect(jsonPath("$.status", is("AVAILABLE")));
    }

    @Test
    @DisplayName("GET /api/food/{id} - Missing food item returns 404 Not Found")
    void testGetFoodListingById_NotFound() throws Exception {
        mockMvc.perform(get("/api/food/99999"))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.status", is(404)))
                .andExpect(jsonPath("$.error", is("NOT_FOUND")))
                .andExpect(jsonPath("$.message", containsString("99999")));
    }

    @Test
    @DisplayName("POST /api/food/{id}/claim - Successful claim changes status to CLAIMED")
    void testClaimFoodListing_Success() throws Exception {
        FoodItem saved = createSampleFoodItem("Mixed Fruit Salad", FoodStatus.AVAILABLE);

        mockMvc.perform(post("/api/food/" + saved.getId() + "/claim"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").isNotEmpty())
                .andExpect(jsonPath("$.foodItemId", is(saved.getId().intValue())))
                .andExpect(jsonPath("$.foodName", is("Mixed Fruit Salad")))
                .andExpect(jsonPath("$.recipientName", is("Demo Recipient")))
                .andExpect(jsonPath("$.status", is("CLAIMED")))
                .andExpect(jsonPath("$.claimedAt").isNotEmpty());

        FoodItem updated = foodItemRepository.findById(saved.getId()).orElseThrow();
        assertEquals(FoodStatus.CLAIMED, updated.getStatus());
        assertEquals(1, claimRepository.count());
    }

    @Test
    @DisplayName("POST /api/food/{id}/claim - Duplicate claim returns 409 Conflict")
    void testClaimFoodListing_DuplicateClaimConflict() throws Exception {
        FoodItem saved = createSampleFoodItem("Veg Pulao", FoodStatus.AVAILABLE);

        // First claim succeeds
        mockMvc.perform(post("/api/food/" + saved.getId() + "/claim"))
                .andExpect(status().isOk());

        // Second claim attempt must fail with 409 Conflict
        mockMvc.perform(post("/api/food/" + saved.getId() + "/claim"))
                .andExpect(status().isConflict())
                .andExpect(jsonPath("$.status", is(409)))
                .andExpect(jsonPath("$.error", is("CONFLICT")))
                .andExpect(jsonPath("$.message", containsString("already been claimed")));
    }

    @Test
    @DisplayName("POST /api/food/{id}/claim - Missing food item returns 404 Not Found")
    void testClaimFoodListing_NotFound() throws Exception {
        mockMvc.perform(post("/api/food/99999/claim"))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.status", is(404)))
                .andExpect(jsonPath("$.error", is("NOT_FOUND")));
    }

    @Test
    @DisplayName("GET /api/claims - Retrieves list of all claimed items")
    void testGetClaims() throws Exception {
        FoodItem item = createSampleFoodItem("Soup and Bread", FoodStatus.AVAILABLE);
        mockMvc.perform(post("/api/food/" + item.getId() + "/claim"))
                .andExpect(status().isOk());

        mockMvc.perform(get("/api/claims"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(1)))
                .andExpect(jsonPath("$[0].foodItemId", is(item.getId().intValue())))
                .andExpect(jsonPath("$[0].recipientName", is("Demo Recipient")));
    }

    @Test
    @DisplayName("POST /api/food - Malformed JSON body returns 400 Bad Request")
    void testCreateFoodListing_MalformedJson() throws Exception {
        String malformedJson = "{\"foodName\": \"Bread\", \"quantity\": \"NOT_A_NUMBER\"}";

        mockMvc.perform(post("/api/food")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(malformedJson))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.status", is(400)))
                .andExpect(jsonPath("$.error", is("BAD_REQUEST")));
    }
}
