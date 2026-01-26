package com.looking4rate.backend.entities;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

/**
 * Entidad para las imágenes de galería de un juego
 */
@Entity
@Table(name = "imagen_juego")
@AllArgsConstructor @NoArgsConstructor @Builder
@Getter
public class ImagenJuego {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /** URL de la imagen */
    @Column(nullable = false)
    private String url;

    /** Texto alternativo para accesibilidad */
    @Column(nullable = false)
    private String alt;

    /** Título/caption de la imagen */
    @Column(nullable = true)
    private String caption;

    /** Juego al que pertenece la imagen */
    @ManyToOne
    private Juego juego;
}
