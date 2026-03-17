package com.faculty.system.config;

import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import com.faculty.system.entity.User;
import com.faculty.system.repository.UserRepository;

@Configuration
@RequiredArgsConstructor
public class DataSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        if (userRepository.count() == 0) {
            // Seed Admin
            userRepository.save(User.builder()
                    .name("System Admin")
                    .email("admin@gmail.com")
                    .password(passwordEncoder.encode("admin123"))
                    .role("ADMIN")
                    .build());

            // Seed HOD
            userRepository.save(User.builder()
                    .name("HOD Computer Science")
                    .email("hod@gmail.com")
                    .password(passwordEncoder.encode("hod123"))
                    .role("HOD")
                    .department("CSE")
                    .build());

            // Seed Faculty
            userRepository.save(User.builder()
                    .name("Dr. Smith")
                    .email("faculty@gmail.com")
                    .password(passwordEncoder.encode("faculty123"))
                    .role("FACULTY")
                    .department("CSE")
                    .designation("Senior Professor")
                    .profileCompletion(85)
                    .researchScore(120)
                    .build());
            
            userRepository.save(User.builder()
                    .name("Prof. Johnson")
                    .email("johnson@gmail.com")
                    .password(passwordEncoder.encode("password"))
                    .role("FACULTY")
                    .department("CSE")
                    .designation("Assistant Professor")
                    .profileCompletion(45)
                    .researchScore(30)
                    .build());
        }
    }
}
