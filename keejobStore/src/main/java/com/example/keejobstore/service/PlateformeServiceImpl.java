package com.example.keejobstore.service;

import com.example.keejobstore.entity.Plateforme;
import com.example.keejobstore.repository.PlateformeRepository;
import com.example.keejobstore.service.CloudinaryService;
import com.example.keejobstore.service.PlateformeService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@Service
@RequiredArgsConstructor
public class PlateformeServiceImpl implements PlateformeService {

    private final PlateformeRepository plateformeRepository;
    private final CloudinaryService cloudinaryService;

    @Override
    public List<Plateforme> getAll() {
        return plateformeRepository.findAllByOrderByNoteDesc();
    }

    @Override
    public Plateforme getById(Long id) {
        return plateformeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Plateforme introuvable avec id " + id));
    }

    @Override
    public void delete(Long id) {
        plateformeRepository.deleteById(id);
    }

    @Override
    public List<Plateforme> getPopulaires() {
        return plateformeRepository.findByPopulaireTrue();
    }

    @Override
    public List<Plateforme> search(String q) {
        return plateformeRepository.searchByNom(q);
    }

    @Override
    public Plateforme createWithImages(Plateforme plateforme, MultipartFile logo, MultipartFile imageIllustration) throws IOException {
        if (logo != null && !logo.isEmpty()) {
            plateforme.setLogo(cloudinaryService.uploadImagePlatforme(logo));
        }
//        if (imageIllustration != null && !imageIllustration.isEmpty()) {
//            plateforme.setImageIllustration(cloudinaryService.uploadImage(imageIllustration));
//        }
        return plateformeRepository.save(plateforme);
    }

    @Override
    public Plateforme updateWithImages(Long id, Plateforme plateforme, MultipartFile logo, MultipartFile imageIllustration) throws IOException {
        Plateforme existing = getById(id);

        existing.setNom(plateforme.getNom());
        existing.setPopulaire(plateforme.isPopulaire());
        existing.setNote(plateforme.getNote());
        existing.setNombreAvis(plateforme.getNombreAvis());
        existing.setNombreApprenants(plateforme.getNombreApprenants());
        existing.setDescription(plateforme.getDescription());
        existing.setSiteWeb(plateforme.getSiteWeb());
        existing.setCategories(plateforme.getCategories());

        if (logo != null && !logo.isEmpty()) {
            existing.setLogo(cloudinaryService.uploadImagePlatforme(logo));
        }
        // sinon on garde existing.getLogo() tel quel (pas de nouveau fichier choisi)

//        if (imageIllustration != null && !imageIllustration.isEmpty()) {
//            existing.setImageIllustration(cloudinaryService.uploadImage(imageIllustration));
//        }

        return plateformeRepository.save(existing);
    }
}