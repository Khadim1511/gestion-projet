package ma.toubkalit.suiviprojet.dto.organisme;

public class OrganismeResponse {
    private Integer id;
    private String code, nom, adresse, telephone, nomContact, emailContact, siteWeb;

    public OrganismeResponse() {}
    public Integer getId() { return id; } public void setId(Integer i) { this.id = i; }
    public String getCode() { return code; } public void setCode(String c) { this.code = c; }
    public String getNom() { return nom; }   public void setNom(String n) { this.nom = n; }
    public String getAdresse() { return adresse; } public void setAdresse(String a) { this.adresse = a; }
    public String getTelephone() { return telephone; } public void setTelephone(String t) { this.telephone = t; }
    public String getNomContact() { return nomContact; } public void setNomContact(String n) { this.nomContact = n; }
    public String getEmailContact() { return emailContact; } public void setEmailContact(String e) { this.emailContact = e; }
    public String getSiteWeb() { return siteWeb; } public void setSiteWeb(String s) { this.siteWeb = s; }
}
