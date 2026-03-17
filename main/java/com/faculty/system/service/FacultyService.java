package com.faculty.system.service;

import java.io.IOException;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import com.faculty.system.dto.ActivityDTO;
import com.faculty.system.dto.FacultyDTO;
import com.faculty.system.entity.*;
import com.faculty.system.enums.Role;
import com.faculty.system.repository.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class FacultyService {

    private final UserRepository userRepository;
    private final FacultyRepository facultyRepository;
    private final CertificationRepository certificationRepository;
    private final PublicationRepository publicationRepository;
    private final ProjectRepository projectRepository;
    private final ActivityRepository activityRepository;
    private final FileStorageService fileStorageService;

    private final PatentRepository patentRepository;
    private final WorkshopRepository workshopRepository;
    private final SystemLogRepository systemLogRepository;

    private void createSystemLog(String email, String action, String details) {
        systemLogRepository.save(SystemLog.builder()
                .userEmail(email)
                .action(action)
                .details(details)
                .timestamp(LocalDateTime.now())
                .build());
    }

    private Faculty getOrCreateFaculty(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return facultyRepository.findByEmail(user.getEmail())
                .orElseGet(() -> {
                    Faculty newFaculty = new Faculty();
                    newFaculty.setName(user.getName());
                    newFaculty.setEmail(user.getEmail());
                    newFaculty.setPassword(user.getPassword());
                    newFaculty.setDepartment(user.getDepartment());
                    newFaculty.setDesignation(user.getDesignation());
                    if (user.getRole() != null) {
                        try {
                            newFaculty.setRole(Role.valueOf(user.getRole().toUpperCase()));
                        } catch (IllegalArgumentException e) {
                            newFaculty.setRole(Role.FACULTY);
                        }
                    } else {
                        newFaculty.setRole(Role.FACULTY); // default
                    }
                    return facultyRepository.save(newFaculty);
                });
    }

    public FacultyDTO getFacultyProfile(Long id) {
        Faculty faculty = getOrCreateFaculty(id);
        
        return convertToDTO(faculty);
    }

    @Transactional
    public FacultyDTO updateFacultyProfile(Long id, FacultyDTO dto) {
        Faculty faculty = getOrCreateFaculty(id);

        faculty.setName(dto.getName());
        faculty.setPhone(dto.getPhone());
        faculty.setDepartment(dto.getDepartment());
        faculty.setDesignation(dto.getDesignation());
        faculty.setAbout(dto.getAbout());

        // Sync back to User entity
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
        user.setName(dto.getName());
        user.setDepartment(dto.getDepartment());
        user.setDesignation(dto.getDesignation());
        userRepository.save(user);

        calculateProfileCompletion(faculty);
        logActivity(faculty, "Profile Updated", "Updated personal information");
        createSystemLog(faculty.getEmail(), "PROFILE_UPDATE", "Faculty updated profile");

        return convertToDTO(facultyRepository.save(faculty));
    }

    @Transactional
    public void uploadFile(Long id, String type, String name, MultipartFile file) {
        Faculty faculty = getOrCreateFaculty(id);

        String filePath;
        try {
            filePath = fileStorageService.storeFile(file);
        } catch (IOException e) {
            throw new RuntimeException("Could not store file", e);
        }

        switch (type.toLowerCase()) {
            case "photo":
                faculty.setProfilePhotoPath(filePath);
                logActivity(faculty, "Photo Uploaded", "Updated profile picture");
                break;
            case "certification":
                Certification cert = Certification.builder()
                        .faculty(faculty)
                        .certificateName(name)
                        .filePath(filePath)
                        .uploadDate(LocalDateTime.now())
                        .build();
                certificationRepository.save(cert);
                logActivity(faculty, "Certification Uploaded", "Added new certificate: " + name);
                break;
            case "publication":
                Publication pub = Publication.builder()
                        .faculty(faculty)
                        .title(name)
                        .filePath(filePath)
                        .uploadDate(LocalDateTime.now())
                        .build();
                publicationRepository.save(pub);
                logActivity(faculty, "Publication Uploaded", "Added new publication: " + name);
                break;
            case "project":
                Project proj = Project.builder()
                        .faculty(faculty)
                        .projectTitle(name)
                        .filePath(filePath)
                        .uploadDate(LocalDateTime.now())
                        .build();
                projectRepository.save(proj);
                logActivity(faculty, "Project Uploaded", "Added new project: " + name);
                break;
            case "patent":
                Patent patent = Patent.builder()
                        .faculty(faculty)
                        .title(name)
                        .filePath(filePath)
                        .createdDate(LocalDateTime.now())
                        .build();
                patentRepository.save(patent);
                logActivity(faculty, "Patent Uploaded", "Added new patent: " + name);
                break;
            case "workshop":
                Workshop workshop = Workshop.builder()
                        .faculty(faculty)
                        .title(name)
                        .filePath(filePath)
                        .createdDate(LocalDateTime.now())
                        .build();
                workshopRepository.save(workshop);
                logActivity(faculty, "Workshop Uploaded", "Added new workshop: " + name);
                break;
        }

        calculateProfileCompletion(faculty);
        facultyRepository.save(faculty);
    }

    private void calculateProfileCompletion(Faculty faculty) {
        int weight = 0;
        if (faculty.getName() != null && !faculty.getName().trim().isEmpty()) weight += 10;
        if (faculty.getEmail() != null && !faculty.getEmail().trim().isEmpty()) weight += 10;
        if (faculty.getPhone() != null && !faculty.getPhone().trim().isEmpty()) weight += 10;
        if (faculty.getDepartment() != null && !faculty.getDepartment().trim().isEmpty()) weight += 10;
        if (faculty.getDesignation() != null && !faculty.getDesignation().trim().isEmpty()) weight += 10;
        if (faculty.getAbout() != null && !faculty.getAbout().trim().isEmpty()) weight += 10;
        if (faculty.getProfilePhotoPath() != null && !faculty.getProfilePhotoPath().trim().isEmpty()) weight += 10;
        
        // Documents (max 30 points) - 5 categories, 6 points each if at least one exists
        int docs = 0;
        if (faculty.getCertifications() != null && !faculty.getCertifications().isEmpty()) docs += 6;
        if (faculty.getPublications() != null && !faculty.getPublications().isEmpty()) docs += 6;
        if (faculty.getProjects() != null && !faculty.getProjects().isEmpty()) docs += 6;
        if (faculty.getPatents() != null && !faculty.getPatents().isEmpty()) docs += 6;
        if (faculty.getWorkshops() != null && !faculty.getWorkshops().isEmpty()) docs += 6;
        
        faculty.setProfileCompletion(Math.min(100, weight + docs));
    }

    private int calculateResearchScore(Faculty faculty) {
        int score = 0;
        if (faculty.getPublications() != null) score += faculty.getPublications().size() * 10;
        if (faculty.getCertifications() != null) score += faculty.getCertifications().size() * 4;
        if (faculty.getProjects() != null) score += faculty.getProjects().size() * 6;
        if (faculty.getPatents() != null) score += faculty.getPatents().size() * 15;
        if (faculty.getWorkshops() != null) score += faculty.getWorkshops().size() * 5;
        if (faculty.getAchievements() != null) {
             long awardsCount = faculty.getAchievements().stream().filter(a -> "Award".equalsIgnoreCase(a.getType())).count();
             score += awardsCount * 8;
        }
        faculty.setResearchScore(score);
        return score;
    }

    private List<String> getBadges(Faculty faculty, int researchScore) {
        List<String> badges = new ArrayList<>();
        if (faculty.getProfileCompletion() >= 80) badges.add("Certified Faculty");
        if (researchScore >= 50) badges.add("Bronze Researcher");
        if (researchScore >= 100) badges.add("Silver Researcher");
        if (researchScore >= 200) badges.add("Gold Researcher");
        if (faculty.getActivities() != null && faculty.getActivities().size() > 10) badges.add("Active Faculty");
        
        // Logic to notify if needed could be added here or in the caller
        // For simplicity, we'll assume the client displays badges
        return badges;
    }

    private void logActivity(Faculty faculty, String type, String description) {
        Activity activity = Activity.builder()
                .faculty(faculty)
                .activityType(type)
                .description(description)
                .timestamp(LocalDateTime.now())
                .build();
        activityRepository.save(activity);
    }

    private FacultyDTO convertToDTO(Faculty faculty) {
        int researchScore = calculateResearchScore(faculty);
        List<ActivityDTO> activities = activityRepository.findByFacultyIdOrderByTimestampDesc(faculty.getId())
                .stream()
                .limit(10)
                .map(a -> new ActivityDTO(a.getActivityType(), a.getDescription(), a.getTimestamp()))
                .collect(Collectors.toList());

        FacultyDTO dto = new FacultyDTO();
        dto.setId(faculty.getId());
        dto.setName(faculty.getName());
        dto.setEmail(faculty.getEmail());
        dto.setPhone(faculty.getPhone());
        dto.setDepartment(faculty.getDepartment());
        dto.setDesignation(faculty.getDesignation());
        dto.setAbout(faculty.getAbout());
        dto.setProfilePhotoPath(faculty.getProfilePhotoPath());
        dto.setProfileCompletion(faculty.getProfileCompletion());
        dto.setResearchScore(researchScore);
        dto.setBadges(getBadges(faculty, researchScore));
        dto.setActivities(activities);
        return dto;
    }
}
