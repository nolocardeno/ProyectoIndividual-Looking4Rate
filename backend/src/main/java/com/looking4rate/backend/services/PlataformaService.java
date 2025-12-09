package com.looking4rate.backend.services;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.looking4rate.backend.dtos.PlataformaDTO;
import com.looking4rate.backend.entities.Plataforma;
import com.looking4rate.backend.exceptions.DuplicateResourceException;
import com.looking4rate.backend.exceptions.ResourceNotFoundException;
import com.looking4rate.backend.repositories.PlataformaRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional
public class PlataformaService {
    
    private final PlataformaRepository plataformaRepository;

    // ==================== CRUD ====================

    /**
     * Lista todas las plataformas
     */
    @Transactional(readOnly = true)
    public List<PlataformaDTO> listarTodas() {
        return plataformaRepository.findAll().stream()
                .map(this::convertirADTO)
                .toList();
    }

    /**
     * Obtiene una plataforma por su ID
     */
    @Transactional(readOnly = true)
    public PlataformaDTO obtenerPorId(Long id) {
        Plataforma plataforma = plataformaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Plataforma", id));
        return convertirADTO(plataforma);
    }

    /**
     * Crea una nueva plataforma
     */
    public PlataformaDTO crear(PlataformaDTO dto) {
        // Verificar que no exista otra plataforma con el mismo nombre
        if (plataformaRepository.findByNombre(dto.nombre()).isPresent()) {
            throw new DuplicateResourceException("Plataforma", "nombre", dto.nombre());
        }
        
        Plataforma plataforma = Plataforma.builder()
                .nombre(dto.nombre())
                .anio_lanzamiento(java.time.Year.of(dto.anioLanzamiento()))
                .fabricante(dto.fabricante())
                .imagen_logo(dto.imagenLogo())
                .build();
        
        Plataforma guardada = plataformaRepository.save(plataforma);
        return convertirADTO(guardada);
    }

    /**
     * Actualiza una plataforma existente
     */
    public PlataformaDTO actualizar(Long id, PlataformaDTO dto) {
        Plataforma plataformaExistente = plataformaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Plataforma", id));
        
        // Verificar si el nuevo nombre ya existe en otra plataforma
        plataformaRepository.findByNombre(dto.nombre())
                .ifPresent(p -> {
                    if (!p.getId().equals(id)) {
                        throw new DuplicateResourceException("Plataforma", "nombre", dto.nombre());
                    }
                });
        
        Plataforma actualizada = Plataforma.builder()
                .id(plataformaExistente.getId())
                .nombre(dto.nombre())
                .anio_lanzamiento(java.time.Year.of(dto.anioLanzamiento()))
                .fabricante(dto.fabricante())
                .imagen_logo(dto.imagenLogo())
                .juegos(plataformaExistente.getJuegos())
                .build();
        
        Plataforma guardada = plataformaRepository.save(actualizada);
        return convertirADTO(guardada);
    }

    /**
     * Elimina una plataforma
     */
    public void eliminar(Long id) {
        if (!plataformaRepository.existsById(id)) {
            throw new ResourceNotFoundException("Plataforma", id);
        }
        plataformaRepository.deleteById(id);
    }

    // ==================== BÚSQUEDAS ====================

    /**
     * Busca plataformas por nombre
     */
    @Transactional(readOnly = true)
    public List<PlataformaDTO> buscarPorNombre(String nombre) {
        return plataformaRepository.findByNombreContainingIgnoreCase(nombre).stream()
                .map(this::convertirADTO)
                .toList();
    }

    /**
     * Busca plataformas por fabricante
     */
    @Transactional(readOnly = true)
    public List<PlataformaDTO> buscarPorFabricante(String fabricante) {
        return plataformaRepository.findByFabricante(fabricante).stream()
                .map(this::convertirADTO)
                .toList();
    }

    /**
     * Lista plataformas ordenadas por año de lanzamiento
     */
    @Transactional(readOnly = true)
    public List<PlataformaDTO> listarPorAnioDesc() {
        return plataformaRepository.findAllOrderByAnioLanzamientoDesc().stream()
                .map(this::convertirADTO)
                .toList();
    }

    // ==================== CONVERSIONES ====================

    private PlataformaDTO convertirADTO(Plataforma plataforma) {
        return new PlataformaDTO(
                plataforma.getId(),
                plataforma.getNombre(),
                plataforma.getAnio_lanzamiento().getValue(),
                plataforma.getFabricante(),
                plataforma.getImagen_logo()
        );
    }
}
