package ma.toubkalit.suiviprojet.services;

import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;

@Service
public class EmailService {

    private final JavaMailSender mailSender;

    public EmailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    public void sendResetPasswordEmail(String to, String resetUrl) throws MessagingException {
        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

        helper.setTo(to);
        helper.setSubject("Réinitialisation de votre mot de passe - SuiviProjet");

        String content = "<h3>Bonjour,</h3>"
                + "<p>Vous avez demandé la réinitialisation de votre mot de passe pour votre compte SuiviProjet.</p>"
                + "<p>Veuillez cliquer sur le lien ci-dessous pour procéder :</p>"
                + "<p><a href=\"" + resetUrl + "\"><b>Réinitialiser mon mot de passe</b></a></p>"
                + "<br>"
                + "<p>Ce lien est valable pendant 24 heures. Si vous n'avez pas demandé cette action, vous pouvez ignorer cet email.</p>"
                + "<p>L'équipe SuiviProjet</p>";

        helper.setText(content, true);
        mailSender.send(message);
    }
}
