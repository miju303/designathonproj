package com.faculty.system.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.faculty.system.entity.Faculty;
import com.faculty.system.enums.Role;

import java.util.List;
import java.util.Optional;

public interface FacultyRepository extends JpaRepository<Faculty, Long> {
    Optional<Faculty> findByEmail(String email);
    List<Faculty> findByDepartment(String department);
    List<Faculty> findByRole(Role role);
}
