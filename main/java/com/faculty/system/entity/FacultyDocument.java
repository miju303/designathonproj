package com.faculty.system.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "faculty_documents")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FacultyDocument {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String fileName;
    private String fileType;
    private String filePath;
    private LocalDateTime uploadDate;

    @ManyToOne
    @JoinColumn(name = "faculty_id")
    private Faculty faculty;
}
