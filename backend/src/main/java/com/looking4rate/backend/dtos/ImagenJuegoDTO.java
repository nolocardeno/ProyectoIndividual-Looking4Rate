package com.looking4rate.backend.dtos;

/**
 * DTO para las imágenes de galería de un juego
 */
public record ImagenJuegoDTO(
    Long id,
    String url,
    String alt,
    String caption
) {}
