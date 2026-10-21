package com.foodrescue;

import com.foodrescue.dto.ClaimResponseDto;
import com.foodrescue.entity.DonorType;
import com.foodrescue.entity.FoodItem;
import com.foodrescue.entity.FoodStatus;
import com.foodrescue.exception.FoodAlreadyClaimedException;
import com.foodrescue.repository.ClaimRepository;
import com.foodrescue.repository.FoodItemRepository;
import com.foodrescue.service.ClaimService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.dao.DataIntegrityViolationException;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.concurrent.*;
import java.util.concurrent.atomic.AtomicInteger;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;

@SpringBootTest
class ClaimConcurrencyTest {

    @Autowired
    private ClaimService claimService;

    @Autowired
    private FoodItemRepository foodItemRepository;

    @Autowired
    private ClaimRepository claimRepository;

    @BeforeEach
    void setUp() {
        claimRepository.deleteAll();
        foodItemRepository.deleteAll();
    }

    @Test
    @DisplayName("Concurrent claim requests: Exactly one succeeds and all others fail with conflict")
    void testConcurrentClaimsPreventDoubleClaim() throws InterruptedException {
        // Arrange
        FoodItem item = new FoodItem();
        item.setFoodName("Surplus Thali Meals");
        item.setDescription("Freshly packaged complete meals");
        item.setQuantity(new BigDecimal("30.00"));
        item.setUnit("meals");
        item.setPickupLocation("Hall 4 Mess");
        item.setPickupDeadline(LocalDateTime.now().plusHours(8));
        item.setDonorName("University Hostel");
        item.setDonorType(DonorType.HOSTEL);
        item.setStatus(FoodStatus.AVAILABLE);
        item.setCreatedAt(LocalDateTime.now());
        FoodItem saved = foodItemRepository.save(item);
        final Long foodId = saved.getId();

        int numberOfThreads = 8;
        ExecutorService executor = Executors.newFixedThreadPool(numberOfThreads);
        CountDownLatch readyLatch = new CountDownLatch(numberOfThreads);
        CountDownLatch startLatch = new CountDownLatch(1);
        CountDownLatch doneLatch = new CountDownLatch(numberOfThreads);

        AtomicInteger successCount = new AtomicInteger(0);
        AtomicInteger conflictCount = new AtomicInteger(0);
        List<Throwable> unexpectedExceptions = Collections.synchronizedList(new ArrayList<>());

        for (int i = 0; i < numberOfThreads; i++) {
            final String recipient = "Recipient-" + i;
            executor.submit(() -> {
                readyLatch.countDown();
                try {
                    // Wait for the release gun so all threads hit claim concurrently
                    startLatch.await();
                    ClaimResponseDto result = claimService.claimFood(foodId, recipient);
                    if (result != null) {
                        successCount.incrementAndGet();
                    }
                } catch (FoodAlreadyClaimedException | DataIntegrityViolationException e) {
                    conflictCount.incrementAndGet();
                } catch (Throwable t) {
                    unexpectedExceptions.add(t);
                } finally {
                    doneLatch.countDown();
                }
            });
        }

        readyLatch.await();
        // Fire the starting gun
        startLatch.countDown();
        boolean completed = doneLatch.await(10, TimeUnit.SECONDS);
        executor.shutdown();

        assertTrue(completed, "All threads should complete within timeout");
        assertTrue(unexpectedExceptions.isEmpty(), "No unexpected exceptions should occur: " + unexpectedExceptions);

        // Assert that EXACTLY one claim succeeded
        assertEquals(1, successCount.get(), "Exactly one concurrent claim should succeed");
        // Assert that all other concurrent attempts failed with conflict
        assertEquals(numberOfThreads - 1, conflictCount.get(), "All other concurrent attempts should be rejected");

        // Assert database integrity
        FoodItem finalFoodItem = foodItemRepository.findById(foodId).orElseThrow();
        assertEquals(FoodStatus.CLAIMED, finalFoodItem.getStatus(), "Food item status must be CLAIMED");
        assertEquals(1, claimRepository.count(), "Exactly one claim record must exist in database");
    }
}
