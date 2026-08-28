package com.example.keejobstore.converter;

import com.fasterxml.jackson.core.type.TypeReference;
import jakarta.persistence.Converter;

import java.util.List;

@Converter
public class CategoriesPlateformeConverter extends JsonListConverter<String> {
    public CategoriesPlateformeConverter() {
        super(new TypeReference<List<String>>() {});
    }
}