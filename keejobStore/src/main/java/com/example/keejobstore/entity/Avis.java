package com.example.keejobstore.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDate;

@Setter
@FieldDefaults(level = AccessLevel.PRIVATE)
@Getter
@AllArgsConstructor
@NoArgsConstructor
@Entity
public class Avis {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nomAuteur;   // "Yassine K."
    private String poste;       // "Développeur Web"
    private Integer note;       // 1 à 5

    @Column(length = 1000)
    private String commentaire;

    private LocalDate date;

    @ManyToOne
    @JoinColumn(name = "centre_id")
    @JsonIgnore
    private CentreFormation centre;
}