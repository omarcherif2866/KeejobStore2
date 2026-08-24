package com.example.keejobstore.service;

import com.example.keejobstore.dto.CvRequestDto;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;

@Service
public class MailService {

    private final JavaMailSender mailSender;

    @Value("${spring.mail.username}")
    private String senderEmail;

    public MailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    @Async
    public void sendCvRequest(CvRequestDto request, byte[] fileBytes, String fileName) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setFrom(senderEmail);
            helper.setTo(senderEmail);
            helper.setReplyTo(request.getEmail());
            helper.setSubject("Nouvelle demande - " + request.getServiceName() + " - " + request.getFullname());

            String htmlContent = buildEmailContent(request);
            helper.setText(htmlContent, true);

            if (fileBytes != null && fileBytes.length > 0) {
                helper.addAttachment(fileName, new ByteArrayResource(fileBytes));
            }

            mailSender.send(message);

        } catch (MessagingException e) {
            System.err.println("Erreur lors de l'envoi de l'email CV request: " + e.getMessage());
        } catch (Exception e) {
            System.err.println("Erreur inattendue lors de l'envoi de l'email: " + e.getMessage());
        }
    }

    private String buildEmailContent(CvRequestDto request) {
        return """
                <html>
                  <body style="font-family: Arial, sans-serif; color: #1e2749;">
                    <h2 style="color: #5958A0;">Nouvelle demande</h2>
                    <p><strong>Service demandé :</strong> %s</p>
                    <p><strong>Nom :</strong> %s</p>
                    <p><strong>Email :</strong> %s</p>
                    <p><strong>WhatsApp :</strong> %s</p>
                    <hr>
                    <p style="font-size: 12px; color: #6b7280;">
                      Ce message a été envoyé automatiquement depuis le formulaire du site marketjob.tn
                    </p>
                  </body>
                </html>
                """.formatted(request.getServiceName(), request.getFullname(), request.getEmail(), request.getWhatsapp());
    }
}