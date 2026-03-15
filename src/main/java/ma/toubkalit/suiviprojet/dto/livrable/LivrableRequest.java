package ma.toubkalit.suiviprojet.dto.livrable;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class LivrableRequest {
    @NotBlank @Size(max = 20) private String code;
    @NotBlank @Size(max = 100) private String libelle;
    private String description;
    @Size(max = 500) private String chemin;

    public LivrableRequest() {}
    public String getCode() { return code; }          public void setCode(String c) { this.code = c; }
    public String getLibelle() { return libelle; }    public void setLibelle(String l) { this.libelle = l; }
    public String getDescription() { return description; } public void setDescription(String d) { this.description = d; }
    public String getChemin() { return chemin; }      public void setChemin(String c) { this.chemin = c; }
}
