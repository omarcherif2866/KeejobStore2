package com.example.keejobstore.controllers;

import com.example.keejobstore.entity.*;
import com.example.keejobstore.service.FormationKeejobService;
import com.example.keejobstore.service.FormationKeejobServiceImp;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/formationKeejob")
@RequiredArgsConstructor
public class FormationKeejobController {

    private final FormationKeejobService formationService;
    private final FormationKeejobServiceImp formationServiceImp;   // pour accéder aux méthodes avec upload

    @GetMapping
    public List<FormationKeejob> getAll() {
        return formationService.getAll();
    }

    @GetMapping("/{id}")
    public FormationKeejob getById(@PathVariable Long id) {
        return formationService.getById(id);
    }

    // ✅ Création avec image (multipart)
    @PostMapping(value = "/plateforme/{plateformeId}", consumes = "multipart/form-data")
    public ResponseEntity<?> create(
            @PathVariable Long plateformeId,
            @RequestPart("formation") FormationKeejob formation,
            @RequestPart(value = "image", required = false) MultipartFile image) {
        try {
            FormationKeejob created = formationServiceImp.createWithImage(formation, plateformeId, image);
            return ResponseEntity.ok(created);
        } catch (IOException e) {
            return ResponseEntity.status(500).body("Erreur lors de l'upload de l'image : " + e.getMessage());
        }
    }

    // ✅ Mise à jour avec image (multipart)
    @PutMapping(value = "/{id}", consumes = "multipart/form-data")
    public ResponseEntity<?> update(
            @PathVariable Long id,
            @RequestPart("formation") FormationKeejob formation,
            @RequestParam("plateformeId") Long plateformeId,
            @RequestPart(value = "image", required = false) MultipartFile image) {
        try {
            FormationKeejob updated = formationServiceImp.updateWithImage(id, formation, plateformeId, image);
            return ResponseEntity.ok(updated);
        } catch (IOException e) {
            return ResponseEntity.status(500).body("Erreur lors de l'upload de l'image : " + e.getMessage());
        }
    }

    // ✅ Upload d'une icône seule (pour construire "avantages" côté front avant soumission du formulaire)
    @PostMapping(value = "/upload-icon", consumes = "multipart/form-data")
    public ResponseEntity<?> uploadIcon(@RequestPart("icon") MultipartFile icon) {
        try {
            String url = formationServiceImp.uploadIcon(icon);
            return ResponseEntity.ok(url);
        } catch (IOException e) {
            return ResponseEntity.status(500).body("Erreur lors de l'upload de l'icône : " + e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        formationService.delete(id);
    }

    @GetMapping("/plateforme/{plateformeId}")
    public ResponseEntity<List<FormationKeejob>> getFormationsByPlateforme(@PathVariable Long plateformeId) {
        return ResponseEntity.ok(formationService.getFormationsByPlateforme(plateformeId));
    }

    @GetMapping("/search")
    public List<FormationKeejob> search(@RequestParam String q) {
        return formationService.search(q);
    }

    @GetMapping("/by-category/{category}")
    public ResponseEntity<?> getFormationsByCategory(@PathVariable String category) {
        try {
            CategoryFormationKeejob enumValue = CategoryFormationKeejob.valueOf(category);
            List<FormationKeejob> formations = formationService.findByCategoryFormationKeejob(enumValue);
            return ResponseEntity.ok(formations);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body("Catégorie invalide !");
        }
    }
}