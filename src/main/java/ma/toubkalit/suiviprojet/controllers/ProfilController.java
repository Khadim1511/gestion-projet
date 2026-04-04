package ma.toubkalit.suiviprojet.controllers;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import ma.toubkalit.suiviprojet.entities.Profil;
import ma.toubkalit.suiviprojet.repositories.ProfilRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/profils")
@Tag(name = "Profils")
public class ProfilController {

    private final ProfilRepository repository;

    public ProfilController(ProfilRepository repository) {
        this.repository = repository;
    }

    @GetMapping
    @Operation(summary = "Liste tous les profils")
    public ResponseEntity<List<Profil>> findAll() {
        return ResponseEntity.ok(repository.findAll());
    }

    @PostMapping
    @org.springframework.security.access.prepost.PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Crée un nouveau profil")
    public ResponseEntity<Profil> create(@jakarta.validation.Valid @org.springframework.web.bind.annotation.RequestBody Profil profil) {
        return org.springframework.http.ResponseEntity.status(org.springframework.http.HttpStatus.CREATED).body(repository.save(profil));
    }

    @PutMapping("/{id}")
    @org.springframework.security.access.prepost.PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Modifie un profil existant")
    public ResponseEntity<Profil> update(@org.springframework.web.bind.annotation.PathVariable Integer id, @jakarta.validation.Valid @org.springframework.web.bind.annotation.RequestBody Profil profil) {
        if (!repository.existsById(id)) return org.springframework.http.ResponseEntity.notFound().build();
        profil.setId(id);
        return org.springframework.http.ResponseEntity.ok(repository.save(profil));
    }

    @DeleteMapping("/{id}")
    @org.springframework.security.access.prepost.PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Supprime un profil")
    public ResponseEntity<Void> delete(@org.springframework.web.bind.annotation.PathVariable Integer id) {
        if (!repository.existsById(id)) return org.springframework.http.ResponseEntity.notFound().build();
        repository.deleteById(id);
        return org.springframework.http.ResponseEntity.noContent().build();
    }
}
