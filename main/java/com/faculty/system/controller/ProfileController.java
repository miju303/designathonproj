package com.faculty.system.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.faculty.system.dto.FacultyDTO;
import com.faculty.system.service.FacultyService;

import java.util.Map;
import java.util.HashMap;

@RestController
@RequestMapping("/api/profile")
@RequiredArgsConstructor
public class ProfileController {

    private final FacultyService facultyService;

    @PostMapping("/update")
    public ResponseEntity<Map<String, Object>> updateProfile(@RequestBody FacultyDTO dto) {
        Map<String, Object> response = new HashMap<>();
        if (dto.getId() == null) {
            response.put("status", "error");
            response.put("message", "Faculty ID is required");
            return ResponseEntity.badRequest().body(response);
        }
        facultyService.updateFacultyProfile(dto.getId(), dto);
        response.put("status", "success");
        response.put("message", "Profile updated successfully");
        return ResponseEntity.ok(response);
    }
}
