package com.foodrescue.service;

import com.foodrescue.dto.FoodItemRequestDto;
import com.foodrescue.dto.FoodItemResponseDto;
import com.foodrescue.entity.FoodItem;
import com.foodrescue.entity.FoodStatus;
import com.foodrescue.exception.ResourceNotFoundException;
import com.foodrescue.repository.FoodItemRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional(readOnly = true)
public class FoodService {

    private final FoodItemRepository foodItemRepository;

    public FoodService(FoodItemRepository foodItemRepository) {
        this.foodItemRepository = foodItemRepository;
    }

    public List<FoodItemResponseDto> getFoodListings(FoodStatus status) {
        List<FoodItem> items;
        if (status != null) {
            items = foodItemRepository.findByStatusOrderByCreatedAtDesc(status);
        } else {
            items = foodItemRepository.findAllByOrderByCreatedAtDesc();
        }
        return items.stream()
                .map(FoodItemResponseDto::fromEntity)
                .collect(Collectors.toList());
    }

    public FoodItemResponseDto getFoodListingById(Long id) {
        FoodItem item = foodItemRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Food listing not found with id: " + id));
        return FoodItemResponseDto.fromEntity(item);
    }

    @Transactional
    public FoodItemResponseDto createFoodListing(FoodItemRequestDto requestDto) {
        if (requestDto.getPickupDeadline() != null && requestDto.getPickupDeadline().isBefore(LocalDateTime.now())) {
            throw new IllegalArgumentException("Pickup deadline must be in the future.");
        }

        FoodItem item = new FoodItem();
        item.setFoodName(requestDto.getFoodName().trim());
        item.setDescription(requestDto.getDescription().trim());
        item.setQuantity(requestDto.getQuantity());
        item.setUnit(requestDto.getUnit().trim());
        item.setPickupLocation(requestDto.getPickupLocation().trim());
        item.setPickupDeadline(requestDto.getPickupDeadline());
        item.setDonorName(requestDto.getDonorName().trim());
        item.setDonorType(requestDto.getDonorType());
        item.setStatus(FoodStatus.AVAILABLE);
        item.setCreatedAt(LocalDateTime.now());

        FoodItem saved = foodItemRepository.save(item);
        return FoodItemResponseDto.fromEntity(saved);
    }
}
