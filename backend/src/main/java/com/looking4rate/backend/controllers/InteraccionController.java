package com.looking4rate.backend.controllers;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.looking4rate.backend.dtos.InteraccionCreacionDTO;
import com.looking4rate.backend.dtos.InteraccionDTO;
import com.looking4rate.backend.services.InteraccionService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/interacciones")
@RequiredArgsConstructor
public class InteraccionController {
    
    private final InteraccionService interaccionService;

    // ==================== CRUD ====================

    /**
     * GET /api/interacciones - Lista todas las interacciones (solo ADMIN)
     */
    @GetMapping
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<List<InteraccionDTO>> listarTodas() {
        return ResponseEntity.ok(interaccionService.listarTodas());
    }

    /**
     * GET /api/interacciones/{id} - Obtiene una interacción por ID
     */
    @GetMapping("/{id}")
    public ResponseEntity<InteraccionDTO> obtenerPorId(@PathVariable Long id) {
        return ResponseEntity.ok(interaccionService.obtenerPorId(id));
    }

    /**
     * POST /api/interacciones/usuario/{usuarioId} - Crea una nueva interacción (propio usuario o ADMIN)
     * 
     * LÓGICA DE NEGOCIO:
     * - Un usuario solo puede tener una interacción por juego
     * - La puntuación debe ser entre 1-10
     * - Para puntuar, debe marcar el juego como jugado
     */
    @PostMapping("/usuario/{usuarioId}")
    @PreAuthorize("hasAuthority('ADMIN') or #usuarioId == authentication.principal.id")
    public ResponseEntity<InteraccionDTO> crear(
            @PathVariable Long usuarioId,
            @Valid @RequestBody InteraccionCreacionDTO dto) {
        InteraccionDTO creada = interaccionService.crear(usuarioId, dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(creada);
    }

    /**
     * PUT /api/interacciones/{id}/usuario/{usuarioId} - Actualiza una interacción (propio usuario o ADMIN)
     */
    @PutMapping("/{id}/usuario/{usuarioId}")
    @PreAuthorize("hasAuthority('ADMIN') or #usuarioId == authentication.principal.id")
    public ResponseEntity<InteraccionDTO> actualizar(
            @PathVariable Long id,
            @PathVariable Long usuarioId,
            @Valid @RequestBody InteraccionCreacionDTO dto) {
        return ResponseEntity.ok(interaccionService.actualizar(usuarioId, id, dto));
    }

    /**
     * DELETE /api/interacciones/{id}/usuario/{usuarioId} - Elimina una interacción (propio usuario o ADMIN)
     */
    @DeleteMapping("/{id}/usuario/{usuarioId}")
    @PreAuthorize("hasAuthority('ADMIN') or #usuarioId == authentication.principal.id")
    public ResponseEntity<Void> eliminar(
            @PathVariable Long id,
            @PathVariable Long usuarioId) {
        interaccionService.eliminar(usuarioId, id);
        return ResponseEntity.noContent().build();
    }

    // ==================== BÚSQUEDAS ====================

    /**
     * GET /api/interacciones/usuario/{usuarioId} - Obtiene interacciones de un usuario
     */
    @GetMapping("/usuario/{usuarioId}")
    public ResponseEntity<List<InteraccionDTO>> obtenerPorUsuario(@PathVariable Long usuarioId) {
        return ResponseEntity.ok(interaccionService.obtenerPorUsuario(usuarioId));
    }

    /**
     * GET /api/interacciones/juego/{juegoId} - Obtiene reviews de un juego
     */
    @GetMapping("/juego/{juegoId}")
    public ResponseEntity<List<InteraccionDTO>> obtenerPorJuego(@PathVariable Long juegoId) {
        return ResponseEntity.ok(interaccionService.obtenerPorJuego(juegoId));
    }

    /**
     * GET /api/interacciones/usuario/{usuarioId}/juego/{juegoId} - Obtiene interacción específica
     */
    @GetMapping("/usuario/{usuarioId}/juego/{juegoId}")
    public ResponseEntity<InteraccionDTO> obtenerPorUsuarioYJuego(
            @PathVariable Long usuarioId,
            @PathVariable Long juegoId) {
        return ResponseEntity.ok(interaccionService.obtenerPorUsuarioYJuego(usuarioId, juegoId));
    }

    /**
     * GET /api/interacciones/usuario/{usuarioId}/jugados - Obtiene juegos jugados por usuario
     */
    @GetMapping("/usuario/{usuarioId}/jugados")
    public ResponseEntity<List<InteraccionDTO>> obtenerJuegosJugados(@PathVariable Long usuarioId) {
        return ResponseEntity.ok(interaccionService.obtenerJuegosJugados(usuarioId));
    }

    /**
     * GET /api/interacciones/juego/{juegoId}/puntuacion - Obtiene puntuación media de un juego
     */
    @GetMapping("/juego/{juegoId}/puntuacion")
    public ResponseEntity<Double> obtenerPuntuacionMedia(@PathVariable Long juegoId) {
        Double puntuacion = interaccionService.obtenerPuntuacionMedia(juegoId);
        return ResponseEntity.ok(puntuacion != null ? puntuacion : 0.0);
    }

    /**
     * GET /api/interacciones/juego/{juegoId}/count - Cuenta reviews de un juego
     */
    @GetMapping("/juego/{juegoId}/count")
    public ResponseEntity<Long> contarReviews(@PathVariable Long juegoId) {
        return ResponseEntity.ok(interaccionService.contarReviewsPorJuego(juegoId));
    }
}
