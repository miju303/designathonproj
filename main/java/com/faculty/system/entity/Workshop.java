package com.faculty.system.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "workshops")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Workshop {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "faculty_id", nullable = false)
    private Faculty faculty;

    private String title;
    private String description;
    
    @Column(name = "file_path")
    private String filePath;

    @Column(name = "created_date")
    private LocalDateTime createdDate;
}
