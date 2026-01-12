package com.looking4rate.backend.services;

import java.util.List;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.looking4rate.backend.dtos.CambioContraseniaDTO;
import com.looking4rate.backend.dtos.UsuarioActualizacionDTO;
import com.looking4rate.backend.dtos.UsuarioDTO;
import com.looking4rate.backend.dtos.UsuarioLoginDTO;
import com.looking4rate.backend.dtos.UsuarioRegistroDTO;
import com.looking4rate.backend.entities.Usuario;
import com.looking4rate.backend.exceptions.DuplicateResourceException;
import com.looking4rate.backend.exceptions.ResourceNotFoundException;
import com.looking4rate.backend.exceptions.UnauthorizedException;
import com.looking4rate.backend.repositories.UsuarioRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional
public class UsuarioService {
    
    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;
    
    // ==================== CRUD ====================
    
    /**
     * Obtiene todos los usuarios
     */
    @Transactional(readOnly = true)
    public List<UsuarioDTO> listarTodos() {
        return usuarioRepository.findAll().stream()
                .map(this::convertirADTO)
                .toList();
    }
    
    /**
     * Obtiene un usuario por su ID
     */
    @Transactional(readOnly = true)
    public UsuarioDTO obtenerPorId(Long id) {
        @SuppressWarnings("null")
        Usuario usuario = usuarioRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Usuario", id));
        return convertirADTO(usuario);
    }
    
    /**
     * Obtiene un usuario por email
     */
    @Transactional(readOnly = true)
    public UsuarioDTO obtenerPorEmail(String email) {
        Usuario usuario = usuarioRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Usuario", "email", email));
        return convertirADTO(usuario);
    }
    
    /**
     * Registra un nuevo usuario
     */
    public UsuarioDTO registrar(UsuarioRegistroDTO dto) {
        // Verificar que el email no esté en uso
        if (usuarioRepository.existsByEmail(dto.email())) {
            throw new DuplicateResourceException("Usuario", "email", dto.email());
        }
        
        // El primer usuario registrado será ADMIN automáticamente
        boolean esPrimerUsuario = usuarioRepository.count() == 0;
        
        Usuario usuario = Usuario.builder()
                .nombre(dto.nombre())
                .email(dto.email())
                .contrasenia(passwordEncoder.encode(dto.contrasenia()))
                .rol(esPrimerUsuario ? Usuario.Rol.ADMIN : Usuario.Rol.USER)
                .activo(true)
                .build();
        
        @SuppressWarnings("null")
        Usuario guardado = usuarioRepository.save(usuario);
        return convertirADTO(guardado);
    }
    
    /**
     * Actualiza un usuario existente
     */
    public UsuarioDTO actualizar(Long id, UsuarioActualizacionDTO dto) {
        @SuppressWarnings("null")
        Usuario usuario = usuarioRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Usuario", id));
        
        // Verificar si el nuevo email ya está en uso por otro usuario
        if (!usuario.getEmail().equals(dto.email()) && usuarioRepository.existsByEmail(dto.email())) {
            throw new DuplicateResourceException("Usuario", "email", dto.email());
        }
        
        // Crear nuevo usuario con datos actualizados (inmutabilidad con Lombok @Builder)
        Usuario actualizado = builderDesdeExistente(usuario)
                .nombre(dto.nombre())
                .email(dto.email())
                .contrasenia(dto.contrasenia() != null && !dto.contrasenia().isEmpty() 
                        ? passwordEncoder.encode(dto.contrasenia()) 
                        : usuario.getContrasenia())
                .build();
        
        @SuppressWarnings("null")
        Usuario guardado = usuarioRepository.save(actualizado);
        return convertirADTO(guardado);
    }
    
    /**
     * Actualiza el avatar de un usuario
     */
    public UsuarioDTO actualizarAvatar(Long id, String avatarUrl) {
        @SuppressWarnings("null")
        Usuario usuario = usuarioRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Usuario", id));
        
        Usuario actualizado = builderDesdeExistente(usuario)
                .avatar(avatarUrl)
                .build();
        
        @SuppressWarnings("null")
        Usuario guardado = usuarioRepository.save(actualizado);
        return convertirADTO(guardado);
    }
    
    /**
     * Elimina un usuario
     */
    @SuppressWarnings("null")
    public void eliminar(Long id) {
        if (!usuarioRepository.existsById(id)) {
            throw new ResourceNotFoundException("Usuario", id);
        }
        usuarioRepository.deleteById(id);
    }
    
    /**
     * Cambia la contraseña de un usuario validando la contraseña actual
     */
    public UsuarioDTO cambiarContrasenia(Long id, CambioContraseniaDTO dto) {
        @SuppressWarnings("null")
        Usuario usuario = usuarioRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Usuario", id));
        
        // Verificar que la contraseña actual es correcta
        if (!passwordEncoder.matches(dto.contraseniaActual(), usuario.getContrasenia())) {
            throw new UnauthorizedException("WRONG_CURRENT_PASSWORD");
        }
        
        // Crear usuario actualizado con nueva contraseña
        Usuario actualizado = builderDesdeExistente(usuario)
                .contrasenia(passwordEncoder.encode(dto.contraseniaNueva()))
                .build();
        
        @SuppressWarnings("null")
        Usuario guardado = usuarioRepository.save(actualizado);
        return convertirADTO(guardado);
    }
    
    // ==================== LÓGICA DE NEGOCIO ====================
    
    /**
     * Autentica un usuario (login)
     */
    @Transactional(readOnly = true)
    public Usuario autenticar(UsuarioLoginDTO dto) {
        Usuario usuario = usuarioRepository.findByEmail(dto.email())
                .orElseThrow(() -> new UnauthorizedException("EMAIL_NOT_FOUND"));
        
        if (!passwordEncoder.matches(dto.contrasenia(), usuario.getContrasenia())) {
            throw new UnauthorizedException("WRONG_PASSWORD");
        }
        
        return usuario;
    }
    
    /**
     * Verifica si existe un email registrado
     */
    @Transactional(readOnly = true)
    public boolean existeEmail(String email) {
        return usuarioRepository.existsByEmail(email);
    }
    
    /**
     * Verifica si existe un nombre de usuario registrado
     */
    @Transactional(readOnly = true)
    public boolean existeNombre(String nombre) {
        return usuarioRepository.existsByNombre(nombre);
    }
    
    /**
     * Busca usuarios por nombre
     */
    @Transactional(readOnly = true)
    public List<UsuarioDTO> buscarPorNombre(String nombre) {
        return usuarioRepository.findByNombreContainingIgnoreCase(nombre).stream()
                .map(this::convertirADTO)
                .toList();
    }
    
    /**
     * Obtiene la entidad Usuario (uso interno para relaciones)
     */
    @SuppressWarnings("null")
    @Transactional(readOnly = true)
    public Usuario obtenerEntidadPorId(Long id) {
        return usuarioRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Usuario", id));
    }
    
    // ==================== CONVERSIONES ====================
    
    /**
     * Construye un Usuario actualizado preservando campos inmutables
     */
    private Usuario.UsuarioBuilder builderDesdeExistente(Usuario original) {
        return Usuario.builder()
                .id(original.getId())
                .nombre(original.getNombre())
                .email(original.getEmail())
                .contrasenia(original.getContrasenia())
                .fecha_registro(original.getFecha_registro())
                .avatar(original.getAvatar())
                .rol(original.getRol())
                .activo(original.isActivo())
                .interacciones(original.getInteracciones());
    }
    
    private UsuarioDTO convertirADTO(Usuario usuario) {
        return new UsuarioDTO(
                usuario.getId(),
                usuario.getNombre(),
                usuario.getEmail(),
                usuario.getFecha_registro(),
                usuario.getAvatar(),
                usuario.getRol().name()
        );
    }
}
