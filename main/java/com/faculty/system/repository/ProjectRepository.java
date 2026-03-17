package com.faculty.system.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.faculty.system.entity.Project;

public interface ProjectRepository extends JpaRepository<Project, Long> {
}
