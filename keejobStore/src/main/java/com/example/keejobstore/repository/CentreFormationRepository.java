package com.example.keejobstore.repository;

import com.example.keejobstore.entity.CentreFormation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CentreFormationRepository extends JpaRepository<CentreFormation, Long> {

    List<CentreFormation> findByCertifieTrue();

    List<CentreFormation> findByLocalisationContainingIgnoreCase(String localisation);

    List<CentreFormation> findByNomContainingIgnoreCase(String nom);

    @Query(value = "SELECT * FROM centre_formation c " +
            "WHERE JSON_SEARCH(LOWER(c.domaines_formation), 'one', LOWER(CONCAT('%', :domaine, '%'))) IS NOT NULL",
            nativeQuery = true)
    List<CentreFormation> findByDomainesFormationContainingIgnoreCase(@Param("domaine") String domaine);
}