package com.looking4rate.backend.services;

import java.time.LocalDate;
import java.util.List;

import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.looking4rate.backend.dtos.JuegoCreacionDTO;
import com.looking4rate.backend.dtos.JuegoDTO;
import com.looking4rate.backend.dtos.JuegoResumenDTO;
import com.looking4rate.backend.entities.Juego;
import com.looking4rate.backend.entities.JuegoDesarrolladora;
import com.looking4rate.backend.entities.JuegoGenero;
import com.looking4rate.backend.entities.JuegoPlataforma;
import com.looking4rate.backend.exceptions.ResourceNotFoundException;
import com.looking4rate.backend.repositories.DesarrolladoraRepository;
import com.looking4rate.backend.repositories.GeneroRepository;
import com.looking4rate.backend.repositories.InteraccionRepository;
import com.looking4rate.backend.repositories.JuegoDesarrolladoraRepository;
import com.looking4rate.backend.repositories.JuegoGeneroRepository;
import com.looking4rate.backend.repositories.JuegoPlataformaRepository;
import com.looking4rate.backend.repositories.JuegoRepository;
import com.looking4rate.backend.repositories.PlataformaRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional
public class JuegoService {

    private final JuegoRepository juegoRepository;
    private final InteraccionRepository interaccionRepository;
    private final PlataformaRepository plataformaRepository;
    private final DesarrolladoraRepository desarrolladoraRepository;
    private final GeneroRepository generoRepository;
    private final JuegoPlataformaRepository juegoPlataformaRepository;
    private final JuegoDesarrolladoraRepository juegoDesarrolladoraRepository;
    private final JuegoGeneroRepository juegoGeneroRepository;

    // ==================== CRUD ====================

    /**
     * Lista todos los juegos (OPTIMIZADO - una sola query)
     */
    @Transactional(readOnly = true)
    @Cacheable(value = "juegos-listado")
    public List<JuegoResumenDTO> listarTodos() {
        return juegoRepository.findAllWithAvgPuntuacion().stream()
                .map(this::convertirArrayAResumenDTO)
                .toList();
    }

    /**
     * Obtiene un juego por su ID con información completa
     */
    @Transactional(readOnly = true)
    @Cacheable(value = "juego-detalle", key = "#id")
    public JuegoDTO obtenerPorId(Long id) {
        @SuppressWarnings("null")
        Juego juego = juegoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Juego", id));
        return convertirADTO(juego);
    }

    /**
     * Crea un nuevo juego
     */
    @SuppressWarnings("null")
    @CacheEvict(value = {"juegos-listado", "juegos-novedades", "juegos-proximos", "juegos-top", "juegos-populares"}, allEntries = true)
public JuegoDTO crear(JuegoCreacionDTO dto) {
        Juego juego = Juego.builder()
                .nombre(dto.nombre())
                .descripcion(dto.descripcion())
                .imagen_portada(dto.imagenPortada())
                .fecha_salida(dto.fechaSalida())
                .build();
        
        @SuppressWarnings("null")
        Juego guardado = juegoRepository.save(juego);
        
        // Asociar plataformas
        if (dto.plataformaIds() != null) {
            dto.plataformaIds().forEach(plataformaId -> {
                @SuppressWarnings("null")
                var plataforma = plataformaRepository.findById(plataformaId)
                        .orElseThrow(() -> new ResourceNotFoundException("Plataforma", plataformaId));
                JuegoPlataforma jp = JuegoPlataforma.builder()
                        .juego(guardado)
                        .plataforma(plataforma)
                        .build();
                juegoPlataformaRepository.save(jp);
            });
        }
        
        // Asociar desarrolladoras
        if (dto.desarrolladoraIds() != null) {
            dto.desarrolladoraIds().forEach(desarrolladoraId -> {
                @SuppressWarnings("null")
                var desarrolladora = desarrolladoraRepository.findById(desarrolladoraId)
                        .orElseThrow(() -> new ResourceNotFoundException("Desarrolladora", desarrolladoraId));
                JuegoDesarrolladora jd = JuegoDesarrolladora.builder()
                        .juego(guardado)
                        .desarrolladora(desarrolladora)
                        .build();
                juegoDesarrolladoraRepository.save(jd);
            });
        }
        
        // Asociar géneros
        if (dto.generoIds() != null) {
            dto.generoIds().forEach(generoId -> {
                @SuppressWarnings("null")
                var genero = generoRepository.findById(generoId)
                        .orElseThrow(() -> new ResourceNotFoundException("Genero", generoId));
                JuegoGenero jg = JuegoGenero.builder()
                        .juego(guardado)
                        .genero(genero)
                        .build();
                juegoGeneroRepository.save(jg);
            });
        }
        
        // Refrescar y devolver
        return obtenerPorId(guardado.getId());
    }

    /**
     * Actualiza un juego existente
     */
    @SuppressWarnings("null")
    @CacheEvict(value = {"juegos-listado", "juegos-novedades", "juegos-proximos", "juegos-top", "juegos-populares", "juego-detalle"}, allEntries = true)
public JuegoDTO actualizar(Long id, JuegoCreacionDTO dto) {
        @SuppressWarnings("null")
        Juego juegoExistente = juegoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Juego", id));
        
        Juego actualizado = Juego.builder()
                .id(juegoExistente.getId())
                .nombre(dto.nombre())
                .descripcion(dto.descripcion())
                .imagen_portada(dto.imagenPortada())
                .fecha_salida(dto.fechaSalida())
                .interacciones(juegoExistente.getInteracciones())
                .build();
        
        juegoRepository.save(actualizado);
        
        // Actualizar relaciones - eliminar las existentes y crear las nuevas
        juegoPlataformaRepository.findByJuegoId(id).forEach(jp -> juegoPlataformaRepository.delete(jp));
        juegoDesarrolladoraRepository.findByJuegoId(id).forEach(jd -> juegoDesarrolladoraRepository.delete(jd));
        juegoGeneroRepository.findByJuegoId(id).forEach(jg -> juegoGeneroRepository.delete(jg));
        
        // Recrear relaciones
        if (dto.plataformaIds() != null) {
            dto.plataformaIds().forEach(plataformaId -> {
                @SuppressWarnings("null")
                var plataforma = plataformaRepository.findById(plataformaId)
                        .orElseThrow(() -> new ResourceNotFoundException("Plataforma", plataformaId));
                JuegoPlataforma jp = JuegoPlataforma.builder()
                        .juego(actualizado)
                        .plataforma(plataforma)
                        .build();
                juegoPlataformaRepository.save(jp);
            });
        }
        
        if (dto.desarrolladoraIds() != null) {
            dto.desarrolladoraIds().forEach(desarrolladoraId -> {
                @SuppressWarnings("null")
                var desarrolladora = desarrolladoraRepository.findById(desarrolladoraId)
                        .orElseThrow(() -> new ResourceNotFoundException("Desarrolladora", desarrolladoraId));
                JuegoDesarrolladora jd = JuegoDesarrolladora.builder()
                        .juego(actualizado)
                        .desarrolladora(desarrolladora)
                        .build();
                juegoDesarrolladoraRepository.save(jd);
            });
        }
        
        if (dto.generoIds() != null) {
            dto.generoIds().forEach(generoId -> {
                @SuppressWarnings("null")
                var genero = generoRepository.findById(generoId)
                        .orElseThrow(() -> new ResourceNotFoundException("Genero", generoId));
                JuegoGenero jg = JuegoGenero.builder()
                        .juego(actualizado)
                        .genero(genero)
                        .build();
                juegoGeneroRepository.save(jg);
            });
        }
        
        return obtenerPorId(id);
    }

    /**
     * Elimina un juego
     */
    @SuppressWarnings("null")
    @CacheEvict(value = {"juegos-listado", "juegos-novedades", "juegos-proximos", "juegos-top", "juegos-populares", "juego-detalle"}, allEntries = true)
public void eliminar(Long id) {
        if (!juegoRepository.existsById(id)) {
            throw new ResourceNotFoundException("Juego", id);
        }
        juegoRepository.deleteById(id);
    }

    // ==================== BÚSQUEDAS ====================

    /**
     * Busca juegos que contengan el texto en su nombre (OPTIMIZADO)
     */
    @Transactional(readOnly = true)
    @Cacheable(value = "juegos-busqueda", key = "#nombre")
    public List<JuegoResumenDTO> buscarPorNombre(String nombre) {
        return juegoRepository.findByNombreWithAvgPuntuacion(nombre).stream()
                .map(this::convertirArrayAResumenDTO)
                .toList();
    }

    /**
     * Obtiene los juegos más recientes (OPTIMIZADO - una sola query)
     */
    @Transactional(readOnly = true)
    @Cacheable(value = "juegos-novedades")
    public List<JuegoResumenDTO> obtenerNovedades() {
        return juegoRepository.findNovedadesWithAvgPuntuacion(
                LocalDate.now(), 
                PageRequest.of(0, 10)
            ).stream()
            .map(this::convertirArrayAResumenDTO)
            .toList();
    }

    /**
     * Obtiene los próximos lanzamientos (OPTIMIZADO - una sola query)
     */
    @Transactional(readOnly = true)
    @Cacheable(value = "juegos-proximos")
    public List<JuegoResumenDTO> obtenerProximosLanzamientos() {
        return juegoRepository.findProximosWithAvgPuntuacion(
                LocalDate.now(),
                PageRequest.of(0, 10)
            ).stream()
            .map(this::convertirArrayAResumenDTO)
            .toList();
    }

    /**
     * Obtiene los juegos mejor valorados (OPTIMIZADO - una sola query)
     */
    @Transactional(readOnly = true)
    @Cacheable(value = "juegos-top", key = "#limite")
    public List<JuegoResumenDTO> obtenerMejorValorados(int limite) {
        return juegoRepository.findTopRatedWithAvgPuntuacion(PageRequest.of(0, limite)).stream()
                .map(this::convertirArrayAResumenDTO)
                .toList();
    }

    /**
     * Obtiene los juegos con más reviews (OPTIMIZADO - una sola query)
     */
    @Transactional(readOnly = true)
    @Cacheable(value = "juegos-populares", key = "#limite")
    public List<JuegoResumenDTO> obtenerMasReviewados(int limite) {
        return juegoRepository.findMostPopularWithAvgPuntuacion(PageRequest.of(0, limite)).stream()
                .map(this::convertirArrayAResumenDTO)
                .toList();
    }

    /**
     * Obtiene la entidad Juego (uso interno para relaciones)
     */
    @SuppressWarnings("null")
@Transactional(readOnly = true)
    public Juego obtenerEntidadPorId(Long id) {
        return juegoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Juego", id));
    }

    // ==================== CONVERSIONES ====================

    private JuegoDTO convertirADTO(Juego juego) {
        Double puntuacionMedia = interaccionRepository.findAveragePuntuacionByJuegoId(juego.getId());
        Long totalReviews = interaccionRepository.countByJuegoId(juego.getId());
        
        List<String> plataformas = juegoPlataformaRepository.findByJuegoId(juego.getId()).stream()
                .map(jp -> jp.getPlataforma().getNombre())
                .toList();
        
        List<String> desarrolladoras = juegoDesarrolladoraRepository.findByJuegoId(juego.getId()).stream()
                .map(jd -> jd.getDesarrolladora().getNombre())
                .toList();
        
        List<String> generos = juegoGeneroRepository.findByJuegoId(juego.getId()).stream()
                .map(jg -> jg.getGenero().getNombre())
                .toList();
        
        return new JuegoDTO(
                juego.getId(),
                juego.getNombre(),
                juego.getDescripcion(),
                juego.getImagen_portada(),
                juego.getFecha_salida(),
                plataformas,
                desarrolladoras,
                generos,
                puntuacionMedia,
                totalReviews != null ? totalReviews.intValue() : 0
        );
    }

    /**
     * Convierte el resultado de la query optimizada (Object[]) a JuegoResumenDTO
     * El array contiene: [id, nombre, imagenPortada, fechaSalida, puntuacionMedia]
     */
    private JuegoResumenDTO convertirArrayAResumenDTO(Object[] row) {
        return new JuegoResumenDTO(
                (Long) row[0],
                (String) row[1],
                (String) row[2],
                (LocalDate) row[3],
                (Double) row[4]
        );
    }

    /**
     * @deprecated Usar convertirArrayAResumenDTO con queries optimizadas
     */
    @Deprecated
    private JuegoResumenDTO convertirAResumenDTO(Juego juego) {
        Double puntuacionMedia = interaccionRepository.findAveragePuntuacionByJuegoId(juego.getId());
        return new JuegoResumenDTO(
                juego.getId(),
                juego.getNombre(),
                juego.getImagen_portada(),
                juego.getFecha_salida(),
                puntuacionMedia
        );
    }
}
