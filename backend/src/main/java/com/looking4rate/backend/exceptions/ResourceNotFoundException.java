package com.looking4rate.backend.exceptions;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

/**
 * Excepción lanzada cuando un recurso no se encuentra
 */
@ResponseStatus(HttpStatus.NOT_FOUND)
public class ResourceNotFoundException extends RuntimeException {
    
    public ResourceNotFoundException(String mensaje) {
        super(mensaje);
    }
    
    public ResourceNotFoundException(String recurso, Long id) {
        super(recurso + " con id " + id + " no encontrado");
    }
    
    public ResourceNotFoundException(String recurso, String campo, String valor) {
        super(recurso + " con " + campo + " '" + valor + "' no encontrado");
    }
}
