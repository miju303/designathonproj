package com.faculty.system.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.faculty.system.entity.MonthlyActivity;

import java.util.List;
import java.util.Optional;

@Repository
public interface MonthlyActivityRepository extends JpaRepository<MonthlyActivity, Long> {
    List<MonthlyActivity> findByFacultyId(Long facultyId);
    Optional<MonthlyActivity> findByFacultyIdAndMonthAndYear(Long facultyId, String month, Integer year);
}
