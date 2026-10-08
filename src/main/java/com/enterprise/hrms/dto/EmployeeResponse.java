package com.enterprise.hrms.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class EmployeeResponse {

    private Long id;
    private Long userId;
    private String email;
    private String userRole;
    private String firstName;
    private String lastName;
    private LocalDate dateOfBirth;
    private String phone;
    private String address;
    private String designation;
    private Double salary;
    private LocalDate joiningDate;
    private String profilePhotoUrl;
    private Long departmentId;
    private String departmentName;
    private Long managerId;
    private String managerName;
    private LocalDateTime createdDate;
    private LocalDateTime lastModifiedDate;
}
