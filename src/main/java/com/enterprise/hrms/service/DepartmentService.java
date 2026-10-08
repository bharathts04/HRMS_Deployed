package com.enterprise.hrms.service;

import com.enterprise.hrms.dto.DepartmentRequest;
import com.enterprise.hrms.dto.DepartmentResponse;
import com.enterprise.hrms.entity.Department;
import com.enterprise.hrms.entity.Employee;
import com.enterprise.hrms.exception.BadRequestException;
import com.enterprise.hrms.exception.ResourceNotFoundException;
import com.enterprise.hrms.repository.DepartmentRepository;
import com.enterprise.hrms.repository.EmployeeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DepartmentService {

    private final DepartmentRepository departmentRepository;
    private final EmployeeRepository employeeRepository;

    public DepartmentResponse createDepartment(DepartmentRequest request) {
        if (departmentRepository.existsByName(request.getName())) {
            throw new BadRequestException("Department name already exists");
        }

        Department department = Department.builder()
                .name(request.getName())
                .description(request.getDescription())
                .build();

        if (request.getHeadId() != null) {
            Employee head = employeeRepository.findById(request.getHeadId())
                    .orElseThrow(() -> new ResourceNotFoundException("Employee not found to set as head"));
            department.setHead(head);
        }

        Department saved = departmentRepository.save(department);
        return mapToResponse(saved);
    }

    public DepartmentResponse updateDepartment(Long id, DepartmentRequest request) {
        Department department = departmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Department not found"));

        if (!department.getName().equals(request.getName()) && departmentRepository.existsByName(request.getName())) {
            throw new BadRequestException("Department name already exists");
        }

        department.setName(request.getName());
        department.setDescription(request.getDescription());

        if (request.getHeadId() != null) {
            Employee head = employeeRepository.findById(request.getHeadId())
                    .orElseThrow(() -> new ResourceNotFoundException("Employee not found to set as head"));
            department.setHead(head);
        } else {
            department.setHead(null);
        }

        Department updated = departmentRepository.save(department);
        return mapToResponse(updated);
    }

    public void deleteDepartment(Long id) {
        if (!departmentRepository.existsById(id)) {
            throw new ResourceNotFoundException("Department not found");
        }
        departmentRepository.deleteById(id);
    }

    public DepartmentResponse getDepartmentById(Long id) {
        Department department = departmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Department not found"));
        return mapToResponse(department);
    }

    public List<DepartmentResponse> getAllDepartments() {
        return departmentRepository.findAll().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    private DepartmentResponse mapToResponse(Department department) {
        long employeeCount = departmentRepository.countEmployeesByDepartmentId(department.getId());
        return DepartmentResponse.builder()
                .id(department.getId())
                .name(department.getName())
                .description(department.getDescription())
                .headId(department.getHead() != null ? department.getHead().getId() : null)
                .headName(department.getHead() != null ? department.getHead().getFirstName() + " " + department.getHead().getLastName() : null)
                .employeeCount(employeeCount)
                .createdDate(department.getCreatedDate())
                .lastModifiedDate(department.getLastModifiedDate())
                .build();
    }
}
