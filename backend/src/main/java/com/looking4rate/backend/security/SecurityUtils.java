package com.looking4rate.backend.security;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

import com.looking4rate.backend.entities.Usuario;
import com.looking4rate.backend.exceptions.UnauthorizedException;
import com.looking4rate.backend.security.CustomUserDetailsService.CustomUserDetails;

/**
 * Utilidades de seguridad para obtener información del usuario actual
 */
@Component
public class SecurityUtils {
    
    /**
     * Obtiene el usuario actual autenticado
     * @return CustomUserDetails del usuario actual
     * @throws UnauthorizedException si no hay usuario autenticado
     */
    public static CustomUserDetails getUsuarioActual() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new UnauthorizedException("No hay usuario autenticado");
        }
        
        Object principal = authentication.getPrincipal();
        
        if (principal instanceof CustomUserDetails) {
            return (CustomUserDetails) principal;
        }
        
        throw new UnauthorizedException("No se pudo obtener la información del usuario");
    }
    
    /**
     * Obtiene el ID del usuario actual
     * @return ID del usuario
     */
    public static Long getUsuarioActualId() {
        return getUsuarioActual().getId();
    }
    
    /**
     * Obtiene el email del usuario actual
     * @return Email del usuario
     */
    public static String getUsuarioActualEmail() {
        return getUsuarioActual().getUsername();
    }
    
    /**
     * Obtiene el rol del usuario actual
     * @return Rol del usuario
     */
    public static Usuario.Rol getUsuarioActualRol() {
        return getUsuarioActual().getRol();
    }
    
    /**
     * Verifica si el usuario actual es administrador
     * @return true si es admin
     */
    public static boolean esAdmin() {
        try {
            return getUsuarioActualRol() == Usuario.Rol.ADMIN;
        } catch (Exception e) {
            return false;
        }
    }
    
    /**
     * Verifica si el usuario actual es el propietario del recurso
     * @param usuarioId ID del propietario del recurso
     * @return true si el usuario actual es el propietario
     */
    public static boolean esPropietario(Long usuarioId) {
        try {
            return getUsuarioActualId().equals(usuarioId);
        } catch (Exception e) {
            return false;
        }
    }
    
    /**
     * Verifica si el usuario actual puede modificar un recurso
     * (es propietario o es admin)
     * @param usuarioId ID del propietario del recurso
     * @return true si puede modificar
     */
    public static boolean puedeModificar(Long usuarioId) {
        return esPropietario(usuarioId) || esAdmin();
    }
    
    /**
     * Valida que el usuario actual pueda modificar el recurso
     * @param usuarioId ID del propietario del recurso
     * @throws UnauthorizedException si no tiene permisos
     */
    public static void validarPermiso(Long usuarioId) {
        if (!puedeModificar(usuarioId)) {
            throw new UnauthorizedException("No tienes permisos para realizar esta acción");
        }
    }
}
