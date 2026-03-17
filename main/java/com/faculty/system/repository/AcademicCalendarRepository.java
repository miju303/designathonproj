package com.faculty.system.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.faculty.system.entity.AcademicCalendar;

@Repository
public interface AcademicCalendarRepository extends JpaRepository<AcademicCalendar, Long> {
}
