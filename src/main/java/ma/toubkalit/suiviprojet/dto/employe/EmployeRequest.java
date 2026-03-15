package ma.toubkalit.suiviprojet.dto.employe;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public class EmployeRequest {
    @NotBlank(message = "Le matricule est obligatoire") @Size(max = 20)
    private String matricule;
    @NotBlank(message = "Le nom est obligatoire") @Size(max = 50)
    private String nom;
    @NotBlank(message = "Le prénom est obligatoire") @Size(max = 50)
    private String prenom;
    @Size(max = 20)  private String telephone;
    @Size(max = 100) private String email;
    @NotBlank(message = "Le login est obligatoire") @Size(max = 50)
    private String login;
    @NotBlank(message = "Le mot de passe est obligatoire")
    private String password;
    @NotNull(message = "Le profil est obligatoire")
    private Integer profilId;

    public EmployeRequest() {}
    public String getMatricule() { return matricule; } public void setMatricule(String m) { this.matricule = m; }
    public String getNom() { return nom; }             public void setNom(String n) { this.nom = n; }
    public String getPrenom() { return prenom; }       public void setPrenom(String p) { this.prenom = p; }
    public String getTelephone() { return telephone; } public void setTelephone(String t) { this.telephone = t; }
    public String getEmail() { return email; }         public void setEmail(String e) { this.email = e; }
    public String getLogin() { return login; }         public void setLogin(String l) { this.login = l; }
    public String getPassword() { return password; }   public void setPassword(String p) { this.password = p; }
    public Integer getProfilId() { return profilId; }  public void setProfilId(Integer p) { this.profilId = p; }
}
