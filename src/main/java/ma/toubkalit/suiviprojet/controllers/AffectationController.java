package ma.toubkalit.suiviprojet.controllers;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import ma.toubkalit.suiviprojet.dto.affectation.*;
import ma.toubkalit.suiviprojet.services.AffectationService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@Tag(name = "Affectations")
public class AffectationController {

    private final AffectationService service;

    public AffectationController(AffectationService service) { this.service = service; }

    @GetMapping("/api/phases/{phaseId}/employes")
    @Operation(summary = "Employés affectés à une phase")
    public ResponseEntity<List<AffectationResponse>> findByPhase(@PathVariable Integer phaseId) {
        return ResponseEntity.ok(service.findByPhase(phaseId));
    }

    @GetMapping("/api/employes/{employeId}/phases")
    @Operation(summary = "Phases d'un employé")
    public ResponseEntity<List<AffectationResponse>> findByEmploye(@PathVariable Integer employeId) {
        return ResponseEntity.ok(service.findByEmploye(employeId));
    }

    @PostMapping("/api/phases/{phaseId}/employes/{employeId}")
    @PreAuthorize("hasAnyRole('CP','ADMIN','DIR')")
    @Operation(summary = "Affecte un employé à une phase")
    public ResponseEntity<AffectationResponse> create(
            @PathVariable Integer phaseId,
            @PathVariable Integer employeId,
            @Valid @RequestBody AffectationRequest req) {
        return ResponseEntity.status(HttpStatus.CREATED).body(service.create(phaseId, employeId, req));
    }

    @PutMapping("/api/phases/{phaseId}/employes/{employeId}")
    @PreAuthorize("hasAnyRole('CP','ADMIN','DIR')")
    @Operation(summary = "Modifie une affectation")
    public ResponseEntity<AffectationResponse> update(
            @PathVariable Integer phaseId,
            @PathVariable Integer employeId,
            @Valid @RequestBody AffectationRequest req) {
        return ResponseEntity.ok(service.update(phaseId, employeId, req));
    }

    @DeleteMapping("/api/phases/{phaseId}/employes/{employeId}")
    @PreAuthorize("hasAnyRole('CP','ADMIN','DIR')")
    @Operation(summary = "Supprime une affectation")
    public ResponseEntity<Void> delete(@PathVariable Integer phaseId, @PathVariable Integer employeId) {
        service.delete(phaseId, employeId);
        return ResponseEntity.noContent().build();
    }
}
