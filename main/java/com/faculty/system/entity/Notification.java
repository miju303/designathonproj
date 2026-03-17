package com.faculty.system.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "notifications")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Notification {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "faculty_id", nullable = false)
    private Faculty faculty;

    private String message;
    private String type; // PROFILE_REVIEW, MISSING_DOCS, ACHIEVEMENT, REMINDER
    
    @Builder.Default
    @Column(name = "is_read")
    private boolean isRead = false;

    private LocalDateTime timestamp;
}
