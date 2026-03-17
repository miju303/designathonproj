package com.faculty.system.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.faculty.system.entity.User;
import com.faculty.system.service.AdminService;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminController {

    private final AdminService adminService;

    @GetMapping("/analytics")
    public ResponseEntity<Map<String, Object>> getAnalytics() {
        return ResponseEntity.ok(adminService.getAnalytics());
    }

    @GetMapping("/faculties")
    public ResponseEntity<List<User>> getFaculties() {
        return ResponseEntity.ok(adminService.getAllFaculties());
    }

    @GetMapping("/faculty")
    public ResponseEntity<List<com.faculty.system.dto.FacultyDTO>> getFacultyProfiles() {
        return ResponseEntity.ok(adminService.getAllFacultyProfiles());
    }

    @PostMapping("/add-faculty")
    public ResponseEntity<User> addFaculty(@RequestBody User user) {
        return ResponseEntity.ok(adminService.addFaculty(user));
    }

    @PutMapping("/edit-faculty/{id}")
    public ResponseEntity<User> editFaculty(@PathVariable Long id, @RequestBody User user) {
        return ResponseEntity.ok(adminService.updateFaculty(id, user));
    }

    @DeleteMapping("/delete-faculty/{id}")
    public ResponseEntity<Map<String, Object>> deleteFaculty(@PathVariable Long id) {
        adminService.deleteFaculty(id);
        Map<String, Object> response = new HashMap<>();
        response.put("status", "success");
        response.put("message", "User deleted");
        return ResponseEntity.ok(response);
    }

    @PostMapping("/reset-password/{id}")
    public ResponseEntity<Map<String, Object>> resetPassword(@PathVariable Long id, @RequestBody Map<String, String> payload) {
        adminService.resetPassword(id, payload.get("password"));
        Map<String, Object> response = new HashMap<>();
        response.put("status", "success");
        response.put("message", "Password reset successful");
        return ResponseEntity.ok(response);
    }

    @PostMapping("/assign-department/{id}")
    public ResponseEntity<Map<String, Object>> assignDepartment(@PathVariable Long id, @RequestBody Map<String, String> payload) {
        adminService.assignDepartment(id, payload.get("department"));
        Map<String, Object> response = new HashMap<>();
        response.put("status", "success");
        response.put("message", "Department assigned");
        return ResponseEntity.ok(response);
    }

    @GetMapping("/naac-report")
    public ResponseEntity<Map<String, Object>> getNaacReport() {
        return ResponseEntity.ok(adminService.generateNaacReport());
    }

    @GetMapping("/logs")
    public ResponseEntity<List<com.faculty.system.entity.SystemLog>> getLogs() {
        return ResponseEntity.ok(adminService.getLogs());
    }

    @PostMapping("/clear-logs")
    public ResponseEntity<Map<String, Object>> clearLogs() {
        adminService.clearLogs();
        Map<String, Object> response = new HashMap<>();
        response.put("status", "success");
        response.put("message", "Logs cleared");
        return ResponseEntity.ok(response);
    }
}
