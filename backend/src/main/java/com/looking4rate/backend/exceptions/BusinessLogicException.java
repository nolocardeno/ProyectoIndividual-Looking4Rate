package com.looking4rate.backend.exceptions;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

/**
 * Excepción lanzada cuando se viola una regla de negocio
 */
@ResponseStatus(HttpStatus.BAD_REQUEST)
public class BusinessLogicException extends RuntimeException {
    
    public BusinessLogicException(String mensaje) {
        super(mensaje);
    }
}
