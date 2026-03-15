package ma.toubkalit.suiviprojet.repositories;

import ma.toubkalit.suiviprojet.entities.Organisme;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface OrganismeRepository extends JpaRepository<Organisme, Integer> {
    Optional<Organisme> findByCode(String code);
    List<Organisme> findByNomContainingIgnoreCase(String nom);
}
