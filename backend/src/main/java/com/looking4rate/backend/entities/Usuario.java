package com.looking4rate.backend.entities;

import java.time.LocalDate;
import java.util.List;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "usuario")
@AllArgsConstructor @NoArgsConstructor @Builder
@Getter
public class Usuario {
    
    /**
     * Roles de usuario
     */
    public enum Rol {
        USER,   // Usuario normal
        ADMIN   // Administrador
    }
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @Column(nullable = false)
    private String nombre;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String contrasenia;

    @Column(nullable = false)
    private LocalDate fecha_registro;

    @Column(nullable = true, columnDefinition = "TEXT")
    private String avatar;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    @Setter
    private Rol rol = Rol.USER;
    
    @Column(nullable = false)
    @Builder.Default
    @Setter
    private boolean activo = true;

    @OneToMany(mappedBy = "usuario", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Interaccion> interacciones;

    @PrePersist
    protected void alCrear() {
        fecha_registro = LocalDate.now();
        if (rol == null) {
            rol = Rol.USER;
        }
    }
}
