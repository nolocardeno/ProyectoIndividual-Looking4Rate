package com.looking4rate.backend.services;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.looking4rate.backend.dtos.DesarrolladoraDTO;
import com.looking4rate.backend.entities.Desarrolladora;
import com.looking4rate.backend.exceptions.DuplicateResourceException;
import com.looking4rate.backend.exceptions.ResourceNotFoundException;
import com.looking4rate.backend.repositories.DesarrolladoraRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional
public class DesarrolladoraService {
    
    private final DesarrolladoraRepository desarrolladoraRepository;

    // ==================== CRUD ====================

    /**
     * Lista todas las desarrolladoras
     */
    @Transactional(readOnly = true)
    public List<DesarrolladoraDTO> listarTodas() {
        return desarrolladoraRepository.findAll().stream()
                .map(this::convertirADTO)
                .toList();
    }

    /**
     * Obtiene una desarrolladora por su ID
     */
    @Transactional(readOnly = true)
    public DesarrolladoraDTO obtenerPorId(Long id) {
        @SuppressWarnings("null")
        Desarrolladora desarrolladora = desarrolladoraRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Desarrolladora", id));
        return convertirADTO(desarrolladora);
    }

    /**
     * Crea una nueva desarrolladora
     */
    public DesarrolladoraDTO crear(DesarrolladoraDTO dto) {
        // Verificar que no exista otra desarrolladora con el mismo nombre
        if (desarrolladoraRepository.findByNombre(dto.nombre()).isPresent()) {
            throw new DuplicateResourceException("Desarrolladora", "nombre", dto.nombre());
        }
        
        Desarrolladora desarrolladora = Desarrolladora.builder()
                .nombre(dto.nombre())
                .fecha_creacion(dto.fechaCreacion())
                .pais(dto.pais())
                .build();
        
        @SuppressWarnings("null")
        Desarrolladora guardada = desarrolladoraRepository.save(desarrolladora);
        return convertirADTO(guardada);
    }

    /**
     * Actualiza una desarrolladora existente
     */
    public DesarrolladoraDTO actualizar(Long id, DesarrolladoraDTO dto) {
        @SuppressWarnings("null")
        Desarrolladora desarrolladoraExistente = desarrolladoraRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Desarrolladora", id));
        
        // Verificar si el nuevo nombre ya existe en otra desarrolladora
        desarrolladoraRepository.findByNombre(dto.nombre())
                .ifPresent(d -> {
                    if (!d.getId().equals(id)) {
                        throw new DuplicateResourceException("Desarrolladora", "nombre", dto.nombre());
                    }
                });
        
        Desarrolladora actualizada = Desarrolladora.builder()
                .id(desarrolladoraExistente.getId())
                .nombre(dto.nombre())
                .fecha_creacion(dto.fechaCreacion())
                .pais(dto.pais())
                .juegos(desarrolladoraExistente.getJuegos())
                .build();
        
        @SuppressWarnings("null")
        Desarrolladora guardada = desarrolladoraRepository.save(actualizada);
        return convertirADTO(guardada);
    }

    /**
     * Elimina una desarrolladora
     */
    @SuppressWarnings("null")
    public void eliminar(Long id) {
        if (!desarrolladoraRepository.existsById(id)) {
            throw new ResourceNotFoundException("Desarrolladora", id);
        }
        desarrolladoraRepository.deleteById(id);
    }

    // ==================== BÚSQUEDAS ====================

    /**
     * Busca desarrolladoras por nombre
     */
    @Transactional(readOnly = true)
    public List<DesarrolladoraDTO> buscarPorNombre(String nombre) {
        return desarrolladoraRepository.findByNombreContainingIgnoreCase(nombre).stream()
                .map(this::convertirADTO)
                .toList();
    }

    /**
     * Busca desarrolladoras por país
     */
    @Transactional(readOnly = true)
    public List<DesarrolladoraDTO> buscarPorPais(String pais) {
        return desarrolladoraRepository.findByPais(pais).stream()
                .map(this::convertirADTO)
                .toList();
    }

    /**
     * Lista desarrolladoras ordenadas por fecha de creación
     */
    @Transactional(readOnly = true)
    public List<DesarrolladoraDTO> listarPorFechaCreacion() {
        return desarrolladoraRepository.findAllOrderByFechaCreacionAsc().stream()
                .map(this::convertirADTO)
                .toList();
    }

    // ==================== CONVERSIONES ====================

    private DesarrolladoraDTO convertirADTO(Desarrolladora desarrolladora) {
        return new DesarrolladoraDTO(
                desarrolladora.getId(),
                desarrolladora.getNombre(),
                desarrolladora.getFecha_creacion(),
                desarrolladora.getPais()
        );
    }
}
