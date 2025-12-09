package com.looking4rate.backend.entities;

import java.time.LocalDate;
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
@Table(name = "desarrolladora")
@AllArgsConstructor @NoArgsConstructor @Builder
@Getter
public class Desarrolladora {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String nombre;

    @Column(nullable = false)
    private LocalDate fecha_creacion;

    @Column(nullable = false)
    private String pais;

    @OneToMany(mappedBy = "desarrolladora", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<JuegoDesarrolladora> juegos;
}
