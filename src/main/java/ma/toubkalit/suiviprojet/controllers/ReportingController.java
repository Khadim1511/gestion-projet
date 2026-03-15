package ma.toubkalit.suiviprojet.controllers;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import ma.toubkalit.suiviprojet.dto.phase.PhaseResponse;
import ma.toubkalit.suiviprojet.dto.reporting.TableauDeBordResponse;
import ma.toubkalit.suiviprojet.services.ReportingService;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/reporting")
@Tag(name = "Reporting")
public class ReportingController {

    private final ReportingService service;

    public ReportingController(ReportingService service) { this.service = service; }

    @GetMapping("/tableau-de-bord")
    @Operation(summary = "Tableau de bord général")
    public ResponseEntity<TableauDeBordResponse> tableauDeBord() {
        return ResponseEntity.ok(service.getTableauDeBord());
    }

    @GetMapping("/phases/terminees-non-facturees")
    @PreAuthorize("hasAnyRole('COMPTA','ADMIN','DIR')")
    @Operation(summary = "Phases terminées mais non facturées")
    public ResponseEntity<List<PhaseResponse>> termineesNonFacturees() {
        return ResponseEntity.ok(service.getPhasesTermineesNonFacturees());
    }

    @GetMapping("/phases/facturees-non-payees")
    @PreAuthorize("hasAnyRole('COMPTA','ADMIN','DIR')")
    @Operation(summary = "Phases facturées mais non payées")
    public ResponseEntity<List<PhaseResponse>> factureesNonPayees() {
        return ResponseEntity.ok(service.getPhasesFactureesNonPayees());
    }

    @GetMapping("/phases/payees")
    @PreAuthorize("hasAnyRole('COMPTA','ADMIN','DIR')")
    @Operation(summary = "Phases payées")
    public ResponseEntity<List<PhaseResponse>> payees() {
        return ResponseEntity.ok(service.getPhasesPayees());
    }

    @GetMapping("/phases/par-periode")
    @PreAuthorize("hasAnyRole('COMPTA','ADMIN','DIR')")
    @Operation(summary = "Phases terminées sur une période")
    public ResponseEntity<List<PhaseResponse>> parPeriode(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate dateDebut,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate dateFin) {
        return ResponseEntity.ok(service.getPhasesTerminesByPeriode(dateDebut, dateFin));
    }
}
