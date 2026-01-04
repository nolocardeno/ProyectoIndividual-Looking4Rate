-- ============================================
-- DATOS DE PRUEBA PARA LOOKING4RATE
-- ============================================

-- Géneros de videojuegos
INSERT INTO genero (nombre, descripcion) VALUES ('Acción', 'Juegos que requieren reflejos rápidos y habilidad');
INSERT INTO genero (nombre, descripcion) VALUES ('RPG', 'Role-Playing Games con progresión de personajes');
INSERT INTO genero (nombre, descripcion) VALUES ('Aventura', 'Juegos basados en exploración y narrativa');
INSERT INTO genero (nombre, descripcion) VALUES ('Shooter', 'Juegos de disparos en primera o tercera persona');
INSERT INTO genero (nombre, descripcion) VALUES ('Deportes', 'Simuladores deportivos');
INSERT INTO genero (nombre, descripcion) VALUES ('Estrategia', 'Juegos de planificación y táctica');
INSERT INTO genero (nombre, descripcion) VALUES ('Terror', 'Juegos de horror y supervivencia');
INSERT INTO genero (nombre, descripcion) VALUES ('Simulación', 'Simuladores de vida y construcción');
INSERT INTO genero (nombre, descripcion) VALUES ('Plataformas', 'Juegos de saltos y plataformas');
INSERT INTO genero (nombre, descripcion) VALUES ('Lucha', 'Juegos de combate uno contra uno');

-- Plataformas
INSERT INTO plataforma (nombre, anio_lanzamiento, fabricante, imagen_logo) VALUES ('PlayStation 5', 2020, 'Sony', 'https://upload.wikimedia.org/wikipedia/commons/0/00/PlayStation_logo.svg');
INSERT INTO plataforma (nombre, anio_lanzamiento, fabricante, imagen_logo) VALUES ('PlayStation 4', 2013, 'Sony', 'https://upload.wikimedia.org/wikipedia/commons/0/00/PlayStation_logo.svg');
INSERT INTO plataforma (nombre, anio_lanzamiento, fabricante, imagen_logo) VALUES ('Xbox Series X', 2020, 'Microsoft', 'https://upload.wikimedia.org/wikipedia/commons/f/f9/Xbox_one_logo.svg');
INSERT INTO plataforma (nombre, anio_lanzamiento, fabricante, imagen_logo) VALUES ('Xbox One', 2013, 'Microsoft', 'https://upload.wikimedia.org/wikipedia/commons/f/f9/Xbox_one_logo.svg');
INSERT INTO plataforma (nombre, anio_lanzamiento, fabricante, imagen_logo) VALUES ('Nintendo Switch', 2017, 'Nintendo', 'https://upload.wikimedia.org/wikipedia/commons/5/5d/Nintendo_Switch_Logo.svg');
INSERT INTO plataforma (nombre, anio_lanzamiento, fabricante, imagen_logo) VALUES ('PC', 1981, 'IBM', null);

-- Desarrolladoras
INSERT INTO desarrolladora (nombre, fecha_creacion, pais) VALUES ('FromSoftware', '1986-11-01', 'Japón');
INSERT INTO desarrolladora (nombre, fecha_creacion, pais) VALUES ('Rockstar Games', '1998-12-01', 'Estados Unidos');
INSERT INTO desarrolladora (nombre, fecha_creacion, pais) VALUES ('CD Projekt Red', '2002-05-01', 'Polonia');
INSERT INTO desarrolladora (nombre, fecha_creacion, pais) VALUES ('Naughty Dog', '1984-09-27', 'Estados Unidos');
INSERT INTO desarrolladora (nombre, fecha_creacion, pais) VALUES ('Santa Monica Studio', '1999-01-01', 'Estados Unidos');
INSERT INTO desarrolladora (nombre, fecha_creacion, pais) VALUES ('Bethesda Game Studios', '2001-01-01', 'Estados Unidos');
INSERT INTO desarrolladora (nombre, fecha_creacion, pais) VALUES ('Larian Studios', '1996-06-14', 'Bélgica');
INSERT INTO desarrolladora (nombre, fecha_creacion, pais) VALUES ('Supergiant Games', '2009-06-01', 'Estados Unidos');
INSERT INTO desarrolladora (nombre, fecha_creacion, pais) VALUES ('id Software', '1991-02-01', 'Estados Unidos');
INSERT INTO desarrolladora (nombre, fecha_creacion, pais) VALUES ('Treyarch', '1996-01-01', 'Estados Unidos');

-- Juegos
INSERT INTO juego (nombre, descripcion, imagen_portada, fecha_salida) VALUES 
('Elden Ring', 'Un vasto mundo de fantasía oscura creado por Hidetaka Miyazaki y George R.R. Martin. Explora las Tierras Intermedias y enfréntate a enemigos épicos.', 'https://cdn.cloudflare.steamstatic.com/steam/apps/1245620/library_600x900.jpg', '2022-02-25');

INSERT INTO juego (nombre, descripcion, imagen_portada, fecha_salida) VALUES 
('Red Dead Redemption 2', 'Experimenta la vida de un forajido en el salvaje oeste americano. Una historia épica de honor y lealtad en un mundo abierto detallado.', 'https://cdn.cloudflare.steamstatic.com/steam/apps/1174180/library_600x900.jpg', '2018-10-26');

INSERT INTO juego (nombre, descripcion, imagen_portada, fecha_salida) VALUES 
('The Witcher 3: Wild Hunt', 'Geralt de Rivia busca a su hija adoptiva en un mundo de fantasía. Un RPG de acción con una narrativa profunda y decisiones significativas.', 'https://cdn.cloudflare.steamstatic.com/steam/apps/292030/library_600x900.jpg', '2015-05-19');

INSERT INTO juego (nombre, descripcion, imagen_portada, fecha_salida) VALUES 
('The Last of Us Part I', 'Una emotiva historia de supervivencia en un mundo post-apocalíptico. Joel y Ellie atraviesan Estados Unidos en busca de esperanza.', 'https://cdn.cloudflare.steamstatic.com/steam/apps/1888930/library_600x900.jpg', '2022-09-02');

INSERT INTO juego (nombre, descripcion, imagen_portada, fecha_salida) VALUES 
('God of War Ragnarök', 'Kratos y Atreus enfrentan el fin de los tiempos nórdicos. Continúa la saga con combates épicos y una narrativa emotiva.', 'https://cdn.cloudflare.steamstatic.com/steam/apps/2322010/library_600x900.jpg', '2022-11-09');

INSERT INTO juego (nombre, descripcion, imagen_portada, fecha_salida) VALUES 
('Baldurs Gate 3', 'Un RPG épico basado en D&D. Crea tu personaje y embárcate en una aventura con decisiones que importan.', 'https://cdn.cloudflare.steamstatic.com/steam/apps/1086940/library_600x900.jpg', '2023-08-03');

INSERT INTO juego (nombre, descripcion, imagen_portada, fecha_salida) VALUES 
('Hades', 'Un roguelike de acción donde Zagreus intenta escapar del inframundo griego. Combate frenético y narrativa procedural.', 'https://cdn.cloudflare.steamstatic.com/steam/apps/1145360/library_600x900.jpg', '2020-09-17');

INSERT INTO juego (nombre, descripcion, imagen_portada, fecha_salida) VALUES 
('DOOM Eternal', 'El Doom Slayer regresa para destruir demonios con armas devastadoras. Acción frenética en primera persona.', 'https://cdn.cloudflare.steamstatic.com/steam/apps/782330/library_600x900.jpg', '2020-03-20');

INSERT INTO juego (nombre, descripcion, imagen_portada, fecha_salida) VALUES 
('Cyberpunk 2077', 'Un RPG de mundo abierto en Night City. Personaliza a V y vive una historia de ciencia ficción cyberpunk.', 'https://cdn.cloudflare.steamstatic.com/steam/apps/1091500/library_600x900.jpg', '2020-12-10');

INSERT INTO juego (nombre, descripcion, imagen_portada, fecha_salida) VALUES 
('Hollow Knight: Silksong', 'La esperada secuela de Hollow Knight. Hornet explora un nuevo reino en este metroidvania desafiante.', 'https://cdn.cloudflare.steamstatic.com/steam/apps/1817070/library_600x900.jpg', '2025-06-01');

-- Relaciones Juego-Plataforma
-- Elden Ring
INSERT INTO juego_plataforma (juego_id, plataforma_id) VALUES (1, 1);
INSERT INTO juego_plataforma (juego_id, plataforma_id) VALUES (1, 2);
INSERT INTO juego_plataforma (juego_id, plataforma_id) VALUES (1, 3);
INSERT INTO juego_plataforma (juego_id, plataforma_id) VALUES (1, 4);
INSERT INTO juego_plataforma (juego_id, plataforma_id) VALUES (1, 6);

-- Red Dead Redemption 2
INSERT INTO juego_plataforma (juego_id, plataforma_id) VALUES (2, 2);
INSERT INTO juego_plataforma (juego_id, plataforma_id) VALUES (2, 4);
INSERT INTO juego_plataforma (juego_id, plataforma_id) VALUES (2, 6);

-- The Witcher 3
INSERT INTO juego_plataforma (juego_id, plataforma_id) VALUES (3, 1);
INSERT INTO juego_plataforma (juego_id, plataforma_id) VALUES (3, 2);
INSERT INTO juego_plataforma (juego_id, plataforma_id) VALUES (3, 3);
INSERT INTO juego_plataforma (juego_id, plataforma_id) VALUES (3, 4);
INSERT INTO juego_plataforma (juego_id, plataforma_id) VALUES (3, 5);
INSERT INTO juego_plataforma (juego_id, plataforma_id) VALUES (3, 6);

-- The Last of Us Part I
INSERT INTO juego_plataforma (juego_id, plataforma_id) VALUES (4, 1);
INSERT INTO juego_plataforma (juego_id, plataforma_id) VALUES (4, 6);

-- God of War Ragnarök
INSERT INTO juego_plataforma (juego_id, plataforma_id) VALUES (5, 1);
INSERT INTO juego_plataforma (juego_id, plataforma_id) VALUES (5, 2);
INSERT INTO juego_plataforma (juego_id, plataforma_id) VALUES (5, 6);

-- Baldur's Gate 3
INSERT INTO juego_plataforma (juego_id, plataforma_id) VALUES (6, 1);
INSERT INTO juego_plataforma (juego_id, plataforma_id) VALUES (6, 3);
INSERT INTO juego_plataforma (juego_id, plataforma_id) VALUES (6, 6);

-- Hades
INSERT INTO juego_plataforma (juego_id, plataforma_id) VALUES (7, 1);
INSERT INTO juego_plataforma (juego_id, plataforma_id) VALUES (7, 2);
INSERT INTO juego_plataforma (juego_id, plataforma_id) VALUES (7, 3);
INSERT INTO juego_plataforma (juego_id, plataforma_id) VALUES (7, 4);
INSERT INTO juego_plataforma (juego_id, plataforma_id) VALUES (7, 5);
INSERT INTO juego_plataforma (juego_id, plataforma_id) VALUES (7, 6);

-- DOOM Eternal
INSERT INTO juego_plataforma (juego_id, plataforma_id) VALUES (8, 1);
INSERT INTO juego_plataforma (juego_id, plataforma_id) VALUES (8, 2);
INSERT INTO juego_plataforma (juego_id, plataforma_id) VALUES (8, 3);
INSERT INTO juego_plataforma (juego_id, plataforma_id) VALUES (8, 4);
INSERT INTO juego_plataforma (juego_id, plataforma_id) VALUES (8, 5);
INSERT INTO juego_plataforma (juego_id, plataforma_id) VALUES (8, 6);

-- Cyberpunk 2077
INSERT INTO juego_plataforma (juego_id, plataforma_id) VALUES (9, 1);
INSERT INTO juego_plataforma (juego_id, plataforma_id) VALUES (9, 3);
INSERT INTO juego_plataforma (juego_id, plataforma_id) VALUES (9, 6);

-- Hollow Knight: Silksong
INSERT INTO juego_plataforma (juego_id, plataforma_id) VALUES (10, 5);
INSERT INTO juego_plataforma (juego_id, plataforma_id) VALUES (10, 6);

-- Relaciones Juego-Desarrolladora
INSERT INTO juego_desarrolladora (juego_id, desarrolladora_id) VALUES (1, 1);
INSERT INTO juego_desarrolladora (juego_id, desarrolladora_id) VALUES (2, 2);
INSERT INTO juego_desarrolladora (juego_id, desarrolladora_id) VALUES (3, 3);
INSERT INTO juego_desarrolladora (juego_id, desarrolladora_id) VALUES (4, 4);
INSERT INTO juego_desarrolladora (juego_id, desarrolladora_id) VALUES (5, 5);
INSERT INTO juego_desarrolladora (juego_id, desarrolladora_id) VALUES (6, 7);
INSERT INTO juego_desarrolladora (juego_id, desarrolladora_id) VALUES (7, 8);
INSERT INTO juego_desarrolladora (juego_id, desarrolladora_id) VALUES (8, 9);
INSERT INTO juego_desarrolladora (juego_id, desarrolladora_id) VALUES (9, 3);

-- Relaciones Juego-Genero
-- Elden Ring: Acción, RPG
INSERT INTO juego_genero (juego_id, genero_id) VALUES (1, 1);
INSERT INTO juego_genero (juego_id, genero_id) VALUES (1, 2);

-- Red Dead Redemption 2: Acción, Aventura
INSERT INTO juego_genero (juego_id, genero_id) VALUES (2, 1);
INSERT INTO juego_genero (juego_id, genero_id) VALUES (2, 3);

-- The Witcher 3: RPG, Aventura
INSERT INTO juego_genero (juego_id, genero_id) VALUES (3, 2);
INSERT INTO juego_genero (juego_id, genero_id) VALUES (3, 3);

-- The Last of Us: Acción, Aventura, Terror
INSERT INTO juego_genero (juego_id, genero_id) VALUES (4, 1);
INSERT INTO juego_genero (juego_id, genero_id) VALUES (4, 3);
INSERT INTO juego_genero (juego_id, genero_id) VALUES (4, 7);

-- God of War: Acción, Aventura
INSERT INTO juego_genero (juego_id, genero_id) VALUES (5, 1);
INSERT INTO juego_genero (juego_id, genero_id) VALUES (5, 3);

-- Baldur's Gate 3: RPG, Estrategia
INSERT INTO juego_genero (juego_id, genero_id) VALUES (6, 2);
INSERT INTO juego_genero (juego_id, genero_id) VALUES (6, 6);

-- Hades: Acción, RPG
INSERT INTO juego_genero (juego_id, genero_id) VALUES (7, 1);
INSERT INTO juego_genero (juego_id, genero_id) VALUES (7, 2);

-- DOOM Eternal: Acción, Shooter
INSERT INTO juego_genero (juego_id, genero_id) VALUES (8, 1);
INSERT INTO juego_genero (juego_id, genero_id) VALUES (8, 4);

-- Cyberpunk 2077: RPG, Shooter
INSERT INTO juego_genero (juego_id, genero_id) VALUES (9, 2);
INSERT INTO juego_genero (juego_id, genero_id) VALUES (9, 4);

-- Hollow Knight Silksong: Acción, Plataformas
INSERT INTO juego_genero (juego_id, genero_id) VALUES (10, 1);
INSERT INTO juego_genero (juego_id, genero_id) VALUES (10, 9);
-- ============================================
-- USUARIO ADMINISTRADOR
-- ============================================
-- Email: admin@looking4rate.com
-- Contraseña: RAPture23.
-- Rol: ADMIN

INSERT INTO usuario (nombre, email, contrasenia, fecha_registro, avatar, rol, activo) VALUES 
('Admin', 'admin@looking4rate.com', '$2a$10$hgC/q19Z1mm1RIkl8/Tg9uKqTEd3cbsgd9.jf42XDtr9lqQ3/loRy', '2026-01-04', 'https://api.dicebear.com/7.x/avataaars/svg?seed=Admin', 'ADMIN', true);