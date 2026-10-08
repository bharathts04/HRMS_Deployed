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
public class PayrollRequest {

    @NotNull(message = "Employee ID is required")
    private Long employeeId;

    @NotBlank(message = "Month is required (e.g., January)")
    private String month;

    @NotBlank(message = "Year is required (e.g., 2024)")
    private String year;
    
    @NotNull(message = "Payment date is required")
    private LocalDate paymentDate;
    
    // Optional overrides
    private Double basic;
    private Double bonus;
    private Double allowance;
}
