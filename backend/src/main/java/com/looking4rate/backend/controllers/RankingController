package com.looking4rate.backend.controllers;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.looking4rate.backend.dtos.JuegoRankingDTO;
import com.looking4rate.backend.services.RankingService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/ranking")
@RequiredArgsConstructor
@Tag(name = "Ranking", description = "Ranking de los juegos mejor valorados")
public class RankingController {

    private final RankingService rankingService;

    @Operation(summary = "Obtener ranking", description = "Obtiene el ranking de los juegos mejor valorados con su posición y estadísticas")
    @GetMapping
    public ResponseEntity<List<JuegoRankingDTO>> obtenerRanking(
            @RequestParam(defaultValue = "10") int limite) {
        return ResponseEntity.ok(rankingService.obtenerRanking(limite));
    }
}
