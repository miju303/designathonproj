package com.faculty.system.service;

import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import com.faculty.system.dto.LoginRequest;
import com.faculty.system.dto.LoginResponse;
import com.faculty.system.entity.Faculty;
import com.faculty.system.repository.FacultyRepository;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final FacultyRepository facultyRepository;

    @PostConstruct
    public void initDefaultUsers() {
        // Hardcoded demo users removed. System now relies solely on MySQL database content.
    }

    public LoginResponse login(LoginRequest request) {
        Optional<Faculty> facultyOpt = facultyRepository.findByEmail(request.getEmail());
        if (facultyOpt.isPresent()) {
            Faculty faculty = facultyOpt.get();
            if (faculty.getPassword().equals(request.getPassword())) {
                return new LoginResponse(faculty.getId(), faculty.getName(), faculty.getEmail(), faculty.getRole(), faculty.getDepartment(), "Login successful", true);
            }
        }
        return new LoginResponse(null, null, null, null, null, "Invalid email or password", false);
    }
}
