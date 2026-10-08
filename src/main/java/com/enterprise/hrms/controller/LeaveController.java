package com.enterprise.hrms.controller;

import com.enterprise.hrms.dto.ApiResponse;
import com.enterprise.hrms.dto.LeaveApplicationRequest;
import com.enterprise.hrms.dto.LeaveRequestResponse;
import com.enterprise.hrms.entity.LeaveRequest.LeaveStatus;
import com.enterprise.hrms.service.LeaveService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/leaves")
@RequiredArgsConstructor
public class LeaveController {

    private final LeaveService leaveService;

    @PostMapping("/apply")
    @PreAuthorize("hasAnyRole('ADMIN', 'HR', 'MANAGER', 'EMPLOYEE')")
    public ResponseEntity<ApiResponse<LeaveRequestResponse>> applyForLeave(@Valid @RequestBody LeaveApplicationRequest request) {
        return ResponseEntity.ok(ApiResponse.success("Leave applied successfully", leaveService.applyForLeave(request)));
    }

    @PutMapping("/{leaveId}/status")
    @PreAuthorize("hasAnyRole('ADMIN', 'HR', 'MANAGER')")
    public ResponseEntity<ApiResponse<LeaveRequestResponse>> updateLeaveStatus(
            @PathVariable Long leaveId,
            @RequestParam LeaveStatus status,
            @RequestParam Long approverId) {
        return ResponseEntity.ok(ApiResponse.success("Leave status updated successfully", 
                leaveService.updateLeaveStatus(leaveId, status, approverId)));
    }

    @GetMapping("/employee/{employeeId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'HR', 'MANAGER', 'EMPLOYEE')")
    public ResponseEntity<ApiResponse<Page<LeaveRequestResponse>>> getLeaveHistory(
            @PathVariable Long employeeId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size);
        return ResponseEntity.ok(ApiResponse.success("Leave history fetched successfully", 
                leaveService.getLeaveHistoryByEmployee(employeeId, pageable)));
    }

    @GetMapping("/status")
    @PreAuthorize("hasAnyRole('ADMIN', 'HR', 'MANAGER')")
    public ResponseEntity<ApiResponse<Page<LeaveRequestResponse>>> getLeavesByStatus(
            @RequestParam LeaveStatus status,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size);
        return ResponseEntity.ok(ApiResponse.success("Leaves fetched successfully", 
                leaveService.getLeavesByStatus(status, pageable)));
    }
}
