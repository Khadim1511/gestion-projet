package ma.toubkalit.suiviprojet.services;

import ma.toubkalit.suiviprojet.dto.phase.PhaseRequest;
import ma.toubkalit.suiviprojet.dto.phase.PhaseResponse;
import ma.toubkalit.suiviprojet.entities.Phase;
import ma.toubkalit.suiviprojet.entities.Projet;
import ma.toubkalit.suiviprojet.exceptions.BusinessException;
import ma.toubkalit.suiviprojet.exceptions.ResourceNotFoundException;
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
import java.util.Optional;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@DisplayName("Tests unitaires - PhaseService")
class PhaseServiceTest {

    @Mock private PhaseRepository phaseRepo;
    @Mock private ProjetRepository projetRepo;

    @InjectMocks private PhaseService phaseService;

    private Projet projet;
    private Phase phase;
    private PhaseRequest request;

    @BeforeEach
    void setUp() {
        projet = new Projet();
        projet.setId(1);
        projet.setNom("Projet Test");
        projet.setDateDebut(LocalDate.of(2024, 1, 1));
        projet.setDateFin(LocalDate.of(2024, 12, 31));
        projet.setMontant(100000.0);

        phase = new Phase();
        phase.setId(1);
        phase.setCode("PH-001");
        phase.setLibelle("Phase 1");
        phase.setDateDebut(LocalDate.of(2024, 1, 1));
        phase.setDateFin(LocalDate.of(2024, 6, 30));
        phase.setMontant(40000.0);
        phase.setEtatRealisation(false);
        phase.setEtatFacturation(false);
        phase.setEtatPaiement(false);
        phase.setProjet(projet);

        request = new PhaseRequest();
        request.setCode("PH-001");
        request.setLibelle("Phase 1");
        request.setDateDebut(LocalDate.of(2024, 1, 1));
        request.setDateFin(LocalDate.of(2024, 6, 30));
        request.setMontant(40000.0);
    }

    // ===== findByProjet =====

    @Test
    @DisplayName("findByProjet() retourne les phases d'un projet existant")
    void findByProjet_success() {
        when(projetRepo.existsById(1)).thenReturn(true);
        when(phaseRepo.findByProjetId(1)).thenReturn(List.of(phase));

        List<PhaseResponse> result = phaseService.findByProjet(1);

        assertThat(result).hasSize(1);
        assertThat(result.get(0).getCode()).isEqualTo("PH-001");
    }

    @Test
    @DisplayName("findByProjet() lève ResourceNotFoundException si le projet n'existe pas")
    void findByProjet_throwsWhenProjetNotFound() {
        when(projetRepo.existsById(99)).thenReturn(false);

        assertThatThrownBy(() -> phaseService.findByProjet(99))
                .isInstanceOf(ResourceNotFoundException.class);
    }

    // ===== findById =====

    @Test
    @DisplayName("findById() retourne la phase correspondante")
    void findById_success() {
        when(phaseRepo.findById(1)).thenReturn(Optional.of(phase));

        PhaseResponse result = phaseService.findById(1);

        assertThat(result.getId()).isEqualTo(1);
        assertThat(result.getLibelle()).isEqualTo("Phase 1");
    }

    @Test
    @DisplayName("findById() lève ResourceNotFoundException si la phase n'existe pas")
    void findById_throwsWhenNotFound() {
        when(phaseRepo.findById(99)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> phaseService.findById(99))
                .isInstanceOf(ResourceNotFoundException.class);
    }

    // ===== create =====

    @Test
    @DisplayName("create() crée et retourne une nouvelle phase")
    void create_success() {
        when(projetRepo.findById(1)).thenReturn(Optional.of(projet));
        when(phaseRepo.sumMontantByProjetId(1)).thenReturn(0.0);
        when(phaseRepo.save(any(Phase.class))).thenReturn(phase);

        PhaseResponse result = phaseService.create(1, request);

        assertThat(result.getCode()).isEqualTo("PH-001");
        assertThat(result.getMontant()).isEqualTo(40000.0);
        verify(phaseRepo).save(any(Phase.class));
    }

    @Test
    @DisplayName("create() lève BusinessException si dateDebut de la phase est après dateFin")
    void create_throwsWhenDateDebutAfterDateFin() {
        when(projetRepo.findById(1)).thenReturn(Optional.of(projet));
        request.setDateDebut(LocalDate.of(2024, 7, 1));
        request.setDateFin(LocalDate.of(2024, 1, 1));

        assertThatThrownBy(() -> phaseService.create(1, request))
                .isInstanceOf(BusinessException.class)
                .hasMessageContaining("date de début");
    }

    @Test
    @DisplayName("create() lève BusinessException si les dates dépassent celles du projet")
    void create_throwsWhenDatesOutsideProjet() {
        when(projetRepo.findById(1)).thenReturn(Optional.of(projet));
        request.setDateDebut(LocalDate.of(2023, 1, 1)); // avant le projet
        request.setDateFin(LocalDate.of(2024, 6, 30));

        assertThatThrownBy(() -> phaseService.create(1, request))
                .isInstanceOf(BusinessException.class)
                .hasMessageContaining("dates de la phase");
    }

    @Test
    @DisplayName("create() lève BusinessException si le montant total des phases dépasse celui du projet")
    void create_throwsWhenMontantDepasse() {
        when(projetRepo.findById(1)).thenReturn(Optional.of(projet));
        when(phaseRepo.sumMontantByProjetId(1)).thenReturn(80000.0); // déjà 80k sur 100k
        request.setMontant(30000.0); // 80k + 30k = 110k > 100k

        assertThatThrownBy(() -> phaseService.create(1, request))
                .isInstanceOf(BusinessException.class)
                .hasMessageContaining("montant total des phases");
    }

    // ===== updateRealisation =====

    @Test
    @DisplayName("updateRealisation() passe la phase à réalisée")
    void updateRealisation_setTrue() {
        when(phaseRepo.findById(1)).thenReturn(Optional.of(phase));
        phase.setEtatRealisation(true);
        when(phaseRepo.save(any(Phase.class))).thenReturn(phase);

        PhaseResponse result = phaseService.updateRealisation(1, true);

        assertThat(result.getEtatRealisation()).isTrue();
    }

    // ===== updateFacturation =====

    @Test
    @DisplayName("updateFacturation() réussit si la phase est réalisée")
    void updateFacturation_successWhenRealisee() {
        phase.setEtatRealisation(true);
        when(phaseRepo.findById(1)).thenReturn(Optional.of(phase));
        phase.setEtatFacturation(true);
        when(phaseRepo.save(any(Phase.class))).thenReturn(phase);

        PhaseResponse result = phaseService.updateFacturation(1, true);

        assertThat(result.getEtatFacturation()).isTrue();
    }

    @Test
    @DisplayName("updateFacturation() lève BusinessException si la phase n'est pas réalisée")
    void updateFacturation_throwsWhenNotRealisee() {
        phase.setEtatRealisation(false);
        when(phaseRepo.findById(1)).thenReturn(Optional.of(phase));

        assertThatThrownBy(() -> phaseService.updateFacturation(1, true))
                .isInstanceOf(BusinessException.class)
                .hasMessageContaining("réalisée avant d'être facturée");
    }

    // ===== updatePaiement =====

    @Test
    @DisplayName("updatePaiement() réussit si la phase est facturée")
    void updatePaiement_successWhenFacturee() {
        phase.setEtatRealisation(true);
        phase.setEtatFacturation(true);
        when(phaseRepo.findById(1)).thenReturn(Optional.of(phase));
        phase.setEtatPaiement(true);
        when(phaseRepo.save(any(Phase.class))).thenReturn(phase);

        PhaseResponse result = phaseService.updatePaiement(1, true);

        assertThat(result.getEtatPaiement()).isTrue();
    }

    @Test
    @DisplayName("updatePaiement() lève BusinessException si la phase n'est pas facturée")
    void updatePaiement_throwsWhenNotFacturee() {
        phase.setEtatFacturation(false);
        when(phaseRepo.findById(1)).thenReturn(Optional.of(phase));

        assertThatThrownBy(() -> phaseService.updatePaiement(1, true))
                .isInstanceOf(BusinessException.class)
                .hasMessageContaining("facturée avant d'être payée");
    }

    // ===== delete =====

    @Test
    @DisplayName("delete() supprime la phase existante")
    void delete_success() {
        when(phaseRepo.existsById(1)).thenReturn(true);

        phaseService.delete(1);

        verify(phaseRepo).deleteById(1);
    }

    @Test
    @DisplayName("delete() lève ResourceNotFoundException si la phase n'existe pas")
    void delete_throwsWhenNotFound() {
        when(phaseRepo.existsById(99)).thenReturn(false);

        assertThatThrownBy(() -> phaseService.delete(99))
                .isInstanceOf(ResourceNotFoundException.class);

        verify(phaseRepo, never()).deleteById(anyInt());
    }
}
