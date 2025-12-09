package com.looking4rate.backend.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.looking4rate.backend.entities.JuegoDesarrolladora;

public interface JuegoDesarrolladoraRepository extends JpaRepository<JuegoDesarrolladora, Long> {
    
    // Desarrolladoras de un juego
    List<JuegoDesarrolladora> findByJuegoId(Long juegoId);
    
    // Juegos de una desarrolladora
    List<JuegoDesarrolladora> findByDesarrolladoraId(Long desarrolladoraId);
    
    // Eliminar relación específica
    void deleteByJuegoIdAndDesarrolladoraId(Long juegoId, Long desarrolladoraId);
}
