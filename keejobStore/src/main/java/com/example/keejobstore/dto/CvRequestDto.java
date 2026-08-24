package com.example.keejobstore.dto;

public class CvRequestDto {
    private String fullname;
    private String email;
    private String whatsapp;
    private String serviceName; // ← ajout

    public CvRequestDto(String fullname, String email, String whatsapp, String serviceName) {
        this.fullname = fullname;
        this.email = email;
        this.whatsapp = whatsapp;
        this.serviceName = serviceName;
    }

    public String getFullname() { return fullname; }
    public String getEmail() { return email; }
    public String getWhatsapp() { return whatsapp; }
    public String getServiceName() { return serviceName; }
}
