package com.faculty.system.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.faculty.system.entity.User;
import com.faculty.system.repository.UserRepository;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class FacultyListController {

    private final UserRepository userRepository;

    @GetMapping("/faculties")
    public ResponseEntity<List<User>> getAllFaculties() {
        List<User> faculties = userRepository.findByRole("FACULTY");
        return ResponseEntity.ok(faculties != null ? faculties : new ArrayList<>());
    }

    @GetMapping("/hod/faculties/{dept}")
    public ResponseEntity<List<User>> getFacultiesByDept(@PathVariable String dept) {
        List<User> faculties = userRepository.findByRoleAndDepartment("FACULTY", dept);
        return ResponseEntity.ok(faculties != null ? faculties : new ArrayList<>());
    }
}
