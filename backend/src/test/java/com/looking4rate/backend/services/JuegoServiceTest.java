package com.looking4rate.backend.services;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

import java.time.LocalDate;
import java.util.Arrays;
import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import com.looking4rate.backend.dtos.JuegoCreacionDTO;
import com.looking4rate.backend.entities.Desarrolladora;
import com.looking4rate.backend.entities.Genero;
import com.looking4rate.backend.entities.Juego;
import com.looking4rate.backend.entities.Plataforma;
import com.looking4rate.backend.exceptions.ResourceNotFoundException;
import com.looking4rate.backend.repositories.DesarrolladoraRepository;
import com.looking4rate.backend.repositories.GeneroRepository;
import com.looking4rate.backend.repositories.InteraccionRepository;
import com.looking4rate.backend.repositories.JuegoDesarrolladoraRepository;
import com.looking4rate.backend.repositories.JuegoGeneroRepository;
import com.looking4rate.backend.repositories.JuegoPlataformaRepository;
import com.looking4rate.backend.repositories.JuegoRepository;
import com.looking4rate.backend.repositories.PlataformaRepository;

@ExtendWith(MockitoExtension.class)
class JuegoServiceTest {

    @Mock
    private JuegoRepository juegoRepository;
    
    @Mock
    private InteraccionRepository interaccionRepository;
    
    @Mock
    private PlataformaRepository plataformaRepository;
    
    @Mock
    private DesarrolladoraRepository desarrolladoraRepository;
    
    @Mock
    private GeneroRepository generoRepository;
    
    @Mock
    private JuegoPlataformaRepository juegoPlataformaRepository;
    
    @Mock
    private JuegoDesarrolladoraRepository juegoDesarrolladoraRepository;
    
    @Mock
    private JuegoGeneroRepository juegoGeneroRepository;
    
    @InjectMocks
    private JuegoService juegoService;
    
    private Juego juegoTest;
    private JuegoCreacionDTO juegoCreacionDTO;
    
    @BeforeEach
    void setUp() {
        juegoTest = Juego.builder()
                .id(1L)
                .nombre("The Legend of Zelda")
                .descripcion("Juego de aventuras")
                .imagen_portada("zelda.jpg")
                .fecha_salida(LocalDate.of(2017, 3, 3))
                .build();
        
        juegoCreacionDTO = new JuegoCreacionDTO(
                "The Legend of Zelda",
                "Juego de aventuras",
                "zelda.jpg",
                LocalDate.of(2017, 3, 3),
                Arrays.asList(1L),
                Arrays.asList(1L),
                Arrays.asList(1L)
        );
    }
    
    @Test
    void testObtenerPorId_NoExisteJuego() {
        // Given
        when(juegoRepository.findById(999L)).thenReturn(Optional.empty());
        
        // When & Then
        assertThrows(ResourceNotFoundException.class, () -> {
            juegoService.obtenerPorId(999L);
        });
        verify(juegoRepository, times(1)).findById(999L);
    }
    
    @Test
    void testCrear_ConDatosValidos() {
        // Given
        Plataforma plataforma = Plataforma.builder().id(1L).nombre("Nintendo Switch").build();
        Desarrolladora desarrolladora = Desarrolladora.builder().id(1L).nombre("Nintendo").build();
        Genero genero = Genero.builder().id(1L).nombre("Aventura").build();
        
        when(juegoRepository.save(any(Juego.class))).thenReturn(juegoTest);
        when(plataformaRepository.findById(1L)).thenReturn(Optional.of(plataforma));
        when(desarrolladoraRepository.findById(1L)).thenReturn(Optional.of(desarrolladora));
        when(generoRepository.findById(1L)).thenReturn(Optional.of(genero));
        
        // Mocks para el método obtenerPorId que se llama al final
        when(juegoRepository.findById(1L)).thenReturn(Optional.of(juegoTest));
        when(juegoPlataformaRepository.findByJuegoId(1L)).thenReturn(Arrays.asList());
        when(juegoDesarrolladoraRepository.findByJuegoId(1L)).thenReturn(Arrays.asList());
        when(juegoGeneroRepository.findByJuegoId(1L)).thenReturn(Arrays.asList());
        
        // When
        var resultado = juegoService.crear(juegoCreacionDTO);
        
        // Then
        assertNotNull(resultado);
        verify(juegoRepository, times(1)).save(any(Juego.class));
        verify(plataformaRepository, times(1)).findById(1L);
        verify(desarrolladoraRepository, times(1)).findById(1L);
        verify(generoRepository, times(1)).findById(1L);
    }
    
    @Test
    void testEliminar_ExisteJuego() {
        // Given
        when(juegoRepository.existsById(1L)).thenReturn(true);
        
        // When
        juegoService.eliminar(1L);
        
        // Then
        verify(juegoRepository, times(1)).existsById(1L);
        verify(juegoRepository, times(1)).deleteById(1L);
    }
    
    @Test
    void testEliminar_NoExisteJuego() {
        // Given
        when(juegoRepository.existsById(999L)).thenReturn(false);
        
        // When & Then
        assertThrows(ResourceNotFoundException.class, () -> {
            juegoService.eliminar(999L);
        });
        verify(juegoRepository, times(1)).existsById(999L);
        verify(juegoRepository, never()).deleteById(any());
    }
    
    @Test
    void testBuscarPorNombre() {
        // Given
        when(juegoRepository.findByNombreContainingIgnoreCase("Zelda")).thenReturn(Arrays.asList(juegoTest));
        
        // When
        var resultado = juegoService.buscarPorNombre("Zelda");
        
        // Then
        assertNotNull(resultado);
        assertEquals(1, resultado.size());
        verify(juegoRepository, times(1)).findByNombreContainingIgnoreCase("Zelda");
    }
}
