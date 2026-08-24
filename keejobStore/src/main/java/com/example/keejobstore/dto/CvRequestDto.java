package com.example.keejobstore.dto;

public class CvRequestDto {

    private String fullname;
    private String email;
    private String whatsapp;

    public CvRequestDto() {}

    public CvRequestDto(String fullname, String email, String whatsapp) {
        this.fullname = fullname;
        this.email = email;
        this.whatsapp = whatsapp;
    }

    public String getFullname() { return fullname; }
    public void setFullname(String fullname) { this.fullname = fullname; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getWhatsapp() { return whatsapp; }
    public void setWhatsapp(String whatsapp) { this.whatsapp = whatsapp; }
}
