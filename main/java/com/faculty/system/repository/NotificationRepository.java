package com.faculty.system.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.faculty.system.entity.Notification;

import java.util.List;

public interface NotificationRepository extends JpaRepository<Notification, Long> {
    List<Notification> findByFacultyIdOrderByTimestampDesc(Long facultyId);
    long countByFacultyIdAndIsReadFalse(Long facultyId);
}
