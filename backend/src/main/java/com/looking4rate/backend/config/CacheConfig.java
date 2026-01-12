package com.looking4rate.backend.config;

import java.time.Duration;

import org.springframework.cache.CacheManager;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.cache.caffeine.CaffeineCacheManager;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import com.github.benmanes.caffeine.cache.Caffeine;

/**
 * Configuración de caché para optimizar el rendimiento.
 * Usa Caffeine como proveedor de caché de alto rendimiento.
 * 
 * Cachés configurados (todos con 5 min de expiración):
 * - juegos-listado: Lista completa de juegos
 * - juegos-novedades: Juegos recientes
 * - juegos-proximos: Próximos lanzamientos
 * - juegos-top: Mejor valorados
 * - juegos-populares: Más populares
 * - juego-detalle: Detalle de un juego específico
 * - catalogo: Géneros, plataformas, etc.
 * - juegos-busqueda: Resultados de búsqueda
 */
@Configuration
@EnableCaching
public class CacheConfig {

    @Bean
    public CacheManager cacheManager() {
        CaffeineCacheManager cacheManager = new CaffeineCacheManager(
            "juegos-listado",
            "juegos-novedades", 
            "juegos-proximos",
            "juegos-top",
            "juegos-populares",
            "juego-detalle",
            "catalogo",
            "juegos-busqueda"
        );
        cacheManager.setCaffeine(caffeineCacheBuilder());
        return cacheManager;
    }

    private Caffeine<Object, Object> caffeineCacheBuilder() {
        return Caffeine.newBuilder()
            .expireAfterWrite(Duration.ofMinutes(5))
            .maximumSize(500);
    }
}
