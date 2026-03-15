package ma.toubkalit.suiviprojet.controllers;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import ma.toubkalit.suiviprojet.dto.phase.*;
import ma.toubkalit.suiviprojet.services.PhaseService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@Tag(name = "Phases")
public class PhaseController {

    private final PhaseService service;

    public PhaseController(PhaseService service) { this.service = service; }

    @GetMapping("/api/projets/{projetId}/phases")
    @Operation(summary = "Liste les phases d'un projet")
    public ResponseEntity<List<PhaseResponse>> findByProjet(@PathVariable Integer projetId) {
        return ResponseEntity.ok(service.findByProjet(projetId));
    }

    @GetMapping("/api/phases/{id}")
    @Operation(summary = "Trouve une phase par ID")
    public ResponseEntity<PhaseResponse> findById(@PathVariable Integer id) {
        return ResponseEntity.ok(service.findById(id));
    }

    @PostMapping("/api/projets/{projetId}/phases")
    @PreAuthorize("hasAnyRole('CP','ADMIN','DIR')")
    @Operation(summary = "Crée une phase dans un projet")
    public ResponseEntity<PhaseResponse> create(@PathVariable Integer projetId, @Valid @RequestBody PhaseRequest req) {
        return ResponseEntity.status(HttpStatus.CREATED).body(service.create(projetId, req));
    }

    @PutMapping("/api/phases/{id}")
    @PreAuthorize("hasAnyRole('CP','ADMIN','DIR')")
    @Operation(summary = "Modifie une phase")
    public ResponseEntity<PhaseResponse> update(@PathVariable Integer id, @Valid @RequestBody PhaseRequest req) {
        return ResponseEntity.ok(service.update(id, req));
    }

    @DeleteMapping("/api/phases/{id}")
    @PreAuthorize("hasAnyRole('ADMIN','DIR')")
    @Operation(summary = "Supprime une phase")
    public ResponseEntity<Void> delete(@PathVariable Integer id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/api/phases/{id}/realisation")
    @PreAuthorize("hasAnyRole('CP','ADMIN','DIR')")
    @Operation(summary = "Met à jour l'état de réalisation")
    public ResponseEntity<PhaseResponse> updateRealisation(@PathVariable Integer id, @RequestParam boolean etat) {
        return ResponseEntity.ok(service.updateRealisation(id, etat));
    }

    @PatchMapping("/api/phases/{id}/facturation")
    @PreAuthorize("hasAnyRole('COMPTA','ADMIN')")
    @Operation(summary = "Met à jour l'état de facturation")
    public ResponseEntity<PhaseResponse> updateFacturation(@PathVariable Integer id, @RequestParam boolean etat) {
        return ResponseEntity.ok(service.updateFacturation(id, etat));
    }

    @PatchMapping("/api/phases/{id}/paiement")
    @PreAuthorize("hasAnyRole('COMPTA','ADMIN')")
    @Operation(summary = "Met à jour l'état de paiement")
    public ResponseEntity<PhaseResponse> updatePaiement(@PathVariable Integer id, @RequestParam boolean etat) {
        return ResponseEntity.ok(service.updatePaiement(id, etat));
    }
}
