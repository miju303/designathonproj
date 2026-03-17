package com.faculty.system.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.faculty.system.entity.Certification;

public interface CertificationRepository extends JpaRepository<Certification, Long> {
}
