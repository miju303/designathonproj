package com.faculty.system.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "system_logs")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SystemLog {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String userEmail;
    private String action;
    private String details;
    private LocalDateTime timestamp;
}
