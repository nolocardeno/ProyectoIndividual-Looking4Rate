package com.looking4rate.backend.dtos;

/**
 * DTO para Plataforma
 */
public record PlataformaDTO(
    Long id,
    String nombre,
    Integer anioLanzamiento,
    String fabricante,
    String imagenLogo
) {}
