package com.faculty.system.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.faculty.system.entity.Faculty;
import com.faculty.system.entity.MonthlyActivity;
import com.faculty.system.repository.FacultyRepository;
import com.faculty.system.repository.MonthlyActivityRepository;

import java.util.List;
import java.util.Map;
import java.util.HashMap;

@RestController
@RequestMapping("/api/activities")
public class MonthlyActivityController {

    @Autowired
    private MonthlyActivityRepository activityRepository;
    
    @Autowired
    private FacultyRepository facultyRepository;

    @GetMapping("/faculty/{facultyId}")
    public ResponseEntity<List<MonthlyActivity>> getFacultyActivities(@PathVariable Long facultyId) {
        return ResponseEntity.ok(activityRepository.findByFacultyId(facultyId));
    }

    @PostMapping("/update")
    public ResponseEntity<Map<String, Object>> updateActivity(@RequestBody MonthlyActivity activity) {
        return processActivity(activity);
    }

    @PostMapping("/add")
    public ResponseEntity<Map<String, Object>> addActivity(@RequestBody MonthlyActivity activity) {
        return processActivity(activity);
    }

    private ResponseEntity<Map<String, Object>> processActivity(MonthlyActivity activity) {
        Map<String, Object> response = new HashMap<>();
        Long facultyId = null;
        if (activity.getFaculty() != null && activity.getFaculty().getId() != null) {
            facultyId = activity.getFaculty().getId();
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

        MonthlyActivity existing = activityRepository.findByFacultyIdAndMonthAndYear(
            faculty.getId(), activity.getMonth(), activity.getYear()
        ).orElse(null);

        MonthlyActivity savedActivity;
        if (existing != null) {
            existing.setFdp(activity.getFdp());
            existing.setWorkshop(activity.getWorkshop());
            existing.setPaper(activity.getPaper());
            existing.setEventConduct(activity.getEventConduct());
            existing.setHackathon(activity.getHackathon());
            existing.setPatent(activity.getPatent());
            savedActivity = activityRepository.save(existing);
        } else {
            activity.setFaculty(faculty);
            savedActivity = activityRepository.save(activity);
        }

        response.put("status", "success");
        response.put("message", "Activity saved successfully");
        response.put("data", savedActivity);
        return ResponseEntity.ok(response);
    }
    
    @GetMapping("/all")
    public ResponseEntity<List<MonthlyActivity>> getAllActivities() {
        return ResponseEntity.ok(activityRepository.findAll());
    }
}
