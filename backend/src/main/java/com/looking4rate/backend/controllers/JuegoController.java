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
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.looking4rate.backend.dtos.JuegoCreacionDTO;
import com.looking4rate.backend.dtos.JuegoDTO;
import com.looking4rate.backend.dtos.JuegoResumenDTO;
import com.looking4rate.backend.services.JuegoService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/juegos")
@RequiredArgsConstructor
public class JuegoController {

    private final JuegoService juegoService;

    // ==================== CRUD ====================

    /**
     * GET /api/juegos - Lista todos los juegos (resumen)
     */
    @GetMapping
    public ResponseEntity<List<JuegoResumenDTO>> listarTodos() {
        return ResponseEntity.ok(juegoService.listarTodos());
    }

    /**
     * GET /api/juegos/{id} - Obtiene un juego por ID (detalle completo)
     */
    @GetMapping("/{id}")
    public ResponseEntity<JuegoDTO> obtenerPorId(@PathVariable Long id) {
        return ResponseEntity.ok(juegoService.obtenerPorId(id));
    }

    /**
     * POST /api/juegos - Crea un nuevo juego (solo ADMIN)
     */
    @PostMapping
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<JuegoDTO> crear(@RequestBody JuegoCreacionDTO dto) {
        JuegoDTO creado = juegoService.crear(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(creado);
    }

    /**
     * PUT /api/juegos/{id} - Actualiza un juego existente (solo ADMIN)
     */
    @PutMapping("/{id}")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<JuegoDTO> actualizar(@PathVariable Long id, @RequestBody JuegoCreacionDTO dto) {
        return ResponseEntity.ok(juegoService.actualizar(id, dto));
    }

    /**
     * DELETE /api/juegos/{id} - Elimina un juego (solo ADMIN)
     */
    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        juegoService.eliminar(id);
        return ResponseEntity.noContent().build();
    }

    // ==================== BÚSQUEDAS ====================

    /**
     * GET /api/juegos/buscar?nombre=xxx - Busca juegos por nombre
     */
    @GetMapping("/buscar")
    public ResponseEntity<List<JuegoResumenDTO>> buscarPorNombre(@RequestParam String nombre) {
        return ResponseEntity.ok(juegoService.buscarPorNombre(nombre));
    }

    /**
     * GET /api/juegos/novedades - Obtiene los juegos más recientes
     */
    @GetMapping("/novedades")
    public ResponseEntity<List<JuegoResumenDTO>> obtenerNovedades() {
        return ResponseEntity.ok(juegoService.obtenerNovedades());
    }

    /**
     * GET /api/juegos/proximos - Obtiene los próximos lanzamientos
     */
    @GetMapping("/proximos")
    public ResponseEntity<List<JuegoResumenDTO>> obtenerProximosLanzamientos() {
        return ResponseEntity.ok(juegoService.obtenerProximosLanzamientos());
    }

    /**
     * GET /api/juegos/top?limite=10 - Obtiene los juegos mejor valorados
     */
    @GetMapping("/top")
    public ResponseEntity<List<JuegoResumenDTO>> obtenerMejorValorados(
            @RequestParam(defaultValue = "10") int limite) {
        return ResponseEntity.ok(juegoService.obtenerMejorValorados(limite));
    }

    /**
     * GET /api/juegos/populares?limite=10 - Obtiene los juegos más reviewados
     */
    @GetMapping("/populares")
    public ResponseEntity<List<JuegoResumenDTO>> obtenerMasReviewados(
            @RequestParam(defaultValue = "10") int limite) {
        return ResponseEntity.ok(juegoService.obtenerMasReviewados(limite));
    }
}