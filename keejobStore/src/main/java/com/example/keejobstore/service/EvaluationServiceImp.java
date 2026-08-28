package com.example.keejobstore.service;

import com.example.keejobstore.entity.*;
import com.example.keejobstore.entity.Evaluation;
import com.example.keejobstore.repository.EvaluationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;


@RequiredArgsConstructor
@Service
public class EvaluationServiceImp implements EvaluationService{
    
    private final EvaluationRepository evaluationRepository;
    
    @Override
    public Evaluation addEvaluation(Evaluation Evaluations) {
        try {
            return evaluationRepository.save(Evaluations);
        } catch (DataIntegrityViolationException e) {
            // Gérer l'erreur de clé dupliquée ici
            throw new IllegalArgumentException("Erreur lors de l'ajout de l'Evaluation : Cette Evaluations existe déjà.");
        } catch (Exception e) {
            // Gérer les autres exceptions ici
            throw new RuntimeException("Une erreur s'est produite lors du traitement de la demande : " + e.getMessage());
        }
    }

    @Override
    public void deleteEvaluationEntityById(Long id) {
        evaluationRepository.deleteById(id);

    }

    @Override
    public Evaluation getEvaluationById(Long id) {
        return evaluationRepository
                .findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Evaluation not found"));
    }

    @Override
    public List<Evaluation> getAllEvaluations() {
        List<Evaluation> EvaluationsList = evaluationRepository.findAll();
        Set<Evaluation> EvaluationsSet = new HashSet<>(EvaluationsList);

        return new ArrayList<>(EvaluationsSet);  // ✔ maintenant c’est une List
    }

    @Override
    public Evaluation updateEvaluation(Long id, Evaluation newData) {

        Evaluation existingEvaluation = evaluationRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Evaluation not found with id: " + id));

        // 🔹 Mise à jour des champs de base
        if (newData.getName() != null) {
            existingEvaluation.setName(newData.getName());
        }

        if (newData.getDescription() != null) {
            existingEvaluation.setDescription(newData.getDescription());
        }

        if (newData.getImage() != null) {
            existingEvaluation.setImage(newData.getImage());
        }

        if (newData.getLogo() != null) {
            existingEvaluation.setLogo(newData.getLogo());
        }

        // 🔹 Mise à jour de la catégorie d'évaluation
        if (newData.getEvaluationCategory() != null) {
            existingEvaluation.setEvaluationCategory(newData.getEvaluationCategory());
        }

        // 🔹 Mise à jour des sections (avec les icônes)
        if (newData.getSections() != null && !newData.getSections().isEmpty()) {
            existingEvaluation.setSections(newData.getSections());
        }

        // 🔹 Mise à jour des partenaires
//        if (newData.getEvaluationPartenaires() != null) {
//            // Supprimer les anciennes relations
//            existingEvaluation.getEvaluationPartenaires().clear();
//            // Ajouter les nouvelles
//            existingEvaluation.setEvaluationPartenaires(newData.getEvaluationPartenaires());
//        }

        // 🔹 Mise à jour des catalogues
        if (newData.getEvaluationCatalogues() != null) {
            // Supprimer les anciens catalogues (orphanRemoval devrait gérer ça)
            if (existingEvaluation.getEvaluationCatalogues() != null) {
                existingEvaluation.getEvaluationCatalogues().clear();
            }

            // Ajouter les nouveaux catalogues
            for (EvaluationCatalogue catalogue : newData.getEvaluationCatalogues()) {
                catalogue.setEvaluation(existingEvaluation); // Associer au parent
            }
            existingEvaluation.setEvaluationCatalogues(newData.getEvaluationCatalogues());
        }

        // 🔹 Sauvegarder et retourner
        return evaluationRepository.save(existingEvaluation);
    }


    public List<String> getAllCategories() {
        List<Evaluation> evaluations = evaluationRepository.findAll();

        return evaluations.stream()
                .flatMap(eval -> eval.getSections().stream())
                .flatMap(section -> section.getDetails().stream())
                .map(DetailObject::getCategory)
                .filter(category -> category != null && !category.isEmpty())
                .distinct()
                .sorted()
                .collect(Collectors.toList());
    }

    /**
     * Récupère tous les details groupés par catégorie
     */
    public Map<String, List<DetailObject>> getDetailsByCategory() {
        List<Evaluation> evaluations = evaluationRepository.findAll();

        return evaluations.stream()
                .flatMap(eval -> eval.getSections().stream())
                .flatMap(section -> section.getDetails().stream())
                .filter(detail -> detail.getCategory() != null)
                .collect(Collectors.groupingBy(
                        DetailObject::getCategory,
                        Collectors.toList()
                ));
    }

    public List<Evaluation> getEvaluationsByCategory(CategoryEvaluation category) {
        return evaluationRepository.findByEvaluationCategory(category);
    }


}
