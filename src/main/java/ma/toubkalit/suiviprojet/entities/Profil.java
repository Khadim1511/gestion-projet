package ma.toubkalit.suiviprojet.entities;

import jakarta.persistence.*;

@Entity
@Table(name = "profils")
public class Profil {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(nullable = false, unique = true, length = 20)
    private String code;

    @Column(nullable = false, length = 50)
    private String libelle;

    public Profil() {}

    public Profil(Integer id, String code, String libelle) {
        this.id = id;
        this.code = code;
        this.libelle = libelle;
    }

    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }

    public String getCode() { return code; }
    public void setCode(String code) { this.code = code; }

    public String getLibelle() { return libelle; }
    public void setLibelle(String libelle) { this.libelle = libelle; }

    @Override
    public String toString() {
        return "Profil{id=" + id + ", code='" + code + "', libelle='" + libelle + "'}";
    }
}
