package com.example.keejobstore.converter;

import com.example.keejobstore.entity.CentreFormation.CaracteristiqueCentre;
import com.fasterxml.jackson.core.type.TypeReference;
import jakarta.persistence.Converter;

import java.util.List;

@Converter
public class CaracteristiquesConverter extends JsonListConverter<CaracteristiqueCentre> {
    public CaracteristiquesConverter() {
        super(new TypeReference<List<CaracteristiqueCentre>>() {});
    }
}