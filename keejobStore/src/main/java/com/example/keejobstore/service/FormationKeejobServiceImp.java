package com.example.keejobstore.service;

import com.example.keejobstore.entity.*;
import com.example.keejobstore.repository.FormationKeejobRepository;
import com.example.keejobstore.repository.PlateformeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RequiredArgsConstructor
@Service
public class FormationKeejobServiceImp implements FormationKeejobService {

    private final FormationKeejobRepository formationRepository;
    private final PlateformeRepository plateformeRepository;
    private final CloudinaryService cloudinaryService;   // ← ajouté

    @Override
    public List<FormationKeejob> getAll() {
        return formationRepository.findAll();
    }

    @Override
    public FormationKeejob getById(Long id) {
        return formationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Formation introuvable avec id " + id));
    }

    @Override
    public FormationKeejob create(FormationKeejob formation, Long plateformeId) {
        Plateforme plateforme = plateformeRepository.findById(plateformeId)
                .orElseThrow(() -> new RuntimeException("Plateforme introuvable avec id " + plateformeId));
        formation.setPlateforme(plateforme);
        return formationRepository.save(formation);
    }

    // ✅ NOUVELLE MÉTHODE : création avec upload d'image sur Cloudinary
    public FormationKeejob createWithImage(FormationKeejob formation, Long plateformeId, MultipartFile image) throws IOException {
        if (image != null && !image.isEmpty()) {
            String imageUrl = cloudinaryService.uploadImage(image);
            formation.setImage(imageUrl);
        }
        return create(formation, plateformeId);
    }

    @Override
    public FormationKeejob update(Long id, FormationKeejob formation) {
        FormationKeejob existing = getById(id);
        applyFields(existing, formation);
        return formationRepository.save(existing);
    }

    // ✅ NOUVELLE MÉTHODE : mise à jour avec upload d'image sur Cloudinary
    public FormationKeejob updateWithImage(Long id, FormationKeejob formation, MultipartFile image) throws IOException {
        FormationKeejob existing = getById(id);
        applyFields(existing, formation);

        if (image != null && !image.isEmpty()) {
            String imageUrl = cloudinaryService.uploadImage(image);
            existing.setImage(imageUrl);
        }
        // sinon on garde existing.getImage() déjà présent, on ne l'écrase pas avec formation.getImage() (souvent vide côté front si pas de nouveau fichier choisi)

        return formationRepository.save(existing);
    }

    // ✅ NOUVELLE MÉTHODE : upload d'une icône seule (pour construire la liste "avantages" côté front)
    public String uploadIcon(MultipartFile icon) throws IOException {
        return cloudinaryService.uploadImage(icon);
    }

    private void applyFields(FormationKeejob existing, FormationKeejob formation) {
        existing.setTitre(formation.getTitre());
        existing.setBadge(formation.getBadge());
        existing.setLienBandeAnnonce(formation.getLienBandeAnnonce());
        existing.setLienFormation(formation.getLienFormation());
        existing.setDescriptionCourte(formation.getDescriptionCourte());
        existing.setAPropos(formation.getAPropos());
        existing.setNote(formation.getNote());
        existing.setNombreAvis(formation.getNombreAvis());
        existing.setNombreApprenants(formation.getNombreApprenants());
        existing.setNiveau(formation.getNiveau());
        existing.setDuree(formation.getDuree());
        existing.setLangue(formation.getLangue());
        existing.setSousTitres(formation.getSousTitres());
        existing.setAcces(formation.getAcces());
        existing.setDerniereMiseAJour(formation.getDerniereMiseAJour());
        existing.setPrix(formation.getPrix());
        existing.setPrixOriginal(formation.getPrixOriginal());
        existing.setReduction(formation.getReduction());
        existing.setAccesVie(formation.isAccesVie());
        existing.setCertificatInclus(formation.isCertificatInclus());
        existing.setGarantieRemboursement(formation.getGarantieRemboursement());
        existing.setCategoryFormationKeejob(formation.getCategoryFormationKeejob());
        existing.setAvantages(formation.getAvantages());
        existing.setCompetencesAcquises(formation.getCompetencesAcquises());
        existing.setPublicCible(formation.getPublicCible());
    }

    @Override
    public void delete(Long id) {
        formationRepository.deleteById(id);
    }

    @Override
    public List<FormationKeejob> getByPlateforme(Long plateformeId) {
        return formationRepository.findByPlateformeIdOrderByNoteDesc(plateformeId);
    }

    @Override
    public List<FormationKeejob> search(String q) {
        return formationRepository.searchByTitre(q);
    }

    @Override
    public List<FormationKeejob> findByCategoryFormationKeejob(CategoryFormationKeejob category) {
        return formationRepository.findByCategoryFormationKeejob(category);
    }
}