package com.faculty.system.service;

import com.faculty.system.dto.FacultyDTO;
import com.lowagie.text.*;
import com.lowagie.text.pdf.PdfPCell;
import com.lowagie.text.pdf.PdfPTable;
import com.lowagie.text.pdf.PdfWriter;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.awt.Color;
import java.io.ByteArrayOutputStream;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class ReportService {

    @SuppressWarnings("unchecked")
    public byte[] generateNaacReportPdf(Map<String, Object> data) {
        Document document = new Document(PageSize.A4);
        ByteArrayOutputStream out = new ByteArrayOutputStream();

        try {
            PdfWriter.getInstance(document, out);
            document.open();

            Font titleFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 18, Color.BLUE);
            Paragraph title = new Paragraph("NAAC Audit Report", titleFont);
            title.setAlignment(Element.ALIGN_CENTER);
            document.add(title);
            document.add(new Paragraph("Generated at: " + data.get("timestamp")));
            document.add(new Paragraph(" "));

            // Summary Section
            Font headFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 14);
            document.add(new Paragraph("Summary Statistics", headFont));
            
            Map<String, Object> summary = (Map<String, Object>) data.get("summary");
            if (summary != null) {
                document.add(new Paragraph("Total Faculty: " + summary.get("totalFaculty")));
                document.add(new Paragraph("Profiles Completed: " + summary.get("profilesCompleted")));
                document.add(new Paragraph("Profiles Pending: " + summary.get("profilesPending")));
                document.add(new Paragraph("Most Active Department: " + summary.get("mostActiveDepartment")));
            }
            document.add(new Paragraph(" "));

            // Faculty Details Table
            document.add(new Paragraph("Faculty Details", headFont));
            document.add(new Paragraph(" "));
            PdfPTable table = new PdfPTable(4);
            table.setWidthPercentage(100);
            
            String[] headers = {"Name", "Department", "Designation", "Completion %"};
            for (String header : headers) {
                PdfPCell cell = new PdfPCell(new Phrase(header, FontFactory.getFont(FontFactory.HELVETICA_BOLD)));
                cell.setBackgroundColor(Color.LIGHT_GRAY);
                table.addCell(cell);
            }

            List<FacultyDTO> faculties = (List<FacultyDTO>) data.get("facultyProfiles");
            if (faculties != null) {
                for (FacultyDTO f : faculties) {
                    table.addCell(f.getName() != null ? f.getName() : "");
                    table.addCell(f.getDepartment() != null ? f.getDepartment() : "");
                    table.addCell(f.getDesignation() != null ? f.getDesignation() : "");
                    table.addCell(f.getProfileCompletion() + "%");
                }
            }
            document.add(table);

            document.close();
        } catch (DocumentException e) {
            e.printStackTrace();
        }

        return out.toByteArray();
    }
}
