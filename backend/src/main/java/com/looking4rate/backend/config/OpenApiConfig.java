package com.looking4rate.backend.config;

import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.License;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import io.swagger.v3.oas.models.security.SecurityScheme;
import io.swagger.v3.oas.models.servers.Server;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.List;

/**
 * Configuración de OpenAPI (Swagger) para la documentación de la API
 */
@Configuration
public class OpenApiConfig {

    @Value("${server.port:8080}")
    private String serverPort;

    @Bean
    public OpenAPI customOpenAPI() {
        final String securitySchemeName = "bearerAuth";
        
        return new OpenAPI()
                .info(new Info()
                        .title("Looking4Rate API")
                        .version("1.0.0")
                        .description("""
                                API REST para la plataforma de valoración de videojuegos Looking4Rate.
                                
                                ## Autenticación
                                La mayoría de endpoints requieren autenticación mediante JWT (Bearer Token).
                                
                                Para obtener un token:
                                1. Registra un usuario en `/api/auth/registro`
                                2. Inicia sesión en `/api/auth/login`
                                3. Usa el token devuelto en el header `Authorization: Bearer <token>`
                                
                                ## Endpoints públicos
                                - GET `/api/juegos/**` - Consultar juegos
                                - GET `/api/plataformas/**` - Consultar plataformas
                                - GET `/api/desarrolladoras/**` - Consultar desarrolladoras
                                - GET `/api/generos/**` - Consultar géneros
                                - GET `/api/interacciones/**` - Consultar interacciones
                                """)
                        .contact(new Contact()
                                .name("Looking4Rate Team")
                                .email("soporte@looking4rate.com"))
                        .license(new License()
                                .name("MIT License")
                                .url("https://opensource.org/licenses/MIT")))
                .servers(List.of(
                        new Server()
                                .url("http://localhost:" + serverPort)
                                .description("Servidor de desarrollo local"),
                        new Server()
                                .url("http://localhost:8080")
                                .description("Servidor Docker local")))
                .addSecurityItem(new SecurityRequirement().addList(securitySchemeName))
                .components(new Components()
                        .addSecuritySchemes(securitySchemeName,
                                new SecurityScheme()
                                        .name(securitySchemeName)
                                        .type(SecurityScheme.Type.HTTP)
                                        .scheme("bearer")
                                        .bearerFormat("JWT")
                                        .description("Introduce el token JWT obtenido del endpoint /api/auth/login")));
    }
}
