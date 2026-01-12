package com.looking4rate.backend.services;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.looking4rate.backend.dtos.InteraccionCreacionDTO;
import com.looking4rate.backend.dtos.InteraccionDTO;
import com.looking4rate.backend.entities.Interaccion;
import com.looking4rate.backend.entities.Juego;
import com.looking4rate.backend.entities.Usuario;
import com.looking4rate.backend.exceptions.BusinessLogicException;
import com.looking4rate.backend.exceptions.DuplicateResourceException;
import com.looking4rate.backend.exceptions.ResourceNotFoundException;
import com.looking4rate.backend.repositories.InteraccionRepository;
import com.looking4rate.backend.repositories.JuegoRepository;
import com.looking4rate.backend.repositories.UsuarioRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional
public class InteraccionService {
    
    private final InteraccionRepository interaccionRepository;
    private final UsuarioRepository usuarioRepository;
    private final JuegoRepository juegoRepository;

    // ==================== CRUD ====================

    /**
     * Lista todas las interacciones
     */
    @Transactional(readOnly = true)
    public List<InteraccionDTO> listarTodas() {
        return interaccionRepository.findAll().stream()
                .map(this::convertirADTO)
                .toList();
    }

    /**
     * Obtiene una interacción por su ID
     */
    @Transactional(readOnly = true)
    public InteraccionDTO obtenerPorId(Long id) {
        @SuppressWarnings("null")
        Interaccion interaccion = interaccionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Interaccion", id));
        return convertirADTO(interaccion);
    }

    /**
     * Crea una nueva interacción (valoración/review)
     * 
     * LÓGICA DE NEGOCIO:
     * - Un usuario solo puede tener UNA interacción por juego
     * - La puntuación debe estar entre 1 y 10 (si se proporciona)
     */
    public InteraccionDTO crear(Long usuarioId, InteraccionCreacionDTO dto) {
        // Verificar que no exista ya una interacción de este usuario con este juego
        if (interaccionRepository.existsByUsuarioIdAndJuegoId(usuarioId, dto.juegoId())) {
            throw new DuplicateResourceException("Ya existe una interacción de este usuario con este juego. Use el método actualizar.");
        }
        
        // Validar puntuación
        validarPuntuacion(dto.puntuacion());
        
        @SuppressWarnings("null")
        Usuario usuario = usuarioRepository.findById(usuarioId)
                .orElseThrow(() -> new ResourceNotFoundException("Usuario", usuarioId));
        
        @SuppressWarnings("null")
        Juego juego = juegoRepository.findById(dto.juegoId())
                .orElseThrow(() -> new ResourceNotFoundException("Juego", dto.juegoId()));
        
        Interaccion interaccion = Interaccion.builder()
                .usuario(usuario)
                .juego(juego)
                .puntuacion(dto.puntuacion())
                .review(dto.review())
                .estado_jugado(dto.estadoJugado())
                .build();
        
        @SuppressWarnings("null")
        Interaccion guardada = interaccionRepository.save(interaccion);
        return convertirADTO(guardada);
    }

    /**
     * Actualiza una interacción existente
     * 
     * LÓGICA DE NEGOCIO:
     * - Solo el propietario puede actualizar su interacción
     * - Las mismas validaciones de puntuación aplican
     */
    public InteraccionDTO actualizar(Long usuarioId, Long interaccionId, InteraccionCreacionDTO dto) {
        @SuppressWarnings("null")
        Interaccion interaccion = interaccionRepository.findById(interaccionId)
                .orElseThrow(() -> new ResourceNotFoundException("Interaccion", interaccionId));
        
        // Verificar que el usuario es el propietario
        if (interaccion.getUsuario().getId() != usuarioId) {
            throw new BusinessLogicException("No puedes modificar la interacción de otro usuario");
        }
        
        // Validar puntuación
        validarPuntuacion(dto.puntuacion());
        
        Interaccion actualizada = Interaccion.builder()
                .id(interaccion.getId())
                .usuario(interaccion.getUsuario())
                .juego(interaccion.getJuego())
                .puntuacion(dto.puntuacion())
                .review(dto.review())
                .estado_jugado(dto.estadoJugado())
                .fecha_interaccion(LocalDateTime.now()) // Actualizar fecha/hora cuando se modifica
                .build();
        
        @SuppressWarnings("null")
        Interaccion guardada = interaccionRepository.save(actualizada);
        return convertirADTO(guardada);
    }

    /**
     * Elimina una interacción
     * 
     * LÓGICA DE NEGOCIO:
     * - Solo el propietario puede eliminar su interacción
     */
    @SuppressWarnings("null")
    public void eliminar(Long usuarioId, Long interaccionId) {
        @SuppressWarnings("null")
        Interaccion interaccion = interaccionRepository.findById(interaccionId)
                .orElseThrow(() -> new ResourceNotFoundException("Interaccion", interaccionId));
        
        // Verificar que el usuario es el propietario
        if (interaccion.getUsuario().getId() != usuarioId) {
            throw new BusinessLogicException("No puedes eliminar la interacción de otro usuario");
        }
        
        interaccionRepository.deleteById(interaccionId);
    }

    // ==================== BÚSQUEDAS ====================

    /**
     * Obtiene todas las interacciones de un usuario
     */
    @Transactional(readOnly = true)
    public List<InteraccionDTO> obtenerPorUsuario(Long usuarioId) {
        return interaccionRepository.findByUsuarioId(usuarioId).stream()
                .map(this::convertirADTO)
                .toList();
    }

    /**
     * Obtiene todas las reviews de un juego
     */
    @Transactional(readOnly = true)
    public List<InteraccionDTO> obtenerPorJuego(Long juegoId) {
        return interaccionRepository.findByJuegoIdOrderByFechaInteraccionDesc(juegoId).stream()
                .map(this::convertirADTO)
                .toList();
    }

    /**
     * Obtiene la interacción de un usuario específico con un juego específico
     */
    @Transactional(readOnly = true)
    public InteraccionDTO obtenerPorUsuarioYJuego(Long usuarioId, Long juegoId) {
        Interaccion interaccion = interaccionRepository.findByUsuarioIdAndJuegoId(usuarioId, juegoId)
                .orElseThrow(() -> new ResourceNotFoundException("Interaccion", "usuario " + usuarioId + " y juego", juegoId.toString()));
        return convertirADTO(interaccion);
    }

    /**
     * Obtiene los juegos jugados por un usuario
     */
    @Transactional(readOnly = true)
    public List<InteraccionDTO> obtenerJuegosJugados(Long usuarioId) {
        return interaccionRepository.findJuegosJugadosByUsuarioId(usuarioId).stream()
                .map(this::convertirADTO)
                .toList();
    }

    /**
     * Obtiene la puntuación media de un juego
     */
    @Transactional(readOnly = true)
    public Double obtenerPuntuacionMedia(Long juegoId) {
        return interaccionRepository.findAveragePuntuacionByJuegoId(juegoId);
    }

    /**
     * Cuenta el número de reviews de un juego
     */
    @Transactional(readOnly = true)
    public Long contarReviewsPorJuego(Long juegoId) {
        return interaccionRepository.countByJuegoId(juegoId);
    }

    // ==================== LÓGICA DE NEGOCIO INTERNA ====================

    /**
     * Valida la puntuación según las reglas de negocio
     */
    private void validarPuntuacion(Integer puntuacion) {
        if (puntuacion != null) {
            // La puntuación debe estar entre 1 y 10
            if (puntuacion < 1 || puntuacion > 10) {
                throw new BusinessLogicException("La puntuación debe estar entre 1 y 10");
            }
        }
    }

    /**
     * Guarda una interacción directamente (método legacy)
     */
    public Interaccion guardarInteraccion(Interaccion interaccion) {
        // Validar puntuación si existe
        validarPuntuacion(interaccion.getPuntuacion());
        return interaccionRepository.save(interaccion);
    }

    // ==================== CONVERSIONES ====================

    private InteraccionDTO convertirADTO(Interaccion interaccion) {
        return new InteraccionDTO(
                interaccion.getId(),
                interaccion.getUsuario().getId(),
                interaccion.getUsuario().getNombre(),
                interaccion.getUsuario().getAvatar(),
                interaccion.getJuego().getId(),
                interaccion.getJuego().getNombre(),
                interaccion.getJuego().getImagen_portada(),
                interaccion.getPuntuacion(),
                interaccion.getReview(),
                interaccion.isEstado_jugado(),
                interaccion.getFecha_interaccion()
        );
    }
}
