package com.looking4rate.backend.repositories;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.looking4rate.backend.entities.Plataforma;

public interface PlataformaRepository extends JpaRepository<Plataforma, Long>{
    
    // Buscar por nombre exacto
    Optional<Plataforma> findByNombre(String nombre);
    
    // Buscar por nombre (parcial)
    List<Plataforma> findByNombreContainingIgnoreCase(String nombre);
    
    // Buscar por fabricante
    List<Plataforma> findByFabricante(String fabricante);
    
    // Ordenar por año de lanzamiento
    @Query("SELECT p FROM Plataforma p ORDER BY p.anio_lanzamiento DESC")
    List<Plataforma> findAllOrderByAnioLanzamientoDesc();
}
