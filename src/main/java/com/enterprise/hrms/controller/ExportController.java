package com.enterprise.hrms.controller;

import com.enterprise.hrms.entity.Employee;
import com.enterprise.hrms.repository.EmployeeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/export")
@RequiredArgsConstructor
public class ExportController {

    private final EmployeeRepository employeeRepository;

    @GetMapping("/employees/csv")
    @PreAuthorize("hasAnyRole('ADMIN', 'HR')")
    public ResponseEntity<byte[]> exportEmployeesCsv() {
        List<Employee> employees = employeeRepository.findAll();

        StringBuilder csvContent = new StringBuilder();
        csvContent.append("ID,First Name,Last Name,Email,Phone,Department,Designation\n");

        for (Employee emp : employees) {
            csvContent.append(emp.getId()).append(",")
                    .append(emp.getFirstName()).append(",")
                    .append(emp.getLastName()).append(",")
                    .append(emp.getUser() != null ? emp.getUser().getEmail() : "").append(",")
                    .append(emp.getPhone() != null ? emp.getPhone() : "").append(",")
                    .append(emp.getDepartment() != null ? emp.getDepartment().getName() : "").append(",")
                    .append(emp.getDesignation() != null ? emp.getDesignation() : "").append("\n");
        }

        byte[] data = csvContent.toString().getBytes();

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=employees.csv")
                .contentType(MediaType.parseMediaType("text/csv"))
                .body(data);
    }
}
