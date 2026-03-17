package com.faculty.system.dto;

import com.faculty.system.enums.Role;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class LoginResponse {
    private Long id;
    private String name;
    private String email;
    private Role role;
    private String department;
    private String message;
    private boolean success;
}
