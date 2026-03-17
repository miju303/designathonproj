package com.faculty.system.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class FacultyDTO {
    private Long id;
    private String name;
    private String email;
    private String phone;
    private String department;
    private String designation;
    private String about;
    private String profilePhotoPath;
    private Integer profileCompletion;
    private Integer researchScore;
    private List<String> badges;
    private List<ActivityDTO> activities;
}
