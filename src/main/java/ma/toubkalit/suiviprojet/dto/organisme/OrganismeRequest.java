package ma.toubkalit.suiviprojet.dto.organisme;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class OrganismeRequest {
    @NotBlank(message = "Le code est obligatoire") @Size(max = 20)
    private String code;
    @NotBlank(message = "Le nom est obligatoire") @Size(max = 100)
    private String nom;
    @Size(max = 200) private String adresse;
    @Size(max = 20)  private String telephone;
    @Size(max = 100) private String nomContact;
    @Size(max = 100) private String emailContact;
    @Size(max = 100) private String siteWeb;

    public OrganismeRequest() {}
    public String getCode() { return code; } public void setCode(String c) { this.code = c; }
    public String getNom() { return nom; }   public void setNom(String n) { this.nom = n; }
    public String getAdresse() { return adresse; } public void setAdresse(String a) { this.adresse = a; }
    public String getTelephone() { return telephone; } public void setTelephone(String t) { this.telephone = t; }
    public String getNomContact() { return nomContact; } public void setNomContact(String n) { this.nomContact = n; }
    public String getEmailContact() { return emailContact; } public void setEmailContact(String e) { this.emailContact = e; }
    public String getSiteWeb() { return siteWeb; } public void setSiteWeb(String s) { this.siteWeb = s; }
}
