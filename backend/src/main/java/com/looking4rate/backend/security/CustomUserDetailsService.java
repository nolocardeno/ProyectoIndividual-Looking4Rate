package com.looking4rate.backend.security;

import java.util.Collection;
import java.util.List;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.looking4rate.backend.entities.Usuario;
import com.looking4rate.backend.exceptions.UnauthorizedException;
import com.looking4rate.backend.repositories.UsuarioRepository;

import lombok.RequiredArgsConstructor;

/**
 * Servicio para cargar los detalles del usuario para Spring Security
 */
@Service
@RequiredArgsConstructor
public class CustomUserDetailsService implements UserDetailsService {
    
    private final UsuarioRepository usuarioRepository;
    
    @Override
    @Transactional(readOnly = true)
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        Usuario usuario = usuarioRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("Usuario no encontrado con email: " + email));
        
        if (!usuario.isActivo()) {
            throw new UnauthorizedException("La cuenta está desactivada");
        }
        
        return crearUserDetails(usuario);
    }
    
    @Transactional(readOnly = true)
    public UserDetails loadUserById(Long id) {
        Usuario usuario = usuarioRepository.findById(id)
                .orElseThrow(() -> new UsernameNotFoundException("Usuario no encontrado con id: " + id));
        
        if (!usuario.isActivo()) {
            throw new UnauthorizedException("La cuenta está desactivada");
        }
        
        return crearUserDetails(usuario);
    }
    
    private UserDetails crearUserDetails(Usuario usuario) {
        return new CustomUserDetails(usuario);
    }
    
    /**
     * Implementación personalizada de UserDetails que incluye el ID del usuario
     */
    public static class CustomUserDetails implements UserDetails {
        private final Long id;
        private final String email;
        private final String password;
        private final String nombre;
        private final Usuario.Rol rol;
        private final boolean activo;
        
        public CustomUserDetails(Usuario usuario) {
            this.id = usuario.getId();
            this.email = usuario.getEmail();
            this.password = usuario.getContrasenia();
            this.nombre = usuario.getNombre();
            this.rol = usuario.getRol();
            this.activo = usuario.isActivo();
        }
        
        public Long getId() {
            return id;
        }
        
        public String getNombre() {
            return nombre;
        }
        
        public Usuario.Rol getRol() {
            return rol;
        }
        
        @Override
        public Collection<? extends GrantedAuthority> getAuthorities() {
            // No usar prefijo ROLE_ para que @PreAuthorize("hasAuthority('ADMIN')") funcione
            return List.of(new SimpleGrantedAuthority(rol.name()));
        }
        
        @Override
        public String getPassword() {
            return password;
        }
        
        @Override
        public String getUsername() {
            return email;
        }
        
        @Override
        public boolean isAccountNonExpired() {
            return true;
        }
        
        @Override
        public boolean isAccountNonLocked() {
            return activo;
        }
        
        @Override
        public boolean isCredentialsNonExpired() {
            return true;
        }
        
        @Override
        public boolean isEnabled() {
            return activo;
        }
    }
}
