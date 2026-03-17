package com.faculty.system.controller;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.web.context.HttpSessionSecurityContextRepository;
import org.springframework.security.web.context.SecurityContextRepository;
import org.springframework.web.bind.annotation.*;

import com.faculty.system.dto.LoginRequest;
import com.faculty.system.security.UserDetailsImpl;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final SecurityContextRepository securityContextRepository = new HttpSessionSecurityContextRepository();

    /**
     * POST /api/auth/login
     * Authenticates user with plain-text password via NoOpPasswordEncoder.
     * Creates a session and returns user info as JSON.
     */
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request,
                                   HttpServletRequest servletRequest,
                                   HttpServletResponse servletResponse) {
        // Validate input
        if (request.getEmail() == null || request.getEmail().isBlank()) {
            return ResponseEntity.badRequest().body(errorResponse("Email is required"));
        }
        if (request.getPassword() == null || request.getPassword().isBlank()) {
            return ResponseEntity.badRequest().body(errorResponse("Password is required"));
        }

        try {
            // Authenticate the user with plain-text password using NoOpPasswordEncoder
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            request.getEmail().trim(),
                            request.getPassword()));

            // Set the security context for the current thread
            SecurityContext context = SecurityContextHolder.createEmptyContext();
            context.setAuthentication(authentication);
            SecurityContextHolder.setContext(context);

            // Persist the security context in the session (Spring Security 6)
            securityContextRepository.saveContext(context, servletRequest, servletResponse);

            UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();

            return ResponseEntity.ok(buildUserResponse(userDetails, "Login successful"));

        } catch (UsernameNotFoundException e) {
            return ResponseEntity.status(401).body(errorResponse("Invalid email or password"));
        } catch (BadCredentialsException e) {
            return ResponseEntity.status(401).body(errorResponse("Invalid email or password"));
        } catch (Exception e) {
            // Catch-all: never return null or "unknown error"
            String msg = e.getMessage();
            if (msg == null || msg.isBlank()) {
                msg = "Authentication failed. Please check your credentials.";
            }
            return ResponseEntity.status(401).body(errorResponse("Login failed: " + msg));
        }
    }

    /**
     * GET /api/auth/me
     * Returns the currently authenticated user's info from the session.
     * Used by the frontend to validate session on page refresh.
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
            return ResponseEntity.ok(buildUserResponse(userDetails, "Session valid"));
        } catch (ClassCastException e) {
            return ResponseEntity.status(401).body(errorResponse("Not authenticated"));
        }
    }

    /**
     * POST /api/auth/logout
     * Invalidates the session and clears the security context.
     */
    @PostMapping("/logout")
    public ResponseEntity<?> logout(HttpServletRequest request) {
        SecurityContextHolder.clearContext();
        HttpSession session = request.getSession(false);
        if (session != null) {
            session.invalidate();
        }
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "Logged out successfully");
        return ResponseEntity.ok(response);
    }

    // --- Helper methods ---

    private Map<String, Object> buildUserResponse(UserDetailsImpl userDetails, String message) {
        Map<String, Object> response = new HashMap<>();
        response.put("id", userDetails.getId());
        response.put("name", userDetails.getFullName() != null ? userDetails.getFullName() : "");
        response.put("email", userDetails.getEmail());
        response.put("role", userDetails.getRole());
        response.put("department", userDetails.getDepartment() != null ? userDetails.getDepartment() : "");
        response.put("success", true);
        response.put("message", message);
        return response;
    }

    private Map<String, Object> errorResponse(String message) {
        Map<String, Object> response = new HashMap<>();
        response.put("success", false);
        response.put("message", message);
        return response;
    }
}
