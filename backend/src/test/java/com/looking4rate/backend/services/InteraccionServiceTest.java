package com.looking4rate.backend.services;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import com.looking4rate.backend.dtos.InteraccionCreacionDTO;
import com.looking4rate.backend.entities.Interaccion;
import com.looking4rate.backend.entities.Juego;
import com.looking4rate.backend.entities.Usuario;
import com.looking4rate.backend.exceptions.BusinessLogicException;
import com.looking4rate.backend.exceptions.ResourceNotFoundException;
import com.looking4rate.backend.repositories.InteraccionRepository;
import com.looking4rate.backend.repositories.JuegoRepository;
import com.looking4rate.backend.repositories.UsuarioRepository;

@ExtendWith(MockitoExtension.class)
class InteraccionServiceTest {

    @Mock
    private InteraccionRepository interaccionRepository;
    
    @Mock
    private UsuarioRepository usuarioRepository;
    
    @Mock
    private JuegoRepository juegoRepository;
    
    @InjectMocks
    private InteraccionService interaccionService;
    
    private Usuario usuarioTest;
    private Juego juegoTest;
    private Interaccion interaccionTest;
    private InteraccionCreacionDTO interaccionCreacionDTO;
    
    @BeforeEach
    void setUp() {
        usuarioTest = Usuario.builder()
                .id(1L)
                .nombre("Usuario Test")
                .email("test@test.com")
                .build();
        
        juegoTest = Juego.builder()
                .id(1L)
                .nombre("The Legend of Zelda")
                .build();
        
        interaccionTest = Interaccion.builder()
                .id(1L)
                .usuario(usuarioTest)
                .juego(juegoTest)
                .puntuacion(9)
                .review("Excelente juego")
                .estado_jugado(true)
                .fecha_interaccion(LocalDateTime.now())
                .build();
        
        interaccionCreacionDTO = new InteraccionCreacionDTO(
                1L,
                9,
                "Excelente juego",
                true
        );
    }
    
    @Test
    void testObtenerPorId_NoExisteInteraccion() {
        // Given
        when(interaccionRepository.findById(999L)).thenReturn(Optional.empty());
        
        // When & Then
        assertThrows(ResourceNotFoundException.class, () -> {
            interaccionService.obtenerPorId(999L);
        });
        verify(interaccionRepository, times(1)).findById(999L);
    }
    
    @Test
    void testCrear_ConDatosValidos() {
        // Given
        when(usuarioRepository.findById(1L)).thenReturn(Optional.of(usuarioTest));
        when(juegoRepository.findById(1L)).thenReturn(Optional.of(juegoTest));
        when(interaccionRepository.existsByUsuarioIdAndJuegoId(1L, 1L)).thenReturn(false);
        when(interaccionRepository.save(any(Interaccion.class))).thenReturn(interaccionTest);
        
        // When
        var resultado = interaccionService.crear(1L, interaccionCreacionDTO);
        
        // Then
        assertNotNull(resultado);
        verify(usuarioRepository, times(1)).findById(1L);
        verify(juegoRepository, times(1)).findById(1L);
        verify(interaccionRepository, times(1)).save(any(Interaccion.class));
    }
    
    @Test
    void testCrear_InteraccionDuplicada() {
        // Given
        when(interaccionRepository.existsByUsuarioIdAndJuegoId(1L, 1L)).thenReturn(true);
        
        // When & Then
        assertThrows(com.looking4rate.backend.exceptions.DuplicateResourceException.class, () -> {
            interaccionService.crear(1L, interaccionCreacionDTO);
        });
        verify(interaccionRepository, never()).save(any(Interaccion.class));
    }
    
    @Test
    void testCrear_UsuarioNoExiste() {
        // Given
        when(usuarioRepository.findById(999L)).thenReturn(Optional.empty());
        
        // When & Then
        assertThrows(ResourceNotFoundException.class, () -> {
            interaccionService.crear(999L, interaccionCreacionDTO);
        });
        verify(interaccionRepository, never()).save(any(Interaccion.class));
    }
    
    @Test
    void testCrear_JuegoNoExiste() {
        // Given
        InteraccionCreacionDTO dtoConJuegoInvalido = new InteraccionCreacionDTO(
                999L, 9, "Review", true
        );
        when(usuarioRepository.findById(1L)).thenReturn(Optional.of(usuarioTest));
        when(juegoRepository.findById(999L)).thenReturn(Optional.empty());
        
        // When & Then
        assertThrows(ResourceNotFoundException.class, () -> {
            interaccionService.crear(1L, dtoConJuegoInvalido);
        });
        verify(interaccionRepository, never()).save(any(Interaccion.class));
    }
    
    @Test
    void testObtenerPorUsuario() {
        // Given
        when(interaccionRepository.findByUsuarioId(1L)).thenReturn(Arrays.asList(interaccionTest));
        
        // When
        var resultado = interaccionService.obtenerPorUsuario(1L);
        
        // Then
        assertNotNull(resultado);
        assertEquals(1, resultado.size());
        verify(interaccionRepository, times(1)).findByUsuarioId(1L);
    }
}
