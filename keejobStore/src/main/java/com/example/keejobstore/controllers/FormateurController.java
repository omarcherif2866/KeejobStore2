package com.example.keejobstore.controllers;

import com.example.keejobstore.dto.FormateurCreationResult;
import com.example.keejobstore.entity.Formateur;
import com.example.keejobstore.service.CloudinaryService;
import com.example.keejobstore.service.FormateurService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/formateur")
@RequiredArgsConstructor
public class FormateurController {

    private final FormateurService formateurService;
    private final CloudinaryService cloudinaryService;

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> addFormateur(
            @RequestParam("address") String address,
            @RequestParam("description") String description,
            @RequestParam("email") String email,
            @RequestParam("phone") String phone,
            @RequestParam("experience") String experience,
            @RequestParam("poste") String poste,
            @RequestParam("firstName") String firstName,
            @RequestParam("lastName") String lastName,
            @RequestParam("university") String university,
            @RequestParam(value = "image", required = false) MultipartFile image,
            @RequestParam(value = "discount", required = false) Integer discount,
            @RequestParam(value = "formationPresentiel", required = false, defaultValue = "false") Boolean formationPresentiel,
            @RequestParam(value = "formationEnLigne", required = false, defaultValue = "false") Boolean formationEnLigne,
            @RequestParam(value = "password", required = false) String password) {
        try {
            System.out.println(">>> CONTROLLER password reçu = " + password);

            if (address.isBlank() || description.isBlank() || email.isBlank() || phone.isBlank()
                    || experience.isBlank() || poste.isBlank() || firstName.isBlank()
                    || lastName.isBlank() || university.isBlank()) {
                return ResponseEntity.badRequest().body("Paramètres d'entrée invalides.");
            }

            Formateur formateur = new Formateur();
            formateur.setAddress(address);
            formateur.setDescription(description);
            formateur.setEmail(email.trim());
            formateur.setPhone(phone);
            formateur.setExperience(experience);
            formateur.setPoste(poste);
            formateur.setFirstName(firstName);
            formateur.setLastName(lastName);
            formateur.setUniversity(university);
            formateur.setDiscount(discount);
            formateur.setFormationPresentiel(formationPresentiel);
            formateur.setFormationEnLigne(formationEnLigne);

            if (image != null && !image.isEmpty()) {
                formateur.setImage(cloudinaryService.uploadImage(image));
            }

            FormateurCreationResult result = formateurService.addFormateur(formateur, password);
            return ResponseEntity.ok(result);

        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Erreur lors de l'upload de l'image : " + e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Une erreur s'est produite lors du traitement de la demande : " + e.getMessage());
        }
    }

    @GetMapping("{id}")
    public Formateur getFormateurById(@PathVariable Long id) {
        return formateurService.getFormateurById(id);
    }

    @DeleteMapping("{id}")
    public void deleteFormateur(@PathVariable Long id) {
        formateurService.deleteFormateurEntityById(id);
    }

    @GetMapping("/allFormateurs")
    public ResponseEntity<List<Formateur>> getAllFormateurs() {
        return ResponseEntity.ok(formateurService.getAllFormateurs());
    }

    @PutMapping(value = "/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> updateFormateur(
            @PathVariable Long id,
            @RequestParam("firstName") String firstName,
            @RequestParam("lastName") String lastName,
            @RequestParam("email") String email,
            @RequestParam("phone") String phone,
            @RequestParam("address") String address,
            @RequestParam("description") String description,
            @RequestParam("experience") String experience,
            @RequestParam("poste") String poste,
            @RequestParam("university") String university,
            @RequestParam(value = "image", required = false) MultipartFile image,
            @RequestParam(value = "discount", required = false) Integer discount,
            @RequestParam(value = "formationPresentiel", required = false, defaultValue = "false") Boolean formationPresentiel,
            @RequestParam(value = "formationEnLigne", required = false, defaultValue = "false") Boolean formationEnLigne) {
        try {
            // Objet "changements" (détaché) : le service compare avec l'entité en base
            Formateur changes = new Formateur();
            changes.setFirstName(firstName);
            changes.setLastName(lastName);
            changes.setEmail(email.trim());
            changes.setPhone(phone);
            changes.setAddress(address);
            changes.setDescription(description);
            changes.setExperience(experience);
            changes.setPoste(poste);
            changes.setUniversity(university);
            changes.setDiscount(discount);
            changes.setFormationPresentiel(formationPresentiel);
            changes.setFormationEnLigne(formationEnLigne);

            if (image != null && !image.isEmpty()) {
                changes.setImage(cloudinaryService.uploadImage(image));
            }

            return ResponseEntity.ok(formateurService.updateFormateur(id, changes));

        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Erreur lors de l'upload de l'image : " + e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Erreur serveur : " + e.getMessage());
        }
    }
}