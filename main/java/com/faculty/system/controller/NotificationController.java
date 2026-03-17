package com.faculty.system.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.faculty.system.entity.Notification;
import com.faculty.system.repository.NotificationRepository;

import java.util.List;
import java.util.Map;
import java.util.HashMap;

@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
public class NotificationController {

    private final NotificationRepository notificationRepository;

    @GetMapping("/{facultyId}")
    public ResponseEntity<List<Notification>> getNotifications(@PathVariable Long facultyId) {
        return ResponseEntity.ok(notificationRepository.findByFacultyIdOrderByTimestampDesc(facultyId));
    }

    @GetMapping("/{facultyId}/unread-count")
    public ResponseEntity<Long> getUnreadCount(@PathVariable Long facultyId) {
        return ResponseEntity.ok(notificationRepository.countByFacultyIdAndIsReadFalse(facultyId));
    }

    @PostMapping("/{id}/read")
    public ResponseEntity<Map<String, Object>> markAsRead(@PathVariable Long id) {
        notificationRepository.findById(id).ifPresent(n -> {
            n.setRead(true);
            notificationRepository.save(n);
        });
        Map<String, Object> response = new HashMap<>();
        response.put("status", "success");
        response.put("message", "Notification marked as read");
        return ResponseEntity.ok(response);
    }

    @PostMapping("/{facultyId}/read-all")
    public ResponseEntity<Map<String, Object>> markAllAsRead(@PathVariable Long facultyId) {
        List<Notification> unread = notificationRepository.findByFacultyIdOrderByTimestampDesc(facultyId)
                .stream().filter(n -> !n.isRead()).toList();
        unread.forEach(n -> n.setRead(true));
        notificationRepository.saveAll(unread);
        Map<String, Object> response = new HashMap<>();
        response.put("status", "success");
        response.put("message", "All notifications marked as read");
        return ResponseEntity.ok(response);
    }
}
