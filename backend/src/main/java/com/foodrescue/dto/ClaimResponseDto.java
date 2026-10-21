package com.foodrescue.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.foodrescue.entity.Claim;

import java.time.LocalDateTime;

public class ClaimResponseDto {

    private Long id;
    private Long foodItemId;
    private String foodName;
    private String recipientName;
    private String status;

    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime claimedAt;

    public ClaimResponseDto() {
    }

    public ClaimResponseDto(Long id, Long foodItemId, String foodName, String recipientName,
                            String status, LocalDateTime claimedAt) {
        this.id = id;
        this.foodItemId = foodItemId;
        this.foodName = foodName;
        this.recipientName = recipientName;
        this.status = status;
        this.claimedAt = claimedAt;
    }

    public static ClaimResponseDto fromEntity(Claim claim) {
        if (claim == null) {
            return null;
        }
        Long foodId = claim.getFoodItem() != null ? claim.getFoodItem().getId() : null;
        String foodName = claim.getFoodItem() != null ? claim.getFoodItem().getFoodName() : null;
        return new ClaimResponseDto(
                claim.getId(),
                foodId,
                foodName,
                claim.getRecipientName(),
                claim.getStatus(),
                claim.getClaimedAt()
        );
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getFoodItemId() {
        return foodItemId;
    }

    public void setFoodItemId(Long foodItemId) {
        this.foodItemId = foodItemId;
    }

    public String getFoodName() {
        return foodName;
    }

    public void setFoodName(String foodName) {
        this.foodName = foodName;
    }

    public String getRecipientName() {
        return recipientName;
    }

    public void setRecipientName(String recipientName) {
        this.recipientName = recipientName;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public LocalDateTime getClaimedAt() {
        return claimedAt;
    }

    public void setClaimedAt(LocalDateTime claimedAt) {
        this.claimedAt = claimedAt;
    }
}

