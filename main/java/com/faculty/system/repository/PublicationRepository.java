package com.faculty.system.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.faculty.system.entity.Publication;

public interface PublicationRepository extends JpaRepository<Publication, Long> {
}
