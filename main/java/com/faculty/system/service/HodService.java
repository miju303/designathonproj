package com.faculty.system.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import com.faculty.system.dto.FacultyDTO;
import com.faculty.system.dto.HodDashboardDTO;
import com.faculty.system.entity.Faculty;
import com.faculty.system.entity.Reminder;
import com.faculty.system.enums.Role;
import com.faculty.system.repository.FacultyRepository;
import com.faculty.system.repository.NotificationRepository;
import com.faculty.system.repository.ReminderRepository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;
@Service
@RequiredArgsConstructor
public class HodService {

    private final FacultyRepository facultyRepository;
    private final ReminderRepository reminderRepository;
    private final NotificationRepository notificationRepository;
    private final FacultyService facultyService;

    public HodDashboardDTO getDashboardStats(String department) {
        List<Faculty> faculties = facultyRepository.findByDepartment(department);
        long total = faculties.size();
        long completed = faculties.stream().filter(f -> f.getProfileCompletion() >= 80).count();
        long pending = total - completed;
        double avg = faculties.stream().mapToInt(Faculty::getProfileCompletion).average().orElse(0.0);

        return new HodDashboardDTO(total, completed, pending, avg);
    }

    public List<FacultyDTO> getFacultyList(String department) {
        return facultyRepository.findByDepartment(department)
                .stream()
                .filter(f -> f.getRole() == Role.FACULTY)
                .map(f -> facultyService.getFacultyProfile(f.getId()))
                .collect(Collectors.toList());
    }

    public void sendReminder(Long facultyId, String message) {
        Faculty faculty = facultyRepository.findById(facultyId)
                .orElseThrow(() -> new RuntimeException("Faculty not found"));

        Reminder reminder = Reminder.builder()
                .faculty(faculty)
                .message(message)
                .status("PENDING")
                .createdDate(LocalDateTime.now())
                .build();
        
        reminderRepository.save(reminder);

        // Also create a notification
        com.faculty.system.entity.Notification notification = com.faculty.system.entity.Notification.builder()
                .faculty(faculty)
                .message("New Reminder: " + message)
                .type("REMINDER")
                .timestamp(LocalDateTime.now())
                .isRead(false)
                .build();
        notificationRepository.save(notification);
    }
}
