package com.example.keejobstore.service;

import com.example.keejobstore.entity.FormationFormateur;
import com.example.keejobstore.entity.ServiceFromateur;

import java.util.List;

public interface FormationFormateurService {

    List<FormationFormateur> getAll();

    FormationFormateur add(FormationFormateur formationFormateur);

    List<FormationFormateur> getByFormateur(Long formateurId);

    FormationFormateur getById(Long id); // ✅ Ajoutez cette ligne

    List<FormationFormateur> getFormationFormateurByUser(Integer userId);

}
