package com.faculty.system.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.faculty.system.entity.User;

import java.util.Optional;
import java.util.List;

public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByEmail(String email);

    List<User> findByRole(String role);

    List<User> findByRoleAndDepartment(String role, String department);

}
