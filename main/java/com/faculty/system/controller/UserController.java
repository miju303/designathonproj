package com.faculty.system.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import com.faculty.system.dto.UserMeResponseDTO;
import com.faculty.system.entity.Faculty;
import com.faculty.system.entity.User;
import com.faculty.system.repository.FacultyRepository;
import com.faculty.system.repository.UserRepository;
import com.faculty.system.security.UserDetailsImpl;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

/**
 * UserController — exposes /api/user/me.
 * Returns the full profile of the currently authenticated user,
 * including Faculty-specific data if the role is FACULTY or HOD.
 */
@RestController
@RequestMapping("/api/user")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class UserController {

    private final UserRepository userRepository;
    private final FacultyRepository facultyRepository;

    /**
     * GET /api/user/me
     * Returns the full authenticated user's profile.
     * - For FACULTY/HOD: returns Faculty entity data (richer profile).
     * - For ADMIN: returns User entity data.
     */
    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if (authentication == null || !authentication.isAuthenticated()
                || "anonymousUser".equals(authentication.getPrincipal())) {
            return ResponseEntity.status(401).body(errorResponse("Not authenticated"));
        }

        try {
            UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
            String email = userDetails.getEmail();
            String role = userDetails.getRole(); // e.g. "FACULTY", "HOD", "ADMIN"

            // For FACULTY and HOD, prefer the Faculty table for richer profile info
            if ("FACULTY".equalsIgnoreCase(role) || "HOD".equalsIgnoreCase(role)) {
                Optional<Faculty> facultyOpt = facultyRepository.findByEmail(email);
                if (facultyOpt.isPresent()) {
                    Faculty faculty = facultyOpt.get();
                    UserMeResponseDTO dto = new UserMeResponseDTO(
                            faculty.getId(),
                            faculty.getName(),
                            faculty.getEmail(),
                            role.toUpperCase(),
                            faculty.getDepartment(),
                            faculty.getDesignation(),
                            faculty.getPhone(),
                            faculty.getAbout(),
                            faculty.getProfilePhotoPath(),
                            faculty.getProfileCompletion(),
                            faculty.getResearchScore()
                    );
                    return ResponseEntity.ok(dto);
                }
            }

            // For ADMIN or fallback when no Faculty record found: use User entity
            Optional<User> userOpt = userRepository.findByEmail(email);
            if (userOpt.isPresent()) {
                User user = userOpt.get();
                UserMeResponseDTO dto = new UserMeResponseDTO(
                        user.getId(),
                        user.getName(),
                        user.getEmail(),
                        role.toUpperCase(),
                        user.getDepartment(),
                        user.getDesignation(),
                        null,
                        null,
                        null,
                        user.getProfileCompletion(),
                        user.getResearchScore()
                );
                return ResponseEntity.ok(dto);
            }

            return ResponseEntity.status(404).body(errorResponse("User not found"));

        } catch (ClassCastException e) {
            return ResponseEntity.status(401).body(errorResponse("Not authenticated"));
        }
    }

    private Map<String, Object> errorResponse(String message) {
        Map<String, Object> res = new HashMap<>();
        res.put("success", false);
        res.put("message", message);
        return res;
    }
}
