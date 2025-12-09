package com.looking4rate.backend.controllers;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.looking4rate.backend.entities.Interaccion;
import com.looking4rate.backend.entities.Juego;
import com.looking4rate.backend.services.InteraccionService;

@RestController
@RequestMapping("/interaccion")
public class InteraccionController {
    
    @Autowired
    private InteraccionService interaccionService;

    // 🟩 1️⃣ Crear una nueva puntuación o reseña
    @PostMapping
    public Interaccion crearInteraccion(@RequestBody Interaccion interaccion) {
        return interaccionService.guardarInteraccion(interaccion);
    }
}
