package ma.toubkalit.suiviprojet.services;

import ma.toubkalit.suiviprojet.dto.phase.*;
import ma.toubkalit.suiviprojet.entities.*;
import ma.toubkalit.suiviprojet.exceptions.*;
import ma.toubkalit.suiviprojet.repositories.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class PhaseService {

    private final PhaseRepository phaseRepo;
    private final ProjetRepository projetRepo;

    public PhaseService(PhaseRepository phaseRepo, ProjetRepository projetRepo) {
        this.phaseRepo = phaseRepo;
        this.projetRepo = projetRepo;
    }

    public List<PhaseResponse> findByProjet(Integer projetId) {
        if (!projetRepo.existsById(projetId)) throw new ResourceNotFoundException("Projet", projetId);
        return phaseRepo.findByProjetId(projetId).stream().map(this::toResponse).collect(Collectors.toList());
    }

    public PhaseResponse findById(Integer id) {
        return toResponse(phaseRepo.findById(id).orElseThrow(() -> new ResourceNotFoundException("Phase", id)));
    }

    public PhaseResponse create(Integer projetId, PhaseRequest req) {
        Projet projet = projetRepo.findById(projetId).orElseThrow(() -> new ResourceNotFoundException("Projet", projetId));
        validerDates(req, projet);
        validerMontant(projetId, req.getMontant(), null);
        Phase ph = new Phase();
        mapToEntity(req, ph, projet);
        return toResponse(phaseRepo.save(ph));
    }

    public PhaseResponse update(Integer id, PhaseRequest req) {
        Phase ph = phaseRepo.findById(id).orElseThrow(() -> new ResourceNotFoundException("Phase", id));
        validerDates(req, ph.getProjet());
        validerMontant(ph.getProjet().getId(), req.getMontant(), id);
        mapToEntity(req, ph, ph.getProjet());
        return toResponse(phaseRepo.save(ph));
    }

    public void delete(Integer id) {
        if (!phaseRepo.existsById(id)) throw new ResourceNotFoundException("Phase", id);
        phaseRepo.deleteById(id);
    }

    public PhaseResponse updateRealisation(Integer id, boolean etat) {
        Phase ph = phaseRepo.findById(id).orElseThrow(() -> new ResourceNotFoundException("Phase", id));
        ph.setEtatRealisation(etat);
        return toResponse(phaseRepo.save(ph));
    }

    public PhaseResponse updateFacturation(Integer id, boolean etat) {
        Phase ph = phaseRepo.findById(id).orElseThrow(() -> new ResourceNotFoundException("Phase", id));
        if (etat && !Boolean.TRUE.equals(ph.getEtatRealisation()))
            throw new BusinessException("La phase doit être réalisée avant d'être facturée");
        ph.setEtatFacturation(etat);
        return toResponse(phaseRepo.save(ph));
    }

    public PhaseResponse updatePaiement(Integer id, boolean etat) {
        Phase ph = phaseRepo.findById(id).orElseThrow(() -> new ResourceNotFoundException("Phase", id));
        if (etat && !Boolean.TRUE.equals(ph.getEtatFacturation()))
            throw new BusinessException("La phase doit être facturée avant d'être payée");
        ph.setEtatPaiement(etat);
        return toResponse(phaseRepo.save(ph));
    }

    private void validerDates(PhaseRequest req, Projet projet) {
        if (req.getDateDebut().isAfter(req.getDateFin()))
            throw new BusinessException("La date de début de la phase est postérieure à sa date de fin");
        if (req.getDateDebut().isBefore(projet.getDateDebut()) || req.getDateFin().isAfter(projet.getDateFin()))
            throw new BusinessException("Les dates de la phase doivent être incluses dans celles du projet ("
                    + projet.getDateDebut() + " → " + projet.getDateFin() + ")");
    }

    private void validerMontant(Integer projetId, Double montantNouveauOuModifie, Integer phaseIdExclure) {
        Projet projet = projetRepo.findById(projetId).orElseThrow();
        Double somme = phaseRepo.sumMontantByProjetId(projetId);
        double total = (somme == null ? 0.0 : somme);
        if (phaseIdExclure != null) {
            Phase existing = phaseRepo.findById(phaseIdExclure).orElse(null);
            if (existing != null) total -= existing.getMontant();
        }
        if (total + montantNouveauOuModifie > projet.getMontant())
            throw new BusinessException("Le montant total des phases (" + (total + montantNouveauOuModifie)
                    + ") dépasse le montant du projet (" + projet.getMontant() + ")");
    }

    private void mapToEntity(PhaseRequest req, Phase ph, Projet projet) {
        ph.setCode(req.getCode()); ph.setLibelle(req.getLibelle());
        ph.setDescription(req.getDescription());
        ph.setDateDebut(req.getDateDebut()); ph.setDateFin(req.getDateFin());
        ph.setMontant(req.getMontant()); ph.setProjet(projet);
    }

    public PhaseResponse toResponse(Phase ph) {
        PhaseResponse r = new PhaseResponse();
        r.setId(ph.getId()); r.setCode(ph.getCode()); r.setLibelle(ph.getLibelle());
        r.setDescription(ph.getDescription());
        r.setDateDebut(ph.getDateDebut()); r.setDateFin(ph.getDateFin());
        r.setMontant(ph.getMontant());
        r.setEtatRealisation(ph.getEtatRealisation());
        r.setEtatFacturation(ph.getEtatFacturation());
        r.setEtatPaiement(ph.getEtatPaiement());
        if (ph.getProjet() != null) {
            r.setProjetId(ph.getProjet().getId());
            r.setProjetNom(ph.getProjet().getNom());
        }
        return r;
    }
}
