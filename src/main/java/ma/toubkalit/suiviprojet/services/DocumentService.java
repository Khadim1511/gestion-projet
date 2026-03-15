package ma.toubkalit.suiviprojet.services;

import ma.toubkalit.suiviprojet.dto.document.*;
import ma.toubkalit.suiviprojet.entities.*;
import ma.toubkalit.suiviprojet.exceptions.*;
import ma.toubkalit.suiviprojet.repositories.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class DocumentService {

    private final DocumentRepository documentRepo;
    private final ProjetRepository projetRepo;

    public DocumentService(DocumentRepository documentRepo, ProjetRepository projetRepo) {
        this.documentRepo = documentRepo;
        this.projetRepo = projetRepo;
    }

    public List<DocumentResponse> findByProjet(Integer projetId) {
        if (!projetRepo.existsById(projetId)) throw new ResourceNotFoundException("Projet", projetId);
        return documentRepo.findByProjetId(projetId).stream().map(this::toResponse).collect(Collectors.toList());
    }

    public DocumentResponse findById(Integer id) {
        return toResponse(documentRepo.findById(id).orElseThrow(() -> new ResourceNotFoundException("Document", id)));
    }

    public DocumentResponse create(Integer projetId, DocumentRequest req) {
        Projet projet = projetRepo.findById(projetId).orElseThrow(() -> new ResourceNotFoundException("Projet", projetId));
        Document d = new Document();
        d.setCode(req.getCode()); d.setLibelle(req.getLibelle());
        d.setDescription(req.getDescription()); d.setChemin(req.getChemin());
        d.setProjet(projet);
        return toResponse(documentRepo.save(d));
    }

    public DocumentResponse update(Integer id, DocumentRequest req) {
        Document d = documentRepo.findById(id).orElseThrow(() -> new ResourceNotFoundException("Document", id));
        d.setCode(req.getCode()); d.setLibelle(req.getLibelle());
        d.setDescription(req.getDescription()); d.setChemin(req.getChemin());
        return toResponse(documentRepo.save(d));
    }

    public void delete(Integer id) {
        if (!documentRepo.existsById(id)) throw new ResourceNotFoundException("Document", id);
        documentRepo.deleteById(id);
    }

    private DocumentResponse toResponse(Document d) {
        DocumentResponse r = new DocumentResponse();
        r.setId(d.getId()); r.setCode(d.getCode()); r.setLibelle(d.getLibelle());
        r.setDescription(d.getDescription()); r.setChemin(d.getChemin());
        if (d.getProjet() != null) r.setProjetId(d.getProjet().getId());
        return r;
    }
}
