package com.faculty.system.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.UpdateTimestamp;

import com.faculty.system.enums.Role;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "faculty")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Faculty {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    @Column(unique = true, nullable = false)
    private String email;

    @Column(nullable = false)
    private String password;

    private String phone;
    private String department;
    private String designation;
    
    @Column(columnDefinition = "TEXT")
    private String about;

    @Column(name = "profile_photo_path")
    private String profilePhotoPath;

    @Builder.Default
    @Column(name = "profile_completion")
    private Integer profileCompletion = 0;

    @Builder.Default
    @Column(name = "research_score")
    private Integer researchScore = 0;

    @UpdateTimestamp
    @Column(name = "last_updated")
    private LocalDateTime lastUpdated;

    @Enumerated(EnumType.STRING)
    private Role role;

    @OneToMany(mappedBy = "faculty", cascade = CascadeType.ALL)
    private List<Certification> certifications;

    @OneToMany(mappedBy = "faculty", cascade = CascadeType.ALL)
    private List<Publication> publications;

    @OneToMany(mappedBy = "faculty", cascade = CascadeType.ALL)
    private List<Project> projects;

    @OneToMany(mappedBy = "faculty", cascade = CascadeType.ALL)
    private List<Patent> patents;

    @OneToMany(mappedBy = "faculty", cascade = CascadeType.ALL)
    private List<Workshop> workshops;

    @OneToMany(mappedBy = "faculty", cascade = CascadeType.ALL)
    private List<Activity> activities;

    @OneToMany(mappedBy = "faculty", cascade = CascadeType.ALL)
    private List<Reminder> reminders;

    @OneToMany(mappedBy = "faculty", cascade = CascadeType.ALL)
    private List<Notification> notifications;

    @OneToMany(mappedBy = "faculty", cascade = CascadeType.ALL)
    private List<FacultyAchievement> achievements;
}
