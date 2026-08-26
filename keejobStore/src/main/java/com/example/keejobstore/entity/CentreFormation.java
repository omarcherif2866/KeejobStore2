package com.example.keejobstore.entity;

import com.example.keejobstore.converter.CaracteristiquesConverter;
import com.example.keejobstore.converter.DomainesFormationConverter;
import com.example.keejobstore.converter.FormationsConverter;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.List;

@Setter
@FieldDefaults(level = AccessLevel.PRIVATE)
@Getter
@AllArgsConstructor
@NoArgsConstructor
@Entity
public class CentreFormation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nom;                  // "Tuilab"
    private boolean certifie;             // badge "Certifié"
    private String image;                 // URL de la photo du centre
    private String localisation;          // "Tunis, Tunisie"
    private Double note;                  // 4.8
    private Integer nombreAvis;           // 124

    @Column(length = 1000)
    private String description;           // texte court sous la note

    // Informations de contact
    private String telephone;
    private String email;
    private String siteWeb;
    private String adresse;               // "Centre Urbain Nord, Tunis"

    // Statistiques (15+, 5+, 1200+, 98%)
    private Integer nombreFormations;
    private Integer nombreFormateurs;
    private Integer nombreApprenants;
    private Double tauxSatisfaction;

    @Column(length = 2000)
    private String apropos;               // paragraphe "Fondé en 2018..."

    // ===================================================================
    // ===== Anciennement InformationsPratiques (@Embedded) =====
    // ===== Maintenant : colonnes simples directement dans la classe =====
    // ===================================================================
    private String horaires;              // "Lun - Ven : 8h30 - 17h30"
    private String languesEnseignement;   // "Français, Arabe, Anglais"
    private String modalites;             // "Présentiel, En ligne, Hybride"
    private String certifications;        // "Internationales et reconnues"

    // ===================================================================
    // ===== Anciennement @ElementCollection (tables séparées) =====
    // ===== Maintenant : une seule colonne JSON par liste =====
    // ===================================================================

    @Convert(converter = DomainesFormationConverter.class)
    @Column(columnDefinition = "JSON")
    private List<String> domainesFormation; // Informatique, Développement, Design...

    @Convert(converter = CaracteristiquesConverter.class)
    @Column(columnDefinition = "JSON")
    private List<CaracteristiqueCentre> caracteristiques; // Certifications reconnues, Formateurs experts...

    @Convert(converter = FormationsConverter.class)
    @Column(columnDefinition = "JSON")
    private List<Formation> formations;

    // Relation réelle vers une entité à part entière (pas un sous-objet) :
    // conservée en @OneToMany, chaque Avis a déjà sa propre table/entité.
    @OneToMany(mappedBy = "centre", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Avis> avis;


    // ===================================================================
    // ===== Classes internes (simples POJO sérialisés en JSON, =====
    // ===== ne sont PLUS des @Embeddable) =====
    // ===================================================================

    @Setter
    @Getter
    @AllArgsConstructor
    @NoArgsConstructor
    public static class CaracteristiqueCentre {
        private String icone;       // ex: "shield", "users"
        private String titre;       // "Certifications reconnues"
        private String description; // "Diplômes et certifications internationales"
    }

    @Setter
    @Getter
    @AllArgsConstructor
    @NoArgsConstructor
    public static class Formation {
        private String titre;   // "Développement Web Full Stack"
        private String duree;   // "6 mois"
        private String icone;
    }
}