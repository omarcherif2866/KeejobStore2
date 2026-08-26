package com.example.keejobstore.converter;

import com.example.keejobstore.entity.CentreFormation.Formation;
import com.fasterxml.jackson.core.type.TypeReference;
import jakarta.persistence.Converter;

import java.util.List;

@Converter
public class FormationsConverter extends JsonListConverter<Formation> {
    public FormationsConverter() {
        super(new TypeReference<List<Formation>>() {});
    }
}