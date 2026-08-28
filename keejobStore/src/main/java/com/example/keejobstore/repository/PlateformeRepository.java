package com.example.keejobstore.repository;

import com.example.keejobstore.entity.Plateforme;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface PlateformeRepository extends JpaRepository<Plateforme, Long> {

    List<Plateforme> findByPopulaireTrue();

    @Query("SELECT p FROM Plateforme p WHERE LOWER(p.nom) LIKE LOWER(CONCAT('%', :q, '%'))")
    List<Plateforme> searchByNom(String q);

    List<Plateforme> findAllByOrderByNoteDesc();
}