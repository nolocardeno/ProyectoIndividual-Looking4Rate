package com.looking4rate.backend.dtos;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

/**
 * DTO para cambio de contraseña
 * Incluye la contraseña actual para validación
 */
public record CambioContraseniaDTO(
    @NotBlank(message = "La contraseña actual es obligatoria")
    String contraseniaActual,
    
    @NotBlank(message = "La nueva contraseña es obligatoria")
    @Size(min = 6, max = 100, message = "La nueva contraseña debe tener entre 6 y 100 caracteres")
    String contraseniaNueva
) {}
