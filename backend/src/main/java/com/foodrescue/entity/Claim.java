package com.foodrescue.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(
    name = "claims",
    uniqueConstraints = {
        @UniqueConstraint(name = "uk_claims_food_item", columnNames = {"food_item_id"})
    }
)
public class Claim {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "food_item_id", nullable = false, unique = true)
    private FoodItem foodItem;

    @Column(name = "recipient_name", nullable = false, length = 120)
    private String recipientName;

    @Column(name = "status", nullable = false, length = 20)
    private String status = "CLAIMED";

    @Column(name = "claimed_at", nullable = false)
    private LocalDateTime claimedAt;

    public Claim() {
    }

    public Claim(Long id, FoodItem foodItem, String recipientName, String status, LocalDateTime claimedAt) {
        this.id = id;
        this.foodItem = foodItem;
        this.recipientName = recipientName;
        this.status = status;
        this.claimedAt = claimedAt;
    }

    @PrePersist
    protected void onCreate() {
        if (this.claimedAt == null) {
            this.claimedAt = LocalDateTime.now();
        }
        if (this.status == null) {
            this.status = "CLAIMED";
        }
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public FoodItem getFoodItem() {
        return foodItem;
    }

    public void setFoodItem(FoodItem foodItem) {
        this.foodItem = foodItem;
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
