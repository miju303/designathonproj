package com.faculty.system.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class HodDashboardDTO {
    private long totalFaculty;
    private long profilesCompleted;
    private long profilesPending;
    private double averageCompletion;
}
