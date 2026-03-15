package ma.toubkalit.suiviprojet.services;

import ma.toubkalit.suiviprojet.dto.organisme.*;
import ma.toubkalit.suiviprojet.entities.Organisme;
import ma.toubkalit.suiviprojet.exceptions.*;
import ma.toubkalit.suiviprojet.repositories.OrganismeRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class OrganismeService {

    private final OrganismeRepository repo;

    public OrganismeService(OrganismeRepository repo) { this.repo = repo; }

    public List<OrganismeResponse> findAll() {
        return repo.findAll().stream().map(this::toResponse).collect(Collectors.toList());
    }

    public OrganismeResponse findById(Integer id) {
        return toResponse(repo.findById(id).orElseThrow(() -> new ResourceNotFoundException("Organisme", id)));
    }

    public List<OrganismeResponse> search(String nom) {
        return repo.findByNomContainingIgnoreCase(nom).stream().map(this::toResponse).collect(Collectors.toList());
    }

    public OrganismeResponse create(OrganismeRequest req) {
        if (repo.findByCode(req.getCode()).isPresent())
            throw new BusinessException("Un organisme avec le code '" + req.getCode() + "' existe déjà");
        Organisme o = new Organisme();
        mapToEntity(req, o);
        return toResponse(repo.save(o));
    }

    public OrganismeResponse update(Integer id, OrganismeRequest req) {
        Organisme o = repo.findById(id).orElseThrow(() -> new ResourceNotFoundException("Organisme", id));
        repo.findByCode(req.getCode()).ifPresent(existing -> {
            if (!existing.getId().equals(id))
                throw new BusinessException("Code déjà utilisé par un autre organisme");
        });
        mapToEntity(req, o);
        return toResponse(repo.save(o));
    }

    public void delete(Integer id) {
        if (!repo.existsById(id)) throw new ResourceNotFoundException("Organisme", id);
        repo.deleteById(id);
    }

    private void mapToEntity(OrganismeRequest req, Organisme o) {
        o.setCode(req.getCode()); o.setNom(req.getNom());
        o.setAdresse(req.getAdresse()); o.setTelephone(req.getTelephone());
        o.setNomContact(req.getNomContact()); o.setEmailContact(req.getEmailContact());
        o.setSiteWeb(req.getSiteWeb());
    }

    private OrganismeResponse toResponse(Organisme o) {
        OrganismeResponse r = new OrganismeResponse();
        r.setId(o.getId()); r.setCode(o.getCode()); r.setNom(o.getNom());
        r.setAdresse(o.getAdresse()); r.setTelephone(o.getTelephone());
        r.setNomContact(o.getNomContact()); r.setEmailContact(o.getEmailContact());
        r.setSiteWeb(o.getSiteWeb());
        return r;
    }
}
