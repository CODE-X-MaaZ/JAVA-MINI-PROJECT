package com.foodrescue.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.foodrescue.entity.DonorType;
import jakarta.validation.constraints.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public class FoodItemRequestDto {

    @NotBlank(message = "Food name is required.")
    @Size(max = 120, message = "Food name cannot exceed 120 characters.")
    private String foodName;

    @NotBlank(message = "Description is required.")
    private String description;

    @NotNull(message = "Quantity is required.")
    @DecimalMin(value = "0.01", inclusive = true, message = "Quantity must be greater than zero.")
    private BigDecimal quantity;

    @NotBlank(message = "Unit is required.")
    @Size(max = 30, message = "Unit cannot exceed 30 characters.")
    private String unit;

    @NotBlank(message = "Pickup location is required.")
    @Size(max = 255, message = "Pickup location cannot exceed 255 characters.")
    private String pickupLocation;

    @NotNull(message = "Pickup deadline is required.")
    @Future(message = "Pickup deadline must be in the future.")
    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm[:ss]")
    private LocalDateTime pickupDeadline;

    @NotBlank(message = "Donor name is required.")
    @Size(max = 120, message = "Donor name cannot exceed 120 characters.")
    private String donorName;

    @NotNull(message = "Donor type is required.")
    private DonorType donorType;

    public FoodItemRequestDto() {
    }

    public FoodItemRequestDto(String foodName, String description, BigDecimal quantity, String unit,
                              String pickupLocation, LocalDateTime pickupDeadline, String donorName,
                              DonorType donorType) {
        this.foodName = foodName;
        this.description = description;
        this.quantity = quantity;
        this.unit = unit;
        this.pickupLocation = pickupLocation;
        this.pickupDeadline = pickupDeadline;
        this.donorName = donorName;
        this.donorType = donorType;
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
}

