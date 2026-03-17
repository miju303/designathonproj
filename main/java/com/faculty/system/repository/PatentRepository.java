package com.faculty.system.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.faculty.system.entity.Patent;

import java.util.List;

public interface PatentRepository extends JpaRepository<Patent, Long> {
    List<Patent> findByFacultyId(Long facultyId);
}
