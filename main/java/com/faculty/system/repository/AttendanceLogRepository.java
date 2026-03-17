package com.faculty.system.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.faculty.system.entity.AttendanceLog;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface AttendanceLogRepository extends JpaRepository<AttendanceLog, Long> {
    List<AttendanceLog> findByFacultyIdAndDateBetween(Long facultyId, LocalDate startDate, LocalDate endDate);
    Optional<AttendanceLog> findByFacultyIdAndDate(Long facultyId, LocalDate date);
}
