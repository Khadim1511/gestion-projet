package ma.toubkalit.suiviprojet.repositories;

import ma.toubkalit.suiviprojet.entities.Document;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface DocumentRepository extends JpaRepository<Document, Integer> {
    List<Document> findByProjetId(Integer projetId);
}
