package ma.toubkalit.suiviprojet.repositories;

import ma.toubkalit.suiviprojet.entities.Projet;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import java.util.List;
import java.util.Optional;

public interface ProjetRepository extends JpaRepository<Projet, Integer> {

    Optional<Projet> findByCode(String code);
    boolean existsByCode(String code);

    List<Projet> findByNomContainingIgnoreCase(String nom);

    List<Projet> findByChefProjetId(Integer chefProjetId);

    @Query("SELECT p FROM Projet p WHERE p.dateFin >= CURRENT_DATE")
    List<Projet> findProjetsEnCours();

    @Query("SELECT p FROM Projet p WHERE p.dateFin < CURRENT_DATE")
    List<Projet> findProjetsClotures();
}
