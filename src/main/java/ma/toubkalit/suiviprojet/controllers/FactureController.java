package ma.toubkalit.suiviprojet.controllers;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import ma.toubkalit.suiviprojet.dto.facture.*;
import ma.toubkalit.suiviprojet.services.FactureService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@Tag(name = "Factures")
public class FactureController {

    private final FactureService service;

    public FactureController(FactureService service) { this.service = service; }

    @GetMapping("/api/factures")
    @Operation(summary = "Liste toutes les factures")
    public ResponseEntity<List<FactureResponse>> findAll() {
        return ResponseEntity.ok(service.findAll());
    }

    @GetMapping("/api/factures/{id}")
    public ResponseEntity<FactureResponse> findById(@PathVariable Integer id) {
        return ResponseEntity.ok(service.findById(id));
    }

    @PostMapping("/api/phases/{phaseId}/facture")
    @PreAuthorize("hasAnyRole('COMPTA','ADMIN')")
    @Operation(summary = "Facture une phase terminée")
    public ResponseEntity<FactureResponse> create(@PathVariable Integer phaseId, @Valid @RequestBody FactureRequest req) {
        return ResponseEntity.status(HttpStatus.CREATED).body(service.create(phaseId, req));
    }

    @PutMapping("/api/factures/{id}")
    @PreAuthorize("hasAnyRole('COMPTA','ADMIN')")
    public ResponseEntity<FactureResponse> update(@PathVariable Integer id, @Valid @RequestBody FactureRequest req) {
        return ResponseEntity.ok(service.update(id, req));
    }

    @DeleteMapping("/api/factures/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> delete(@PathVariable Integer id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
}
