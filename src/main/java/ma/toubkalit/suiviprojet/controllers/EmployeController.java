package ma.toubkalit.suiviprojet.controllers;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import ma.toubkalit.suiviprojet.dto.employe.*;
import ma.toubkalit.suiviprojet.services.EmployeService;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/employes")
@Tag(name = "Employés")
public class EmployeController {

    private final EmployeService service;

    public EmployeController(EmployeService service) { this.service = service; }

    @GetMapping
    @Operation(summary = "Liste tous les employés")
    public ResponseEntity<List<EmployeResponse>> findAll() {
        return ResponseEntity.ok(service.findAll());
    }

    @GetMapping("/{id}")
    @Operation(summary = "Trouve un employé par ID")
    public ResponseEntity<EmployeResponse> findById(@PathVariable Integer id) {
        return ResponseEntity.ok(service.findById(id));
    }

    @GetMapping("/search")
    @Operation(summary = "Recherche par nom ou prénom")
    public ResponseEntity<List<EmployeResponse>> search(@RequestParam String q) {
        return ResponseEntity.ok(service.search(q));
    }

    @GetMapping("/disponibles")
    @Operation(summary = "Employés disponibles sur une période")
    public ResponseEntity<List<EmployeResponse>> disponibles(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate dateDebut,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate dateFin) {
        return ResponseEntity.ok(service.findDisponibles(dateDebut, dateFin));
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Crée un employé")
    public ResponseEntity<EmployeResponse> create(@Valid @RequestBody EmployeRequest req) {
        return ResponseEntity.status(HttpStatus.CREATED).body(service.create(req));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Modifie un employé")
    public ResponseEntity<EmployeResponse> update(@PathVariable Integer id, @Valid @RequestBody EmployeRequest req) {
        return ResponseEntity.ok(service.update(id, req));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Supprime un employé")
    public ResponseEntity<Void> delete(@PathVariable Integer id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
}
