package ma.toubkalit.suiviprojet.controllers;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import ma.toubkalit.suiviprojet.dto.auth.*;
import ma.toubkalit.suiviprojet.entities.Employe;
import ma.toubkalit.suiviprojet.entities.PasswordResetToken;
import ma.toubkalit.suiviprojet.repositories.EmployeRepository;
import ma.toubkalit.suiviprojet.repositories.PasswordResetTokenRepository;
import ma.toubkalit.suiviprojet.security.JwtUtils;
import ma.toubkalit.suiviprojet.services.EmailService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.*;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.*;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;
import java.util.Optional;
import java.util.UUID;

@RestController
@RequestMapping("/api/auth")
@Tag(name = "Authentification")
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final JwtUtils jwtUtils;
    private final UserDetailsService userDetailsService;
    private final EmployeRepository employeRepository;
    private final EmailService emailService;
    private final PasswordResetTokenRepository tokenRepository;
    private final PasswordEncoder passwordEncoder;

    public AuthController(AuthenticationManager authenticationManager,
                          JwtUtils jwtUtils,
                          UserDetailsService userDetailsService,
                          EmployeRepository employeRepository,
                          EmailService emailService,
                          PasswordResetTokenRepository tokenRepository,
                          PasswordEncoder passwordEncoder) {
        this.authenticationManager = authenticationManager;
        this.jwtUtils = jwtUtils;
        this.userDetailsService = userDetailsService;
        this.employeRepository = employeRepository;
        this.emailService = emailService;
        this.tokenRepository = tokenRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @PostMapping("/login")
    @Operation(summary = "Connexion - obtenir un token JWT")
    public ResponseEntity<LoginResponse> login(@Valid @RequestBody LoginRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getLogin(), request.getPassword())
        );
        UserDetails userDetails = userDetailsService.loadUserByUsername(request.getLogin());
        String token = jwtUtils.generateToken(userDetails);

        Employe employe = employeRepository.findByLogin(request.getLogin()).orElseThrow();

        LoginResponse response = new LoginResponse(
                token,
                employe.getLogin(),
                employe.getNom(),
                employe.getPrenom(),
                employe.getProfil().getCode()
        );
        return ResponseEntity.ok(response);
    }

    @GetMapping("/me")
    @Operation(summary = "Informations de l'utilisateur connecté")
    public ResponseEntity<Employe> me(Authentication auth) {
        return employeRepository.findByLogin(auth.getName())
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/forgot-password")
    @Operation(summary = "Demande de réinitialisation de mot de passe")
    public ResponseEntity<?> forgotPassword(@Valid @RequestBody ForgotPasswordRequest request) {
        Optional<Employe> employeOpt = employeRepository.findByEmail(request.getEmail());
        if (employeOpt.isEmpty()) {
            // Pour la sécurité, on ne dit pas si l'email existe ou pas
            return ResponseEntity.ok().build();
        }

        Employe employe = employeOpt.get();
        // Supprimer l'ancien token s'il existe
        tokenRepository.findByEmploye(employe).ifPresent(tokenRepository::delete);

        String token = UUID.randomUUID().toString();
        PasswordResetToken resetToken = new PasswordResetToken(token, employe);
        tokenRepository.save(resetToken);

        try {
            String resetUrl = "http://localhost:5173/reset-password?token=" + token;
            emailService.sendResetPasswordEmail(employe.getEmail(), resetUrl);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Erreur lors de l'envoi de l'email");
        }

        return ResponseEntity.ok().build();
    }

    @PostMapping("/reset-password")
    @Operation(summary = "Réinitialisation du mot de passe avec token")
    public ResponseEntity<?> resetPassword(@Valid @RequestBody ResetPasswordRequest request) {
        Optional<PasswordResetToken> tokenOpt = tokenRepository.findByToken(request.getToken());

        if (tokenOpt.isEmpty() || tokenOpt.get().isExpired()) {
            return ResponseEntity.badRequest().body("Token invalide ou expiré");
        }

        PasswordResetToken resetToken = tokenOpt.get();
        Employe employe = resetToken.getEmploye();
        employe.setPassword(passwordEncoder.encode(request.getNewPassword()));
        employeRepository.save(employe);

        tokenRepository.delete(resetToken);

        return ResponseEntity.ok().build();
    }
}
