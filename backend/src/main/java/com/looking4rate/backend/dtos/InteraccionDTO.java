package com.looking4rate.backend.dtos;

import java.time.LocalDate;

/**
 * DTO para respuestas de Interaccion
 */
public record InteraccionDTO(
    Long id,
    Long usuarioId,
    String nombreUsuario,
    Long juegoId,
    String nombreJuego,
    Integer puntuacion,
    String review,
    boolean estadoJugado,
    LocalDate fechaInteraccion
) {}
