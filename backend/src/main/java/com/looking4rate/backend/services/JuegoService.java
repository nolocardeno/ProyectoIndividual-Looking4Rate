package com.looking4rate.backend.services;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.looking4rate.backend.entities.Juego;
import com.looking4rate.backend.repositories.JuegoRepository;

@Service
public class JuegoService {

    @Autowired
    private JuegoRepository juegoRepository;

    public List<Juego> listarTodos() {
        return juegoRepository.findAll();
    }

    public List<Juego> buscarContiene(String busqueda) {
        return juegoRepository.findByNombreContainingIgnoreCase(busqueda);
    }

}
