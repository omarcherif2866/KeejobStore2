package com.example.keejobstore.entity;

import com.example.keejobstore.converter.AvantagesFormationConverter;
import com.example.keejobstore.converter.CompetencesFormationConverter;
import com.example.keejobstore.converter.PublicCibleFormationConverter;
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
public class FormationKeejob {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String titre;
    private String badge;
    private String image;                  // URL Cloudinary
    //private String lienBandeAnnonce;
    private String lienFormation;

    @Column(length = 500)
    private String descriptionCourte;

    @Column(length = 2000)
    private String aPropos;


    private String nombreApprenants;

    private String niveau;
    private String duree;
    private String langue;
    private String sousTitres;
    private String acces;
    private String derniereMiseAJour;

    private Double prix;
    private Double prixOriginal;
    private Integer reduction;

    private boolean accesVie;
    private boolean certificatInclus;
    private String garantieRemboursement;

    @Enumerated(EnumType.STRING)
    private CategoryFormationKeejob categoryFormationKeejob;   // ← réintégré, utilisé par la navigation du site

    @Convert(converter = AvantagesFormationConverter.class)
    @Column(columnDefinition = "JSON")
    private List<Avantage> avantages = new ArrayList<>();

    @Convert(converter = CompetencesFormationConverter.class)
    @Column(columnDefinition = "JSON")
    private List<String> competencesAcquises = new ArrayList<>();

    @Convert(converter = PublicCibleFormationConverter.class)
    @Column(columnDefinition = "JSON")
    private List<String> publicCible = new ArrayList<>();

    @ManyToOne
    @JoinColumn(name = "plateforme_id")
    private Plateforme plateforme;

    @OneToMany(mappedBy = "formation", cascade = CascadeType.ALL, orphanRemoval = true)
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