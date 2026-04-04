package ma.toubkalit.suiviprojet.repositories;

import ma.toubkalit.suiviprojet.entities.Employe;
import ma.toubkalit.suiviprojet.entities.PasswordResetToken;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface PasswordResetTokenRepository extends JpaRepository<PasswordResetToken, Long> {
    Optional<PasswordResetToken> findByToken(String token);
    Optional<PasswordResetToken> findByEmploye(Employe employe);
}
