package com.looking4rate.backend.dtos;

import java.time.LocalDate;

/**
 * DTO para respuestas de Usuario (sin contraseña)
 */
public record UsuarioDTO(
    Long id,
    String nombre,
    String email,
    LocalDate fechaRegistro,
    String avatar,
    String rol
) {}
