package ma.toubkalit.suiviprojet.repositories;

import ma.toubkalit.suiviprojet.entities.Profil;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface ProfilRepository extends JpaRepository<Profil, Integer> {
    Optional<Profil> findByCode(String code);
}
