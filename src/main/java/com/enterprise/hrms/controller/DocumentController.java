package com.enterprise.hrms.controller;

import com.enterprise.hrms.dto.ApiResponse;
import com.enterprise.hrms.dto.DocumentResponse;
import com.enterprise.hrms.entity.Document;
import com.enterprise.hrms.entity.Document.DocumentType;
import com.enterprise.hrms.entity.Employee;
import com.enterprise.hrms.exception.ResourceNotFoundException;
import com.enterprise.hrms.repository.DocumentRepository;
import com.enterprise.hrms.repository.EmployeeRepository;
import com.enterprise.hrms.service.FileStorageService;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1/documents")
@RequiredArgsConstructor
public class DocumentController {

    private final FileStorageService fileStorageService;
    private final DocumentRepository documentRepository;
    private final EmployeeRepository employeeRepository;

    @PostMapping("/upload")
    @PreAuthorize("hasAnyRole('ADMIN', 'HR', 'EMPLOYEE')")
    public ResponseEntity<ApiResponse<DocumentResponse>> uploadDocument(
            @RequestParam("file") MultipartFile file,
            @RequestParam("employeeId") Long employeeId,
            @RequestParam("type") DocumentType type) {
            
        Employee employee = employeeRepository.findById(employeeId)
                .orElseThrow(() -> new ResourceNotFoundException("Employee not found"));

        String fileName = fileStorageService.storeFile(file);

        String fileDownloadUri = ServletUriComponentsBuilder.fromCurrentContextPath()
                .path("/api/v1/documents/download/")
                .path(fileName)
                .toUriString();

        Document document = Document.builder()
                .employee(employee)
                .fileName(fileName)
                .fileUrl(fileDownloadUri)
                .type(type)
                .build();

        Document saved = documentRepository.save(document);

        return ResponseEntity.ok(ApiResponse.success("Document uploaded successfully", mapToResponse(saved)));
    }

    @GetMapping("/employee/{employeeId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'HR', 'MANAGER', 'EMPLOYEE')")
    public ResponseEntity<ApiResponse<List<DocumentResponse>>> getEmployeeDocuments(@PathVariable Long employeeId) {
        List<DocumentResponse> documents = documentRepository.findByEmployeeId(employeeId)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
        return ResponseEntity.ok(ApiResponse.success("Documents fetched successfully", documents));
    }

    @GetMapping("/all")
    @PreAuthorize("hasAnyRole('ADMIN', 'HR')")
    public ResponseEntity<ApiResponse<List<DocumentResponse>>> getAllDocuments() {
        List<DocumentResponse> documents = documentRepository.findAll()
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
        return ResponseEntity.ok(ApiResponse.success("All documents fetched successfully", documents));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'HR', 'EMPLOYEE')")
    public ResponseEntity<ApiResponse<Void>> deleteDocument(@PathVariable Long id) {
        Document document = documentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Document not found with id: " + id));
        fileStorageService.deleteFile(document.getFileName());
        documentRepository.delete(document);
        return ResponseEntity.ok(ApiResponse.success("Document deleted successfully", null));
    }

    @GetMapping("/download/{fileName:.+}")
    public ResponseEntity<Resource> downloadFile(@PathVariable String fileName) {
        Resource resource = fileStorageService.loadFileAsResource(fileName);

        return ResponseEntity.ok()
                .contentType(MediaType.APPLICATION_OCTET_STREAM)
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + resource.getFilename() + "\"")
                .body(resource);
    }

    private DocumentResponse mapToResponse(Document doc) {
        String employeeName = doc.getEmployee() != null ? 
                doc.getEmployee().getFirstName() + " " + doc.getEmployee().getLastName() : "Unknown";
        String origName = doc.getFileName();
        if (origName != null && origName.contains("_")) {
            origName = origName.substring(origName.indexOf("_") + 1);
        }
        return DocumentResponse.builder()
                .id(doc.getId())
                .employeeId(doc.getEmployee() != null ? doc.getEmployee().getId() : null)
                .employeeName(employeeName)
                .fileName(doc.getFileName())
                .originalFileName(origName)
                .fileUrl(doc.getFileUrl())
                .type(doc.getType())
                .uploadedAt(doc.getCreatedDate())
                .build();
    }
}
