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

import com.looking4rate.backend.dtos.GeneroDTO;
import com.looking4rate.backend.services.GeneroService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/generos")
@RequiredArgsConstructor
public class GeneroController {
    
    private final GeneroService generoService;

    // ==================== CRUD ====================

    /**
     * GET /api/generos - Lista todos los géneros
     */
    @GetMapping
    public ResponseEntity<List<GeneroDTO>> listarTodos() {
        return ResponseEntity.ok(generoService.listarTodos());
    }

    /**
     * GET /api/generos/{id} - Obtiene un género por ID
     */
    @GetMapping("/{id}")
    public ResponseEntity<GeneroDTO> obtenerPorId(@PathVariable Long id) {
        return ResponseEntity.ok(generoService.obtenerPorId(id));
    }

    /**
     * POST /api/generos - Crea un nuevo género (solo ADMIN)
     */
    @PostMapping
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<GeneroDTO> crear(@RequestBody GeneroDTO dto) {
        GeneroDTO creado = generoService.crear(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(creado);
    }

    /**
     * PUT /api/generos/{id} - Actualiza un género (solo ADMIN)
     */
    @PutMapping("/{id}")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<GeneroDTO> actualizar(
            @PathVariable Long id,
            @RequestBody GeneroDTO dto) {
        return ResponseEntity.ok(generoService.actualizar(id, dto));
    }

    /**
     * DELETE /api/generos/{id} - Elimina un género (solo ADMIN)
     */
    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        generoService.eliminar(id);
        return ResponseEntity.noContent().build();
    }

    // ==================== BÚSQUEDAS ====================

    /**
     * GET /api/generos/buscar?nombre=xxx - Busca géneros por nombre
     */
    @GetMapping("/buscar")
    public ResponseEntity<List<GeneroDTO>> buscarPorNombre(@RequestParam String nombre) {
        return ResponseEntity.ok(generoService.buscarPorNombre(nombre));
    }
}
