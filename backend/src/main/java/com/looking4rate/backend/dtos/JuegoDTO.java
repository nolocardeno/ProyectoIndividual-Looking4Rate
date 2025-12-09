package com.looking4rate.backend.dtos;

import java.time.LocalDate;
import java.util.List;

/**
 * DTO para respuestas de Juego con información completa
 */
public record JuegoDTO(
    Long id,
    String nombre,
    String descripcion,
    String imagenPortada,
    LocalDate fechaSalida,
    List<String> plataformas,
    List<String> desarrolladoras,
    List<String> generos,
    Double puntuacionMedia,
    Integer totalReviews
) {}
