package com.looking4rate.backend.integration;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import java.time.LocalDate;
import java.util.Arrays;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.looking4rate.backend.dtos.JuegoCreacionDTO;

/**
 * Tests de integración para validaciones de Juego
 */
@SpringBootTest
@AutoConfigureMockMvc
class JuegoValidationIntegrationTest {

    @Autowired
    private MockMvc mockMvc;
    
    @Autowired
    private ObjectMapper objectMapper;
    
    @Test
    @WithMockUser(authorities = "ADMIN")
    void testCrear_ConDatosValidos_DebeCrear() throws Exception {
        JuegoCreacionDTO dto = new JuegoCreacionDTO(
            "The Legend of Zelda: Breath of the Wild",
            "Un juego de aventuras épico en un vasto mundo abierto",
            "zelda-botw.jpg",
            LocalDate.of(2017, 3, 3),
            Arrays.asList(1L),
            Arrays.asList(1L),
            Arrays.asList(1L)
        );
        
        mockMvc.perform(post("/api/juegos")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(dto)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.nombre").value("The Legend of Zelda: Breath of the Wild"));
    }
    
    @Test
    @WithMockUser(authorities = "ADMIN")
    void testCrear_ConNombreVacio_DebeRetornarBadRequest() throws Exception {
        JuegoCreacionDTO dto = new JuegoCreacionDTO(
            "",  // nombre vacío
            "Descripción válida",
            "imagen.jpg",
            LocalDate.of(2023, 1, 1),
            Arrays.asList(1L),
            Arrays.asList(1L),
            Arrays.asList(1L)
        );
        
        mockMvc.perform(post("/api/juegos")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(dto)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.error").value("Error de validación"))
                .andExpect(jsonPath("$.errores.nombre").exists());
    }
    
    @Test
    @WithMockUser(authorities = "ADMIN")
    void testCrear_ConDescripcionVacia_DebeRetornarBadRequest() throws Exception {
        JuegoCreacionDTO dto = new JuegoCreacionDTO(
            "Nombre válido",
            "",  // descripción vacía
            "imagen.jpg",
            LocalDate.of(2023, 1, 1),
            Arrays.asList(1L),
            Arrays.asList(1L),
            Arrays.asList(1L)
        );
        
        mockMvc.perform(post("/api/juegos")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(dto)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.error").value("Error de validación"))
                .andExpect(jsonPath("$.errores.descripcion").exists());
    }
    
    @Test
    @WithMockUser(authorities = "ADMIN")
    void testCrear_ConFechaFutura_DebeRetornarBadRequest() throws Exception {
        JuegoCreacionDTO dto = new JuegoCreacionDTO(
            "Nombre válido",
            "Descripción válida",
            "imagen.jpg",
            LocalDate.now().plusDays(1),  // fecha futura
            Arrays.asList(1L),
            Arrays.asList(1L),
            Arrays.asList(1L)
        );
        
        mockMvc.perform(post("/api/juegos")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(dto)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.error").value("Error de validación"))
                .andExpect(jsonPath("$.errores.fechaSalida").exists());
    }
    
    @Test
    @WithMockUser(authorities = "ADMIN")
    void testCrear_ConPlataformasVacias_DebeRetornarBadRequest() throws Exception {
        JuegoCreacionDTO dto = new JuegoCreacionDTO(
            "Nombre válido",
            "Descripción válida",
            "imagen.jpg",
            LocalDate.of(2023, 1, 1),
            Arrays.asList(),  // plataformas vacías
            Arrays.asList(1L),
            Arrays.asList(1L)
        );
        
        mockMvc.perform(post("/api/juegos")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(dto)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.error").value("Error de validación"))
                .andExpect(jsonPath("$.errores.plataformaIds").exists());
    }
    
    @Test
    @WithMockUser(authorities = "ADMIN")
    void testCrear_ConDesarrolladorasVacias_DebeRetornarBadRequest() throws Exception {
        JuegoCreacionDTO dto = new JuegoCreacionDTO(
            "Nombre válido",
            "Descripción válida",
            "imagen.jpg",
            LocalDate.of(2023, 1, 1),
            Arrays.asList(1L),
            Arrays.asList(),  // desarrolladoras vacías
            Arrays.asList(1L)
        );
        
        mockMvc.perform(post("/api/juegos")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(dto)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.error").value("Error de validación"))
                .andExpect(jsonPath("$.errores.desarrolladoraIds").exists());
    }
    
    @Test
    @WithMockUser(authorities = "ADMIN")
    void testCrear_ConGenerosVacios_DebeRetornarBadRequest() throws Exception {
        JuegoCreacionDTO dto = new JuegoCreacionDTO(
            "Nombre válido",
            "Descripción válida",
            "imagen.jpg",
            LocalDate.of(2023, 1, 1),
            Arrays.asList(1L),
            Arrays.asList(1L),
            Arrays.asList()  // géneros vacíos
        );
        
        mockMvc.perform(post("/api/juegos")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(dto)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.error").value("Error de validación"))
                .andExpect(jsonPath("$.errores.generoIds").exists());
    }
    
    @Test
    @WithMockUser(authorities = "ADMIN")
    void testCrear_ConMultiplesErrores_DebeRetornarTodosLosErrores() throws Exception {
        JuegoCreacionDTO dto = new JuegoCreacionDTO(
            "",  // nombre vacío
            "",  // descripción vacía
            "imagen.jpg",
            LocalDate.now().plusDays(1),  // fecha futura
            Arrays.asList(),  // plataformas vacías
            Arrays.asList(1L),
            Arrays.asList(1L)
        );
        
        mockMvc.perform(post("/api/juegos")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(dto)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.error").value("Error de validación"))
                .andExpect(jsonPath("$.errores.nombre").exists())
                .andExpect(jsonPath("$.errores.descripcion").exists())
                .andExpect(jsonPath("$.errores.fechaSalida").exists())
                .andExpect(jsonPath("$.errores.plataformaIds").exists());
    }
}
