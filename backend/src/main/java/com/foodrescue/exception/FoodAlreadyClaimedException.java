package com.foodrescue.exception;

public class FoodAlreadyClaimedException extends RuntimeException {
    public FoodAlreadyClaimedException(String message) {
        super(message);
    }
}

