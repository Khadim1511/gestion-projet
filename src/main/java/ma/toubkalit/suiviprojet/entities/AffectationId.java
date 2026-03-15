package ma.toubkalit.suiviprojet.entities;

import jakarta.persistence.Embeddable;
import java.io.Serializable;
import java.util.Objects;

@Embeddable
public class AffectationId implements Serializable {

    private Integer employeId;
    private Integer phaseId;

    public AffectationId() {}

    public AffectationId(Integer employeId, Integer phaseId) {
        this.employeId = employeId;
        this.phaseId = phaseId;
    }

    public Integer getEmployeId() { return employeId; }
    public void setEmployeId(Integer employeId) { this.employeId = employeId; }

    public Integer getPhaseId() { return phaseId; }
    public void setPhaseId(Integer phaseId) { this.phaseId = phaseId; }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof AffectationId)) return false;
        AffectationId that = (AffectationId) o;
        return Objects.equals(employeId, that.employeId) && Objects.equals(phaseId, that.phaseId);
    }

    @Override
    public int hashCode() {
        return Objects.hash(employeId, phaseId);
    }
}
