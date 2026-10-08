package com.enterprise.hrms.dto;

import com.enterprise.hrms.entity.Document.DocumentType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DocumentResponse {
    private Long id;
    private Long employeeId;
    private String employeeName;
    private String fileName;
    private String originalFileName;
    private String fileUrl;
    private DocumentType type;
    private LocalDateTime uploadedAt;
}
