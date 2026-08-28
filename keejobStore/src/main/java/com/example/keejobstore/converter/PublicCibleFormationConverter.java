package com.example.keejobstore.converter;

import com.fasterxml.jackson.core.type.TypeReference;
import jakarta.persistence.Converter;

import java.util.List;

@Converter
public class PublicCibleFormationConverter extends JsonListConverter<String> {
    public PublicCibleFormationConverter() {
        super(new TypeReference<List<String>>() {});
    }
}