package com.faculty.system.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.faculty.system.service.AdminService;
import com.faculty.system.service.ReportService;

import java.util.Map;

@RestController
@RequestMapping("/api/reports")
@RequiredArgsConstructor
public class ReportController {

    private final AdminService adminService;
    private final ReportService reportService;

    @GetMapping("/naac-pdf")
    public ResponseEntity<byte[]> downloadNaacPdf() {
        Map<String, Object> data = adminService.generateNaacReport();
        byte[] pdf = reportService.generateNaacReportPdf(data);

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=NAAC_Report.pdf")
                .contentType(MediaType.APPLICATION_PDF)
                .body(pdf);
    }
}
