package ma.toubkalit.suiviprojet.entities;

import jakarta.persistence.*;
import java.util.List;

@Entity
@Table(name = "organismes")
public class Organisme {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(nullable = false, unique = true, length = 20)
    private String code;

    @Column(nullable = false, length = 100)
    private String nom;

    @Column(length = 200)
    private String adresse;

    @Column(length = 20)
    private String telephone;

    @Column(length = 100)
    private String nomContact;

    @Column(length = 100)
    private String emailContact;

    @Column(length = 100)
    private String siteWeb;

    @OneToMany(mappedBy = "organisme", fetch = FetchType.LAZY)
    private List<Projet> projets;

    public Organisme() {}

    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }

    public String getCode() { return code; }
    public void setCode(String code) { this.code = code; }

    public String getNom() { return nom; }
    public void setNom(String nom) { this.nom = nom; }

    public String getAdresse() { return adresse; }
    public void setAdresse(String adresse) { this.adresse = adresse; }

    public String getTelephone() { return telephone; }
    public void setTelephone(String telephone) { this.telephone = telephone; }

    public String getNomContact() { return nomContact; }
    public void setNomContact(String nomContact) { this.nomContact = nomContact; }

    public String getEmailContact() { return emailContact; }
    public void setEmailContact(String emailContact) { this.emailContact = emailContact; }

    public String getSiteWeb() { return siteWeb; }
    public void setSiteWeb(String siteWeb) { this.siteWeb = siteWeb; }

    public List<Projet> getProjets() { return projets; }
    public void setProjets(List<Projet> projets) { this.projets = projets; }
}
