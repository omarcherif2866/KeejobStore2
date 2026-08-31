package com.example.keejobstore.converter;

import com.example.keejobstore.entity.Certification.Avantage;
import com.fasterxml.jackson.core.type.TypeReference;
import jakarta.persistence.Converter;

import java.util.List;

@Converter
public class AvantagesCertificationConverter extends JsonListConverter<Avantage> {
    public AvantagesCertificationConverter() {
        super(new TypeReference<List<Avantage>>() {});
    }
}