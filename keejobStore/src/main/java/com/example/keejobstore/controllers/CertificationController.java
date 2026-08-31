package com.example.keejobstore.controllers;

import com.example.keejobstore.entity.*;
import com.example.keejobstore.service.CertificationService;
import com.example.keejobstore.service.CertificationServiceImp;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/certification")
@RequiredArgsConstructor
public class CertificationController {

    private final CertificationService certificationService;
    private final CertificationServiceImp certificationServiceImp;

    @GetMapping
    public List<Certification> getAll() {
        return certificationService.getAll();
    }

    @GetMapping("/{id}")
    public Certification getById(@PathVariable Long id) {
        return certificationService.getById(id);
    }

    // ✅ Création avec image (multipart)
    @PostMapping(value = "/plateforme/{plateformeId}", consumes = "multipart/form-data")
    public ResponseEntity<?> create(
            @PathVariable Long plateformeId,
            @RequestPart("certification") Certification certification,
            @RequestPart(value = "image", required = false) MultipartFile image) {
        try {
            Certification created = certificationServiceImp.createWithImage(certification, plateformeId, image);
            return ResponseEntity.ok(created);
        } catch (IOException e) {
            return ResponseEntity.status(500).body("Erreur lors de l'upload de l'image : " + e.getMessage());
        }
    }

    // ✅ Mise à jour avec image (multipart)
    @PutMapping(value = "/{id}", consumes = "multipart/form-data")
    public ResponseEntity<?> update(
            @PathVariable Long id,
            @RequestPart("certification") Certification certification,
            @RequestPart(value = "image", required = false) MultipartFile image) {
        try {
            Certification updated = certificationServiceImp.updateWithImage(id, certification, image);
            return ResponseEntity.ok(updated);
        } catch (IOException e) {
            return ResponseEntity.status(500).body("Erreur lors de l'upload de l'image : " + e.getMessage());
        }
    }

    // ✅ Upload d'une icône seule (pour construire "avantages" côté front)
    @PostMapping(value = "/upload-icon", consumes = "multipart/form-data")
    public ResponseEntity<?> uploadIcon(@RequestPart("icon") MultipartFile icon) {
        try {
            String url = certificationServiceImp.uploadIcon(icon);
            return ResponseEntity.ok(url);
        } catch (IOException e) {
            return ResponseEntity.status(500).body("Erreur lors de l'upload de l'icône : " + e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        certificationService.delete(id);
    }

    @GetMapping("/plateforme/{plateformeId}")
    public ResponseEntity<List<Certification>> getCertificationsByPlateforme(@PathVariable Long plateformeId) {
        return ResponseEntity.ok(certificationService.getCertificationsByPlateforme(plateformeId));
    }

    @GetMapping("/search")
    public List<Certification> search(@RequestParam String q) {
        return certificationService.search(q);
    }

    @GetMapping("/by-category/{category}")
    public ResponseEntity<?> getCertificationsByCategory(@PathVariable String category) {
        try {
            CategoryCertification enumValue = CategoryCertification.valueOf(category);
            List<Certification> certifications = certificationService.findByCategoryCertification(enumValue);
            return ResponseEntity.ok(certifications);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body("Catégorie invalide !");
        }
    }
}