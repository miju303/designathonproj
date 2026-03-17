package com.faculty.system.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.faculty.system.entity.Workshop;

import java.util.List;

public interface WorkshopRepository extends JpaRepository<Workshop, Long> {
    List<Workshop> findByFacultyId(Long facultyId);
}
