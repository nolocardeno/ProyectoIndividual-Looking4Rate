package com.looking4rate.backend.controllers;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.looking4rate.backend.entities.Juego;
import com.looking4rate.backend.services.JuegoService;

@RestController
@RequestMapping("/juegos")
public class JuegoController {

    @Autowired
    private JuegoService juegoService;

    @GetMapping
    public List<Juego> listarTodos() {
        return juegoService.listarTodos();
    }

    @GetMapping("/buscar")
    public List<Juego> buscarContiene(@PathVariable("nombre") String nombre) {
        return juegoService.buscarContiene(nombre);
    }

}