package com.example.keejobstore.entity;

import com.example.keejobstore.converter.CategoriesPlateformeConverter;
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
public class Plateforme {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nom;                    // "Udemy"
    private String logo;                   // URL Cloudinary
    private boolean populaire;

    private Double note;                   // 4.6
    private String nombreAvis;             // "72k"
    private String nombreApprenants;       // "62M+"

    @Column(length = 500)
    private String description;

    private String siteWeb;
    private String imageIllustration;      // URL Cloudinary — grande image page détail

    @Convert(converter = CategoriesPlateformeConverter.class)
    @Column(columnDefinition = "JSON")
    private List<String> categories = new ArrayList<>();

    @OneToMany(mappedBy = "plateforme", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore
    private List<FormationKeejob> formations = new ArrayList<>();
}