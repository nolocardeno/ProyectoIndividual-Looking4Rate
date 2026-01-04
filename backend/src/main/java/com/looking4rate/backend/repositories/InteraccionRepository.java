package com.looking4rate.backend.repositories;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.looking4rate.backend.entities.Interaccion;

public interface InteraccionRepository extends JpaRepository<Interaccion, Long>{
    
    // Todas las interacciones de un usuario
    List<Interaccion> findByUsuarioId(Long usuarioId);
    
    // Todas las interacciones/reviews de un juego
    List<Interaccion> findByJuegoId(Long juegoId);
    
    // Interacción específica de un usuario con un juego
    Optional<Interaccion> findByUsuarioIdAndJuegoId(Long usuarioId, Long juegoId);
    
    // Verificar si existe interacción entre usuario y juego
    boolean existsByUsuarioIdAndJuegoId(Long usuarioId, Long juegoId);
    
    // Reviews de un juego ordenadas por fecha/hora (más recientes primero)
    @Query("SELECT i FROM Interaccion i WHERE i.juego.id = :juegoId ORDER BY i.fecha_interaccion DESC")
    List<Interaccion> findByJuegoIdOrderByFechaInteraccionDesc(@Param("juegoId") Long juegoId);
    
    // Reviews con puntuación (para calcular media)
    List<Interaccion> findByJuegoIdAndPuntuacionIsNotNull(Long juegoId);
    
    // Media de puntuación de un juego
    @Query("SELECT AVG(i.puntuacion) FROM Interaccion i WHERE i.juego.id = :juegoId AND i.puntuacion IS NOT NULL")
    Double findAveragePuntuacionByJuegoId(@Param("juegoId") Long juegoId);
    
    // Contar reviews de un juego
    Long countByJuegoId(Long juegoId);
    
    // Juegos jugados por un usuario
    @Query("SELECT i FROM Interaccion i WHERE i.usuario.id = :usuarioId AND i.estado_jugado = true")
    List<Interaccion> findJuegosJugadosByUsuarioId(@Param("usuarioId") Long usuarioId);
}
