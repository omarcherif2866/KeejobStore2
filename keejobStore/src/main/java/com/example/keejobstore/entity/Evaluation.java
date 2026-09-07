package com.example.keejobstore.entity;


import com.example.keejobstore.converter.EvaluationSectionListConverter;
import com.example.keejobstore.converter.PriceConverter;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.ArrayList;
import java.util.List;

@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Entity
public class Evaluation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Setter(AccessLevel.NONE)
    long id;

    private String name;
    private String logo;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(columnDefinition = "JSON")
    @Convert(converter = EvaluationSectionListConverter.class)
    private List<EvaluationSection> sections = new ArrayList<>();

    private String image;

    @Enumerated(EnumType.STRING)
    private CategoryEvaluation evaluationCategory ;

    @Column(columnDefinition = "JSON")
    @Convert(converter = PriceConverter.class)
    private List<PriceSection> priceSections = new ArrayList<>();

    @OneToMany(mappedBy = "evaluation", cascade = CascadeType.ALL, fetch = FetchType.EAGER, orphanRemoval = true)
    private List<EvaluationCatalogue> evaluationCatalogues = new ArrayList<>();

    @OneToMany(mappedBy = "evaluation", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore
    private List<Avis> avis = new ArrayList<>();


}
