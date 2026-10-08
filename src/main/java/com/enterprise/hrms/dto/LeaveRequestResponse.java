package com.enterprise.hrms.dto;

import com.enterprise.hrms.entity.LeaveRequest.LeaveStatus;
import com.enterprise.hrms.entity.LeaveRequest.LeaveType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class LeaveRequestResponse {

    private Long id;
    private Long employeeId;
    private String employeeName;
    private LeaveType type;
    private LocalDate startDate;
    private LocalDate endDate;
    private String reason;
    private LeaveStatus status;
    private Long approvedById;
    private String approvedByName;
}
