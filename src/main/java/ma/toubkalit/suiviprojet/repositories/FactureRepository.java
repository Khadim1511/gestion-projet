package ma.toubkalit.suiviprojet.repositories;

import ma.toubkalit.suiviprojet.entities.Facture;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface FactureRepository extends JpaRepository<Facture, Integer> {
    Optional<Facture> findByCode(String code);
    Optional<Facture> findByPhaseId(Integer phaseId);
    boolean existsByPhaseId(Integer phaseId);
}
