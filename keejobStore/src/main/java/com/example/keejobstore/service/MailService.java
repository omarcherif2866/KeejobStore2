package com.example.keejobstore.service;

import com.example.keejobstore.dto.CvRequestDto;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import java.io.IOException;

@Service
public class MailService {

    private final JavaMailSender mailSender;

    @Value("${spring.mail.username}")
    private String senderEmail;

    public MailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    public void sendCvRequest(CvRequestDto request, MultipartFile cvFile) throws MessagingException, IOException {

        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

        helper.setFrom(senderEmail);
        helper.setTo(senderEmail); // le compte qui envoie reçoit aussi les demandes
        helper.setSubject("Nouvelle demande de CV - " + request.getFullname());

        String htmlContent = buildEmailContent(request);
        helper.setText(htmlContent, true);

        if (cvFile != null && !cvFile.isEmpty()) {
            helper.addAttachment(cvFile.getOriginalFilename(), cvFile);
        }

        mailSender.send(message);
    }

    private String buildEmailContent(CvRequestDto request) {
        return """
            <html>
              <body style="font-family: Arial, sans-serif; color: #1e2749;">
                <h2 style="color: #5958A0;">Nouvelle demande de CV</h2>
                <p><strong>Nom :</strong> %s</p>
                <p><strong>Email :</strong> %s</p>
                <p><strong>WhatsApp :</strong> %s</p>
                <hr>
                <p style="font-size: 12px; color: #6b7280;">
                  Ce message a été envoyé automatiquement depuis le formulaire du site marketjob.tn
                </p>
              </body>
            </html>
            """.formatted(request.getFullname(), request.getEmail(), request.getWhatsapp());
    }
}