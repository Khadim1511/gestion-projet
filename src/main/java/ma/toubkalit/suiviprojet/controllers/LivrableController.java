package ma.toubkalit.suiviprojet.controllers;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import ma.toubkalit.suiviprojet.dto.livrable.*;
import ma.toubkalit.suiviprojet.services.LivrableService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@Tag(name = "Livrables")
public class LivrableController {

    private final LivrableService service;

    public LivrableController(LivrableService service) { this.service = service; }

    @GetMapping("/api/phases/{phaseId}/livrables")
    @Operation(summary = "Liste les livrables d'une phase")
    public ResponseEntity<List<LivrableResponse>> findByPhase(@PathVariable Integer phaseId) {
        return ResponseEntity.ok(service.findByPhase(phaseId));
    }

    @GetMapping("/api/livrables/{id}")
    public ResponseEntity<LivrableResponse> findById(@PathVariable Integer id) {
        return ResponseEntity.ok(service.findById(id));
    }

    @PostMapping("/api/phases/{phaseId}/livrables")
    @PreAuthorize("hasAnyRole('CP','ADMIN','DIR')")
    public ResponseEntity<LivrableResponse> create(@PathVariable Integer phaseId, @Valid @RequestBody LivrableRequest req) {
        return ResponseEntity.status(HttpStatus.CREATED).body(service.create(phaseId, req));
    }

    @PutMapping("/api/livrables/{id}")
    @PreAuthorize("hasAnyRole('CP','ADMIN','DIR')")
    public ResponseEntity<LivrableResponse> update(@PathVariable Integer id, @Valid @RequestBody LivrableRequest req) {
        return ResponseEntity.ok(service.update(id, req));
    }

    @DeleteMapping("/api/livrables/{id}")
    @PreAuthorize("hasAnyRole('CP','ADMIN','DIR')")
    public ResponseEntity<Void> delete(@PathVariable Integer id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
}
