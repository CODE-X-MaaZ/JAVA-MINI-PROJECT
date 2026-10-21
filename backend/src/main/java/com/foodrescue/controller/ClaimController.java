package com.foodrescue.controller;

import com.foodrescue.dto.ClaimResponseDto;
import com.foodrescue.service.ClaimService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/claims")
public class ClaimController {

    private final ClaimService claimService;

    public ClaimController(ClaimService claimService) {
        this.claimService = claimService;
    }

    /**
     * GET /api/claims
     * Returns claims for demo identity / session.
     */
    @GetMapping
    public ResponseEntity<List<ClaimResponseDto>> getClaims() {
        List<ClaimResponseDto> claims = claimService.getClaims();
        return ResponseEntity.ok(claims);
    }
}

