package com.looking4rate.backend.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.looking4rate.backend.entities.Juego;

public interface JuegoRepository extends JpaRepository<Juego, Long> {

    // Busca nombres que CONTENGAN lo que escriba el usuario
    List<Juego> findByNombreContainingIgnoreCase(String nombre);
    
}