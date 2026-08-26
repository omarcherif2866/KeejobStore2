package com.example.keejobstore.controllers;

import com.example.keejobstore.entity.CentreFormation;
import com.example.keejobstore.entity.CentreFormation.CaracteristiqueCentre;
import com.example.keejobstore.entity.CentreFormation.Formation;
import com.example.keejobstore.service.CentreFormationService;
import com.example.keejobstore.service.CloudinaryService;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.Collections;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/centres-formation")
@RequiredArgsConstructor
public class CentreFormationController {

    private final CentreFormationService centreFormationService;
    private final CloudinaryService cloudinaryService;

    @GetMapping
    public ResponseEntity<List<CentreFormation>> getAll() {
        return ResponseEntity.ok(centreFormationService.getAllCentres());
    }

    @GetMapping("/{id}")
    public ResponseEntity<CentreFormation> getById(@PathVariable Long id) {
        return centreFormationService.getCentreById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // ========== CREATE avec upload image ==========
    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> create(
            @RequestParam("nom") String nom,
            @RequestParam(value = "certifie", required = false, defaultValue = "false") boolean certifie,
            @RequestParam(value = "image", required = false) MultipartFile image,
            @RequestParam(value = "localisation", required = false) String localisation,
            @RequestParam(value = "note", required = false) Double note,
            @RequestParam(value = "nombreAvis", required = false) Integer nombreAvis,
            @RequestParam(value = "description", required = false) String description,
            @RequestParam(value = "telephone", required = false) String telephone,
            @RequestParam(value = "email", required = false) String email,
            @RequestParam(value = "siteWeb", required = false) String siteWeb,
            @RequestParam(value = "adresse", required = false) String adresse,
            @RequestParam(value = "nombreFormations", required = false) Integer nombreFormations,
            @RequestParam(value = "nombreFormateurs", required = false) Integer nombreFormateurs,
            @RequestParam(value = "nombreApprenants", required = false) Integer nombreApprenants,
            @RequestParam(value = "tauxSatisfaction", required = false) Double tauxSatisfaction,
            @RequestParam(value = "aPropos", required = false) String aPropos,
            @RequestParam(value = "horaires", required = false) String horaires,
            @RequestParam(value = "languesEnseignement", required = false) String languesEnseignement,
            @RequestParam(value = "modalites", required = false) String modalites,
            @RequestParam(value = "certifications", required = false) String certifications,
            @RequestParam(value = "domainesFormation", required = false) String domainesFormationJson,
            @RequestParam(value = "caracteristiques", required = false) String caracteristiquesJson,
            @RequestParam(value = "formations", required = false) String formationsJson
    ) {
        ObjectMapper mapper = new ObjectMapper();
        try {
            CentreFormation centreFormation = new CentreFormation();
            centreFormation.setNom(nom);
            centreFormation.setCertifie(certifie);
            centreFormation.setLocalisation(localisation);
            centreFormation.setNote(note);
            centreFormation.setNombreAvis(nombreAvis);
            centreFormation.setDescription(description);
            centreFormation.setTelephone(telephone);
            centreFormation.setEmail(email);
            centreFormation.setSiteWeb(siteWeb);
            centreFormation.setAdresse(adresse);
            centreFormation.setNombreFormations(nombreFormations);
            centreFormation.setNombreFormateurs(nombreFormateurs);
            centreFormation.setNombreApprenants(nombreApprenants);
            centreFormation.setTauxSatisfaction(tauxSatisfaction);
            centreFormation.setApropos(aPropos);
            centreFormation.setHoraires(horaires);
            centreFormation.setLanguesEnseignement(languesEnseignement);
            centreFormation.setModalites(modalites);
            centreFormation.setCertifications(certifications);

            // ===== Upload image vers Cloudinary =====
            if (image != null && !image.isEmpty()) {
                String imageUrl = cloudinaryService.uploadImage(image);
                centreFormation.setImage(imageUrl);
            }

            // ===== Parsing des listes JSON =====
            if (domainesFormationJson != null && !domainesFormationJson.isBlank()) {
                List<String> domainesFormation = mapper.readValue(
                        domainesFormationJson, new TypeReference<List<String>>() {});
                centreFormation.setDomainesFormation(domainesFormation);
            } else {
                centreFormation.setDomainesFormation(Collections.emptyList());
            }

            if (caracteristiquesJson != null && !caracteristiquesJson.isBlank()) {
                List<CaracteristiqueCentre> caracteristiques = mapper.readValue(
                        caracteristiquesJson, new TypeReference<List<CaracteristiqueCentre>>() {});
                centreFormation.setCaracteristiques(caracteristiques);
            } else {
                centreFormation.setCaracteristiques(Collections.emptyList());
            }

            if (formationsJson != null && !formationsJson.isBlank()) {
                List<Formation> formations = mapper.readValue(
                        formationsJson, new TypeReference<List<Formation>>() {});
                centreFormation.setFormations(formations);
            } else {
                centreFormation.setFormations(Collections.emptyList());
            }

            CentreFormation created = centreFormationService.createCentre(centreFormation);
            return ResponseEntity.status(HttpStatus.CREATED).body(created);

        } catch (JsonProcessingException e) {
            System.err.println("❌ ERREUR JSON CREATE CentreFormation: " + e.getMessage());
            return ResponseEntity.badRequest().body(Map.of("error", "JSON invalide : " + e.getMessage()));
        } catch (Exception e) {
            System.err.println("❌ ERREUR CREATE CentreFormation: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", e.getMessage()));
        }
    }

    // ========== UPDATE avec upload image ==========
    @PutMapping(value = "/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> update(
            @PathVariable Long id,
            @RequestParam(value = "nom", required = false) String nom,
            @RequestParam(value = "certifie", required = false) Boolean certifie,
            @RequestParam(value = "image", required = false) MultipartFile image,
            @RequestParam(value = "localisation", required = false) String localisation,
            @RequestParam(value = "note", required = false) Double note,
            @RequestParam(value = "nombreAvis", required = false) Integer nombreAvis,
            @RequestParam(value = "description", required = false) String description,
            @RequestParam(value = "telephone", required = false) String telephone,
            @RequestParam(value = "email", required = false) String email,
            @RequestParam(value = "siteWeb", required = false) String siteWeb,
            @RequestParam(value = "adresse", required = false) String adresse,
            @RequestParam(value = "nombreFormations", required = false) Integer nombreFormations,
            @RequestParam(value = "nombreFormateurs", required = false) Integer nombreFormateurs,
            @RequestParam(value = "nombreApprenants", required = false) Integer nombreApprenants,
            @RequestParam(value = "tauxSatisfaction", required = false) Double tauxSatisfaction,
            @RequestParam(value = "aPropos", required = false) String aPropos,
            @RequestParam(value = "horaires", required = false) String horaires,
            @RequestParam(value = "languesEnseignement", required = false) String languesEnseignement,
            @RequestParam(value = "modalites", required = false) String modalites,
            @RequestParam(value = "certifications", required = false) String certifications,
            @RequestParam(value = "domainesFormation", required = false) String domainesFormationJson,
            @RequestParam(value = "caracteristiques", required = false) String caracteristiquesJson,
            @RequestParam(value = "formations", required = false) String formationsJson
    ) {
        ObjectMapper mapper = new ObjectMapper();
        try {
            CentreFormation existing = centreFormationService.getCentreById(id)
                    .orElseThrow(() -> new EntityNotFoundException("Centre de formation non trouvé"));

            if (nom != null) existing.setNom(nom);
            if (certifie != null) existing.setCertifie(certifie);
            if (localisation != null) existing.setLocalisation(localisation);
            if (note != null) existing.setNote(note);
            if (nombreAvis != null) existing.setNombreAvis(nombreAvis);
            if (description != null) existing.setDescription(description);
            if (telephone != null) existing.setTelephone(telephone);
            if (email != null) existing.setEmail(email);
            if (siteWeb != null) existing.setSiteWeb(siteWeb);
            if (adresse != null) existing.setAdresse(adresse);
            if (nombreFormations != null) existing.setNombreFormations(nombreFormations);
            if (nombreFormateurs != null) existing.setNombreFormateurs(nombreFormateurs);
            if (nombreApprenants != null) existing.setNombreApprenants(nombreApprenants);
            if (tauxSatisfaction != null) existing.setTauxSatisfaction(tauxSatisfaction);
            if (aPropos != null) existing.setApropos(aPropos);
            if (horaires != null) existing.setHoraires(horaires);
            if (languesEnseignement != null) existing.setLanguesEnseignement(languesEnseignement);
            if (modalites != null) existing.setModalites(modalites);
            if (certifications != null) existing.setCertifications(certifications);

            // ===== Upload nouvelle image si fournie =====
            if (image != null && !image.isEmpty()) {
                String imageUrl = cloudinaryService.uploadImage(image);
                existing.setImage(imageUrl);
            }

            // ===== Mise à jour des listes JSON si fournies =====
            if (domainesFormationJson != null && !domainesFormationJson.isBlank()) {
                List<String> domainesFormation = mapper.readValue(
                        domainesFormationJson, new TypeReference<List<String>>() {});
                existing.setDomainesFormation(domainesFormation);
            }

            if (caracteristiquesJson != null && !caracteristiquesJson.isBlank()) {
                List<CaracteristiqueCentre> caracteristiques = mapper.readValue(
                        caracteristiquesJson, new TypeReference<List<CaracteristiqueCentre>>() {});
                existing.setCaracteristiques(caracteristiques);
            }

            if (formationsJson != null && !formationsJson.isBlank()) {
                List<Formation> formations = mapper.readValue(
                        formationsJson, new TypeReference<List<Formation>>() {});
                existing.setFormations(formations);
            }

            CentreFormation updated = centreFormationService.updateCentre(id, existing);
            return ResponseEntity.ok(updated);

        } catch (EntityNotFoundException e) {
            return ResponseEntity.notFound().build();
        } catch (JsonProcessingException e) {
            System.err.println("❌ ERREUR JSON UPDATE CentreFormation: " + e.getMessage());
            return ResponseEntity.badRequest().body(Map.of("error", "JSON invalide : " + e.getMessage()));
        } catch (Exception e) {
            System.err.println("❌ ERREUR UPDATE CentreFormation: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", e.getMessage()));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        try {
            centreFormationService.deleteCentre(id);
            return ResponseEntity.noContent().build();
        } catch (EntityNotFoundException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/certifies")
    public ResponseEntity<List<CentreFormation>> getCertifies() {
        return ResponseEntity.ok(centreFormationService.getCentresCertifies());
    }

    @GetMapping("/search/localisation")
    public ResponseEntity<List<CentreFormation>> searchByLocalisation(@RequestParam String q) {
        return ResponseEntity.ok(centreFormationService.searchByLocalisation(q));
    }

    @GetMapping("/search/nom")
    public ResponseEntity<List<CentreFormation>> searchByNom(@RequestParam String q) {
        return ResponseEntity.ok(centreFormationService.searchByNom(q));
    }

    @GetMapping("/search/domaine")
    public ResponseEntity<List<CentreFormation>> searchByDomaine(@RequestParam String q) {
        return ResponseEntity.ok(centreFormationService.searchByDomaine(q));
    }
}