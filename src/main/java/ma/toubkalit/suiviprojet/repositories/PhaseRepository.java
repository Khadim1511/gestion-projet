package ma.toubkalit.suiviprojet.repositories;

import ma.toubkalit.suiviprojet.entities.Phase;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.time.LocalDate;
import java.util.List;

public interface PhaseRepository extends JpaRepository<Phase, Integer> {

    List<Phase> findByProjetId(Integer projetId);

    List<Phase> findByEtatRealisationTrue();

    List<Phase> findByEtatRealisationTrueAndEtatFacturationFalse();

    List<Phase> findByEtatFacturationTrueAndEtatPaiementFalse();

    List<Phase> findByEtatPaiementTrue();

    @Query("SELECT SUM(p.montant) FROM Phase p WHERE p.projet.id = :projetId")
    Double sumMontantByProjetId(@Param("projetId") Integer projetId);

    @Query("""
        SELECT ph FROM Phase ph WHERE ph.etatRealisation = true
        AND ph.dateDebut >= :dateDebut AND ph.dateFin <= :dateFin
    """)
    List<Phase> findPhasesTerminesByPeriode(@Param("dateDebut") LocalDate dateDebut,
                                             @Param("dateFin") LocalDate dateFin);
}
