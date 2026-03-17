package com.faculty.system.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import com.faculty.system.dto.FacultyDTO;
import com.faculty.system.service.FacultyService;

import java.util.Map;
import java.util.HashMap;

@RestController
@RequestMapping("/api/faculty")
@RequiredArgsConstructor
public class FacultyController {

    private final FacultyService facultyService;

    @GetMapping("/{id}")
    public ResponseEntity<FacultyDTO> getProfile(@PathVariable Long id) {
        return ResponseEntity.ok(facultyService.getFacultyProfile(id));
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<FacultyDTO> updateProfile(@PathVariable Long id, @RequestBody FacultyDTO dto) {
        return ResponseEntity.ok(facultyService.updateFacultyProfile(id, dto));
    }

    @PostMapping("/upload")
    public ResponseEntity<Map<String, Object>> uploadFile(
            @RequestParam("id") Long id,
            @RequestParam("type") String type,
            @RequestParam(value = "name", required = false) String name,
            @RequestParam("file") MultipartFile file) {
        facultyService.uploadFile(id, type, name, file);
        Map<String, Object> response = new HashMap<>();
        response.put("status", "success");
        response.put("message", "File uploaded successfully");
        return ResponseEntity.ok(response);
    }
}
