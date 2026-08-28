package com.example.keejobstore.controllers;

import com.example.keejobstore.entity.Plateforme;
import com.example.keejobstore.service.PlateformeService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/plateformes")
@RequiredArgsConstructor
public class PlateformeController {

    private final PlateformeService plateformeService;

    @GetMapping
    public List<Plateforme> getAll() {
        return plateformeService.getAll();
    }

    @GetMapping("/{id}")
    public Plateforme getById(@PathVariable Long id) {
        return plateformeService.getById(id);
    }

    // ✅ Création avec logo + imageIllustration (multipart)
    @PostMapping(consumes = "multipart/form-data")
    public ResponseEntity<?> create(
            @RequestPart("plateforme") Plateforme plateforme,
            @RequestPart(value = "logo", required = false) MultipartFile logo,
            @RequestPart(value = "imageIllustration", required = false) MultipartFile imageIllustration) {
        try {
            Plateforme created = plateformeService.createWithImages(plateforme, logo, imageIllustration);
            return ResponseEntity.ok(created);
        } catch (IOException e) {
            return ResponseEntity.status(500).body("Erreur lors de l'upload : " + e.getMessage());
        }
    }

    // ✅ Mise à jour avec logo + imageIllustration (multipart)
    @PutMapping(value = "/{id}", consumes = "multipart/form-data")
    public ResponseEntity<?> update(
            @PathVariable Long id,
            @RequestPart("plateforme") Plateforme plateforme,
            @RequestPart(value = "logo", required = false) MultipartFile logo,
            @RequestPart(value = "imageIllustration", required = false) MultipartFile imageIllustration) {
        try {
            Plateforme updated = plateformeService.updateWithImages(id, plateforme, logo, imageIllustration);
            return ResponseEntity.ok(updated);
        } catch (IOException e) {
            return ResponseEntity.status(500).body("Erreur lors de l'upload : " + e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        plateformeService.delete(id);
    }

    @GetMapping("/populaires")
    public List<Plateforme> getPopulaires() {
        return plateformeService.getPopulaires();
    }

    @GetMapping("/search")
    public List<Plateforme> search(@RequestParam String q) {
        return plateformeService.search(q);
    }
}