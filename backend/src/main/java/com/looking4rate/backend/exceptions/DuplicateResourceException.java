package com.looking4rate.backend.exceptions;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

/**
 * Excepción lanzada cuando hay un conflicto de datos (ej: email duplicado)
 */
@ResponseStatus(HttpStatus.CONFLICT)
public class DuplicateResourceException extends RuntimeException {
    
    public DuplicateResourceException(String mensaje) {
        super(mensaje);
    }
    
    public DuplicateResourceException(String recurso, String campo, String valor) {
        super("Ya existe un " + recurso + " con " + campo + " '" + valor + "'");
    }
}
