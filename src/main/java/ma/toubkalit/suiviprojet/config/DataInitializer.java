package ma.toubkalit.suiviprojet.config;

import ma.toubkalit.suiviprojet.entities.*;
import ma.toubkalit.suiviprojet.repositories.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class DataInitializer {

    private static final Logger log = LoggerFactory.getLogger(DataInitializer.class);

    @Bean
    CommandLineRunner initData(ProfilRepository profilRepo,
            EmployeRepository employeRepo,
            PasswordEncoder encoder) {
        return args -> {
            String[][] profils = {
                    { "ADMIN", "Administrateur" },
                    { "DIR", "Directeur" },
                    { "CP", "Chef de projet" },
                    { "SEC", "Secrétaire" },
                    { "COMPTA", "Comptable" },
                    { "EMP", "Employé" }
            };

            for (String[] p : profils) {
                if (profilRepo.findByCode(p[0]).isEmpty()) {
                    Profil profil = new Profil();
                    profil.setCode(p[0]);
                    profil.setLibelle(p[1]);
                    profilRepo.save(profil);
                    log.info("Profil créé : {}", p[0]);
                }
            }

            employeRepo.findByLogin("admin").ifPresent(admin -> {
                admin.setEmail("khadimseye2004@gmail.com");
                employeRepo.save(admin);
                log.info("Email de l'admin mis à jour : {}", admin.getEmail());
            });

            if (employeRepo.findByLogin("admin").isEmpty()) {
                Profil adminProfil = profilRepo.findByCode("ADMIN").orElseThrow();
                Employe admin = new Employe();
                admin.setMatricule("ADM001");
                admin.setNom("Admin");
                admin.setPrenom("Système");
                admin.setLogin("admin");
                admin.setEmail("khadimseye2004@gmail.com");
                admin.setPassword(encoder.encode("admin123"));
                admin.setProfil(adminProfil);
                employeRepo.save(admin);
                log.info("Utilisateur admin créé (login: admin / password: admin123)");
            }
        };
    }
}
