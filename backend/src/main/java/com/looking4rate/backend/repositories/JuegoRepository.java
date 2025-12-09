package com.looking4rate.backend.repositories;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.looking4rate.backend.entities.Juego;

public interface JuegoRepository extends JpaRepository<Juego, Long> {

    // Busca nombres que CONTENGAN lo que escriba el usuario
    List<Juego> findByNombreContainingIgnoreCase(String nombre);
    
    // Juegos ordenados por fecha de salida descendente (más recientes primero)
    @Query("SELECT j FROM Juego j ORDER BY j.fecha_salida DESC")
    List<Juego> findAllOrderByFechaSalidaDesc();
    
    // Juegos con fecha de salida posterior a hoy (próximos lanzamientos)
    @Query("SELECT j FROM Juego j WHERE j.fecha_salida > :fecha ORDER BY j.fecha_salida ASC")
    List<Juego> findByFechaSalidaAfterOrderByFechaSalidaAsc(@Param("fecha") LocalDate fecha);
    
    // Juegos lanzados en un rango de fechas
    @Query("SELECT j FROM Juego j WHERE j.fecha_salida BETWEEN :inicio AND :fin")
    List<Juego> findByFechaSalidaBetween(@Param("inicio") LocalDate inicio, @Param("fin") LocalDate fin);
    
    // Juegos más valorados (query personalizada con JPQL)
    @Query("SELECT j FROM Juego j LEFT JOIN j.interacciones i " +
           "GROUP BY j ORDER BY AVG(i.puntuacion) DESC NULLS LAST")
    List<Juego> findTopRatedGames(Pageable pageable);
    
    // Juegos con más interacciones/reviews
    @Query("SELECT j FROM Juego j LEFT JOIN j.interacciones i " +
           "GROUP BY j ORDER BY COUNT(i) DESC")
    List<Juego> findMostReviewedGames(Pageable pageable);
}