package ma.toubkalit.suiviprojet.dto.livrable;

public class LivrableResponse {
    private Integer id;
    private String code, libelle, description, chemin;
    private Integer phaseId;

    public LivrableResponse() {}
    public Integer getId() { return id; }             public void setId(Integer i) { this.id = i; }
    public String getCode() { return code; }          public void setCode(String c) { this.code = c; }
    public String getLibelle() { return libelle; }    public void setLibelle(String l) { this.libelle = l; }
    public String getDescription() { return description; } public void setDescription(String d) { this.description = d; }
    public String getChemin() { return chemin; }      public void setChemin(String c) { this.chemin = c; }
    public Integer getPhaseId() { return phaseId; }   public void setPhaseId(Integer p) { this.phaseId = p; }
}
