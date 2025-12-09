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

import com.looking4rate.backend.dtos.DesarrolladoraDTO;
import com.looking4rate.backend.services.DesarrolladoraService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/desarrolladoras")
@RequiredArgsConstructor
public class DesarrolladoraController {
    
    private final DesarrolladoraService desarrolladoraService;

    // ==================== CRUD ====================

    /**
     * GET /api/desarrolladoras - Lista todas las desarrolladoras
     */
    @GetMapping
    public ResponseEntity<List<DesarrolladoraDTO>> listarTodas() {
        return ResponseEntity.ok(desarrolladoraService.listarTodas());
    }

    /**
     * GET /api/desarrolladoras/{id} - Obtiene una desarrolladora por ID
     */
    @GetMapping("/{id}")
    public ResponseEntity<DesarrolladoraDTO> obtenerPorId(@PathVariable Long id) {
        return ResponseEntity.ok(desarrolladoraService.obtenerPorId(id));
    }

    /**
     * POST /api/desarrolladoras - Crea una nueva desarrolladora (solo ADMIN)
     */
    @PostMapping
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<DesarrolladoraDTO> crear(@RequestBody DesarrolladoraDTO dto) {
        DesarrolladoraDTO creada = desarrolladoraService.crear(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(creada);
    }

    /**
     * PUT /api/desarrolladoras/{id} - Actualiza una desarrolladora (solo ADMIN)
     */
    @PutMapping("/{id}")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<DesarrolladoraDTO> actualizar(
            @PathVariable Long id,
            @RequestBody DesarrolladoraDTO dto) {
        return ResponseEntity.ok(desarrolladoraService.actualizar(id, dto));
    }

    /**
     * DELETE /api/desarrolladoras/{id} - Elimina una desarrolladora (solo ADMIN)
     */
    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        desarrolladoraService.eliminar(id);
        return ResponseEntity.noContent().build();
    }

    // ==================== BÚSQUEDAS ====================

    /**
     * GET /api/desarrolladoras/buscar?nombre=xxx - Busca desarrolladoras por nombre
     */
    @GetMapping("/buscar")
    public ResponseEntity<List<DesarrolladoraDTO>> buscarPorNombre(@RequestParam String nombre) {
        return ResponseEntity.ok(desarrolladoraService.buscarPorNombre(nombre));
    }

    /**
     * GET /api/desarrolladoras/pais/{pais} - Busca desarrolladoras por país
     */
    @GetMapping("/pais/{pais}")
    public ResponseEntity<List<DesarrolladoraDTO>> buscarPorPais(@PathVariable String pais) {
        return ResponseEntity.ok(desarrolladoraService.buscarPorPais(pais));
    }

    /**
     * GET /api/desarrolladoras/antiguas - Lista desarrolladoras por fecha de creación
     */
    @GetMapping("/antiguas")
    public ResponseEntity<List<DesarrolladoraDTO>> listarPorFechaCreacion() {
        return ResponseEntity.ok(desarrolladoraService.listarPorFechaCreacion());
    }
}
