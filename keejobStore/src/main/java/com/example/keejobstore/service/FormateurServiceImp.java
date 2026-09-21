package com.example.keejobstore.service;

import com.example.keejobstore.dto.FormateurCreationResult;
import com.example.keejobstore.entity.Formateur;
import com.example.keejobstore.entity.Role;
import com.example.keejobstore.entity.User;
import com.example.keejobstore.repository.FormateurRepository;
import com.example.keejobstore.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;

@RequiredArgsConstructor
@Service
public class FormateurServiceImp implements FormateurService {

    private final FormateurRepository formateurRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    // ───────────── Formateur → User ─────────────
    @Override
    @Transactional
    public FormateurCreationResult addFormateur(Formateur formateur, String password) {
        try {
            System.out.println(">>> SERVICE password reçu = " + password);
            String rawPassword = null;

            User user = userRepository.findByEmailIgnoreCase(formateur.getEmail()).orElse(null);

            if (user != null) {
                if (user.getRole() == Role.Admin) {
                    throw new IllegalArgumentException("Cet email appartient à un administrateur.");
                }
                if (formateurRepository.findByUserId(user.getId()).isPresent()) {
                    throw new IllegalArgumentException("Un formateur existe déjà avec cet email.");
                }
                if (user.getRole() != Role.FORMATEUR) {
                    user.setRole(Role.FORMATEUR);
                    user = userRepository.save(user);
                }
                // Le mot de passe d'un user existant n'est pas modifié
            } else {
                if (password != null && !password.isBlank()) {
                    if (password.length() < 8) {
                        throw new IllegalArgumentException("Le mot de passe doit contenir au moins 8 caractères.");
                    }
                    rawPassword = password;
                } else {
                    rawPassword = generatePassword();
                }

                user = new User();
                user.setUsername(formateur.getEmail());
                user.setEmail(formateur.getEmail());
                user.setPassword(passwordEncoder.encode(rawPassword));
                user.setRole(Role.FORMATEUR);
                user.setBlocked(false);
                user = userRepository.save(user);
            }

            formateur.setUser(user);
            return new FormateurCreationResult(formateurRepository.save(formateur), rawPassword);

        } catch (DataIntegrityViolationException e) {
            throw new IllegalArgumentException("Erreur lors de l'ajout du formateur : il existe déjà.");
        }
    }

    // ───────────── User → Formateur ─────────────
    @Override
    @Transactional
    public Formateur linkOrCreateForUser(User user) {
        if (user.getRole() != Role.FORMATEUR) return null;

        Optional<Formateur> linked = formateurRepository.findByUserId(user.getId());
        if (linked.isPresent()) return linked.get();

        Optional<Formateur> existing =
                formateurRepository.findByEmailIgnoreCaseAndUserIsNull(user.getEmail());
        if (existing.isPresent()) {
            Formateur f = existing.get();
            f.setUser(user);
            return formateurRepository.save(f);
        }

        Formateur f = new Formateur();
        f.setEmail(user.getEmail());
        f.setFirstName(user.getUsername());
        f.setLastName("");
        f.setUser(user);
        return formateurRepository.save(f);
    }

    @Override
    public void deleteFormateurEntityById(Long id) {
        formateurRepository.deleteById(id);
    }

    @Override
    public Formateur getFormateurById(Long id) {
        return formateurRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("formateur not found"));
    }

    @Override
    public List<Formateur> getAllFormateurs() {
        return formateurRepository.findAll();
    }

    @Override
    @Transactional
    public Formateur updateFormateur(Long id, Formateur formateur) {
        Formateur existing = formateurRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Formateur not found with ID: " + id));

        if (formateur.getAddress() != null) existing.setAddress(formateur.getAddress());
        if (formateur.getDescription() != null) existing.setDescription(formateur.getDescription());
        if (formateur.getPhone() != null) existing.setPhone(formateur.getPhone());
        if (formateur.getExperience() != null) existing.setExperience(formateur.getExperience());
        if (formateur.getPoste() != null) existing.setPoste(formateur.getPoste());
        if (formateur.getFirstName() != null) existing.setFirstName(formateur.getFirstName());
        if (formateur.getLastName() != null) existing.setLastName(formateur.getLastName());
        if (formateur.getUniversity() != null) existing.setUniversity(formateur.getUniversity());
        if (formateur.getDiscount() != null) existing.setDiscount(formateur.getDiscount());
        if (formateur.getImage() != null) existing.setImage(formateur.getImage());
        if (formateur.getFormationPresentiel() != null) existing.setFormationPresentiel(formateur.getFormationPresentiel());
        if (formateur.getFormationEnLigne() != null) existing.setFormationEnLigne(formateur.getFormationEnLigne());

        // Email : synchronisé aussi sur le User lié
        if (formateur.getEmail() != null && !formateur.getEmail().equalsIgnoreCase(existing.getEmail())) {
            User linked = existing.getUser();
            if (linked != null) {
                Optional<User> other = userRepository.findByEmailIgnoreCase(formateur.getEmail());
                if (other.isPresent() && !other.get().getId().equals(linked.getId())) {
                    throw new IllegalArgumentException("Cet email est déjà utilisé par un autre compte.");
                }
                linked.setEmail(formateur.getEmail());
                userRepository.save(linked);
            }
            existing.setEmail(formateur.getEmail());
        }

        return formateurRepository.save(existing);
    }

    private String generatePassword() {
        return UUID.randomUUID().toString().replace("-", "").substring(0, 10);
    }
}