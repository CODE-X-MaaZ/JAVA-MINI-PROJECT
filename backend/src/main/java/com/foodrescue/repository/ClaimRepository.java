package com.foodrescue.repository;

import com.foodrescue.entity.Claim;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ClaimRepository extends JpaRepository<Claim, Long> {

    List<Claim> findAllByOrderByClaimedAtDesc();

    List<Claim> findByRecipientNameOrderByClaimedAtDesc(String recipientName);

    boolean existsByFoodItemId(Long foodItemId);
}
