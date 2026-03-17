package com.faculty.system.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.faculty.system.entity.AttendanceLog;
import com.faculty.system.entity.Faculty;
import com.faculty.system.repository.AttendanceLogRepository;
import com.faculty.system.repository.FacultyRepository;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/attendance")
public class AttendanceController {

    @Autowired
    private AttendanceLogRepository attendanceRepository;
    
    @Autowired
    private FacultyRepository facultyRepository;

    @GetMapping
    public ResponseEntity<List<AttendanceLog>> getAttendance(
        @RequestParam Long facultyId,
        @RequestParam String startDate,
        @RequestParam String endDate
    ) {
        List<AttendanceLog> logs = attendanceRepository.findByFacultyIdAndDateBetween(
            facultyId, LocalDate.parse(startDate), LocalDate.parse(endDate)
        );
        return ResponseEntity.ok(logs);
    }

    @PostMapping("/add")
    public ResponseEntity<Map<String, Object>> addAttendance(@RequestBody Map<String, Object> payload) {
        return processAttendance(payload);
    }

    @PutMapping("/update")
    public ResponseEntity<Map<String, Object>> updateAttendance(@RequestBody Map<String, Object> payload) {
        return processAttendance(payload);
    }

    private ResponseEntity<Map<String, Object>> processAttendance(Map<String, Object> payload) {
        Map<String, Object> response = new HashMap<>();
        
        Long facultyId = payload.containsKey("facultyId") ? Long.valueOf(payload.get("facultyId").toString()) : null;
        if (facultyId == null && payload.containsKey("faculty")) {
            @SuppressWarnings("unchecked")
            Map<String, Object> fac = (Map<String, Object>) payload.get("faculty");
            if (fac != null && fac.containsKey("id")) facultyId = Long.valueOf(fac.get("id").toString());
        }
        
        if (facultyId == null) {
            response.put("status", "error");
            response.put("message", "Faculty ID is required");
            return ResponseEntity.badRequest().body(response);
        }

        Faculty faculty = facultyRepository.findById(facultyId).orElse(null);
        if (faculty == null) {
            response.put("status", "error");
            response.put("message", "Faculty not found");
            return ResponseEntity.badRequest().body(response);
        }
        
        LocalDate date = LocalDate.parse(payload.get("date").toString());
        String status = payload.get("status").toString();
        
        AttendanceLog existing = attendanceRepository.findByFacultyIdAndDate(
            faculty.getId(), date
        ).orElse(null);

        AttendanceLog savedLog;
        if (existing != null) {
            existing.setStatus(status);
            savedLog = attendanceRepository.save(existing);
        } else {
            AttendanceLog newLog = new AttendanceLog();
            newLog.setFaculty(faculty);
            newLog.setDate(date);
            newLog.setStatus(status);
            savedLog = attendanceRepository.save(newLog);
        }

        response.put("status", "success");
        response.put("message", "Attendance saved successfully");
        response.put("data", savedLog);
        return ResponseEntity.ok(response);
    }
}
