package com.example.keejobstore.service;

import com.example.keejobstore.entity.CategoryCertification;
import com.example.keejobstore.entity.Certification;
import com.example.keejobstore.entity.FormationKeejob;

import java.util.List;

public interface CertificationService {
    List<Certification> getAll();
    Certification getById(Long id);
    Certification create(Certification certification, Long plateformeId);
    Certification update(Long id, Certification certification, Long plateformeId);
    void delete(Long id);
    List<Certification> search(String q);
    List<Certification> findByCategoryCertification(CategoryCertification category);
    List<Certification> getCertificationsByPlateforme(Long plateformeId);

}