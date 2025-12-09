package com.looking4rate.backend.controllers;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.looking4rate.backend.dtos.UsuarioDTO;
import com.looking4rate.backend.dtos.UsuarioLoginDTO;
import com.looking4rate.backend.dtos.UsuarioRegistroDTO;
import com.looking4rate.backend.entities.Usuario;
import com.looking4rate.backend.security.JwtTokenProvider;
import com.looking4rate.backend.security.SecurityUtils;
import com.looking4rate.backend.security.CustomUserDetailsService.CustomUserDetails;
import com.looking4rate.backend.services.UsuarioService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

/**
 * Controlador para autenticación (login/registro)
 */
@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {
    
    private final UsuarioService usuarioService;
    private final JwtTokenProvider jwtTokenProvider;
    
    /**
     * POST /api/auth/registro - Registra un nuevo usuario
     */
    @PostMapping("/registro")
    public ResponseEntity<AuthResponse> registro(@Valid @RequestBody UsuarioRegistroDTO dto) {
        UsuarioDTO usuario = usuarioService.registrar(dto);
        
        // Autenticar y generar token
        Usuario entidad = usuarioService.autenticar(new UsuarioLoginDTO(dto.email(), dto.contrasenia()));
        String token = jwtTokenProvider.generarToken(entidad);
        
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(new AuthResponse(token, usuario, "Usuario registrado exitosamente"));
    }
    
    /**
     * POST /api/auth/login - Inicia sesión
     */
    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody UsuarioLoginDTO dto) {
        Usuario usuario = usuarioService.autenticar(dto);
        String token = jwtTokenProvider.generarToken(usuario);
        
        UsuarioDTO usuarioDTO = new UsuarioDTO(
                usuario.getId(),
                usuario.getNombre(),
                usuario.getEmail(),
                usuario.getFecha_registro(),
                usuario.getAvatar(),
                usuario.getRol().name()
        );
        
        return ResponseEntity.ok(new AuthResponse(token, usuarioDTO, "Login exitoso"));
    }
    
    /**
     * GET /api/auth/me - Obtiene información del usuario autenticado
     */
    @GetMapping("/me")
    public ResponseEntity<UsuarioDTO> obtenerUsuarioActual() {
        CustomUserDetails userDetails = SecurityUtils.getUsuarioActual();
        UsuarioDTO dto = usuarioService.obtenerPorId(userDetails.getId());
        return ResponseEntity.ok(dto);
    }
    
    /**
     * POST /api/auth/validar - Valida si un token es válido
     */
    @PostMapping("/validar")
    public ResponseEntity<TokenValidationResponse> validarToken(@RequestBody TokenRequest request) {
        boolean valido = jwtTokenProvider.validarToken(request.token());
        return ResponseEntity.ok(new TokenValidationResponse(valido));
    }
    
    /**
     * Clase interna para la respuesta de autenticación
     */
    public record AuthResponse(
        String token,
        UsuarioDTO usuario,
        String mensaje
    ) {}
    
    /**
     * Request para validar token
     */
    public record TokenRequest(String token) {}
    
    /**
     * Response de validación de token
     */
    public record TokenValidationResponse(boolean valido) {}
}
