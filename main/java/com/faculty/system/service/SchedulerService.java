package com.faculty.system.service;

import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import com.faculty.system.entity.AcademicCalendar;
import com.faculty.system.entity.Assignment;
import com.faculty.system.entity.Faculty;
import com.faculty.system.entity.Notification;
import com.faculty.system.repository.AcademicCalendarRepository;
import com.faculty.system.repository.AssignmentRepository;
import com.faculty.system.repository.FacultyRepository;
import com.faculty.system.repository.NotificationRepository;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class SchedulerService {

    private final AcademicCalendarRepository calendarRepository;
    private final AssignmentRepository assignmentRepository;
    private final FacultyRepository facultyRepository;
    private final NotificationRepository notificationRepository;

    // Run every day at 8:00 AM. For testing purposes, could be run more frequently.
    @Scheduled(cron = "0 0 8 * * ?")
    public void runDailyReminders() {
        System.out.println("Running daily reminder job...");
        LocalDate today = LocalDate.now();

        // 1. Check calendar events
        List<AcademicCalendar> upcomingEvents = calendarRepository.findAll();
        for (AcademicCalendar event : upcomingEvents) {
            if (event.getEventDate() != null) {
                int daysBefore = event.getReminderDaysBefore() != null ? event.getReminderDaysBefore() : 1;
                if (today.plusDays(daysBefore).equals(event.getEventDate())) {
                    sendNotificationToAll("Upcoming Event Reminder: " + event.getTitle() + " on " + event.getEventDate());
                }
            }
        }

        // 2. Check assignments
        List<Assignment> pendingAssignments = assignmentRepository.findAll();
        for (Assignment assignment : pendingAssignments) {
            if ("PENDING".equals(assignment.getStatus()) && assignment.getSubmissionDate() != null) {
                if (today.plusDays(1).equals(assignment.getSubmissionDate())) {
                    createNotification(assignment.getFaculty(), "Assignment due tomorrow: " + assignment.getTitle());
                } else if (today.isAfter(assignment.getSubmissionDate())) {
                    assignment.setStatus("OVERDUE");
                    assignmentRepository.save(assignment);
                    createNotification(assignment.getFaculty(), "Assignment OVERDUE: " + assignment.getTitle());
                }
            }
        }

        // 3. Check monthly activity deadline (e.g. 28th of every month)
        if (today.getDayOfMonth() == 28) {
            sendNotificationToAll("Reminder: Please submit your monthly activity report by the end of the month.");
        }
    }

    private void sendNotificationToAll(String message) {
        List<Faculty> allFaculty = facultyRepository.findAll();
        for (Faculty faculty : allFaculty) {
            createNotification(faculty, message);
        }
    }

    private void createNotification(Faculty faculty, String message) {
        Notification notification = Notification.builder()
                .faculty(faculty)
                .message(message)
                .type("REMINDER")
                .timestamp(LocalDateTime.now())
                .isRead(false)
                .build();
        notificationRepository.save(notification);
    }
}
