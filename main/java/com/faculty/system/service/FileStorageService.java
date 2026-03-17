package com.faculty.system.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.faculty.system.entity.FacultyDocument;
import com.faculty.system.repository.FacultyDocumentRepository;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.util.UUID;

@Service
public class FileStorageService {

    private final String uploadDir = "uploads";

    @Autowired
    private FacultyDocumentRepository documentRepository;

    public String storeFile(MultipartFile file) throws IOException {
        Path root = Paths.get(uploadDir);
        if (!Files.exists(root)) {
            Files.createDirectories(root);
        }

        String originalFilename = file.getOriginalFilename();
        String extension = "";
        if (originalFilename != null && originalFilename.contains(".")) {
            extension = originalFilename.substring(originalFilename.lastIndexOf("."));
        }
        
        String storedFilename = UUID.randomUUID().toString() + extension;
        Path filePath = root.resolve(storedFilename);
        Files.copy(file.getInputStream(), filePath);

        return filePath.toString();
    }

    public FacultyDocument saveDocument(MultipartFile file) throws IOException {
        String filePath = storeFile(file);
        
        FacultyDocument document = FacultyDocument.builder()
                .fileName(file.getOriginalFilename())
                .fileType(file.getContentType())
                .filePath(filePath)
                .uploadDate(LocalDateTime.now())
                .build();

        return documentRepository.save(document);
    }

    public FacultyDocument getFile(Long id) {
        return documentRepository.findById(id).orElseThrow(() -> new RuntimeException("File not found with id " + id));
    }
}
