package ma.toubkalit.suiviprojet.dto.projet;

import java.time.LocalDate;

public class ProjetResponse {
    private Integer id;
    private String code, nom, description;
    private LocalDate dateDebut, dateFin;
    private Double montant;
    private Integer organismeId;
    private String organismeNom;
    private Integer chefProjetId;
    private String chefProjetNom;

    public ProjetResponse() {}
    public Integer getId() { return id; }                   public void setId(Integer i) { this.id = i; }
    public String getCode() { return code; }                public void setCode(String c) { this.code = c; }
    public String getNom() { return nom; }                  public void setNom(String n) { this.nom = n; }
    public String getDescription() { return description; }  public void setDescription(String d) { this.description = d; }
    public LocalDate getDateDebut() { return dateDebut; }   public void setDateDebut(LocalDate d) { this.dateDebut = d; }
    public LocalDate getDateFin() { return dateFin; }       public void setDateFin(LocalDate d) { this.dateFin = d; }
    public Double getMontant() { return montant; }          public void setMontant(Double m) { this.montant = m; }
    public Integer getOrganismeId() { return organismeId; } public void setOrganismeId(Integer o) { this.organismeId = o; }
    public String getOrganismeNom() { return organismeNom; } public void setOrganismeNom(String o) { this.organismeNom = o; }
    public Integer getChefProjetId() { return chefProjetId; } public void setChefProjetId(Integer c) { this.chefProjetId = c; }
    public String getChefProjetNom() { return chefProjetNom; } public void setChefProjetNom(String c) { this.chefProjetNom = c; }
}
