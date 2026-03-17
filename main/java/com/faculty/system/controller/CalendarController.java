package com.faculty.system.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.faculty.system.entity.AcademicCalendar;
import com.faculty.system.repository.AcademicCalendarRepository;
import com.faculty.system.repository.AssignmentRepository;
import com.faculty.system.repository.FacultyAchievementRepository;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api/calendar")
public class CalendarController {

    @Autowired
    private AcademicCalendarRepository calendarRepository;

    @Autowired
    private AssignmentRepository assignmentRepository;
    
    @Autowired
    private FacultyAchievementRepository achievementRepository;

    @GetMapping("/events")
    public ResponseEntity<List<AcademicCalendar>> getAllEvents() {
        List<AcademicCalendar> events = new ArrayList<>(calendarRepository.findAll());

        // Add Assignments
        assignmentRepository.findAll().forEach(a -> {
            if (a.getAssignedDate() != null) {
                events.add(AcademicCalendar.builder()
                        .title("Assigned: " + a.getTitle())
                        .eventDate(a.getAssignedDate())
                        .eventType("Assignment")
                        .description(a.getDescription())
                        .build());
            }
            if (a.getSubmissionDate() != null) {
                events.add(AcademicCalendar.builder()
                        .title("Due: " + a.getTitle())
                        .eventDate(a.getSubmissionDate())
                        .eventType("Submission Deadline")
                        .description(a.getDescription())
                        .build());
            }
        });

        // Add Achievements (FDP, Workshop, Paper, Patent, Hackathon)
        achievementRepository.findAll().forEach(a -> {
            if (a.getDate() != null) {
                events.add(AcademicCalendar.builder()
                        .title(a.getTitle())
                        .eventDate(a.getDate())
                        .eventType(a.getType())
                        .description("Achievement by " + a.getFaculty().getName())
                        .build());
            }
        });

        return ResponseEntity.ok(events);
    }

    @PostMapping("/add-event")
    public ResponseEntity<AcademicCalendar> createEvent(@RequestBody AcademicCalendar event) {
        return ResponseEntity.ok(calendarRepository.save(event));
    }
}
