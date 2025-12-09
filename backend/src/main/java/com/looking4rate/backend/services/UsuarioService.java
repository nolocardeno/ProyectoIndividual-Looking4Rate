package com.looking4rate.backend.services;

import java.util.List;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

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
        
        Usuario guardado = usuarioRepository.save(usuario);
        return convertirADTO(guardado);
    }
    
    /**
     * Actualiza un usuario existente
     */
    public UsuarioDTO actualizar(Long id, UsuarioRegistroDTO dto) {
        Usuario usuario = usuarioRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Usuario", id));
        
        // Verificar si el nuevo email ya está en uso por otro usuario
        if (!usuario.getEmail().equals(dto.email()) && usuarioRepository.existsByEmail(dto.email())) {
            throw new DuplicateResourceException("Usuario", "email", dto.email());
        }
        
        // Crear nuevo usuario con datos actualizados (inmutabilidad con Lombok @Builder)
        Usuario actualizado = Usuario.builder()
                .id(usuario.getId())
                .nombre(dto.nombre())
                .email(dto.email())
                .contrasenia(dto.contrasenia() != null && !dto.contrasenia().isEmpty() 
                        ? passwordEncoder.encode(dto.contrasenia()) 
                        : usuario.getContrasenia())
                .fecha_registro(usuario.getFecha_registro())
                .avatar(usuario.getAvatar())
                .rol(usuario.getRol())
                .activo(usuario.isActivo())
                .interacciones(usuario.getInteracciones())
                .build();
        
        Usuario guardado = usuarioRepository.save(actualizado);
        return convertirADTO(guardado);
    }
    
    /**
     * Actualiza el avatar de un usuario
     */
    public UsuarioDTO actualizarAvatar(Long id, String avatarUrl) {
        Usuario usuario = usuarioRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Usuario", id));
        
        Usuario actualizado = Usuario.builder()
                .id(usuario.getId())
                .nombre(usuario.getNombre())
                .email(usuario.getEmail())
                .contrasenia(usuario.getContrasenia())
                .fecha_registro(usuario.getFecha_registro())
                .avatar(avatarUrl)
                .rol(usuario.getRol())
                .activo(usuario.isActivo())
                .interacciones(usuario.getInteracciones())
                .build();
        
        Usuario guardado = usuarioRepository.save(actualizado);
        return convertirADTO(guardado);
    }
    
    /**
     * Elimina un usuario
     */
    public void eliminar(Long id) {
        if (!usuarioRepository.existsById(id)) {
            throw new ResourceNotFoundException("Usuario", id);
        }
        usuarioRepository.deleteById(id);
    }
    
    // ==================== LÓGICA DE NEGOCIO ====================
    
    /**
     * Autentica un usuario (login)
     */
    @Transactional(readOnly = true)
    public Usuario autenticar(UsuarioLoginDTO dto) {
        Usuario usuario = usuarioRepository.findByEmail(dto.email())
                .orElseThrow(() -> new UnauthorizedException("Credenciales inválidas"));
        
        if (!passwordEncoder.matches(dto.contrasenia(), usuario.getContrasenia())) {
            throw new UnauthorizedException("Credenciales inválidas");
        }
        
        return usuario;
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
    @Transactional(readOnly = true)
    public Usuario obtenerEntidadPorId(Long id) {
        return usuarioRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Usuario", id));
    }
    
    // ==================== CONVERSIONES ====================
    
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
