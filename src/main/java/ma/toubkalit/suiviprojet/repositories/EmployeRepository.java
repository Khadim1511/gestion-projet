package ma.toubkalit.suiviprojet.repositories;

import ma.toubkalit.suiviprojet.entities.Employe;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface EmployeRepository extends JpaRepository<Employe, Integer> {

    Optional<Employe> findByLogin(String login);
    Optional<Employe> findByMatricule(String matricule);
    Optional<Employe> findByEmail(String email);

    List<Employe> findByNomContainingIgnoreCaseOrPrenomContainingIgnoreCase(String nom, String prenom);

    @Query("""
        SELECT e FROM Employe e WHERE e.id NOT IN (
            SELECT a.employe.id FROM Affectation a
            WHERE a.dateDebut <= :dateFin AND a.dateFin >= :dateDebut
        )
    """)
    List<Employe> findDisponibles(@Param("dateDebut") LocalDate dateDebut,
                                  @Param("dateFin") LocalDate dateFin);
}
