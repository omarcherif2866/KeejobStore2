package com.example.keejobstore.converter;

import com.fasterxml.jackson.core.type.TypeReference;
import jakarta.persistence.Converter;

import java.util.List;

@Converter
public class CompetencesFormationConverter extends JsonListConverter<String> {
    public CompetencesFormationConverter() {
        super(new TypeReference<List<String>>() {});
    }
}