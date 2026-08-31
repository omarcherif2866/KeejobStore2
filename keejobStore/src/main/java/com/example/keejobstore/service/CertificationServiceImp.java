package com.example.keejobstore.service;

import com.example.keejobstore.entity.*;
import com.example.keejobstore.repository.CertificationRepository;
import com.example.keejobstore.repository.PlateformeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RequiredArgsConstructor
@Service
public class CertificationServiceImp implements CertificationService {

    private final CertificationRepository certificationRepository;
    private final PlateformeRepository plateformeRepository;
    private final CloudinaryService cloudinaryService;

    @Override
    public List<Certification> getAll() {
        return certificationRepository.findAll();
    }

    @Override
    public Certification getById(Long id) {
        return certificationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Certification introuvable avec id " + id));
    }

    @Override
    public Certification create(Certification certification, Long plateformeId) {
        Plateforme plateforme = plateformeRepository.findById(plateformeId)
                .orElseThrow(() -> new RuntimeException("Plateforme introuvable avec id " + plateformeId));
        certification.setPlateforme(plateforme);
        return certificationRepository.save(certification);
    }

    // ✅ Création avec upload d'image sur Cloudinary
    public Certification createWithImage(Certification certification, Long plateformeId, MultipartFile image) throws IOException {
        if (image != null && !image.isEmpty()) {
            certification.setImage(cloudinaryService.uploadImage(image));
        }
        return create(certification, plateformeId);
    }

    @Override
    public Certification update(Long id, Certification certification) {
        Certification existing = getById(id);
        applyFields(existing, certification);
        return certificationRepository.save(existing);
    }

    // ✅ Mise à jour avec upload d'image sur Cloudinary
    public Certification updateWithImage(Long id, Certification certification, MultipartFile image) throws IOException {
        Certification existing = getById(id);
        applyFields(existing, certification);

        if (image != null && !image.isEmpty()) {
            existing.setImage(cloudinaryService.uploadImage(image));
        }

        return certificationRepository.save(existing);
    }

    // ✅ Upload d'une icône seule (pour construire "avantages" côté front)
    public String uploadIcon(MultipartFile icon) throws IOException {
        return cloudinaryService.uploadImage(icon);
    }

    private void applyFields(Certification existing, Certification certification) {
        existing.setTitre(certification.getTitre());
        existing.setBadge(certification.getBadge());
        existing.setOrganismeEmetteur(certification.getOrganismeEmetteur());
        existing.setLienCertification(certification.getLienCertification());
        existing.setDescriptionCourte(certification.getDescriptionCourte());
        existing.setAPropos(certification.getAPropos());
//        existing.setNote(certification.getNote());
//        existing.setNombreAvis(certification.getNombreAvis());
        existing.setNombreCertifies(certification.getNombreCertifies());
        existing.setNiveau(certification.getNiveau());
        existing.setDureeExamen(certification.getDureeExamen());
        existing.setDureeValidite(certification.getDureeValidite());
        existing.setLangue(certification.getLangue());
        existing.setModaliteExamen(certification.getModaliteExamen());
        existing.setDerniereMiseAJour(certification.getDerniereMiseAJour());
        existing.setPrix(certification.getPrix());
        existing.setPrixOriginal(certification.getPrixOriginal());
        existing.setReduction(certification.getReduction());
        existing.setScoreMinimum(certification.getScoreMinimum());
        existing.setTauxReussite(certification.getTauxReussite());
        existing.setDiplomeInclus(certification.isDiplomeInclus());
        existing.setGarantieRemboursement(certification.getGarantieRemboursement());
        existing.setCategoryCertification(certification.getCategoryCertification());
        existing.setAvantages(certification.getAvantages());
        existing.setCompetencesValidees(certification.getCompetencesValidees());
        existing.setPublicCible(certification.getPublicCible());
    }

    @Override
    public void delete(Long id) {
        certificationRepository.deleteById(id);
    }

    @Override
    public List<Certification> getCertificationsByPlateforme(Long plateformeId) {
        return certificationRepository.findByPlateformeId(plateformeId);
    }

    @Override
    public List<Certification> search(String q) {
        return certificationRepository.searchByTitre(q);
    }

    @Override
    public List<Certification> findByCategoryCertification(CategoryCertification category) {
        return certificationRepository.findByCategoryCertification(category);
    }
}