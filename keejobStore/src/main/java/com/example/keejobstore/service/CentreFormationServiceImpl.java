package com.example.keejobstore.service;


import com.example.keejobstore.entity.CentreFormation;
import com.example.keejobstore.repository.CentreFormationRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Transactional
public class CentreFormationServiceImpl implements CentreFormationService {

    private final CentreFormationRepository centreFormationRepository;

    @Override
    @Transactional(readOnly = true)
    public List<CentreFormation> getAllCentres() {
        return centreFormationRepository.findAll();
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<CentreFormation> getCentreById(Long id) {
        return centreFormationRepository.findById(id);
    }

    @Override
    public CentreFormation createCentre(CentreFormation centreFormation) {
        return centreFormationRepository.save(centreFormation);
    }

    @Override
    public CentreFormation updateCentre(Long id, CentreFormation centreFormation) {
        CentreFormation existant = centreFormationRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Centre de formation introuvable avec l'id : " + id));

        existant.setNom(centreFormation.getNom());
        existant.setCertifie(centreFormation.isCertifie());
        existant.setImage(centreFormation.getImage());
        existant.setLocalisation(centreFormation.getLocalisation());
        existant.setNote(centreFormation.getNote());
        existant.setNombreAvis(centreFormation.getNombreAvis());
        existant.setDescription(centreFormation.getDescription());
        existant.setTelephone(centreFormation.getTelephone());
        existant.setEmail(centreFormation.getEmail());
        existant.setSiteWeb(centreFormation.getSiteWeb());
        existant.setAdresse(centreFormation.getAdresse());
        existant.setNombreFormations(centreFormation.getNombreFormations());
        existant.setNombreFormateurs(centreFormation.getNombreFormateurs());
        existant.setNombreApprenants(centreFormation.getNombreApprenants());
        existant.setTauxSatisfaction(centreFormation.getTauxSatisfaction());
        existant.setApropos(centreFormation.getApropos());

        // Anciennement InformationsPratiques (@Embedded) : champs aplatis
        existant.setHoraires(centreFormation.getHoraires());
        existant.setLanguesEnseignement(centreFormation.getLanguesEnseignement());
        existant.setModalites(centreFormation.getModalites());
        existant.setCertifications(centreFormation.getCertifications());

        // Listes stockées en colonnes JSON
        existant.setDomainesFormation(centreFormation.getDomainesFormation());
        existant.setCaracteristiques(centreFormation.getCaracteristiques());
        existant.setFormations(centreFormation.getFormations());

        return centreFormationRepository.save(existant);
    }

    @Override
    public void deleteCentre(Long id) {
        if (!centreFormationRepository.existsById(id)) {
            throw new EntityNotFoundException("Centre de formation introuvable avec l'id : " + id);
        }
        centreFormationRepository.deleteById(id);
    }

    @Override
    @Transactional(readOnly = true)
    public List<CentreFormation> getCentresCertifies() {
        return centreFormationRepository.findByCertifieTrue();
    }

    @Override
    @Transactional(readOnly = true)
    public List<CentreFormation> searchByLocalisation(String localisation) {
        return centreFormationRepository.findByLocalisationContainingIgnoreCase(localisation);
    }

    @Override
    @Transactional(readOnly = true)
    public List<CentreFormation> searchByNom(String nom) {
        return centreFormationRepository.findByNomContainingIgnoreCase(nom);
    }

    @Override
    @Transactional(readOnly = true)
    public List<CentreFormation> searchByDomaine(String domaine) {
        return centreFormationRepository.findByDomainesFormationContainingIgnoreCase(domaine);
    }
}