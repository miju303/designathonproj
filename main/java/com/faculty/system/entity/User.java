package com.faculty.system.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name="users")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    
    @Column(unique = true, nullable = false)
    private String email;
    
    private String password;
    private String role;
    private String department;
    private String designation;

    @Builder.Default
    private Integer profileCompletion = 0;

    @Builder.Default
    private Integer researchScore = 0;
}
