package com.example.keejobstore.service;


import com.example.keejobstore.dto.FormateurCreationResult;
import com.example.keejobstore.entity.Formateur;
import com.example.keejobstore.entity.User;

import java.util.List;

public interface FormateurService {
    FormateurCreationResult addFormateur(Formateur formateur, String password);
    Formateur linkOrCreateForUser(User user);
    void deleteFormateurEntityById(Long id);
    Formateur getFormateurById(Long id);
    public List<Formateur> getAllFormateurs();
    Formateur updateFormateur(Long id, Formateur Formateur);



}
