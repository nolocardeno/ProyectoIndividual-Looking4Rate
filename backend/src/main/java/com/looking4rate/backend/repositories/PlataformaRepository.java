package com.looking4rate.backend.repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import com.looking4rate.backend.entities.Plataforma;

public interface PlataformaRepository extends JpaRepository<Plataforma, Long>{
    
}
