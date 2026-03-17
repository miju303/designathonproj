package com.faculty.system.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.faculty.system.dto.FacultyDTO;
import com.faculty.system.entity.SystemLog;
import com.faculty.system.entity.User;
import com.faculty.system.enums.Role;
import com.faculty.system.repository.*;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AdminService {

    private final UserRepository userRepository;
    private final SystemLogRepository systemLogRepository;
    private final ActivityRepository activityRepository;
    private final FacultyAchievementRepository achievementRepository;
    private final AttendanceLogRepository attendanceRepository;

    public Map<String, Object> getAnalytics() {
        List<User> all = userRepository.findAll();
        long total = all.stream().filter(u -> "FACULTY".equals(u.getRole())).count();
        
        // Profiles are considered completed if completion >= 80%
        long completed = all.stream()
            .filter(u -> "FACULTY".equals(u.getRole()))
            .filter(u -> u.getProfileCompletion() != null && u.getProfileCompletion() >= 80)
            .count();
        
        Map<String, Object> stats = new HashMap<>();
        stats.put("totalFaculty", total);
        stats.put("profilesCompleted", completed);
        stats.put("profilesPending", total - completed);
        
        // Find most active department based on count of faculty
        String mostActive = all.stream()
            .filter(u -> "FACULTY".equals(u.getRole()))
            .filter(u -> u.getDepartment() != null && !u.getDepartment().isEmpty())
            .collect(Collectors.groupingBy(User::getDepartment, Collectors.counting()))
            .entrySet().stream()
            .max(Map.Entry.comparingByValue())
            .map(Map.Entry::getKey)
            .orElse("None");
        
        stats.put("mostActiveDepartment", mostActive);
        
        return stats;
    }

    private final FacultyRepository facultyRepository;
    private final FacultyService facultyService;

    public List<User> getAllFaculties() {
        return userRepository.findByRole("FACULTY");
    }

    public List<FacultyDTO> getAllFacultyProfiles() {
        return facultyRepository.findAll().stream()
                .filter(f -> f.getRole() == Role.FACULTY)
                .map(f -> facultyService.getFacultyProfile(f.getId()))
                .collect(Collectors.toList());
    }

    @Transactional
    public User addFaculty(User user) {
        if (user.getRole() == null) user.setRole("FACULTY");
        User saved = userRepository.save(user);
        logAction("admin@gmail.com", "ADD_FACULTY", "Added user: " + user.getName());
        return saved;
    }

    @Transactional
    public User updateFaculty(Long id, User updatedUser) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));

        user.setName(updatedUser.getName());
        user.setEmail(updatedUser.getEmail());
        user.setDepartment(updatedUser.getDepartment());
        user.setDesignation(updatedUser.getDesignation());
        user.setRole(updatedUser.getRole());
        if (updatedUser.getPassword() != null && !updatedUser.getPassword().isEmpty()) {
            user.setPassword(updatedUser.getPassword());
        }

        User saved = userRepository.save(user);
        logAction("admin@gmail.com", "UPDATE_FACULTY", "Updated user: " + user.getName());
        return saved;
    }

    @Transactional
    public void deleteFaculty(Long id) {
        userRepository.findById(id).ifPresent(u -> {
            logAction("admin@gmail.com", "DELETE_FACULTY", "Deleted user: " + u.getName());
            userRepository.deleteById(id);
        });
    }

    @Transactional
    public void resetPassword(Long id, String newPassword) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
        user.setPassword(newPassword);
        userRepository.save(user);
        logAction("admin@gmail.com", "RESET_PASSWORD", "Reset password for: " + user.getName());
    }

    @Transactional
    public void assignDepartment(Long id, String department) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
        user.setDepartment(department);
        userRepository.save(user);
        logAction("admin@gmail.com", "ASSIGN_DEPT", "Assigned department '" + department + "' to: " + user.getName());
    }

    public Map<String, Object> generateNaacReport() {
        Map<String, Object> report = new HashMap<>();
        report.put("timestamp", LocalDateTime.now());
        
        List<FacultyDTO> allFaculties = getAllFacultyProfiles();
        
        Map<String, Object> summary = getAnalytics();
        report.put("summary", summary);
        
        report.put("facultyProfiles", allFaculties);
        
        report.put("activities", activityRepository.findAll());
        report.put("achievements", achievementRepository.findAll());
        report.put("attendance", attendanceRepository.findAll());
        
        return report;
    }

    public List<SystemLog> getLogs() {
        return systemLogRepository.findAll();
    }

    @Transactional
    public void clearLogs() {
        systemLogRepository.deleteAll();
    }

    private void logAction(String email, String action, String details) {
        systemLogRepository.save(SystemLog.builder()
                .userEmail(email)
                .action(action)
                .details(details)
                .timestamp(LocalDateTime.now())
                .build());
    }
}
