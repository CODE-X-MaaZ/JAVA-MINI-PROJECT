package com.foodrescue.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.foodrescue.entity.DonorType;
import com.foodrescue.entity.FoodItem;
import com.foodrescue.entity.FoodStatus;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public class FoodItemResponseDto {

    private Long id;
    private String foodName;
    private String description;
    private BigDecimal quantity;
    private String unit;
    private String pickupLocation;

    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime pickupDeadline;

    private String donorName;
    private DonorType donorType;
    private FoodStatus status;

    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime createdAt;

    public FoodItemResponseDto() {
    }

    public FoodItemResponseDto(Long id, String foodName, String description, BigDecimal quantity,
                               String unit, String pickupLocation, LocalDateTime pickupDeadline,
                               String donorName, DonorType donorType, FoodStatus status,
                               LocalDateTime createdAt) {
        this.id = id;
        this.foodName = foodName;
        this.description = description;
        this.quantity = quantity;
        this.unit = unit;
        this.pickupLocation = pickupLocation;
        this.pickupDeadline = pickupDeadline;
        this.donorName = donorName;
        this.donorType = donorType;
        this.status = status;
        this.createdAt = createdAt;
    }

    public static FoodItemResponseDto fromEntity(FoodItem entity) {
        if (entity == null) {
            return null;
        }
        return new FoodItemResponseDto(
                entity.getId(),
                entity.getFoodName(),
                entity.getDescription(),
                entity.getQuantity(),
                entity.getUnit(),
                entity.getPickupLocation(),
                entity.getPickupDeadline(),
                entity.getDonorName(),
                entity.getDonorType(),
                entity.getStatus(),
                entity.getCreatedAt()
        );
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getFoodName() {
        return foodName;
    }

    public void setFoodName(String foodName) {
        this.foodName = foodName;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public BigDecimal getQuantity() {
        return quantity;
    }

    public void setQuantity(BigDecimal quantity) {
        this.quantity = quantity;
    }

    public String getUnit() {
        return unit;
    }

    public void setUnit(String unit) {
        this.unit = unit;
    }

    public String getPickupLocation() {
        return pickupLocation;
    }

    public void setPickupLocation(String pickupLocation) {
        this.pickupLocation = pickupLocation;
    }

    public LocalDateTime getPickupDeadline() {
        return pickupDeadline;
    }

    public void setPickupDeadline(LocalDateTime pickupDeadline) {
        this.pickupDeadline = pickupDeadline;
    }

    public String getDonorName() {
        return donorName;
    }

    public void setDonorName(String donorName) {
        this.donorName = donorName;
    }

    public DonorType getDonorType() {
        return donorType;
    }

    public void setDonorType(DonorType donorType) {
        this.donorType = donorType;
    }

    public FoodStatus getStatus() {
        return status;
    }

    public void setStatus(FoodStatus status) {
        this.status = status;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}

