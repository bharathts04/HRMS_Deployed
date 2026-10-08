package com.enterprise.hrms.controller;

import com.enterprise.hrms.dto.ApiResponse;
import com.enterprise.hrms.dto.DashboardResponse;
import com.enterprise.hrms.service.DashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/dashboard")
@RequiredArgsConstructor
public class DashboardController {

    private final DashboardService dashboardService;

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'HR')")
    public ResponseEntity<ApiResponse<DashboardResponse>> getDashboardData() {
        return ResponseEntity.ok(ApiResponse.success("Dashboard data fetched successfully", dashboardService.getDashboardData()));
    }
}
