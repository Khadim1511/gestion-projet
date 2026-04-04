package ma.toubkalit.suiviprojet.entities;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "factures")
public class Facture {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(nullable = false, unique = true, length = 20)
    private String code;

    @Column(nullable = false)
    private LocalDate dateFacture;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "phase_id", nullable = false, unique = true)
    private Phase phase;

    @Column(length = 500)
    private String chemin;

    public Facture() {}

    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }

    public String getCode() { return code; }
    public void setCode(String code) { this.code = code; }

    public LocalDate getDateFacture() { return dateFacture; }
    public void setDateFacture(LocalDate dateFacture) { this.dateFacture = dateFacture; }

    public Phase getPhase() { return phase; }
    public void setPhase(Phase phase) { this.phase = phase; }

    public String getChemin() { return chemin; }
    public void setChemin(String chemin) { this.chemin = chemin; }
}
