package com.faculty.system.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.faculty.system.entity.Assignment;
import com.faculty.system.entity.Faculty;
import com.faculty.system.entity.SystemLog;
import com.faculty.system.repository.AssignmentRepository;
import com.faculty.system.repository.FacultyRepository;
import com.faculty.system.repository.SystemLogRepository;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.HashMap;

@RestController
@RequestMapping("/api/assignments")
public class AssignmentController {

    @Autowired
    private AssignmentRepository assignmentRepository;
    
    @Autowired
    private FacultyRepository facultyRepository;

    @Autowired
    private SystemLogRepository systemLogRepository;

    @GetMapping("/faculty/{facultyId}")
    public ResponseEntity<List<Assignment>> getFacultyAssignments(@PathVariable Long facultyId) {
        return ResponseEntity.ok(assignmentRepository.findByFacultyId(facultyId));
    }

    @PostMapping({"/create", "/assign"})
    public ResponseEntity<Map<String, Object>> assignTask(@RequestBody Assignment assignment) {
        Map<String, Object> response = new HashMap<>();
        
        if (assignment.getFaculty() == null || assignment.getFaculty().getId() == null) {
            response.put("status", "error");
            response.put("message", "Faculty ID is required");
            return ResponseEntity.badRequest().body(response);
        }
        Faculty faculty = facultyRepository.findById(assignment.getFaculty().getId()).orElse(null);
        if (faculty == null) {
            response.put("status", "error");
            response.put("message", "Faculty not found");
            return ResponseEntity.badRequest().body(response);
        }
        
        assignment.setFaculty(faculty);
        assignment.setStatus("PENDING");
        if (assignment.getAssignedBy() == null) {
            assignment.setAssignedBy("Admin");
        }
        if (assignment.getAssignedDate() == null) {
            assignment.setAssignedDate(LocalDate.now());
        }
        
        Assignment saved = assignmentRepository.save(assignment);
        
        systemLogRepository.save(SystemLog.builder()
                .userEmail(assignment.getAssignedBy())
                .action("ASSIGNMENT_CREATED")
                .details("Assigned task '" + saved.getTitle() + "' to " + faculty.getName())
                .timestamp(LocalDateTime.now())
                .build());
                
        response.put("status", "success");
        response.put("message", "Assignment created successfully");
        response.put("data", saved);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/update-status/{id}")
    public ResponseEntity<Assignment> updateStatus(@PathVariable Long id, @RequestParam String status) {
        Assignment assignment = assignmentRepository.findById(id).orElse(null);
        if (assignment == null) return ResponseEntity.notFound().build();
        assignment.setStatus(status);
        return ResponseEntity.ok(assignmentRepository.save(assignment));
    }
}
