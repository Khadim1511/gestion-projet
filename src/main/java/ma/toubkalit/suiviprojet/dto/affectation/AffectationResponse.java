package ma.toubkalit.suiviprojet.dto.affectation;

import java.time.LocalDate;

public class AffectationResponse {
    private Integer employeId, phaseId;
    private String employeNom, phaseLibelle;
    private LocalDate dateDebut, dateFin;

    public AffectationResponse() {}
    public Integer getEmployeId() { return employeId; }    public void setEmployeId(Integer e) { this.employeId = e; }
    public Integer getPhaseId() { return phaseId; }        public void setPhaseId(Integer p) { this.phaseId = p; }
    public String getEmployeNom() { return employeNom; }   public void setEmployeNom(String e) { this.employeNom = e; }
    public String getPhaseLibelle() { return phaseLibelle; } public void setPhaseLibelle(String p) { this.phaseLibelle = p; }
    public LocalDate getDateDebut() { return dateDebut; }  public void setDateDebut(LocalDate d) { this.dateDebut = d; }
    public LocalDate getDateFin() { return dateFin; }      public void setDateFin(LocalDate d) { this.dateFin = d; }
}
