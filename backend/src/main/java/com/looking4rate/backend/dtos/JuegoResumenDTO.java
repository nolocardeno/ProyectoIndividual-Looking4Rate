package com.looking4rate.backend.dtos;

import java.time.LocalDate;

/**
 * DTO para listados de juegos - información resumida
 */
public record JuegoResumenDTO(
    Long id,
    String nombre,
    String imagenPortada,
    LocalDate fechaSalida,
    Double puntuacionMedia
) {}
