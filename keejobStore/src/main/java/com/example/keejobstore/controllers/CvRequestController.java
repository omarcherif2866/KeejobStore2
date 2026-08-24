package com.example.keejobstore.controllers;

import com.example.keejobstore.dto.CvRequestDto;
import com.example.keejobstore.service.MailService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Map;

@RestController
@RequestMapping("/cv-request")
public class CvRequestController {

    private final MailService mailService;

    public CvRequestController(MailService mailService) {
        this.mailService = mailService;
    }

    @PostMapping(consumes = "multipart/form-data")
    public ResponseEntity<?> submitCvRequest(
            @RequestParam("fullname") String fullname,
            @RequestParam("email") String email,
            @RequestParam("whatsapp") String whatsapp,
            @RequestParam("serviceName") String serviceName,
            @RequestParam(value = "cvFile", required = false) MultipartFile cvFile) {

        try {
            CvRequestDto request = new CvRequestDto(fullname, email, whatsapp, serviceName);

            byte[] fileBytes = null;
            String fileName = null;
            if (cvFile != null && !cvFile.isEmpty()) {
                fileBytes = cvFile.getBytes();
                fileName = cvFile.getOriginalFilename();
            }

            mailService.sendCvRequest(request, fileBytes, fileName);

            return ResponseEntity.ok(Map.of("message", "Demande envoyée avec succès"));

        } catch (IOException e) {
            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("message", "Erreur lors de la lecture du fichier"));
        }
    }
}