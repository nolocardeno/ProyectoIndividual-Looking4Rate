package com.looking4rate.backend.dtos;

/**
 * DTO para crear/actualizar interacciones (valoraciones/reviews)
 */
public record InteraccionCreacionDTO(
    Long juegoId,
    Integer puntuacion,
    String review,
    boolean estadoJugado
) {}
