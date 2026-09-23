package com.example.keejobstore.dto;
import lombok.Data;

@Data
public class ContactRequest {
    private String nom;
    private String prenom;
    private String email;
    private String sujet;
    private String phone;
    private String message;
}