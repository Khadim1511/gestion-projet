package ma.toubkalit.suiviprojet.controllers;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import ma.toubkalit.suiviprojet.dto.organisme.*;
import ma.toubkalit.suiviprojet.services.OrganismeService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/organismes")
@Tag(name = "Organismes")
public class OrganismeController {

    private final OrganismeService service;

    public OrganismeController(OrganismeService service) { this.service = service; }

    @GetMapping
    @Operation(summary = "Liste tous les organismes")
    public ResponseEntity<List<OrganismeResponse>> findAll() {
        return ResponseEntity.ok(service.findAll());
    }

    @GetMapping("/{id}")
    @Operation(summary = "Trouve un organisme par ID")
    public ResponseEntity<OrganismeResponse> findById(@PathVariable Integer id) {
        return ResponseEntity.ok(service.findById(id));
    }

    @GetMapping("/search")
    @Operation(summary = "Recherche par nom")
    public ResponseEntity<List<OrganismeResponse>> search(@RequestParam String nom) {
        return ResponseEntity.ok(service.search(nom));
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('SEC','ADMIN','DIR')")
    @Operation(summary = "Crée un organisme")
    public ResponseEntity<OrganismeResponse> create(@Valid @RequestBody OrganismeRequest req) {
        return ResponseEntity.status(HttpStatus.CREATED).body(service.create(req));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('SEC','ADMIN','DIR')")
    @Operation(summary = "Modifie un organisme")
    public ResponseEntity<OrganismeResponse> update(@PathVariable Integer id, @Valid @RequestBody OrganismeRequest req) {
        return ResponseEntity.ok(service.update(id, req));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Supprime un organisme")
    public ResponseEntity<Void> delete(@PathVariable Integer id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
}
