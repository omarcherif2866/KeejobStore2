package com.example.keejobstore.repository;

import com.example.keejobstore.entity.CategoryFormationKeejob;
import com.example.keejobstore.entity.FormationKeejob;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface FormationKeejobRepository extends JpaRepository<FormationKeejob, Long> {

    List<FormationKeejob> findByCategoryFormationKeejob(CategoryFormationKeejob category);

    List<FormationKeejob> findByPlateformeId(Long plateformeId);

    @Query("SELECT f FROM FormationKeejob f WHERE LOWER(f.titre) LIKE LOWER(CONCAT('%', :q, '%'))")
    List<FormationKeejob> searchByTitre(String q);

}