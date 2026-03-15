package ma.toubkalit.suiviprojet.dto.facture;

import java.time.LocalDate;

public class FactureResponse {
    private Integer id;
    private String code;
    private LocalDate dateFacture;
    private Integer phaseId;
    private String phaseLibelle;
    private Double montant;

    public FactureResponse() {}
    public Integer getId() { return id; }               public void setId(Integer i) { this.id = i; }
    public String getCode() { return code; }            public void setCode(String c) { this.code = c; }
    public LocalDate getDateFacture() { return dateFacture; } public void setDateFacture(LocalDate d) { this.dateFacture = d; }
    public Integer getPhaseId() { return phaseId; }     public void setPhaseId(Integer p) { this.phaseId = p; }
    public String getPhaseLibelle() { return phaseLibelle; } public void setPhaseLibelle(String p) { this.phaseLibelle = p; }
    public Double getMontant() { return montant; }      public void setMontant(Double m) { this.montant = m; }
}
