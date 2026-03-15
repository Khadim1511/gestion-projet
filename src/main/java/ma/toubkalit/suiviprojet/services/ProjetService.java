package ma.toubkalit.suiviprojet.services;

import ma.toubkalit.suiviprojet.dto.projet.*;
import ma.toubkalit.suiviprojet.entities.*;
import ma.toubkalit.suiviprojet.exceptions.*;
import ma.toubkalit.suiviprojet.repositories.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class ProjetService {

    private final ProjetRepository projetRepo;
    private final OrganismeRepository organismeRepo;
    private final EmployeRepository employeRepo;

    public ProjetService(ProjetRepository projetRepo, OrganismeRepository organismeRepo, EmployeRepository employeRepo) {
        this.projetRepo = projetRepo;
        this.organismeRepo = organismeRepo;
        this.employeRepo = employeRepo;
    }

    public List<ProjetResponse> findAll() {
        return projetRepo.findAll().stream().map(this::toResponse).collect(Collectors.toList());
    }

    public ProjetResponse findById(Integer id) {
        return toResponse(projetRepo.findById(id).orElseThrow(() -> new ResourceNotFoundException("Projet", id)));
    }

    public List<ProjetResponse> search(String nom) {
        return projetRepo.findByNomContainingIgnoreCase(nom).stream().map(this::toResponse).collect(Collectors.toList());
    }

    public List<ProjetResponse> findEnCours() {
        return projetRepo.findProjetsEnCours().stream().map(this::toResponse).collect(Collectors.toList());
    }

    public List<ProjetResponse> findClotures() {
        return projetRepo.findProjetsClotures().stream().map(this::toResponse).collect(Collectors.toList());
    }

    public ProjetResponse create(ProjetRequest req) {
        validerDates(req);
        if (projetRepo.existsByCode(req.getCode()))
            throw new BusinessException("Un projet avec le code '" + req.getCode() + "' existe déjà");
        Projet p = new Projet();
        mapToEntity(req, p);
        return toResponse(projetRepo.save(p));
    }

    public ProjetResponse update(Integer id, ProjetRequest req) {
        validerDates(req);
        Projet p = projetRepo.findById(id).orElseThrow(() -> new ResourceNotFoundException("Projet", id));
        projetRepo.findByCode(req.getCode()).ifPresent(ex -> {
            if (!ex.getId().equals(id)) throw new BusinessException("Code projet déjà utilisé");
        });
        mapToEntity(req, p);
        return toResponse(projetRepo.save(p));
    }

    public void delete(Integer id) {
        if (!projetRepo.existsById(id)) throw new ResourceNotFoundException("Projet", id);
        projetRepo.deleteById(id);
    }

    private void validerDates(ProjetRequest req) {
        if (req.getDateDebut() != null && req.getDateFin() != null
                && req.getDateDebut().isAfter(req.getDateFin()))
            throw new BusinessException("La date de début ne peut pas être postérieure à la date de fin");
    }

    private void mapToEntity(ProjetRequest req, Projet p) {
        p.setCode(req.getCode()); p.setNom(req.getNom());
        p.setDescription(req.getDescription());
        p.setDateDebut(req.getDateDebut()); p.setDateFin(req.getDateFin());
        p.setMontant(req.getMontant());
        Organisme org = organismeRepo.findById(req.getOrganismeId())
                .orElseThrow(() -> new ResourceNotFoundException("Organisme", req.getOrganismeId()));
        p.setOrganisme(org);
        if (req.getChefProjetId() != null) {
            Employe chef = employeRepo.findById(req.getChefProjetId())
                    .orElseThrow(() -> new ResourceNotFoundException("Employé", req.getChefProjetId()));
            p.setChefProjet(chef);
        } else {
            p.setChefProjet(null);
        }
    }

    public ProjetResponse toResponse(Projet p) {
        ProjetResponse r = new ProjetResponse();
        r.setId(p.getId()); r.setCode(p.getCode()); r.setNom(p.getNom());
        r.setDescription(p.getDescription());
        r.setDateDebut(p.getDateDebut()); r.setDateFin(p.getDateFin());
        r.setMontant(p.getMontant());
        if (p.getOrganisme() != null) {
            r.setOrganismeId(p.getOrganisme().getId());
            r.setOrganismeNom(p.getOrganisme().getNom());
        }
        if (p.getChefProjet() != null) {
            r.setChefProjetId(p.getChefProjet().getId());
            r.setChefProjetNom(p.getChefProjet().getNom() + " " + p.getChefProjet().getPrenom());
        }
        return r;
    }
}
