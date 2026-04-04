package ma.toubkalit.suiviprojet.services;

import ma.toubkalit.suiviprojet.dto.projet.ProjetRequest;
import ma.toubkalit.suiviprojet.dto.projet.ProjetResponse;
import ma.toubkalit.suiviprojet.entities.Employe;
import ma.toubkalit.suiviprojet.entities.Organisme;
import ma.toubkalit.suiviprojet.entities.Projet;
import ma.toubkalit.suiviprojet.exceptions.BusinessException;
import ma.toubkalit.suiviprojet.exceptions.ResourceNotFoundException;
import ma.toubkalit.suiviprojet.repositories.EmployeRepository;
import ma.toubkalit.suiviprojet.repositories.OrganismeRepository;
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
@DisplayName("Tests unitaires - ProjetService")
class ProjetServiceTest {

    @Mock private ProjetRepository projetRepo;
    @Mock private OrganismeRepository organismeRepo;
    @Mock private EmployeRepository employeRepo;

    @InjectMocks private ProjetService projetService;

    private Organisme organisme;
    private Employe employe;
    private Projet projet;
    private ProjetRequest request;

    @BeforeEach
    void setUp() {
        organisme = new Organisme();
        organisme.setId(1);
        organisme.setNom("Organisme Test");

        employe = new Employe();
        employe.setId(1);
        employe.setNom("Dupont");
        employe.setPrenom("Jean");

        projet = new Projet();
        projet.setId(1);
        projet.setCode("PRJ-001");
        projet.setNom("Projet Test");
        projet.setDescription("Description de test");
        projet.setDateDebut(LocalDate.of(2024, 1, 1));
        projet.setDateFin(LocalDate.of(2024, 12, 31));
        projet.setMontant(100000.0);
        projet.setOrganisme(organisme);
        projet.setChefProjet(employe);

        request = new ProjetRequest();
        request.setCode("PRJ-001");
        request.setNom("Projet Test");
        request.setDescription("Description de test");
        request.setDateDebut(LocalDate.of(2024, 1, 1));
        request.setDateFin(LocalDate.of(2024, 12, 31));
        request.setMontant(100000.0);
        request.setOrganismeId(1);
        request.setChefProjetId(1);
    }

    // ===== findAll =====

    @Test
    @DisplayName("findAll() retourne la liste de tous les projets")
    void findAll_returnsAllProjets() {
        when(projetRepo.findAll()).thenReturn(List.of(projet));

        List<ProjetResponse> result = projetService.findAll();

        assertThat(result).hasSize(1);
        assertThat(result.get(0).getCode()).isEqualTo("PRJ-001");
        assertThat(result.get(0).getNom()).isEqualTo("Projet Test");
        verify(projetRepo).findAll();
    }

    @Test
    @DisplayName("findAll() retourne une liste vide quand aucun projet n'existe")
    void findAll_returnsEmptyList() {
        when(projetRepo.findAll()).thenReturn(List.of());

        List<ProjetResponse> result = projetService.findAll();

        assertThat(result).isEmpty();
    }

    // ===== findById =====

    @Test
    @DisplayName("findById() retourne le projet correspondant à l'ID")
    void findById_returnsProjet() {
        when(projetRepo.findById(1)).thenReturn(Optional.of(projet));

        ProjetResponse result = projetService.findById(1);

        assertThat(result.getId()).isEqualTo(1);
        assertThat(result.getCode()).isEqualTo("PRJ-001");
        assertThat(result.getOrganismeNom()).isEqualTo("Organisme Test");
        assertThat(result.getChefProjetNom()).isEqualTo("Dupont Jean");
    }

    @Test
    @DisplayName("findById() lève ResourceNotFoundException si le projet n'existe pas")
    void findById_throwsWhenNotFound() {
        when(projetRepo.findById(99)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> projetService.findById(99))
                .isInstanceOf(ResourceNotFoundException.class);
    }

    // ===== search =====

    @Test
    @DisplayName("search() retourne les projets dont le nom contient la chaîne recherchée")
    void search_returnsMatchingProjets() {
        when(projetRepo.findByNomContainingIgnoreCase("Test")).thenReturn(List.of(projet));

        List<ProjetResponse> result = projetService.search("Test");

        assertThat(result).hasSize(1);
        assertThat(result.get(0).getNom()).contains("Test");
    }

    // ===== findEnCours =====

    @Test
    @DisplayName("findEnCours() retourne uniquement les projets en cours")
    void findEnCours_returnsProjetsEnCours() {
        when(projetRepo.findProjetsEnCours()).thenReturn(List.of(projet));

        List<ProjetResponse> result = projetService.findEnCours();

        assertThat(result).hasSize(1);
        verify(projetRepo).findProjetsEnCours();
    }

    // ===== findClotures =====

    @Test
    @DisplayName("findClotures() retourne uniquement les projets clôturés")
    void findClotures_returnsProjetsClotures() {
        when(projetRepo.findProjetsClotures()).thenReturn(List.of(projet));

        List<ProjetResponse> result = projetService.findClotures();

        assertThat(result).hasSize(1);
        verify(projetRepo).findProjetsClotures();
    }

    // ===== create =====

    @Test
    @DisplayName("create() crée et retourne un nouveau projet")
    void create_success() {
        when(projetRepo.existsByCode("PRJ-001")).thenReturn(false);
        when(organismeRepo.findById(1)).thenReturn(Optional.of(organisme));
        when(employeRepo.findById(1)).thenReturn(Optional.of(employe));
        when(projetRepo.save(any(Projet.class))).thenReturn(projet);

        ProjetResponse result = projetService.create(request);

        assertThat(result.getCode()).isEqualTo("PRJ-001");
        assertThat(result.getMontant()).isEqualTo(100000.0);
        verify(projetRepo).save(any(Projet.class));
    }

    @Test
    @DisplayName("create() lève BusinessException si le code projet existe déjà")
    void create_throwsWhenCodeAlreadyExists() {
        when(projetRepo.existsByCode("PRJ-001")).thenReturn(true);

        assertThatThrownBy(() -> projetService.create(request))
                .isInstanceOf(BusinessException.class)
                .hasMessageContaining("PRJ-001");
    }

    @Test
    @DisplayName("create() lève BusinessException si dateDebut est après dateFin")
    void create_throwsWhenDateDebutAfterDateFin() {
        request.setDateDebut(LocalDate.of(2024, 12, 31));
        request.setDateFin(LocalDate.of(2024, 1, 1));

        assertThatThrownBy(() -> projetService.create(request))
                .isInstanceOf(BusinessException.class)
                .hasMessageContaining("date de début");
    }

    @Test
    @DisplayName("create() lève ResourceNotFoundException si l'organisme n'existe pas")
    void create_throwsWhenOrganismeNotFound() {
        when(projetRepo.existsByCode("PRJ-001")).thenReturn(false);
        when(organismeRepo.findById(1)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> projetService.create(request))
                .isInstanceOf(ResourceNotFoundException.class);
    }

    @Test
    @DisplayName("create() fonctionne sans chef de projet (champ optionnel)")
    void create_successWithoutChefProjet() {
        request.setChefProjetId(null);
        when(projetRepo.existsByCode("PRJ-001")).thenReturn(false);
        when(organismeRepo.findById(1)).thenReturn(Optional.of(organisme));
        projet.setChefProjet(null);
        when(projetRepo.save(any(Projet.class))).thenReturn(projet);

        ProjetResponse result = projetService.create(request);

        assertThat(result).isNotNull();
        assertThat(result.getChefProjetId()).isNull();
    }

    // ===== update =====

    @Test
    @DisplayName("update() modifie et retourne le projet mis à jour")
    void update_success() {
        when(projetRepo.findById(1)).thenReturn(Optional.of(projet));
        when(projetRepo.findByCode("PRJ-001")).thenReturn(Optional.of(projet));
        when(organismeRepo.findById(1)).thenReturn(Optional.of(organisme));
        when(employeRepo.findById(1)).thenReturn(Optional.of(employe));
        when(projetRepo.save(any(Projet.class))).thenReturn(projet);

        ProjetResponse result = projetService.update(1, request);

        assertThat(result).isNotNull();
        verify(projetRepo).save(any(Projet.class));
    }

    @Test
    @DisplayName("update() lève ResourceNotFoundException si le projet n'existe pas")
    void update_throwsWhenNotFound() {
        when(projetRepo.findById(99)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> projetService.update(99, request))
                .isInstanceOf(ResourceNotFoundException.class);
    }

    // ===== delete =====

    @Test
    @DisplayName("delete() supprime le projet existant")
    void delete_success() {
        when(projetRepo.existsById(1)).thenReturn(true);

        projetService.delete(1);

        verify(projetRepo).deleteById(1);
    }

    @Test
    @DisplayName("delete() lève ResourceNotFoundException si le projet n'existe pas")
    void delete_throwsWhenNotFound() {
        when(projetRepo.existsById(99)).thenReturn(false);

        assertThatThrownBy(() -> projetService.delete(99))
                .isInstanceOf(ResourceNotFoundException.class);

        verify(projetRepo, never()).deleteById(anyInt());
    }
}
