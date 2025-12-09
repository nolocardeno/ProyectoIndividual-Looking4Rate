package com.looking4rate.backend.repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import com.looking4rate.backend.entities.Interaccion;

public interface InteraccionRepository extends JpaRepository<Interaccion, Long>{
    
}
