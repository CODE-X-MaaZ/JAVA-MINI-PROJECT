package com.foodrescue.service;

import com.foodrescue.dto.ClaimResponseDto;
import com.foodrescue.entity.Claim;
import com.foodrescue.entity.FoodItem;
import com.foodrescue.entity.FoodStatus;
import com.foodrescue.exception.FoodAlreadyClaimedException;
import com.foodrescue.exception.ResourceNotFoundException;
import com.foodrescue.repository.ClaimRepository;
import com.foodrescue.repository.FoodItemRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Isolation;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional(readOnly = true)
public class ClaimService {

    public static final String DEMO_RECIPIENT_NAME = "Demo Recipient";

    private final FoodItemRepository foodItemRepository;
    private final ClaimRepository claimRepository;

    public ClaimService(FoodItemRepository foodItemRepository, ClaimRepository claimRepository) {
        this.foodItemRepository = foodItemRepository;
        this.claimRepository = claimRepository;
    }

    /**
     * Atomically claims an available food listing.
     * Uses pessimistic locking (SELECT FOR UPDATE) to prevent concurrent double-claiming.
     */
    @Transactional(isolation = Isolation.READ_COMMITTED)
    public ClaimResponseDto claimFood(Long foodId, String recipientName) {
        // 1. Acquire pessimistic write lock on the target FoodItem row
        FoodItem foodItem = foodItemRepository.findByIdForUpdate(foodId)
                .orElseThrow(() -> new ResourceNotFoundException("Food listing not found with id: " + foodId));

        // 2. Concurrency check: Ensure item is still AVAILABLE
        if (foodItem.getStatus() != FoodStatus.AVAILABLE) {
            throw new FoodAlreadyClaimedException("Food item with id " + foodId + " has already been claimed.");
        }

        // 3. Mark food item as CLAIMED
        foodItem.setStatus(FoodStatus.CLAIMED);
        foodItemRepository.save(foodItem);

        // 4. Create and persist Claim entity
        String recipient = (recipientName != null && !recipientName.trim().isEmpty())
                ? recipientName.trim()
                : DEMO_RECIPIENT_NAME;

        Claim claim = new Claim();
        claim.setFoodItem(foodItem);
        claim.setRecipientName(recipient);
        claim.setStatus("CLAIMED");
        claim.setClaimedAt(LocalDateTime.now());

        Claim savedClaim = claimRepository.save(claim);
        return ClaimResponseDto.fromEntity(savedClaim);
    }

    public List<ClaimResponseDto> getClaims() {
        return claimRepository.findAllByOrderByClaimedAtDesc()
                .stream()
                .map(ClaimResponseDto::fromEntity)
                .collect(Collectors.toList());
    }
}

