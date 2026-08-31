package com.example.keejobstore.converter;

import com.fasterxml.jackson.core.type.TypeReference;
import jakarta.persistence.Converter;

import java.util.List;

@Converter
public class PublicCibleCertificationConverter extends JsonListConverter<String> {
    public PublicCibleCertificationConverter() {
        super(new TypeReference<List<String>>() {});
    }
}