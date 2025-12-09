package com.looking4rate.backend.repositories;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.looking4rate.backend.entities.Usuario;

public interface UsuarioRepository extends JpaRepository<Usuario, Long>{

    // Buscar por email (para login)
    Optional<Usuario> findByEmail(String email);
    
    // Verificar si existe un email (para registro)
    boolean existsByEmail(String email);
    
    // Buscar usuarios por nombre (parcial, ignorando mayúsculas)
    List<Usuario> findByNombreContainingIgnoreCase(String nombre);
}