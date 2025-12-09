package com.looking4rate.backend.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.looking4rate.backend.repositories.InteraccionRepository;

@Service
public class InteraccionService {
    
    @Autowired
    private InteraccionRepository interaccionRepository;

    
}
