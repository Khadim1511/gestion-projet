package ma.toubkalit.suiviprojet.services;

import ma.toubkalit.suiviprojet.dto.phase.PhaseResponse;
import ma.toubkalit.suiviprojet.dto.reporting.TableauDeBordResponse;
import ma.toubkalit.suiviprojet.repositories.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional(readOnly = true)
public class ReportingService {

    private final PhaseRepository phaseRepo;
    private final ProjetRepository projetRepo;
    private final PhaseService phaseService;
    private final OrganismeRepository organismeRepo;
    private final EmployeRepository employeRepo;

    public ReportingService(PhaseRepository phaseRepo,
                            ProjetRepository projetRepo,
                            PhaseService phaseService,
                            OrganismeRepository organismeRepo,
                            EmployeRepository employeRepo) {
        this.phaseRepo = phaseRepo;
        this.projetRepo = projetRepo;
        this.phaseService = phaseService;
        this.organismeRepo = organismeRepo;
        this.employeRepo = employeRepo;
    }

    public List<PhaseResponse> getPhasesTermineesNonFacturees() {
        return phaseRepo.findByEtatRealisationTrueAndEtatFacturationFalse()
                .stream().map(phaseService::toResponse).collect(Collectors.toList());
    }

    public List<PhaseResponse> getPhasesFactureesNonPayees() {
        return phaseRepo.findByEtatFacturationTrueAndEtatPaiementFalse()
                .stream().map(phaseService::toResponse).collect(Collectors.toList());
    }

    public List<PhaseResponse> getPhasesPayees() {
        return phaseRepo.findByEtatPaiementTrue()
                .stream().map(phaseService::toResponse).collect(Collectors.toList());
    }

    public List<PhaseResponse> getPhasesTerminesByPeriode(LocalDate dateDebut, LocalDate dateFin) {
        return phaseRepo.findPhasesTerminesByPeriode(dateDebut, dateFin)
                .stream().map(phaseService::toResponse).collect(Collectors.toList());
    }

    public TableauDeBordResponse getTableauDeBord() {
        TableauDeBordResponse tb = new TableauDeBordResponse();
        
        // Frontend expected fields (counts)
        tb.setCountProjets(projetRepo.count());
        tb.setCountProjetsEnCours(projetRepo.findProjetsEnCours().size());
        tb.setCountProjetsClotures(projetRepo.findProjetsClotures().size());
        tb.setCountPhases(phaseRepo.count());
        tb.setCountOrganismes(organismeRepo.count());
        tb.setCountEmployes(employeRepo.count());
        
        Double totalMontant = projetRepo.sumTotalMontant();
        tb.setTotalMontant(totalMontant != null ? totalMontant : 0.0);

        // Individual phase states
        tb.setPhasesTerminees(phaseRepo.findByEtatRealisationTrue().size());
        tb.setPhasesNonFacturees(phaseRepo.findByEtatRealisationTrueAndEtatFacturationFalse().size());
        tb.setPhasesFactureesNonPayees(phaseRepo.findByEtatFacturationTrueAndEtatPaiementFalse().size());
        tb.setPhasesPayees(phaseRepo.findByEtatPaiementTrue().size());
        
        return tb;
    }
}
