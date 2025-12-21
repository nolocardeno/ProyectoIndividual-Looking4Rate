package com.looking4rate.backend.dtos;

import java.time.LocalDate;
import java.util.List;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PastOrPresent;
import jakarta.validation.constraints.Size;

/**
 * DTO para crear/actualizar juegos
 */
public record JuegoCreacionDTO(
    @NotBlank(message = "El nombre del juego es obligatorio")
    @Size(max = 200, message = "El nombre no puede superar los 200 caracteres")
    String nombre,
    
    @NotBlank(message = "La descripción del juego es obligatoria")
    @Size(max = 2000, message = "La descripción no puede superar los 2000 caracteres")
    String descripcion,
    
    @Size(max = 500, message = "La URL de la imagen no puede superar los 500 caracteres")
    String imagenPortada,
    
    @NotNull(message = "La fecha de salida es obligatoria")
    @PastOrPresent(message = "La fecha de salida no puede ser futura")
    LocalDate fechaSalida,
    
    @NotEmpty(message = "Debe especificar al menos una plataforma")
    List<Long> plataformaIds,
    
    @NotEmpty(message = "Debe especificar al menos una desarrolladora")
    List<Long> desarrolladoraIds,
    
    @NotEmpty(message = "Debe especificar al menos un género")
    List<Long> generoIds
) {}
