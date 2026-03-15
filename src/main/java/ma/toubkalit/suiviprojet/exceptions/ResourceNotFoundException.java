package ma.toubkalit.suiviprojet.exceptions;

public class ResourceNotFoundException extends RuntimeException {
    public ResourceNotFoundException(String message) {
        super(message);
    }
    public ResourceNotFoundException(String resource, Object id) {
        super(resource + " non trouvé(e) avec l'id : " + id);
    }
}
