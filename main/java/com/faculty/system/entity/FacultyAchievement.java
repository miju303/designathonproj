package com.faculty.system.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;

@Entity
@Table(name = "faculty_achievements")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FacultyAchievement {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "faculty_id", nullable = false)
    private Faculty faculty;

    private String type; // FDP, Workshop, Research Paper, Patent, Event Conduct, Hackathon
    private String title;
    private LocalDate date;

    @Column(name = "certificate_url")
    private String certificateUrl;
}
