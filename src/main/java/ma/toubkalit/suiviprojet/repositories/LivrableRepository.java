package ma.toubkalit.suiviprojet.repositories;

import ma.toubkalit.suiviprojet.entities.Livrable;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface LivrableRepository extends JpaRepository<Livrable, Integer> {
    List<Livrable> findByPhaseId(Integer phaseId);
}
