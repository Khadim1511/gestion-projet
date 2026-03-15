package ma.toubkalit.suiviprojet.services;

import ma.toubkalit.suiviprojet.dto.livrable.*;
import ma.toubkalit.suiviprojet.entities.*;
import ma.toubkalit.suiviprojet.exceptions.*;
import ma.toubkalit.suiviprojet.repositories.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class LivrableService {

    private final LivrableRepository livrableRepo;
    private final PhaseRepository phaseRepo;

    public LivrableService(LivrableRepository livrableRepo, PhaseRepository phaseRepo) {
        this.livrableRepo = livrableRepo;
        this.phaseRepo = phaseRepo;
    }

    public List<LivrableResponse> findByPhase(Integer phaseId) {
        if (!phaseRepo.existsById(phaseId)) throw new ResourceNotFoundException("Phase", phaseId);
        return livrableRepo.findByPhaseId(phaseId).stream().map(this::toResponse).collect(Collectors.toList());
    }

    public LivrableResponse findById(Integer id) {
        return toResponse(livrableRepo.findById(id).orElseThrow(() -> new ResourceNotFoundException("Livrable", id)));
    }

    public LivrableResponse create(Integer phaseId, LivrableRequest req) {
        Phase phase = phaseRepo.findById(phaseId).orElseThrow(() -> new ResourceNotFoundException("Phase", phaseId));
        Livrable l = new Livrable();
        l.setCode(req.getCode()); l.setLibelle(req.getLibelle());
        l.setDescription(req.getDescription()); l.setChemin(req.getChemin());
        l.setPhase(phase);
        return toResponse(livrableRepo.save(l));
    }

    public LivrableResponse update(Integer id, LivrableRequest req) {
        Livrable l = livrableRepo.findById(id).orElseThrow(() -> new ResourceNotFoundException("Livrable", id));
        l.setCode(req.getCode()); l.setLibelle(req.getLibelle());
        l.setDescription(req.getDescription()); l.setChemin(req.getChemin());
        return toResponse(livrableRepo.save(l));
    }

    public void delete(Integer id) {
        if (!livrableRepo.existsById(id)) throw new ResourceNotFoundException("Livrable", id);
        livrableRepo.deleteById(id);
    }

    private LivrableResponse toResponse(Livrable l) {
        LivrableResponse r = new LivrableResponse();
        r.setId(l.getId()); r.setCode(l.getCode()); r.setLibelle(l.getLibelle());
        r.setDescription(l.getDescription()); r.setChemin(l.getChemin());
        if (l.getPhase() != null) r.setPhaseId(l.getPhase().getId());
        return r;
    }
}
