package com.example.keejobstore.repository;

import com.example.keejobstore.entity.Formateur;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface FormateurRepository extends JpaRepository<Formateur,Long > {
    Optional<Formateur> findByUserId(Integer userId);
    Optional<Formateur> findByEmailIgnoreCaseAndUserIsNull(String email);   // formateur existant pas encore lié
    boolean existsByEmailIgnoreCase(String email);

}
