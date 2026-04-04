package ma.toubkalit.suiviprojet.services;

import org.springframework.stereotype.Service;
import jakarta.annotation.PostConstruct;
import java.io.IOException;
import java.nio.file.*;

@Service
public class FileStorageService {

    private final Path root = Paths.get("uploads/factures");

    @PostConstruct
    public void init() {
        try {
            Files.createDirectories(root);
        } catch (IOException e) {
            throw new RuntimeException("Could not initialize folder for uploads!");
        }
    }

    public String save(byte[] data, String filename) {
        try {
            Path file = this.root.resolve(filename);
            Files.write(file, data);
            return file.toString();
        } catch (Exception e) {
            throw new RuntimeException("Could not store the file. Error: " + e.getMessage());
        }
    }

    public Path load(String filename) {
        return root.resolve(filename);
    }
}
