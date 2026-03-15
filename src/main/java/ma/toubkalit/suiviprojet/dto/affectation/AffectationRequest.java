package ma.toubkalit.suiviprojet.dto.affectation;

import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;

public class AffectationRequest {
    @NotNull private LocalDate dateDebut;
    @NotNull private LocalDate dateFin;

    public AffectationRequest() {}
    public LocalDate getDateDebut() { return dateDebut; } public void setDateDebut(LocalDate d) { this.dateDebut = d; }
    public LocalDate getDateFin() { return dateFin; }     public void setDateFin(LocalDate d) { this.dateFin = d; }
}
