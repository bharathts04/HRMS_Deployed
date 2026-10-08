package com.enterprise.hrms.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

@Entity
@Table(name = "salary")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@EqualsAndHashCode(callSuper = true)
public class Salary extends Auditable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "employee_id", nullable = false)
    private Employee employee;

    private Double basic;
    private Double hra;
    private Double bonus;
    private Double allowance;
    private Double tax;
    private Double pf;
    
    @Column(nullable = false)
    private Double netSalary;

    @Column(nullable = false)
    private LocalDate paymentDate;
    
    private String month;
    private String year;
}
