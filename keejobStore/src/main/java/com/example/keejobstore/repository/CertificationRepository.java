package com.example.keejobstore.repository;

import com.example.keejobstore.entity.CategoryCertification;
import com.example.keejobstore.entity.Certification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface CertificationRepository extends JpaRepository<Certification, Long> {

    List<Certification> findByCategoryCertification(CategoryCertification category);

    List<Certification> findByPlateformeId(Long plateformeId);

    @Query("SELECT c FROM Certification c WHERE LOWER(c.titre) LIKE LOWER(CONCAT('%', :q, '%'))")
    List<Certification> searchByTitre(String q);

}