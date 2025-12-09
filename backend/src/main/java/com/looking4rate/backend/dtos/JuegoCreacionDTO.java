package com.looking4rate.backend.dtos;

import java.time.LocalDate;
import java.util.List;

/**
 * DTO para crear/actualizar juegos
 */
public record JuegoCreacionDTO(
    String nombre,
    String descripcion,
    String imagenPortada,
    LocalDate fechaSalida,
    List<Long> plataformaIds,
    List<Long> desarrolladoraIds,
    List<Long> generoIds
) {}
