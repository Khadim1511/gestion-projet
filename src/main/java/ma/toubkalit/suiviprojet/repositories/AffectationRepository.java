package ma.toubkalit.suiviprojet.repositories;

import ma.toubkalit.suiviprojet.entities.Affectation;
import ma.toubkalit.suiviprojet.entities.AffectationId;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface AffectationRepository extends JpaRepository<Affectation, AffectationId> {
    List<Affectation> findByPhaseId(Integer phaseId);
    List<Affectation> findByEmployeId(Integer employeId);
}
