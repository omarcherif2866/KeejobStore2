package com.example.keejobstore.service;

import com.example.keejobstore.entity.Avis;
import com.example.keejobstore.entity.CentreFormation;
import com.example.keejobstore.entity.FormationKeejob;
import com.example.keejobstore.repository.AvisRepository;
import com.example.keejobstore.repository.CentreFormationRepository;
import com.example.keejobstore.repository.FormationKeejobRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@RequiredArgsConstructor
@Service
public class AvisServiceImpl implements AvisService {

    private final AvisRepository avisRepository;
    private final CentreFormationRepository centreFormationRepository;
    private final FormationKeejobRepository formationKeejobRepository;


    @Override
    public List<Avis> getAllAvis() {
        return avisRepository.findAll();
    }

    @Override
    public List<Avis> getAvisByCentreId(Long centreId) {
        return avisRepository.findByCentreId(centreId);
    }

    @Override
    public Avis getAvisById(Long id) {
        return avisRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Avis introuvable avec l'id : " + id));
    }

    @Override
    public Avis createAvis(Long centreId, Avis avis) {
        CentreFormation centre = centreFormationRepository.findById(centreId)
                .orElseThrow(() -> new EntityNotFoundException("Centre de formation introuvable avec l'id : " + centreId));

        avis.setCentre(centre);
        return avisRepository.save(avis);
    }

    @Override
    public Avis updateAvis(Long id, Avis avisDetails) {
        Avis avis = getAvisById(id);

        avis.setNomAuteur(avisDetails.getNomAuteur());
        avis.setPoste(avisDetails.getPoste());
        avis.setNote(avisDetails.getNote());
        avis.setCommentaire(avisDetails.getCommentaire());
        avis.setDate(avisDetails.getDate());

        return avisRepository.save(avis);
    }

    @Override
    public void deleteAvis(Long id) {
        Avis avis = getAvisById(id);
        avisRepository.delete(avis);
    }

    // AvisServiceImp.java (exemple)
    @Override
    public List<Avis> getAvisByFormationId(Long formationId) {
        return avisRepository.findByFormationId(formationId);
    }

    @Override
    public Avis createAvisForFormation(Long formationId, Avis avis) {
        FormationKeejob formation = formationKeejobRepository.findById(formationId)
                .orElseThrow(() -> new RuntimeException("Formation non trouvée avec l'id : " + formationId));

        avis.setFormation(formation);
        avis.setDate(LocalDate.now()); // si vous voulez fixer la date côté serveur

        return avisRepository.save(avis);
    }
}
