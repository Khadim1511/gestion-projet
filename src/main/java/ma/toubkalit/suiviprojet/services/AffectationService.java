package ma.toubkalit.suiviprojet.services;

import ma.toubkalit.suiviprojet.dto.affectation.*;
import ma.toubkalit.suiviprojet.entities.*;
import ma.toubkalit.suiviprojet.exceptions.*;
import ma.toubkalit.suiviprojet.repositories.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class AffectationService {

    private final AffectationRepository affectationRepo;
    private final PhaseRepository phaseRepo;
    private final EmployeRepository employeRepo;

    public AffectationService(AffectationRepository affectationRepo, PhaseRepository phaseRepo, EmployeRepository employeRepo) {
        this.affectationRepo = affectationRepo;
        this.phaseRepo = phaseRepo;
        this.employeRepo = employeRepo;
    }

    public List<AffectationResponse> findByPhase(Integer phaseId) {
        return affectationRepo.findByPhaseId(phaseId).stream().map(this::toResponse).collect(Collectors.toList());
    }

    public List<AffectationResponse> findByEmploye(Integer employeId) {
        return affectationRepo.findByEmployeId(employeId).stream().map(this::toResponse).collect(Collectors.toList());
    }

    public AffectationResponse create(Integer phaseId, Integer employeId, AffectationRequest req) {
        Phase phase = phaseRepo.findById(phaseId).orElseThrow(() -> new ResourceNotFoundException("Phase", phaseId));
        Employe employe = employeRepo.findById(employeId).orElseThrow(() -> new ResourceNotFoundException("Employé", employeId));

        AffectationId affId = new AffectationId(employeId, phaseId);
        if (affectationRepo.existsById(affId))
            throw new BusinessException("Cet employé est déjà affecté à cette phase");

        if (req.getDateDebut().isBefore(phase.getDateDebut()) || req.getDateFin().isAfter(phase.getDateFin()))
            throw new BusinessException("Les dates d'affectation doivent être incluses dans celles de la phase");

        if (req.getDateDebut().isAfter(req.getDateFin()))
            throw new BusinessException("La date de début est postérieure à la date de fin");

        Affectation aff = new Affectation();
        aff.setId(affId);
        aff.setEmploye(employe);
        aff.setPhase(phase);
        aff.setDateDebut(req.getDateDebut());
        aff.setDateFin(req.getDateFin());
        return toResponse(affectationRepo.save(aff));
    }

    public AffectationResponse update(Integer phaseId, Integer employeId, AffectationRequest req) {
        Phase phase = phaseRepo.findById(phaseId).orElseThrow(() -> new ResourceNotFoundException("Phase", phaseId));
        AffectationId affId = new AffectationId(employeId, phaseId);
        Affectation aff = affectationRepo.findById(affId).orElseThrow(() -> new ResourceNotFoundException("Affectation non trouvée"));

        if (req.getDateDebut().isBefore(phase.getDateDebut()) || req.getDateFin().isAfter(phase.getDateFin()))
            throw new BusinessException("Les dates d'affectation doivent être incluses dans celles de la phase");

        aff.setDateDebut(req.getDateDebut());
        aff.setDateFin(req.getDateFin());
        return toResponse(affectationRepo.save(aff));
    }

    public void delete(Integer phaseId, Integer employeId) {
        AffectationId affId = new AffectationId(employeId, phaseId);
        if (!affectationRepo.existsById(affId)) throw new ResourceNotFoundException("Affectation non trouvée");
        affectationRepo.deleteById(affId);
    }

    private AffectationResponse toResponse(Affectation a) {
        AffectationResponse r = new AffectationResponse();
        r.setEmployeId(a.getEmploye().getId());
        r.setPhaseId(a.getPhase().getId());
        r.setEmployeNom(a.getEmploye().getNom() + " " + a.getEmploye().getPrenom());
        r.setPhaseLibelle(a.getPhase().getLibelle());
        r.setDateDebut(a.getDateDebut());
        r.setDateFin(a.getDateFin());
        return r;
    }
}
