package com.enterprise.hrms.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class PerformanceReviewResponse {
    private Long id;
    private Long employeeId;
    private String employeeName;
    private Long reviewerId;
    private String reviewerName;
    private LocalDate reviewDate;
    private Double communicationScore;
    private Double productivityScore;
    private Double teamworkScore;
    private Double leadershipScore;
    private Double overallRating;
    private String comments;
}
