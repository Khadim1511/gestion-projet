package ma.toubkalit.suiviprojet.controllers;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import ma.toubkalit.suiviprojet.dto.projet.*;
import ma.toubkalit.suiviprojet.services.ProjetService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/projets")
@Tag(name = "Projets")
public class ProjetController {

    private final ProjetService service;

    public ProjetController(ProjetService service) { this.service = service; }

    @GetMapping
    @Operation(summary = "Liste tous les projets")
    public ResponseEntity<List<ProjetResponse>> findAll() {
        return ResponseEntity.ok(service.findAll());
    }

    @GetMapping("/{id}")
    @Operation(summary = "Trouve un projet par ID")
    public ResponseEntity<ProjetResponse> findById(@PathVariable Integer id) {
        return ResponseEntity.ok(service.findById(id));
    }

    @GetMapping("/search")
    @Operation(summary = "Recherche par nom")
    public ResponseEntity<List<ProjetResponse>> search(@RequestParam String nom) {
        return ResponseEntity.ok(service.search(nom));
    }

    @GetMapping("/en-cours")
    @Operation(summary = "Projets en cours")
    public ResponseEntity<List<ProjetResponse>> enCours() {
        return ResponseEntity.ok(service.findEnCours());
    }

    @GetMapping("/clotures")
    @Operation(summary = "Projets clôturés")
    public ResponseEntity<List<ProjetResponse>> clotures() {
        return ResponseEntity.ok(service.findClotures());
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('SEC','ADMIN','DIR')")
    @Operation(summary = "Crée un projet")
    public ResponseEntity<ProjetResponse> create(@Valid @RequestBody ProjetRequest req) {
        return ResponseEntity.status(HttpStatus.CREATED).body(service.create(req));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('SEC','ADMIN','DIR','CP')")
    @Operation(summary = "Modifie un projet")
    public ResponseEntity<ProjetResponse> update(@PathVariable Integer id, @Valid @RequestBody ProjetRequest req) {
        return ResponseEntity.ok(service.update(id, req));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN','DIR')")
    @Operation(summary = "Supprime un projet")
    public ResponseEntity<Void> delete(@PathVariable Integer id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
}
