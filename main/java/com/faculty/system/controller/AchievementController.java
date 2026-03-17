package com.faculty.system.controller;

import java.io.IOException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import com.faculty.system.entity.Faculty;
import com.faculty.system.entity.FacultyAchievement;
import com.faculty.system.entity.SystemLog;
import com.faculty.system.repository.FacultyAchievementRepository;
import com.faculty.system.repository.FacultyRepository;
import com.faculty.system.repository.SystemLogRepository;
import com.faculty.system.service.FileStorageService;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.HashMap;

@RestController
@RequestMapping("/api/achievements")
public class AchievementController {

    @Autowired
    private FacultyAchievementRepository achievementRepository;
    
    @Autowired
    private FacultyRepository facultyRepository;

    @Autowired
    private FileStorageService fileStorageService;

    @Autowired
    private SystemLogRepository systemLogRepository;

    @GetMapping("/faculty/{facultyId}")
    public ResponseEntity<List<FacultyAchievement>> getFacultyAchievements(@PathVariable Long facultyId) {
        return ResponseEntity.ok(achievementRepository.findByFacultyId(facultyId));
    }

    @PostMapping("/upload")
    public ResponseEntity<Map<String, Object>> uploadAchievement(
            @RequestParam("facultyId") Long facultyId,
            @RequestParam("type") String type,
            @RequestParam("title") String title,
            @RequestParam("date") String date,
            @RequestParam(value = "file", required = false) MultipartFile file) {
        
        Map<String, Object> response = new HashMap<>();
        
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
        
        FacultyAchievement achievement = new FacultyAchievement();
        achievement.setFaculty(faculty);
        achievement.setType(type);
        achievement.setTitle(title);
        try {
            achievement.setDate(LocalDate.parse(date));
        } catch (Exception e) {
            achievement.setDate(LocalDate.now());
        }

        if (file != null && !file.isEmpty()) {
            try {
                String fileName = fileStorageService.storeFile(file);
                achievement.setCertificateUrl(fileName);
            } catch (IOException e) {
                response.put("status", "error");
                response.put("message", "Could not store file: " + e.getMessage());
                return ResponseEntity.internalServerError().body(response);
            }
        }

        FacultyAchievement saved = achievementRepository.save(achievement);
        
        systemLogRepository.save(SystemLog.builder()
                .userEmail(faculty.getEmail())
                .action("ACHIEVEMENT_UPLOADED")
                .details("Faculty uploaded achievement: " + saved.getTitle())
                .timestamp(LocalDateTime.now())
                .build());

        response.put("status", "success");
        response.put("message", "Achievement uploaded successfully");
        response.put("data", saved);
        return ResponseEntity.ok(response);
    }
}
