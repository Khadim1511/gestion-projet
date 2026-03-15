package ma.toubkalit.suiviprojet.entities;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.util.List;

@Entity
@Table(name = "phases")
public class Phase {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(nullable = false, length = 20)
    private String code;

    @Column(nullable = false, length = 100)
    private String libelle;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(nullable = false)
    private LocalDate dateDebut;

    @Column(nullable = false)
    private LocalDate dateFin;

    @Column(nullable = false)
    private Double montant;

    @Column(nullable = false)
    private Boolean etatRealisation = false;

    @Column(nullable = false)
    private Boolean etatFacturation = false;

    @Column(nullable = false)
    private Boolean etatPaiement = false;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "projet_id", nullable = false)
    private Projet projet;

    @OneToMany(mappedBy = "phase", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Livrable> livrables;

    @OneToMany(mappedBy = "phase", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Affectation> affectations;

    @OneToOne(mappedBy = "phase", fetch = FetchType.LAZY)
    private Facture facture;

    public Phase() {}

    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }

    public String getCode() { return code; }
    public void setCode(String code) { this.code = code; }

    public String getLibelle() { return libelle; }
    public void setLibelle(String libelle) { this.libelle = libelle; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public LocalDate getDateDebut() { return dateDebut; }
    public void setDateDebut(LocalDate dateDebut) { this.dateDebut = dateDebut; }

    public LocalDate getDateFin() { return dateFin; }
    public void setDateFin(LocalDate dateFin) { this.dateFin = dateFin; }

    public Double getMontant() { return montant; }
    public void setMontant(Double montant) { this.montant = montant; }

    public Boolean getEtatRealisation() { return etatRealisation; }
    public void setEtatRealisation(Boolean etatRealisation) { this.etatRealisation = etatRealisation; }

    public Boolean getEtatFacturation() { return etatFacturation; }
    public void setEtatFacturation(Boolean etatFacturation) { this.etatFacturation = etatFacturation; }

    public Boolean getEtatPaiement() { return etatPaiement; }
    public void setEtatPaiement(Boolean etatPaiement) { this.etatPaiement = etatPaiement; }

    public Projet getProjet() { return projet; }
    public void setProjet(Projet projet) { this.projet = projet; }

    public List<Livrable> getLivrables() { return livrables; }
    public void setLivrables(List<Livrable> livrables) { this.livrables = livrables; }

    public List<Affectation> getAffectations() { return affectations; }
    public void setAffectations(List<Affectation> affectations) { this.affectations = affectations; }

    public Facture getFacture() { return facture; }
    public void setFacture(Facture facture) { this.facture = facture; }
}
