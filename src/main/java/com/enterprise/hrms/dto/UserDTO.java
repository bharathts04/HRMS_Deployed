package com.enterprise.hrms.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class UserDTO {
    private Long id; // This is the Employee ID for frontend convenience
    private Long userId; // The actual User ID
    private String email;
    private String role;
    private String firstName;
    private String lastName;
}
