package ma.toubkalit.suiviprojet.services;

import ma.toubkalit.suiviprojet.dto.facture.*;
import ma.toubkalit.suiviprojet.entities.*;
import ma.toubkalit.suiviprojet.exceptions.*;
import ma.toubkalit.suiviprojet.repositories.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class FactureService {

    private final FactureRepository factureRepo;
    private final PhaseRepository phaseRepo;

    public FactureService(FactureRepository factureRepo, PhaseRepository phaseRepo) {
        this.factureRepo = factureRepo;
        this.phaseRepo = phaseRepo;
    }

    public List<FactureResponse> findAll() {
        return factureRepo.findAll().stream().map(this::toResponse).collect(Collectors.toList());
    }

    public FactureResponse findById(Integer id) {
        return toResponse(factureRepo.findById(id).orElseThrow(() -> new ResourceNotFoundException("Facture", id)));
    }

    public FactureResponse create(Integer phaseId, FactureRequest req) {
        Phase phase = phaseRepo.findById(phaseId).orElseThrow(() -> new ResourceNotFoundException("Phase", phaseId));
        if (!Boolean.TRUE.equals(phase.getEtatRealisation()))
            throw new BusinessException("La phase doit être terminée avant d'être facturée");
        if (factureRepo.existsByPhaseId(phaseId))
            throw new BusinessException("Cette phase est déjà facturée");
        if (factureRepo.findByCode(req.getCode()).isPresent())
            throw new BusinessException("Une facture avec ce code existe déjà");

        Facture f = new Facture();
        f.setCode(req.getCode());
        f.setDateFacture(req.getDateFacture());
        f.setPhase(phase);
        phase.setEtatFacturation(true);
        phaseRepo.save(phase);
        return toResponse(factureRepo.save(f));
    }

    public FactureResponse update(Integer id, FactureRequest req) {
        Facture f = factureRepo.findById(id).orElseThrow(() -> new ResourceNotFoundException("Facture", id));
        factureRepo.findByCode(req.getCode()).ifPresent(ex -> {
            if (!ex.getId().equals(id)) throw new BusinessException("Code facture déjà utilisé");
        });
        f.setCode(req.getCode());
        f.setDateFacture(req.getDateFacture());
        return toResponse(factureRepo.save(f));
    }

    public void delete(Integer id) {
        if (!factureRepo.existsById(id)) throw new ResourceNotFoundException("Facture", id);
        factureRepo.deleteById(id);
    }

    private FactureResponse toResponse(Facture f) {
        FactureResponse r = new FactureResponse();
        r.setId(f.getId()); r.setCode(f.getCode());
        r.setDateFacture(f.getDateFacture());
        if (f.getPhase() != null) {
            r.setPhaseId(f.getPhase().getId());
            r.setPhaseLibelle(f.getPhase().getLibelle());
            r.setMontant(f.getPhase().getMontant());
        }
        return r;
    }
}
