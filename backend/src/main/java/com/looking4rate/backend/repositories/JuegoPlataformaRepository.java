package com.looking4rate.backend.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.looking4rate.backend.entities.JuegoPlataforma;

public interface JuegoPlataformaRepository extends JpaRepository<JuegoPlataforma, Long>{
    
    // Plataformas de un juego
    List<JuegoPlataforma> findByJuegoId(Long juegoId);
    
    // Juegos de una plataforma
    List<JuegoPlataforma> findByPlataformaId(Long plataformaId);
    
    // Eliminar relación específica
    void deleteByJuegoIdAndPlataformaId(Long juegoId, Long plataformaId);
    
    // Verificar si existe relación
    boolean existsByJuegoIdAndPlataformaId(Long juegoId, Long plataformaId);
}
