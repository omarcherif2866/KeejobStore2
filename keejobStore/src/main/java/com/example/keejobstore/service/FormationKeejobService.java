package com.example.keejobstore.service;

import com.example.keejobstore.entity.CategoryCoaching;
import com.example.keejobstore.entity.CategoryFormationKeejob;
import com.example.keejobstore.entity.CoachingEmploi;
import com.example.keejobstore.entity.FormationKeejob;

import java.util.List;

public interface FormationKeejobService {
    List<FormationKeejob> getAll();
    FormationKeejob getById(Long id);
    FormationKeejob create(FormationKeejob formation, Long CentreFormationId);
    FormationKeejob update(Long id, FormationKeejob formation, Long CentreFormationId);
    void delete(Long id);
    List<FormationKeejob> search(String q);
    List<FormationKeejob> findByCategoryFormationKeejob(CategoryFormationKeejob category);
    List<FormationKeejob> getFormationsByPlateforme(Long CentreFormationId);

}
