package com.example.keejobstore.dto;

import com.example.keejobstore.entity.Formateur;

public record FormateurCreationResult(Formateur formateur, String temporaryPassword) {}