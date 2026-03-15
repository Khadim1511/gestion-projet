package ma.toubkalit.suiviprojet.entities;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "affectations")
public class Affectation {

    @EmbeddedId
    private AffectationId id;

    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("employeId")
    @JoinColumn(name = "employe_id")
    private Employe employe;

    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("phaseId")
    @JoinColumn(name = "phase_id")
    private Phase phase;

    @Column(nullable = false)
    private LocalDate dateDebut;

    @Column(nullable = false)
    private LocalDate dateFin;

    public Affectation() {}

    public AffectationId getId() { return id; }
    public void setId(AffectationId id) { this.id = id; }

    public Employe getEmploye() { return employe; }
    public void setEmploye(Employe employe) { this.employe = employe; }

    public Phase getPhase() { return phase; }
    public void setPhase(Phase phase) { this.phase = phase; }

    public LocalDate getDateDebut() { return dateDebut; }
    public void setDateDebut(LocalDate dateDebut) { this.dateDebut = dateDebut; }

    public LocalDate getDateFin() { return dateFin; }
    public void setDateFin(LocalDate dateFin) { this.dateFin = dateFin; }
}
