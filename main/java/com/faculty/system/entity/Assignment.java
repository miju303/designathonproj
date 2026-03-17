package com.faculty.system.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;

@Entity
@Table(name = "assignments")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Assignment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(name = "assigned_by")
    private String assignedBy;

    @Column(name = "assign_date")
    private LocalDate assignedDate;

    @Column(name = "submission_date")
    private LocalDate submissionDate;

    @ManyToOne
    @JoinColumn(name = "assigned_to", nullable = false)
    private Faculty faculty;

    private String status; // PENDING, COMPLETED, OVERDUE
}
