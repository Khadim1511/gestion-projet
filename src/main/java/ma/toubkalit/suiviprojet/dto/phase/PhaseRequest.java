package ma.toubkalit.suiviprojet.dto.phase;

import jakarta.validation.constraints.*;
import java.time.LocalDate;

public class PhaseRequest {
    @NotBlank(message = "Le code est obligatoire") @Size(max = 20)
    private String code;
    @NotBlank(message = "Le libellé est obligatoire") @Size(max = 100)
    private String libelle;
    private String description;
    @NotNull(message = "La date de début est obligatoire")
    private LocalDate dateDebut;
    @NotNull(message = "La date de fin est obligatoire")
    private LocalDate dateFin;
    @NotNull(message = "Le montant est obligatoire") @Positive
    private Double montant;

    public PhaseRequest() {}
    public String getCode() { return code; }           public void setCode(String c) { this.code = c; }
    public String getLibelle() { return libelle; }     public void setLibelle(String l) { this.libelle = l; }
    public String getDescription() { return description; } public void setDescription(String d) { this.description = d; }
    public LocalDate getDateDebut() { return dateDebut; }  public void setDateDebut(LocalDate d) { this.dateDebut = d; }
    public LocalDate getDateFin() { return dateFin; }      public void setDateFin(LocalDate d) { this.dateFin = d; }
    public Double getMontant() { return montant; }         public void setMontant(Double m) { this.montant = m; }
}
