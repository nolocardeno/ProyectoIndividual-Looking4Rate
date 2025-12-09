package com.looking4rate.backend.repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import com.looking4rate.backend.entities.Usuario;

public interface UsuarioRepository extends JpaRepository<Usuario, Long>{

}