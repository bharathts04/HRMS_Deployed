package com.enterprise.hrms.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "documents")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@EqualsAndHashCode(callSuper = true)
public class Document extends Auditable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "employee_id", nullable = false)
    private Employee employee;

    @Column(nullable = false)
    private String fileName;

    @Column(nullable = false)
    private String fileUrl; // Path to local storage

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private DocumentType type;

    public enum DocumentType {
        RESUME, PAN, AADHAAR, PASSPORT, CERTIFICATE, OTHER
    }
}
