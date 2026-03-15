package ma.toubkalit.suiviprojet.dto.auth;

public class LoginResponse {

    private String token;
    private String login;
    private String nom;
    private String prenom;
    private String profil;

    public LoginResponse() {}

    public LoginResponse(String token, String login, String nom, String prenom, String profil) {
        this.token = token;
        this.login = login;
        this.nom = nom;
        this.prenom = prenom;
        this.profil = profil;
    }

    public String getToken() { return token; }
    public void setToken(String token) { this.token = token; }

    public String getLogin() { return login; }
    public void setLogin(String login) { this.login = login; }

    public String getNom() { return nom; }
    public void setNom(String nom) { this.nom = nom; }

    public String getPrenom() { return prenom; }
    public void setPrenom(String prenom) { this.prenom = prenom; }

    public String getProfil() { return profil; }
    public void setProfil(String profil) { this.profil = profil; }
}
