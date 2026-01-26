package com.looking4rate.backend.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.looking4rate.backend.entities.ImagenJuego;

/**
 * Repositorio para las imágenes de galería de juegos
 */
public interface ImagenJuegoRepository extends JpaRepository<ImagenJuego, Long> {
    
    /**
     * Busca todas las imágenes de un juego
     * @param juegoId ID del juego
     * @return Lista de imágenes del juego
     */
    List<ImagenJuego> findByJuegoId(Long juegoId);
}
