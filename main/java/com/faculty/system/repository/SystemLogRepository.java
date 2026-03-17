package com.faculty.system.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.faculty.system.entity.SystemLog;

public interface SystemLogRepository extends JpaRepository<SystemLog, Long> {
}
