package com.faculty.system.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import java.time.LocalDateTime;

@Entity
@Table(name = "monthly_activities")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MonthlyActivity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "faculty_id", nullable = false)
    private Faculty faculty;

    private String month;
    private Integer year;

    @Builder.Default
    private Integer fdp = 0;

    @Builder.Default
    private Integer workshop = 0;

    @Builder.Default
    private Integer paper = 0;

    @Builder.Default
    @Column(name = "event_conduct")
    private Integer eventConduct = 0;

    @Builder.Default
    private Integer hackathon = 0;

    @Builder.Default
    private Integer patent = 0;

    @CreationTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}
