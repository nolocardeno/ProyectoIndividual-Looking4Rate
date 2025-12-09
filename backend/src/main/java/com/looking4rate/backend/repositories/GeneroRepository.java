package com.looking4rate.backend.repositories;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.looking4rate.backend.entities.Genero;

public interface GeneroRepository extends JpaRepository<Genero, Long> {
    
    // Buscar por nombre exacto
    Optional<Genero> findByNombre(String nombre);
    
    // Buscar por nombre (parcial)
    List<Genero> findByNombreContainingIgnoreCase(String nombre);
    
    // Verificar si existe un género
    boolean existsByNombre(String nombre);
}
