package com.example.keejobstore.service;

import com.example.keejobstore.entity.Plateforme;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

public interface PlateformeService {

    List<Plateforme> getAll();
    Plateforme getById(Long id);
    void delete(Long id);
    List<Plateforme> getPopulaires();
    List<Plateforme> search(String q);

    // ✅ Création avec upload Cloudinary du logo et/ou de l'image d'illustration
    Plateforme createWithImages(Plateforme plateforme, MultipartFile logo, MultipartFile imageIllustration) throws IOException;

    // ✅ Mise à jour avec upload Cloudinary du logo et/ou de l'image d'illustration
    Plateforme updateWithImages(Long id, Plateforme plateforme, MultipartFile logo, MultipartFile imageIllustration) throws IOException;
}