package com.example.keejobstore.converter;

import com.example.keejobstore.entity.FormationKeejob.Avantage;
import com.fasterxml.jackson.core.type.TypeReference;
import jakarta.persistence.Converter;

import java.util.List;

@Converter
public class AvantagesFormationConverter extends JsonListConverter<Avantage> {
    public AvantagesFormationConverter() {
        super(new TypeReference<List<Avantage>>() {});
    }
}