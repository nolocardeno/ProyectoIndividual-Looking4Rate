package com.looking4rate.backend.services;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.looking4rate.backend.dtos.GeneroDTO;
import com.looking4rate.backend.entities.Genero;
import com.looking4rate.backend.exceptions.DuplicateResourceException;
import com.looking4rate.backend.exceptions.ResourceNotFoundException;
import com.looking4rate.backend.repositories.GeneroRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional
public class GeneroService {
    
    private final GeneroRepository generoRepository;

    // ==================== CRUD ====================

    /**
     * Lista todos los géneros
     */
    @Transactional(readOnly = true)
    public List<GeneroDTO> listarTodos() {
        return generoRepository.findAll().stream()
                .map(this::convertirADTO)
                .toList();
    }

    /**
     * Obtiene un género por su ID
     */
    @Transactional(readOnly = true)
    public GeneroDTO obtenerPorId(Long id) {
        Genero genero = generoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Genero", id));
        return convertirADTO(genero);
    }

    /**
     * Crea un nuevo género
     */
    public GeneroDTO crear(GeneroDTO dto) {
        // Verificar que no exista otro género con el mismo nombre
        if (generoRepository.existsByNombre(dto.nombre())) {
            throw new DuplicateResourceException("Genero", "nombre", dto.nombre());
        }
        
        Genero genero = Genero.builder()
                .nombre(dto.nombre())
                .descripcion(dto.descripcion())
                .build();
        
        Genero guardado = generoRepository.save(genero);
        return convertirADTO(guardado);
    }

    /**
     * Actualiza un género existente
     */
    public GeneroDTO actualizar(Long id, GeneroDTO dto) {
        Genero generoExistente = generoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Genero", id));
        
        // Verificar si el nuevo nombre ya existe en otro género
        generoRepository.findByNombre(dto.nombre())
                .ifPresent(g -> {
                    if (!g.getId().equals(id)) {
                        throw new DuplicateResourceException("Genero", "nombre", dto.nombre());
                    }
                });
        
        Genero actualizado = Genero.builder()
                .id(generoExistente.getId())
                .nombre(dto.nombre())
                .descripcion(dto.descripcion())
                .juegos(generoExistente.getJuegos())
                .build();
        
        Genero guardado = generoRepository.save(actualizado);
        return convertirADTO(guardado);
    }

    /**
     * Elimina un género
     */
    public void eliminar(Long id) {
        if (!generoRepository.existsById(id)) {
            throw new ResourceNotFoundException("Genero", id);
        }
        generoRepository.deleteById(id);
    }

    // ==================== BÚSQUEDAS ====================

    /**
     * Busca géneros por nombre
     */
    @Transactional(readOnly = true)
    public List<GeneroDTO> buscarPorNombre(String nombre) {
        return generoRepository.findByNombreContainingIgnoreCase(nombre).stream()
                .map(this::convertirADTO)
                .toList();
    }

    // ==================== CONVERSIONES ====================

    private GeneroDTO convertirADTO(Genero genero) {
        return new GeneroDTO(
                genero.getId(),
                genero.getNombre(),
                genero.getDescripcion()
        );
    }
}
