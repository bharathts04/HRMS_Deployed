package com.enterprise.hrms.service;

import com.enterprise.hrms.dto.EmployeeRequest;
import com.enterprise.hrms.dto.EmployeeResponse;
import com.enterprise.hrms.entity.Department;
import com.enterprise.hrms.entity.Employee;
import com.enterprise.hrms.entity.Role;
import com.enterprise.hrms.entity.User;
import com.enterprise.hrms.exception.ResourceNotFoundException;
import org.springframework.transaction.annotation.Transactional;
import com.enterprise.hrms.repository.DepartmentRepository;
import com.enterprise.hrms.repository.EmployeeRepository;
import com.enterprise.hrms.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class EmployeeService {

    private final EmployeeRepository employeeRepository;
    private final UserRepository userRepository;
    private final DepartmentRepository departmentRepository;
    private final FileStorageService fileStorageService;

    public EmployeeResponse createEmployee(EmployeeRequest request) {
        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Employee employee = Employee.builder()
                .user(user)
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .dateOfBirth(request.getDateOfBirth())
                .phone(request.getPhone())
                .address(request.getAddress())
                .designation(request.getDesignation())
                .salary(request.getSalary())
                .joiningDate(request.getJoiningDate())
                .build();

        if (request.getDepartmentId() != null) {
            Department dept = departmentRepository.findById(request.getDepartmentId())
                    .orElseThrow(() -> new ResourceNotFoundException("Department not found"));
            employee.setDepartment(dept);
        }

        if (request.getManagerId() != null) {
            Employee manager = employeeRepository.findById(request.getManagerId())
                    .orElseThrow(() -> new ResourceNotFoundException("Manager not found"));
            employee.setManager(manager);
        }

        Employee saved = employeeRepository.save(employee);
        return mapToResponse(saved);
    }

    @Transactional
    public EmployeeResponse updateEmployee(Long id, EmployeeRequest request, String currentUserEmail) {
        Employee employee = employeeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Employee not found"));
                
        User currentUser = userRepository.findByEmail(currentUserEmail)
                .orElseThrow(() -> new ResourceNotFoundException("Current user not found"));

        if (currentUser.getRole() != Role.ROLE_ADMIN && currentUser.getRole() != Role.ROLE_HR) {
            if (!employee.getUser().getId().equals(currentUser.getId())) {
                throw new org.springframework.security.access.AccessDeniedException("You are not authorized to update this profile");
            }
            // Employees should not be able to change their own role, salary, or department implicitly
            // We can enforce this if needed, but for now we just verify they are updating their own profile.
        }

        employee.setFirstName(request.getFirstName());
        employee.setLastName(request.getLastName());
        employee.setDateOfBirth(request.getDateOfBirth());
        employee.setPhone(request.getPhone());
        employee.setAddress(request.getAddress());
        employee.setDesignation(request.getDesignation());
        employee.setSalary(request.getSalary());
        employee.setJoiningDate(request.getJoiningDate());

        if (request.getDepartmentId() != null) {
            Department dept = departmentRepository.findById(request.getDepartmentId())
                    .orElseThrow(() -> new ResourceNotFoundException("Department not found"));
            employee.setDepartment(dept);
        } else {
            employee.setDepartment(null);
        }

        if (request.getManagerId() != null) {
            Employee manager = employeeRepository.findById(request.getManagerId())
                    .orElseThrow(() -> new ResourceNotFoundException("Manager not found"));
            employee.setManager(manager);
        } else {
            employee.setManager(null);
        }

        Employee updated = employeeRepository.save(employee);
        return mapToResponse(updated);
    }

    public void deleteEmployee(Long id, String currentUserEmail) {
        Employee targetEmployee = employeeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Employee not found"));

        User currentUser = userRepository.findByEmail(currentUserEmail)
                .orElseThrow(() -> new ResourceNotFoundException("Current user not found"));

        // System Admin can delete anyone
        // HR can only delete Employees, not other HRs or Admins
        if (currentUser.getRole() == com.enterprise.hrms.entity.Role.ROLE_HR) {
            if (targetEmployee.getUser() != null && 
                (targetEmployee.getUser().getRole() == com.enterprise.hrms.entity.Role.ROLE_ADMIN || 
                 targetEmployee.getUser().getRole() == com.enterprise.hrms.entity.Role.ROLE_HR)) {
                throw new com.enterprise.hrms.exception.BadRequestException("HR cannot delete Admin or HR users");
            }
        }

        User targetUser = targetEmployee.getUser();
        
        employeeRepository.deleteById(id);
        
        if (targetUser != null) {
            userRepository.delete(targetUser);
        }
    }

    public EmployeeResponse getEmployeeById(Long id) {
        Employee employee = employeeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Employee not found"));
        return mapToResponse(employee);
    }

    @Transactional
    public EmployeeResponse uploadProfilePhoto(Long id, org.springframework.web.multipart.MultipartFile file, String currentUserEmail) {
        Employee employee = employeeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Employee not found"));

        User currentUser = userRepository.findByEmail(currentUserEmail)
                .orElseThrow(() -> new ResourceNotFoundException("Current user not found"));

        if (currentUser.getRole() != Role.ROLE_ADMIN && currentUser.getRole() != Role.ROLE_HR) {
            if (!employee.getUser().getId().equals(currentUser.getId())) {
                throw new org.springframework.security.access.AccessDeniedException("You are not authorized to update this profile photo");
            }
        }

        String fileName = fileStorageService.storeFile(file);
        String fileUrl = "/api/v1/employees/photo/" + fileName;
        
        employee.setProfilePhotoUrl(fileUrl);
        Employee saved = employeeRepository.save(employee);
        
        return mapToResponse(saved);
    }

    public Page<EmployeeResponse> getAllEmployees(Pageable pageable) {
        return employeeRepository.findAll(pageable)
                .map(this::mapToResponse);
    }
    
    public Page<EmployeeResponse> getEmployeesByDepartment(Long departmentId, Pageable pageable) {
        return employeeRepository.findByDepartmentId(departmentId, pageable)
                .map(this::mapToResponse);
    }

    private EmployeeResponse mapToResponse(Employee employee) {
        return EmployeeResponse.builder()
                .id(employee.getId())
                .userId(employee.getUser() != null ? employee.getUser().getId() : null)
                .email(employee.getUser() != null ? employee.getUser().getEmail() : null)
                .userRole(employee.getUser() != null && employee.getUser().getRole() != null ? employee.getUser().getRole().name() : null)
                .firstName(employee.getFirstName())
                .lastName(employee.getLastName())
                .dateOfBirth(employee.getDateOfBirth())
                .phone(employee.getPhone())
                .address(employee.getAddress())
                .designation(employee.getDesignation())
                .salary(employee.getSalary())
                .joiningDate(employee.getJoiningDate())
                .profilePhotoUrl(employee.getProfilePhotoUrl())
                .departmentId(employee.getDepartment() != null ? employee.getDepartment().getId() : null)
                .departmentName(employee.getDepartment() != null ? employee.getDepartment().getName() : null)
                .managerId(employee.getManager() != null ? employee.getManager().getId() : null)
                .managerName(employee.getManager() != null ? employee.getManager().getFirstName() + " " + employee.getManager().getLastName() : null)
                .createdDate(employee.getCreatedDate())
                .lastModifiedDate(employee.getLastModifiedDate())
                .build();
    }
}
