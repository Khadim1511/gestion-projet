package ma.toubkalit.suiviprojet.dto.projet;

import jakarta.validation.constraints.*;
import java.time.LocalDate;

public class ProjetRequest {
    @NotBlank(message = "Le code est obligatoire") @Size(max = 20)
    private String code;
    @NotBlank(message = "Le nom est obligatoire") @Size(max = 100)
    private String nom;
    private String description;
    @NotNull(message = "La date de début est obligatoire")
    private LocalDate dateDebut;
    @NotNull(message = "La date de fin est obligatoire")
    private LocalDate dateFin;
    @NotNull(message = "Le montant est obligatoire") @Positive
    private Double montant;
    @NotNull(message = "L'organisme est obligatoire")
    private Integer organismeId;
    private Integer chefProjetId;

    public ProjetRequest() {}
    public String getCode() { return code; }           public void setCode(String c) { this.code = c; }
    public String getNom() { return nom; }             public void setNom(String n) { this.nom = n; }
    public String getDescription() { return description; } public void setDescription(String d) { this.description = d; }
    public LocalDate getDateDebut() { return dateDebut; }  public void setDateDebut(LocalDate d) { this.dateDebut = d; }
    public LocalDate getDateFin() { return dateFin; }      public void setDateFin(LocalDate d) { this.dateFin = d; }
    public Double getMontant() { return montant; }         public void setMontant(Double m) { this.montant = m; }
    public Integer getOrganismeId() { return organismeId; } public void setOrganismeId(Integer o) { this.organismeId = o; }
    public Integer getChefProjetId() { return chefProjetId; } public void setChefProjetId(Integer c) { this.chefProjetId = c; }
}
