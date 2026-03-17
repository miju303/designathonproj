package com.faculty.system.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.faculty.system.entity.FacultyAchievement;

import java.util.List;

@Repository
public interface FacultyAchievementRepository extends JpaRepository<FacultyAchievement, Long> {
    List<FacultyAchievement> findByFacultyId(Long facultyId);
}
