package com.faculty.system.dto;

/**
 * DTO returned by /api/user/me — provides the logged-in user's full identity info.
 */
public class UserMeResponseDTO {
    private Long id;
    private String name;
    private String email;
    private String role;
    private String department;
    private String designation;
    private String phone;
    private String about;
    private String profilePhotoPath;
    private Integer profileCompletion;
    private Integer researchScore;

    // Default constructor (needed for serialization)
    public UserMeResponseDTO() {}

    public UserMeResponseDTO(Long id, String name, String email, String role,
                              String department, String designation, String phone,
                              String about, String profilePhotoPath,
                              Integer profileCompletion, Integer researchScore) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.role = role;
        this.department = department;
        this.designation = designation;
        this.phone = phone;
        this.about = about;
        this.profilePhotoPath = profilePhotoPath;
        this.profileCompletion = profileCompletion;
        this.researchScore = researchScore;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }

    public String getDepartment() { return department; }
    public void setDepartment(String department) { this.department = department; }

    public String getDesignation() { return designation; }
    public void setDesignation(String designation) { this.designation = designation; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }

    public String getAbout() { return about; }
    public void setAbout(String about) { this.about = about; }

    public String getProfilePhotoPath() { return profilePhotoPath; }
    public void setProfilePhotoPath(String profilePhotoPath) { this.profilePhotoPath = profilePhotoPath; }

    public Integer getProfileCompletion() { return profileCompletion; }
    public void setProfileCompletion(Integer profileCompletion) { this.profileCompletion = profileCompletion; }

    public Integer getResearchScore() { return researchScore; }
    public void setResearchScore(Integer researchScore) { this.researchScore = researchScore; }
}
