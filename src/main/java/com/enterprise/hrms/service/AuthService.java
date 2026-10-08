package com.enterprise.hrms.service;

import com.enterprise.hrms.dto.AuthRequest;
import com.enterprise.hrms.dto.AuthResponse;
import com.enterprise.hrms.dto.RegisterRequest;
import com.enterprise.hrms.entity.Role;
import com.enterprise.hrms.entity.User;
import com.enterprise.hrms.exception.BadRequestException;
import com.enterprise.hrms.repository.UserRepository;
import com.enterprise.hrms.repository.EmployeeRepository;
import com.enterprise.hrms.repository.DepartmentRepository;
import com.enterprise.hrms.dto.UserDTO;
import com.enterprise.hrms.security.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final EmployeeRepository employeeRepository;
    private final DepartmentRepository departmentRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new BadRequestException("Email is already registered");
        }

        var user = User.builder()
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(request.getRole() != null ? request.getRole() : Role.ROLE_EMPLOYEE)
                .build();

        userRepository.save(user);

        // Auto-create Employee profile for the new user
        com.enterprise.hrms.entity.Employee employee = new com.enterprise.hrms.entity.Employee();
        employee.setUser(user);
        employee.setFirstName(request.getFirstName() != null && !request.getFirstName().trim().isEmpty() ? request.getFirstName() : "New");
        employee.setLastName(request.getLastName() != null && !request.getLastName().trim().isEmpty() ? request.getLastName() : "User");
        employee.setDesignation(request.getDesignation());
        employee.setJoiningDate(java.time.LocalDate.now());
        
        if (request.getDepartmentId() != null) {
            departmentRepository.findById(request.getDepartmentId()).ifPresent(employee::setDepartment);
        }
        
        employeeRepository.save(employee);

        var jwtToken = jwtService.generateToken(user);
        var refreshToken = jwtService.generateRefreshToken(user);

        return AuthResponse.builder()
                .token(jwtToken)
                .refreshToken(refreshToken)
                .build();
    }

    public AuthResponse login(AuthRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(),
                        request.getPassword()
                )
        );

        var user = userRepository.findByEmail(request.getEmail())
                .orElseThrow();

        var jwtToken = jwtService.generateToken(user);
        var refreshToken = jwtService.generateRefreshToken(user);

        UserDTO userDTO = new UserDTO();
        userDTO.setUserId(user.getId());
        userDTO.setEmail(user.getEmail());
        userDTO.setRole(user.getRole().name());

        employeeRepository.findByUserId(user.getId()).ifPresent(emp -> {
            userDTO.setId(emp.getId());
            userDTO.setFirstName(emp.getFirstName());
            userDTO.setLastName(emp.getLastName());
        });

        return AuthResponse.builder()
                .token(jwtToken)
                .refreshToken(refreshToken)
                .user(userDTO)
                .build();
    }
}
