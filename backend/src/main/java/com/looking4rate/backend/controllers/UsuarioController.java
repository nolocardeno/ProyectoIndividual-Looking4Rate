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

import com.looking4rate.backend.dtos.AvatarDTO;
import com.looking4rate.backend.dtos.CambioContraseniaDTO;
import com.looking4rate.backend.dtos.UsuarioActualizacionDTO;
import com.looking4rate.backend.dtos.UsuarioDTO;
import com.looking4rate.backend.dtos.UsuarioRegistroDTO;
import com.looking4rate.backend.services.UsuarioService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/usuarios")
@RequiredArgsConstructor
public class UsuarioController {
    
    private final UsuarioService usuarioService;

    // ==================== CRUD ====================

    /**
     * GET /api/usuarios - Lista todos los usuarios (solo ADMIN)
     */
    @GetMapping
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<List<UsuarioDTO>> listarTodos() {
        return ResponseEntity.ok(usuarioService.listarTodos());
    }

    /**
     * GET /api/usuarios/{id} - Obtiene un usuario por ID (propio usuario o ADMIN)
     */
    @GetMapping("/{id}")
    @PreAuthorize("hasAuthority('ADMIN') or #id == authentication.principal.id")
    public ResponseEntity<UsuarioDTO> obtenerPorId(@PathVariable Long id) {
        return ResponseEntity.ok(usuarioService.obtenerPorId(id));
    }

    /**
     * POST /api/usuarios - Registra un nuevo usuario
     */
    @PostMapping
    public ResponseEntity<UsuarioDTO> registrar(@RequestBody UsuarioRegistroDTO dto) {
        UsuarioDTO creado = usuarioService.registrar(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(creado);
    }

    /**
     * PUT /api/usuarios/{id} - Actualiza un usuario (propio usuario o ADMIN)
     * La contraseña es opcional - si no se envía o está vacía, se mantiene la actual
     */
    @PutMapping("/{id}")
    @PreAuthorize("hasAuthority('ADMIN') or #id == authentication.principal.id")
    public ResponseEntity<UsuarioDTO> actualizar(
            @PathVariable Long id,
            @RequestBody UsuarioActualizacionDTO dto) {
        return ResponseEntity.ok(usuarioService.actualizar(id, dto));
    }

    /**
     * PUT /api/usuarios/{id}/avatar - Actualiza el avatar de un usuario (propio usuario o ADMIN)
     */
    @PutMapping("/{id}/avatar")
    @PreAuthorize("hasAuthority('ADMIN') or #id == authentication.principal.id")
    public ResponseEntity<UsuarioDTO> actualizarAvatar(
            @PathVariable Long id,
            @RequestBody AvatarDTO dto) {
        return ResponseEntity.ok(usuarioService.actualizarAvatar(id, dto.avatarUrl()));
    }

    /**
     * PUT /api/usuarios/{id}/contrasenia - Cambia la contraseña de un usuario (propio usuario o ADMIN)
     * Requiere validar la contraseña actual
     */
    @PutMapping("/{id}/contrasenia")
    @PreAuthorize("hasAuthority('ADMIN') or #id == authentication.principal.id")
    public ResponseEntity<UsuarioDTO> cambiarContrasenia(
            @PathVariable Long id,
            @RequestBody CambioContraseniaDTO dto) {
        return ResponseEntity.ok(usuarioService.cambiarContrasenia(id, dto));
    }

    /**
     * DELETE /api/usuarios/{id} - Elimina un usuario (solo ADMIN)
     */
    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        usuarioService.eliminar(id);
        return ResponseEntity.noContent().build();
    }

    // ==================== BÚSQUEDAS ====================

    /**
     * GET /api/usuarios/buscar?nombre=xxx - Busca usuarios por nombre (solo ADMIN)
     */
    @GetMapping("/buscar")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<List<UsuarioDTO>> buscarPorNombre(@RequestParam String nombre) {
        return ResponseEntity.ok(usuarioService.buscarPorNombre(nombre));
    }

    /**
     * GET /api/usuarios/email/{email} - Obtiene un usuario por email (solo ADMIN)
     */
    @GetMapping("/email/{email}")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<UsuarioDTO> obtenerPorEmail(@PathVariable String email) {
        return ResponseEntity.ok(usuarioService.obtenerPorEmail(email));
    }
}
