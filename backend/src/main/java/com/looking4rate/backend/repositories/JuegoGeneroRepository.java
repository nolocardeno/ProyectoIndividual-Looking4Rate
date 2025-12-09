package com.looking4rate.backend.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.looking4rate.backend.entities.JuegoGenero;

public interface JuegoGeneroRepository extends JpaRepository<JuegoGenero, Long> {
    
    // Géneros de un juego
    List<JuegoGenero> findByJuegoId(Long juegoId);
    
    // Juegos de un género
    List<JuegoGenero> findByGeneroId(Long generoId);
    
    // Eliminar relación específica
    void deleteByJuegoIdAndGeneroId(Long juegoId, Long generoId);
    
    // Verificar si existe relación
    boolean existsByJuegoIdAndGeneroId(Long juegoId, Long generoId);
}
