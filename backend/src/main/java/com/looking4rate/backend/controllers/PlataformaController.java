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

import com.looking4rate.backend.dtos.PlataformaDTO;
import com.looking4rate.backend.services.PlataformaService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/plataformas")
@RequiredArgsConstructor
public class PlataformaController {
    
    private final PlataformaService plataformaService;

    // ==================== CRUD ====================

    /**
     * GET /api/plataformas - Lista todas las plataformas
     */
    @GetMapping
    public ResponseEntity<List<PlataformaDTO>> listarTodas() {
        return ResponseEntity.ok(plataformaService.listarTodas());
    }

    /**
     * GET /api/plataformas/{id} - Obtiene una plataforma por ID
     */
    @GetMapping("/{id}")
    public ResponseEntity<PlataformaDTO> obtenerPorId(@PathVariable Long id) {
        return ResponseEntity.ok(plataformaService.obtenerPorId(id));
    }

    /**
     * POST /api/plataformas - Crea una nueva plataforma (solo ADMIN)
     */
    @PostMapping
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<PlataformaDTO> crear(@RequestBody PlataformaDTO dto) {
        PlataformaDTO creada = plataformaService.crear(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(creada);
    }

    /**
     * PUT /api/plataformas/{id} - Actualiza una plataforma (solo ADMIN)
     */
    @PutMapping("/{id}")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<PlataformaDTO> actualizar(
            @PathVariable Long id,
            @RequestBody PlataformaDTO dto) {
        return ResponseEntity.ok(plataformaService.actualizar(id, dto));
    }

    /**
     * DELETE /api/plataformas/{id} - Elimina una plataforma (solo ADMIN)
     */
    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        plataformaService.eliminar(id);
        return ResponseEntity.noContent().build();
    }

    // ==================== BÚSQUEDAS ====================

    /**
     * GET /api/plataformas/buscar?nombre=xxx - Busca plataformas por nombre
     */
    @GetMapping("/buscar")
    public ResponseEntity<List<PlataformaDTO>> buscarPorNombre(@RequestParam String nombre) {
        return ResponseEntity.ok(plataformaService.buscarPorNombre(nombre));
    }

    /**
     * GET /api/plataformas/fabricante/{fabricante} - Busca plataformas por fabricante
     */
    @GetMapping("/fabricante/{fabricante}")
    public ResponseEntity<List<PlataformaDTO>> buscarPorFabricante(@PathVariable String fabricante) {
        return ResponseEntity.ok(plataformaService.buscarPorFabricante(fabricante));
    }

    /**
     * GET /api/plataformas/recientes - Lista plataformas por año descendente
     */
    @GetMapping("/recientes")
    public ResponseEntity<List<PlataformaDTO>> listarPorAnioDesc() {
        return ResponseEntity.ok(plataformaService.listarPorAnioDesc());
    }
}
