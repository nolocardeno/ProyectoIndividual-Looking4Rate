package com.looking4rate.backend.dtos;

import java.time.LocalDateTime;

/**
 * DTO para respuestas de Interaccion
 */
public record InteraccionDTO(
    Long id,
    Long usuarioId,
    String nombreUsuario,
    String avatarUsuario,
    Long juegoId,
    String nombreJuego,
    String imagenJuego,
    Integer puntuacion,
    String review,
    boolean estadoJugado,
    LocalDateTime fechaInteraccion
) {}
