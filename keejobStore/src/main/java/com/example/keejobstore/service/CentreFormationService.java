package com.example.keejobstore.service;

import com.example.keejobstore.entity.CentreFormation;

import java.util.List;
import java.util.Optional;

public interface CentreFormationService {

    List<CentreFormation> getAllCentres();

    Optional<CentreFormation> getCentreById(Long id);

    CentreFormation createCentre(CentreFormation centreFormation);

    CentreFormation updateCentre(Long id, CentreFormation centreFormation);

    void deleteCentre(Long id);

    List<CentreFormation> getCentresCertifies();

    List<CentreFormation> searchByLocalisation(String localisation);

    List<CentreFormation> searchByNom(String nom);

    List<CentreFormation> searchByDomaine(String domaine);
}