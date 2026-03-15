package ma.toubkalit.suiviprojet.controllers;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import ma.toubkalit.suiviprojet.dto.document.*;
import ma.toubkalit.suiviprojet.services.DocumentService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@Tag(name = "Documents")
public class DocumentController {

    private final DocumentService service;

    public DocumentController(DocumentService service) { this.service = service; }

    @GetMapping("/api/projets/{projetId}/documents")
    @Operation(summary = "Liste les documents d'un projet")
    public ResponseEntity<List<DocumentResponse>> findByProjet(@PathVariable Integer projetId) {
        return ResponseEntity.ok(service.findByProjet(projetId));
    }

    @GetMapping("/api/documents/{id}")
    public ResponseEntity<DocumentResponse> findById(@PathVariable Integer id) {
        return ResponseEntity.ok(service.findById(id));
    }

    @PostMapping("/api/projets/{projetId}/documents")
    @PreAuthorize("hasAnyRole('CP','SEC','ADMIN','DIR')")
    public ResponseEntity<DocumentResponse> create(@PathVariable Integer projetId, @Valid @RequestBody DocumentRequest req) {
        return ResponseEntity.status(HttpStatus.CREATED).body(service.create(projetId, req));
    }

    @PutMapping("/api/documents/{id}")
    @PreAuthorize("hasAnyRole('CP','SEC','ADMIN','DIR')")
    public ResponseEntity<DocumentResponse> update(@PathVariable Integer id, @Valid @RequestBody DocumentRequest req) {
        return ResponseEntity.ok(service.update(id, req));
    }

    @DeleteMapping("/api/documents/{id}")
    @PreAuthorize("hasAnyRole('ADMIN','DIR')")
    public ResponseEntity<Void> delete(@PathVariable Integer id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
}
