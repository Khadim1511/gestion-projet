package ma.toubkalit.suiviprojet.dto.employe;

public class EmployeResponse {
    private Integer id;
    private String matricule, nom, prenom, telephone, email, login;
    private String profilCode, profilLibelle;

    public EmployeResponse() {}
    public Integer getId() { return id; }               public void setId(Integer i) { this.id = i; }
    public String getMatricule() { return matricule; }  public void setMatricule(String m) { this.matricule = m; }
    public String getNom() { return nom; }              public void setNom(String n) { this.nom = n; }
    public String getPrenom() { return prenom; }        public void setPrenom(String p) { this.prenom = p; }
    public String getTelephone() { return telephone; }  public void setTelephone(String t) { this.telephone = t; }
    public String getEmail() { return email; }          public void setEmail(String e) { this.email = e; }
    public String getLogin() { return login; }          public void setLogin(String l) { this.login = l; }
    public String getProfilCode() { return profilCode; } public void setProfilCode(String p) { this.profilCode = p; }
    public String getProfilLibelle() { return profilLibelle; } public void setProfilLibelle(String p) { this.profilLibelle = p; }
}
