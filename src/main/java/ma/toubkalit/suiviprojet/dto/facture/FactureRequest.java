package ma.toubkalit.suiviprojet.dto.facture;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.time.LocalDate;

public class FactureRequest {
    @NotBlank @Size(max = 20) private String code;
    @NotNull private LocalDate dateFacture;

    public FactureRequest() {}
    public String getCode() { return code; }               public void setCode(String c) { this.code = c; }
    public LocalDate getDateFacture() { return dateFacture; } public void setDateFacture(LocalDate d) { this.dateFacture = d; }
}
