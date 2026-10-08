package com.enterprise.hrms.service;

import com.enterprise.hrms.dto.LeaveApplicationRequest;
import com.enterprise.hrms.dto.LeaveRequestResponse;
import com.enterprise.hrms.entity.Employee;
import com.enterprise.hrms.entity.LeaveRequest;
import com.enterprise.hrms.exception.BadRequestException;
import com.enterprise.hrms.exception.ResourceNotFoundException;
import com.enterprise.hrms.repository.EmployeeRepository;
import com.enterprise.hrms.repository.LeaveRequestRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class LeaveService {

    private final LeaveRequestRepository leaveRequestRepository;
    private final EmployeeRepository employeeRepository;

    public LeaveRequestResponse applyForLeave(LeaveApplicationRequest request) {
        if (request.getStartDate().isAfter(request.getEndDate())) {
            throw new BadRequestException("Start date cannot be after end date");
        }

        Employee employee = employeeRepository.findById(request.getEmployeeId())
                .orElseThrow(() -> new ResourceNotFoundException("Employee not found"));

        LeaveRequest leaveRequest = LeaveRequest.builder()
                .employee(employee)
                .type(request.getType())
                .startDate(request.getStartDate())
                .endDate(request.getEndDate())
                .reason(request.getReason())
                .status(LeaveRequest.LeaveStatus.PENDING)
                .build();

        LeaveRequest saved = leaveRequestRepository.save(leaveRequest);
        return mapToResponse(saved);
    }

    public LeaveRequestResponse updateLeaveStatus(Long leaveId, LeaveRequest.LeaveStatus status, Long approverId) {
        LeaveRequest leaveRequest = leaveRequestRepository.findById(leaveId)
                .orElseThrow(() -> new ResourceNotFoundException("Leave request not found"));

        Employee approver = employeeRepository.findById(approverId)
                .orElseThrow(() -> new ResourceNotFoundException("Approver not found"));

        leaveRequest.setStatus(status);
        leaveRequest.setApprovedBy(approver);

        LeaveRequest updated = leaveRequestRepository.save(leaveRequest);
        return mapToResponse(updated);
    }

    public Page<LeaveRequestResponse> getLeaveHistoryByEmployee(Long employeeId, Pageable pageable) {
        return leaveRequestRepository.findByEmployeeId(employeeId, pageable)
                .map(this::mapToResponse);
    }

    public Page<LeaveRequestResponse> getLeavesByStatus(LeaveRequest.LeaveStatus status, Pageable pageable) {
        return leaveRequestRepository.findByStatus(status, pageable)
                .map(this::mapToResponse);
    }

    private LeaveRequestResponse mapToResponse(LeaveRequest leaveRequest) {
        return LeaveRequestResponse.builder()
                .id(leaveRequest.getId())
                .employeeId(leaveRequest.getEmployee().getId())
                .employeeName(leaveRequest.getEmployee().getFirstName() + " " + leaveRequest.getEmployee().getLastName())
                .type(leaveRequest.getType())
                .startDate(leaveRequest.getStartDate())
                .endDate(leaveRequest.getEndDate())
                .reason(leaveRequest.getReason())
                .status(leaveRequest.getStatus())
                .approvedById(leaveRequest.getApprovedBy() != null ? leaveRequest.getApprovedBy().getId() : null)
                .approvedByName(leaveRequest.getApprovedBy() != null ? leaveRequest.getApprovedBy().getFirstName() + " " + leaveRequest.getApprovedBy().getLastName() : null)
                .build();
    }
}
