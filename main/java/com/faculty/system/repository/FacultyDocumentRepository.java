package com.faculty.system.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.faculty.system.entity.FacultyDocument;

@Repository
public interface FacultyDocumentRepository extends JpaRepository<FacultyDocument, Long> {
}
