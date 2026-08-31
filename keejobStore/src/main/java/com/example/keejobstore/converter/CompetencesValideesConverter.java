package com.example.keejobstore.converter;

import com.fasterxml.jackson.core.type.TypeReference;
import jakarta.persistence.Converter;

import java.util.List;

@Converter
public class CompetencesValideesConverter extends JsonListConverter<String> {
    public CompetencesValideesConverter() {
        super(new TypeReference<List<String>>() {});
    }
}