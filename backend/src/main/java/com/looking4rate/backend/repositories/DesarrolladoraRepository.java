package com.looking4rate.backend.repositories;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.looking4rate.backend.entities.Desarrolladora;

public interface DesarrolladoraRepository extends JpaRepository<Desarrolladora, Long>{

    // Buscar por nombre exacto
    Optional<Desarrolladora> findByNombre(String nombre);
    
    // Buscar por nombre (parcial)
    List<Desarrolladora> findByNombreContainingIgnoreCase(String nombre);
    
    // Buscar por país
    List<Desarrolladora> findByPais(String pais);
    
    // Ordenar por fecha de creación
    @Query("SELECT d FROM Desarrolladora d ORDER BY d.fecha_creacion ASC")
    List<Desarrolladora> findAllOrderByFechaCreacionAsc();
}
