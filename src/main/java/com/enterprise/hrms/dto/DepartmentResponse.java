package com.enterprise.hrms.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class DepartmentResponse {
    private Long id;
    private String name;
    private String description;
    private Long headId;
    private String headName;
    private long employeeCount;
    private LocalDateTime createdDate;
    private LocalDateTime lastModifiedDate;
}
