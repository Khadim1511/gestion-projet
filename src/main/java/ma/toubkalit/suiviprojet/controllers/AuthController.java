package ma.toubkalit.suiviprojet.controllers;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import ma.toubkalit.suiviprojet.dto.auth.*;
import ma.toubkalit.suiviprojet.entities.Employe;
import ma.toubkalit.suiviprojet.repositories.EmployeRepository;
import ma.toubkalit.suiviprojet.security.JwtUtils;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.*;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.*;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/auth")
@Tag(name = "Authentification")
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final JwtUtils jwtUtils;
    private final UserDetailsService userDetailsService;
    private final EmployeRepository employeRepository;

    public AuthController(AuthenticationManager authenticationManager,
                          JwtUtils jwtUtils,
                          UserDetailsService userDetailsService,
                          EmployeRepository employeRepository) {
        this.authenticationManager = authenticationManager;
        this.jwtUtils = jwtUtils;
        this.userDetailsService = userDetailsService;
        this.employeRepository = employeRepository;
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
}
