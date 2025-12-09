package com.looking4rate.backend.dtos;

import java.time.LocalDate;

/**
 * DTO para Desarrolladora
 */
public record DesarrolladoraDTO(
    Long id,
    String nombre,
    LocalDate fechaCreacion,
    String pais
) {}
