package com.example.keejobstore.controllers;
import com.example.keejobstore.dto.ContactRequest;
import com.example.keejobstore.service.ContactService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/contact")
@RequiredArgsConstructor
public class ContactController {

    private final ContactService contactService;

    @PostMapping
    public ResponseEntity<?> contact(@RequestBody ContactRequest request) {
        try {
            contactService.sendContactEmail(
                    request.getNom(),
                    request.getPrenom(),
                    request.getEmail(),
                    request.getSujet(),
                    request.getPhone(),
                    request.getMessage()
            );
            return ResponseEntity.ok("Message envoyé avec succès");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Erreur envoi : " + e.getMessage());
        }
    }
}