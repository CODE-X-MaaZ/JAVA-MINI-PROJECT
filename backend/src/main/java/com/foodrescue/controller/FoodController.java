package com.foodrescue.controller;

import com.foodrescue.dto.ClaimResponseDto;
import com.foodrescue.dto.FoodItemRequestDto;
import com.foodrescue.dto.FoodItemResponseDto;
import com.foodrescue.entity.FoodStatus;
import com.foodrescue.service.ClaimService;
import com.foodrescue.service.FoodService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/food")
public class FoodController {

    private final FoodService foodService;
    private final ClaimService claimService;

    public FoodController(FoodService foodService, ClaimService claimService) {
        this.foodService = foodService;
        this.claimService = claimService;
    }

    /**
     * GET /api/food
     * Optional filter: ?status=AVAILABLE
     */
    @GetMapping
    public ResponseEntity<List<FoodItemResponseDto>> getFoodListings(
            @RequestParam(required = false) FoodStatus status) {
        List<FoodItemResponseDto> listings = foodService.getFoodListings(status);
        return ResponseEntity.ok(listings);
    }

    /**
     * GET /api/food/{id}
     */
    @GetMapping("/{id}")
    public ResponseEntity<FoodItemResponseDto> getFoodListingById(@PathVariable Long id) {
        FoodItemResponseDto listing = foodService.getFoodListingById(id);
        return ResponseEntity.ok(listing);
    }

    /**
     * POST /api/food
     */
    @PostMapping
    public ResponseEntity<FoodItemResponseDto> createFoodListing(
            @Valid @RequestBody FoodItemRequestDto requestDto) {
        FoodItemResponseDto created = foodService.createFoodListing(requestDto);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    /**
     * POST /api/food/{id}/claim
     */
    @PostMapping("/{id}/claim")
    public ResponseEntity<ClaimResponseDto> claimFoodListing(@PathVariable Long id) {
        ClaimResponseDto claim = claimService.claimFood(id, ClaimService.DEMO_RECIPIENT_NAME);
        return ResponseEntity.ok(claim);
    }
}
