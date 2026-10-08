package com.enterprise.hrms.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class PerformanceReviewRequest {

    @NotNull(message = "Employee ID is required")
    private Long employeeId;

    @NotNull(message = "Reviewer ID is required")
    private Long reviewerId;

    @Min(0) @Max(5)
    private Double communicationScore;
    
    @Min(0) @Max(5)
    private Double productivityScore;
    
    @Min(0) @Max(5)
    private Double teamworkScore;
    
    @Min(0) @Max(5)
    private Double leadershipScore;
    
    private String comments;
}
