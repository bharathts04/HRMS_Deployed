package com.enterprise.hrms.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

@Entity
@Table(name = "job_positions")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@EqualsAndHashCode(callSuper = true)
public class JobPosition extends Auditable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(length = 1000)
    private String description;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "department_id")
    private Department department;
    
    private String location;

    @Column(nullable = false)
    private String employmentType; // Full-time, Part-time, Contract

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private PositionStatus status;
    
    private LocalDate postedDate;
    private LocalDate closingDate;

    public enum PositionStatus {
        OPEN, CLOSED, ON_HOLD
    }
}
