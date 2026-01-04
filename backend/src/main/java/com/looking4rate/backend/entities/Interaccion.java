package com.looking4rate.backend.entities;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "interaccion")
@AllArgsConstructor @NoArgsConstructor @Builder
@Getter
public class Interaccion {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    private Usuario usuario;

    @ManyToOne
    private Juego juego;

    @Column(nullable = true)
    private Integer puntuacion;

    @Column(nullable = true)
    private String review;

    @Column(nullable = false)
    private boolean estado_jugado;

    @Column(nullable = false)
    private LocalDateTime fecha_interaccion;

    @PrePersist
    protected void alCrear() {
        fecha_interaccion = LocalDateTime.now();
    }
}
