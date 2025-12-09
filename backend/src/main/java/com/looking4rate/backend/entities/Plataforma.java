package com.looking4rate.backend.entities;

import java.time.Year;
import java.util.List;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "plataforma")
@AllArgsConstructor @NoArgsConstructor @Builder
@Getter
public class Plataforma {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String nombre;

    @Column(nullable = false)
    private Year anio_lanzamiento;

    @Column(nullable = false)
    private String fabricante;

    @Column(nullable = true)
    private String imagen_logo; 

    @OneToMany(mappedBy = "plataforma", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<JuegoPlataforma> juegos;
}
