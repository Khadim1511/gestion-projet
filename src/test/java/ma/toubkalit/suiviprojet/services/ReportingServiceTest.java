package ma.toubkalit.suiviprojet.services;

import ma.toubkalit.suiviprojet.dto.reporting.TableauDeBordResponse;
import ma.toubkalit.suiviprojet.dto.phase.PhaseResponse;
import ma.toubkalit.suiviprojet.entities.Phase;
import ma.toubkalit.suiviprojet.entities.Projet;
import ma.toubkalit.suiviprojet.repositories.PhaseRepository;
import ma.toubkalit.suiviprojet.repositories.ProjetRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;
import java.util.List;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@DisplayName("Tests unitaires - ReportingService")
class ReportingServiceTest {

    @Mock private PhaseRepository phaseRepo;
    @Mock private ProjetRepository projetRepo;
    @Mock private PhaseService phaseService;

    @InjectMocks private ReportingService reportingService;

    private Phase phaseTerminee;
    private Phase phaseFacturee;
    private Phase phasePayee;
    private Projet projet;

    @BeforeEach
    void setUp() {
        projet = new Projet();
        projet.setId(1);
        projet.setNom("Projet Test");

        phaseTerminee = new Phase();
        phaseTerminee.setId(1);
        phaseTerminee.setCode("PH-001");
        phaseTerminee.setEtatRealisation(true);
        phaseTerminee.setEtatFacturation(false);
        phaseTerminee.setEtatPaiement(false);
        phaseTerminee.setProjet(projet);

        phaseFacturee = new Phase();
        phaseFacturee.setId(2);
        phaseFacturee.setCode("PH-002");
        phaseFacturee.setEtatRealisation(true);
        phaseFacturee.setEtatFacturation(true);
        phaseFacturee.setEtatPaiement(false);
        phaseFacturee.setProjet(projet);

        phasePayee = new Phase();
        phasePayee.setId(3);
        phasePayee.setCode("PH-003");
        phasePayee.setEtatRealisation(true);
        phasePayee.setEtatFacturation(true);
        phasePayee.setEtatPaiement(true);
        phasePayee.setProjet(projet);
    }

    // ===== getPhasesTermineesNonFacturees =====

    @Test
    @DisplayName("getPhasesTermineesNonFacturees() retourne les phases réalisées mais non facturées")
    void getPhasesTermineesNonFacturees_returnsCorrectList() {
        PhaseResponse response = new PhaseResponse();
        response.setId(1);
        response.setCode("PH-001");

        when(phaseRepo.findByEtatRealisationTrueAndEtatFacturationFalse())
                .thenReturn(List.of(phaseTerminee));
        when(phaseService.toResponse(phaseTerminee)).thenReturn(response);

        List<PhaseResponse> result = reportingService.getPhasesTermineesNonFacturees();

        assertThat(result).hasSize(1);
        assertThat(result.get(0).getCode()).isEqualTo("PH-001");
        verify(phaseRepo).findByEtatRealisationTrueAndEtatFacturationFalse();
    }

    @Test
    @DisplayName("getPhasesTermineesNonFacturees() retourne une liste vide si aucune phase concernée")
    void getPhasesTermineesNonFacturees_returnsEmptyList() {
        when(phaseRepo.findByEtatRealisationTrueAndEtatFacturationFalse()).thenReturn(List.of());

        List<PhaseResponse> result = reportingService.getPhasesTermineesNonFacturees();

        assertThat(result).isEmpty();
    }

    // ===== getPhasesFactureesNonPayees =====

    @Test
    @DisplayName("getPhasesFactureesNonPayees() retourne les phases facturées mais non payées")
    void getPhasesFactureesNonPayees_returnsCorrectList() {
        PhaseResponse response = new PhaseResponse();
        response.setId(2);
        response.setCode("PH-002");

        when(phaseRepo.findByEtatFacturationTrueAndEtatPaiementFalse())
                .thenReturn(List.of(phaseFacturee));
        when(phaseService.toResponse(phaseFacturee)).thenReturn(response);

        List<PhaseResponse> result = reportingService.getPhasesFactureesNonPayees();

        assertThat(result).hasSize(1);
        assertThat(result.get(0).getCode()).isEqualTo("PH-002");
    }

    // ===== getPhasesPayees =====

    @Test
    @DisplayName("getPhasesPayees() retourne les phases entièrement payées")
    void getPhasesPayees_returnsCorrectList() {
        PhaseResponse response = new PhaseResponse();
        response.setId(3);
        response.setCode("PH-003");

        when(phaseRepo.findByEtatPaiementTrue()).thenReturn(List.of(phasePayee));
        when(phaseService.toResponse(phasePayee)).thenReturn(response);

        List<PhaseResponse> result = reportingService.getPhasesPayees();

        assertThat(result).hasSize(1);
        assertThat(result.get(0).getCode()).isEqualTo("PH-003");
    }

    // ===== getPhasesTerminesByPeriode =====

    @Test
    @DisplayName("getPhasesTerminesByPeriode() filtre les phases par période")
    void getPhasesTerminesByPeriode_returnsFilteredList() {
        LocalDate debut = LocalDate.of(2024, 1, 1);
        LocalDate fin = LocalDate.of(2024, 6, 30);

        PhaseResponse response = new PhaseResponse();
        response.setId(1);

        when(phaseRepo.findPhasesTerminesByPeriode(debut, fin)).thenReturn(List.of(phaseTerminee));
        when(phaseService.toResponse(phaseTerminee)).thenReturn(response);

        List<PhaseResponse> result = reportingService.getPhasesTerminesByPeriode(debut, fin);

        assertThat(result).hasSize(1);
        verify(phaseRepo).findPhasesTerminesByPeriode(debut, fin);
    }

    @Test
    @DisplayName("getPhasesTerminesByPeriode() retourne liste vide pour une période sans phases")
    void getPhasesTerminesByPeriode_returnsEmptyForPeriodWithNoPhases() {
        LocalDate debut = LocalDate.of(2020, 1, 1);
        LocalDate fin = LocalDate.of(2020, 12, 31);

        when(phaseRepo.findPhasesTerminesByPeriode(debut, fin)).thenReturn(List.of());

        List<PhaseResponse> result = reportingService.getPhasesTerminesByPeriode(debut, fin);

        assertThat(result).isEmpty();
    }

    // ===== getTableauDeBord =====

    @Test
    @DisplayName("getTableauDeBord() retourne les statistiques globales correctes")
    void getTableauDeBord_returnsCorrectStats() {
        when(projetRepo.count()).thenReturn(5L);
        when(projetRepo.findProjetsEnCours()).thenReturn(List.of(projet, projet));
        when(projetRepo.findProjetsClotures()).thenReturn(List.of(projet));
        when(phaseRepo.count()).thenReturn(10L);
        when(phaseRepo.findByEtatRealisationTrue()).thenReturn(List.of(phaseTerminee, phaseFacturee, phasePayee));
        when(phaseRepo.findByEtatRealisationTrueAndEtatFacturationFalse()).thenReturn(List.of(phaseTerminee));
        when(phaseRepo.findByEtatFacturationTrueAndEtatPaiementFalse()).thenReturn(List.of(phaseFacturee));
        when(phaseRepo.findByEtatPaiementTrue()).thenReturn(List.of(phasePayee));

        TableauDeBordResponse result = reportingService.getTableauDeBord();

        assertThat(result.getTotalProjets()).isEqualTo(5L);
        assertThat(result.getProjetsEnCours()).isEqualTo(2);
        assertThat(result.getProjetsClotures()).isEqualTo(1);
        assertThat(result.getTotalPhases()).isEqualTo(10L);
        assertThat(result.getPhasesTerminees()).isEqualTo(3);
        assertThat(result.getPhasesNonFacturees()).isEqualTo(1);
        assertThat(result.getPhasesFactureesNonPayees()).isEqualTo(1);
        assertThat(result.getPhasesPayees()).isEqualTo(1);
    }

    @Test
    @DisplayName("getTableauDeBord() retourne des compteurs à zéro si aucune donnée")
    void getTableauDeBord_returnsZerosWhenNoData() {
        when(projetRepo.count()).thenReturn(0L);
        when(projetRepo.findProjetsEnCours()).thenReturn(List.of());
        when(projetRepo.findProjetsClotures()).thenReturn(List.of());
        when(phaseRepo.count()).thenReturn(0L);
        when(phaseRepo.findByEtatRealisationTrue()).thenReturn(List.of());
        when(phaseRepo.findByEtatRealisationTrueAndEtatFacturationFalse()).thenReturn(List.of());
        when(phaseRepo.findByEtatFacturationTrueAndEtatPaiementFalse()).thenReturn(List.of());
        when(phaseRepo.findByEtatPaiementTrue()).thenReturn(List.of());

        TableauDeBordResponse result = reportingService.getTableauDeBord();

        assertThat(result.getTotalProjets()).isZero();
        assertThat(result.getProjetsEnCours()).isZero();
        assertThat(result.getPhasesPayees()).isZero();
    }
}
