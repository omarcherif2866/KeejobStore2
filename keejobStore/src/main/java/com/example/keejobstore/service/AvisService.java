package com.example.keejobstore.service;

import com.example.keejobstore.entity.Avis;

import java.util.List;

public interface AvisService {

    List<Avis> getAllAvis();

    List<Avis> getAvisByCentreId(Long centreId);

    Avis getAvisById(Long id);

    Avis createAvis(Long centreId, Avis avis);

    Avis updateAvis(Long id, Avis avis);

    void deleteAvis(Long id);
}