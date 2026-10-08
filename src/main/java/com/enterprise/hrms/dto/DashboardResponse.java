package com.enterprise.hrms.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Map;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class DashboardResponse {
    private long totalEmployees;
    private long totalDepartments;
    private long totalOpenPositions;
    private long todayPresentCount;
    private long todayAbsentCount;
    private long onLeaveCount;
    private long pendingLeaveRequests;
    private long newEmployeesThisMonth;
    private String payrollStatus;
    
    private Map<String, Long> employeesByDepartment;
    private Map<String, Long> attendanceTrend;
    private Map<String, Long> leaveStatusDistribution;
    private Map<String, Long> employeeGrowth;
    private Map<String, Double> departmentAttendanceRate;
}
