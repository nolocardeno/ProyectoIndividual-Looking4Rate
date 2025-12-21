package com.looking4rate.backend.dtos;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

/**
 * DTO para crear/actualizar interacciones (valoraciones/reviews)
 */
public record InteraccionCreacionDTO(
    @NotNull(message = "El ID del juego es obligatorio")
    Long juegoId,
    
    @Min(value = 1, message = "La puntuación mínima es 1")
    @Max(value = 10, message = "La puntuación máxima es 10")
    Integer puntuacion,
    
    @Size(max = 1000, message = "La review no puede superar los 1000 caracteres")
    String review,
    
    boolean estadoJugado
) {}
