package com.enterprise.hrms.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class EmployeeRequest {

    @NotBlank(message = "First name is required")
    private String firstName;

    @NotBlank(message = "Last name is required")
    private String lastName;

    @NotNull(message = "User ID is required")
    private Long userId;

    private LocalDate dateOfBirth;
    
    private String phone;
    
    private String address;

    private String designation;
    
    private Double salary;

    @NotNull(message = "Joining date is required")
    private LocalDate joiningDate;

    private Long departmentId;

    private Long managerId;
}
