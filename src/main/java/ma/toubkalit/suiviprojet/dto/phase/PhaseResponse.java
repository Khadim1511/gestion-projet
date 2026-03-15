package ma.toubkalit.suiviprojet.dto.phase;

import java.time.LocalDate;

public class PhaseResponse {
    private Integer id;
    private String code, libelle, description;
    private LocalDate dateDebut, dateFin;
    private Double montant;
    private Boolean etatRealisation, etatFacturation, etatPaiement;
    private Integer projetId;
    private String projetNom;

    public PhaseResponse() {}
    public Integer getId() { return id; }                      public void setId(Integer i) { this.id = i; }
    public String getCode() { return code; }                   public void setCode(String c) { this.code = c; }
    public String getLibelle() { return libelle; }             public void setLibelle(String l) { this.libelle = l; }
    public String getDescription() { return description; }     public void setDescription(String d) { this.description = d; }
    public LocalDate getDateDebut() { return dateDebut; }      public void setDateDebut(LocalDate d) { this.dateDebut = d; }
    public LocalDate getDateFin() { return dateFin; }          public void setDateFin(LocalDate d) { this.dateFin = d; }
    public Double getMontant() { return montant; }             public void setMontant(Double m) { this.montant = m; }
    public Boolean getEtatRealisation() { return etatRealisation; } public void setEtatRealisation(Boolean e) { this.etatRealisation = e; }
    public Boolean getEtatFacturation() { return etatFacturation; } public void setEtatFacturation(Boolean e) { this.etatFacturation = e; }
    public Boolean getEtatPaiement() { return etatPaiement; }  public void setEtatPaiement(Boolean e) { this.etatPaiement = e; }
    public Integer getProjetId() { return projetId; }          public void setProjetId(Integer p) { this.projetId = p; }
    public String getProjetNom() { return projetNom; }         public void setProjetNom(String p) { this.projetNom = p; }
}
