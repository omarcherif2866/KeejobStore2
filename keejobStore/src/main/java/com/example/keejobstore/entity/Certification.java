package com.example.keejobstore.entity;


import com.example.keejobstore.converter.AvantagesCertificationConverter;
import com.example.keejobstore.converter.CompetencesValideesConverter;
import com.example.keejobstore.converter.PublicCibleCertificationConverter;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.ArrayList;
import java.util.List;

@Setter
@FieldDefaults(level = AccessLevel.PRIVATE)
@Getter
@AllArgsConstructor
@NoArgsConstructor
@Entity
public class Certification {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String titre;                  // "Certification Google Ads"
    private String badge;                  // "Officielle" / "Populaire" (nullable)
    private String image;                  // URL Cloudinary
    private String organismeEmetteur;      // "Google", "HubSpot Academy"...
    private String lienCertification;      // lien externe pour passer/obtenir la certification

    @Column(length = 500)
    private String descriptionCourte;

    @Column(length = 2000)
    private String aPropos;


    private String nombreCertifies;        // "50 000+"

    private String niveau;                 // "Débutant à intermédiaire"
    private String dureeExamen;            // "1h30"
    private String dureeValidite;          // "Valide à vie", "3 ans"
    private String langue;
    private String modaliteExamen;         // "En ligne, surveillé"
    private String derniereMiseAJour;

    private Double prix;
    private Double prixOriginal;
    private Integer reduction;

    private Integer scoreMinimum;          // % requis pour réussir (ex: 80)
    private Double tauxReussite;           // % de réussite historique

    private boolean diplomeInclus;
    private String garantieRemboursement;

    @Enumerated(EnumType.STRING)
    private CategoryCertification categoryCertification;

    @Convert(converter = AvantagesCertificationConverter.class)
    @Column(columnDefinition = "JSON")
    private List<Avantage> avantages = new ArrayList<>();

    @Convert(converter = CompetencesValideesConverter.class)
    @Column(columnDefinition = "JSON")
    private List<String> competencesValidees = new ArrayList<>();

    @Convert(converter = PublicCibleCertificationConverter.class)
    @Column(columnDefinition = "JSON")
    private List<String> publicCible = new ArrayList<>();

    @ManyToOne
    @JoinColumn(name = "plateforme_id")
    private Plateforme plateforme;

    @OneToMany(mappedBy = "certification", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore
    private List<Avis> avis = new ArrayList<>();

    @Setter
    @FieldDefaults(level = AccessLevel.PRIVATE)
    @Getter
    @AllArgsConstructor
    @NoArgsConstructor
    public static class Avantage {
        private String titre;
    }
}