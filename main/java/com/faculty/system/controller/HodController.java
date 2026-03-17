package com.faculty.system.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.faculty.system.dto.FacultyDTO;
import com.faculty.system.dto.HodDashboardDTO;
import com.faculty.system.service.HodService;

import java.util.List;
import java.util.Map;
import java.util.HashMap;

@RestController
@RequestMapping("/api/hod")
@RequiredArgsConstructor
public class HodController {

    private final HodService hodService;

    @GetMapping("/dashboard/{department}")
    public ResponseEntity<HodDashboardDTO> getDashboard(@PathVariable String department) {
        return ResponseEntity.ok(hodService.getDashboardStats(department));
    }

    @GetMapping("/faculty-status")
    public ResponseEntity<Map<String, Object>> getFacultyStatus(@RequestParam(required = false) String department) {
        if (department == null) department = "";
        HodDashboardDTO stats = hodService.getDashboardStats(department);
        Map<String, Object> response = new HashMap<>();
        response.put("profile_completed", stats.getProfilesCompleted());
        response.put("profile_pending", stats.getProfilesPending());
        response.put("total_faculty", stats.getTotalFaculty());
        return ResponseEntity.ok(response);
    }

    @GetMapping("/faculties/{department}")
    public ResponseEntity<List<FacultyDTO>> getFaculties(@PathVariable String department) {
        return ResponseEntity.ok(hodService.getFacultyList(department));
    }

    @GetMapping("/facultyList")
    public ResponseEntity<List<FacultyDTO>> getFacultyList(@RequestParam("department") String department) {
        return ResponseEntity.ok(hodService.getFacultyList(department));
    }

    @PostMapping("/send-reminder")
    public ResponseEntity<Map<String, Object>> sendReminder(@RequestParam("id") Long id, @RequestParam("message") String message) {
        hodService.sendReminder(id, message);
        Map<String, Object> response = new HashMap<>();
        response.put("status", "success");
        response.put("message", "Reminder sent successfully");
        return ResponseEntity.ok(response);
    }
}
