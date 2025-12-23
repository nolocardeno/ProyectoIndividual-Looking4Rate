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

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

/**
 * Controlador para autenticación (login/registro)
 */
@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@Tag(name = "Autenticación", description = "Endpoints para registro, login y gestión de sesión")
public class AuthController {
    
    private final UsuarioService usuarioService;
    private final JwtTokenProvider jwtTokenProvider;
    
    /**
     * POST /api/auth/registro - Registra un nuevo usuario
     */
    @Operation(summary = "Registrar usuario", description = "Crea una nueva cuenta de usuario y devuelve un token JWT")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "201", description = "Usuario registrado exitosamente"),
        @ApiResponse(responseCode = "400", description = "Datos de registro inválidos"),
        @ApiResponse(responseCode = "409", description = "El email ya está registrado")
    })
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
    @Operation(summary = "Iniciar sesión", description = "Autentica al usuario y devuelve un token JWT")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Login exitoso"),
        @ApiResponse(responseCode = "401", description = "Credenciales inválidas")
    })
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
    @Operation(summary = "Obtener usuario actual", description = "Devuelve la información del usuario autenticado")
    @SecurityRequirement(name = "bearerAuth")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Usuario obtenido correctamente"),
        @ApiResponse(responseCode = "401", description = "No autenticado")
    })
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
