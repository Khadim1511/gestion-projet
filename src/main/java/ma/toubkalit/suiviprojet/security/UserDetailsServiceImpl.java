package ma.toubkalit.suiviprojet.security;

import ma.toubkalit.suiviprojet.entities.Employe;
import ma.toubkalit.suiviprojet.repositories.EmployeRepository;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.*;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class UserDetailsServiceImpl implements UserDetailsService {

    private final EmployeRepository employeRepository;

    public UserDetailsServiceImpl(EmployeRepository employeRepository) {
        this.employeRepository = employeRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String login) throws UsernameNotFoundException {
        Employe employe = employeRepository.findByLogin(login)
                .orElseThrow(() -> new UsernameNotFoundException("Utilisateur non trouvé : " + login));

        return User.builder()
                .username(employe.getLogin())
                .password(employe.getPassword())
                .authorities(List.of(new SimpleGrantedAuthority("ROLE_" + employe.getProfil().getCode())))
                .build();
    }
}
