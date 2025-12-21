package com.looking4rate.backend.integration;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.looking4rate.backend.dtos.InteraccionCreacionDTO;

/**
 * Tests de integración para validaciones de Interacción
 * Estos tests verifican que las validaciones de Jakarta Validation funcionan correctamente
 */
@SpringBootTest
@AutoConfigureMockMvc
class InteraccionValidationIntegrationTest {

    @Autowired
    private MockMvc mockMvc;
    
    @Autowired
    private ObjectMapper objectMapper;
    
    @Test
    @WithMockUser(authorities = "ADMIN")
    void testCrear_ConJuegoIdNull_DebeRetornarBadRequest() throws Exception {
        InteraccionCreacionDTO dto = new InteraccionCreacionDTO(
            null,  // juegoId nulo
            8,
            "Review válida",
            true
        );
        
        mockMvc.perform(post("/api/interacciones/usuario/1")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(dto)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.error").value("Error de validación"))
                .andExpect(jsonPath("$.errores.juegoId").exists());
    }
    
    @Test
    @WithMockUser(authorities = "ADMIN")
    void testCrear_ConPuntuacionMenorA1_DebeRetornarBadRequest() throws Exception {
        InteraccionCreacionDTO dto = new InteraccionCreacionDTO(
            1L,
            0,  // puntuación inválida (mínimo 1)
            "Review válida",
            true
        );
        
        mockMvc.perform(post("/api/interacciones/usuario/1")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(dto)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.error").value("Error de validación"))
                .andExpect(jsonPath("$.errores.puntuacion").exists());
    }
    
    @Test
    @WithMockUser(authorities = "ADMIN")
    void testCrear_ConPuntuacionMayorA10_DebeRetornarBadRequest() throws Exception {
        InteraccionCreacionDTO dto = new InteraccionCreacionDTO(
            1L,
            11,  // puntuación inválida (máximo 10)
            "Review válida",
            true
        );
        
        mockMvc.perform(post("/api/interacciones/usuario/1")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(dto)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.error").value("Error de validación"))
                .andExpect(jsonPath("$.errores.puntuacion").exists());
    }
    
    @Test
    @WithMockUser(authorities = "ADMIN")
    void testCrear_ConReviewMuyLarga_DebeRetornarBadRequest() throws Exception {
        // Crear una review de más de 1000 caracteres
        String reviewLarga = "a".repeat(1001);
        
        InteraccionCreacionDTO dto = new InteraccionCreacionDTO(
            1L,
            8,
            reviewLarga,  // review demasiado larga
            true
        );
        
        mockMvc.perform(post("/api/interacciones/usuario/1")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(dto)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.error").value("Error de validación"))
                .andExpect(jsonPath("$.errores.review").exists());
    }
    
    @Test
    @WithMockUser(authorities = "ADMIN")
    void testCrear_ConMultiplesErrores_DebeRetornarTodosLosErrores() throws Exception {
        String reviewLarga = "a".repeat(1001);
        
        InteraccionCreacionDTO dto = new InteraccionCreacionDTO(
            null,  // juegoId nulo
            15,    // puntuación inválida
            reviewLarga,  // review muy larga
            true
        );
        
        mockMvc.perform(post("/api/interacciones/usuario/1")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(dto)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.error").value("Error de validación"))
                .andExpect(jsonPath("$.errores.juegoId").exists())
                .andExpect(jsonPath("$.errores.puntuacion").exists())
                .andExpect(jsonPath("$.errores.review").exists());
    }
}
