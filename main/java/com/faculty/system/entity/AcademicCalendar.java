package com.faculty.system.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;

@Entity
@Table(name = "calendar_events")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AcademicCalendar {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "title", nullable = false)
    private String title;

    @Column(name = "event_date", nullable = false)
    private LocalDate eventDate;

    @Column(name = "event_type")
    private String eventType;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(name = "reminder_days_before")
    @Builder.Default
    private Integer reminderDaysBefore = 1;
}
