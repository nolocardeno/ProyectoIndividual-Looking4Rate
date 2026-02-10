package com.looking4rate.backend.dtos;

public record JuegoRankingDTO(
    Integer posicion,
    Long id,
    String nombre,
    String imagenPortada,
    Double puntuacionMedia,
    Long totalReviews
) {}
