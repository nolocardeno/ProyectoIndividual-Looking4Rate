package com.looking4rate.backend.services;

import java.util.ArrayList;
import java.util.List;

import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.looking4rate.backend.dtos.JuegoRankingDTO;
import com.looking4rate.backend.repositories.JuegoRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class RankingService {

    private final JuegoRepository juegoRepository;

    public List<JuegoRankingDTO> obtenerRanking(int limite) {
        List<Object[]> resultados = juegoRepository.findRankingWithStats(PageRequest.of(0, limite));
        List<JuegoRankingDTO> ranking = new ArrayList<>();

        for (int i = 0; i < resultados.size(); i++) {
            Object[] row = resultados.get(i);
            ranking.add(new JuegoRankingDTO(
                i + 1,
                (Long) row[0],
                (String) row[1],
                (String) row[2],
                (Double) row[3],
                (Long) row[4]
            ));
        }

        return ranking;
    }
}
