package ma.toubkalit.suiviprojet.services;

import ma.toubkalit.suiviprojet.dto.employe.*;
import ma.toubkalit.suiviprojet.entities.*;
import ma.toubkalit.suiviprojet.exceptions.*;
import ma.toubkalit.suiviprojet.repositories.*;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class EmployeService {

    private final EmployeRepository employeRepo;
    private final ProfilRepository profilRepo;
    private final PasswordEncoder encoder;

    public EmployeService(EmployeRepository employeRepo, ProfilRepository profilRepo, PasswordEncoder encoder) {
        this.employeRepo = employeRepo;
        this.profilRepo = profilRepo;
        this.encoder = encoder;
    }

    public List<EmployeResponse> findAll() {
        return employeRepo.findAll().stream().map(this::toResponse).collect(Collectors.toList());
    }

    public EmployeResponse findById(Integer id) {
        return toResponse(employeRepo.findById(id).orElseThrow(() -> new ResourceNotFoundException("Employé", id)));
    }

    public List<EmployeResponse> search(String q) {
        return employeRepo.findByNomContainingIgnoreCaseOrPrenomContainingIgnoreCase(q, q)
                .stream().map(this::toResponse).collect(Collectors.toList());
    }

    public List<EmployeResponse> findDisponibles(LocalDate dateDebut, LocalDate dateFin) {
        return employeRepo.findDisponibles(dateDebut, dateFin)
                .stream().map(this::toResponse).collect(Collectors.toList());
    }

    public EmployeResponse create(EmployeRequest req) {
        if (employeRepo.findByMatricule(req.getMatricule()).isPresent())
            throw new BusinessException("Matricule '" + req.getMatricule() + "' déjà utilisé");
        if (employeRepo.findByLogin(req.getLogin()).isPresent())
            throw new BusinessException("Login '" + req.getLogin() + "' déjà utilisé");
        Profil profil = profilRepo.findById(req.getProfilId())
                .orElseThrow(() -> new ResourceNotFoundException("Profil", req.getProfilId()));
        Employe e = new Employe();
        mapToEntity(req, e, profil);
        e.setPassword(encoder.encode(req.getPassword()));
        return toResponse(employeRepo.save(e));
    }

    public EmployeResponse update(Integer id, EmployeRequest req) {
        Employe e = employeRepo.findById(id).orElseThrow(() -> new ResourceNotFoundException("Employé", id));
        employeRepo.findByMatricule(req.getMatricule()).ifPresent(ex -> {
            if (!ex.getId().equals(id)) throw new BusinessException("Matricule déjà utilisé");
        });
        employeRepo.findByLogin(req.getLogin()).ifPresent(ex -> {
            if (!ex.getId().equals(id)) throw new BusinessException("Login déjà utilisé");
        });
        Profil profil = profilRepo.findById(req.getProfilId())
                .orElseThrow(() -> new ResourceNotFoundException("Profil", req.getProfilId()));
        mapToEntity(req, e, profil);
        if (req.getPassword() != null && !req.getPassword().isBlank())
            e.setPassword(encoder.encode(req.getPassword()));
        return toResponse(employeRepo.save(e));
    }

    public void delete(Integer id) {
        if (!employeRepo.existsById(id)) throw new ResourceNotFoundException("Employé", id);
        employeRepo.deleteById(id);
    }

    private void mapToEntity(EmployeRequest req, Employe e, Profil profil) {
        e.setMatricule(req.getMatricule()); e.setNom(req.getNom());
        e.setPrenom(req.getPrenom()); e.setTelephone(req.getTelephone());
        e.setEmail(req.getEmail()); e.setLogin(req.getLogin());
        e.setProfil(profil);
    }

    public EmployeResponse toResponse(Employe e) {
        EmployeResponse r = new EmployeResponse();
        r.setId(e.getId()); r.setMatricule(e.getMatricule());
        r.setNom(e.getNom()); r.setPrenom(e.getPrenom());
        r.setTelephone(e.getTelephone()); r.setEmail(e.getEmail());
        r.setLogin(e.getLogin());
        if (e.getProfil() != null) {
            r.setProfilCode(e.getProfil().getCode());
            r.setProfilLibelle(e.getProfil().getLibelle());
        }
        return r;
    }
}
