package com.example.keejobstore.converter;

import com.fasterxml.jackson.core.type.TypeReference;
import jakarta.persistence.Converter;

import java.util.List;

@Converter
public class DomainesFormationConverter extends JsonListConverter<String> {
    public DomainesFormationConverter() {
        super(new TypeReference<List<String>>() {});
    }
}