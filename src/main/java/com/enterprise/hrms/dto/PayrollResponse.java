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
public class PayrollResponse {
    private Long id;
    private Long employeeId;
    private String employeeName;
    private String month;
    private String year;
    private LocalDate paymentDate;
    private Double basic;
    private Double hra;
    private Double bonus;
    private Double allowance;
    private Double tax;
    private Double pf;
    private Double netSalary;
}
