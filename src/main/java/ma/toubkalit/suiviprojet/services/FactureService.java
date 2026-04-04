package ma.toubkalit.suiviprojet.services;

import ma.toubkalit.suiviprojet.dto.document.DocumentRequest;
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
    private final PdfGeneratorService pdfService;
    private final FileStorageService storageService;
    private final DocumentService documentService;

    public FactureService(FactureRepository factureRepo, 
                          PhaseRepository phaseRepo,
                          PdfGeneratorService pdfService,
                          FileStorageService storageService,
                          DocumentService documentService) {
        this.factureRepo = factureRepo;
        this.phaseRepo = phaseRepo;
        this.pdfService = pdfService;
        this.storageService = storageService;
        this.documentService = documentService;
    }

    public List<FactureResponse> findAll() {
        return factureRepo.findAll().stream().map(this::toResponse).collect(Collectors.toList());
    }

    public FactureResponse findById(Integer id) {
        return toResponse(factureRepo.findById(id).orElseThrow(() -> new ResourceNotFoundException("Facture", id)));
    }

    public FactureResponse create(Integer phaseId, FactureRequest req) {
        Phase phase = phaseRepo.findById(phaseId).orElseThrow(() -> new ResourceNotFoundException("Phase", phaseId));
        // Note: Check on etatRealisation was removed to allow flexible invoicing (advances, etc).
        if (factureRepo.existsByPhaseId(phaseId))
            throw new BusinessException("Cette phase est déjà facturée");
        if (factureRepo.findByCode(req.getCode()).isPresent())
            throw new BusinessException("Une facture avec ce code existe déjà");

        Facture f = new Facture();
        f.setCode(req.getCode());
        f.setDateFacture(req.getDateFacture());
        f.setPhase(phase);
        
        Facture saved = factureRepo.save(f);
        
        // Finalize phase state
        phase.setEtatFacturation(true);
        phaseRepo.save(phase);

        // Generate PDF and save to storage
        byte[] pdfBytes = pdfService.generateFacturePdf(saved);
        String filename = "facture_" + saved.getCode() + ".pdf";
        String path = storageService.save(pdfBytes, filename);
        
        // Update facture with path
        saved.setChemin(path);
        factureRepo.save(saved);

        // Automatically create a Document entry for the project
        DocumentRequest docReq = new DocumentRequest();
        docReq.setCode(saved.getCode());
        docReq.setLibelle("Facture " + saved.getCode());
        docReq.setDescription("Facture générée automatiquement pour la phase: " + phase.getLibelle());
        docReq.setChemin(path);
        documentService.create(phase.getProjet().getId(), docReq);

        return toResponse(saved);
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
        r.setChemin(f.getChemin());
        if (f.getPhase() != null) {
            r.setPhaseId(f.getPhase().getId());
            r.setPhaseLibelle(f.getPhase().getLibelle());
            r.setMontant(f.getPhase().getMontant());
        }
        return r;
    }
}
