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
('Hollow Knight: Silksong', 'La esperada secuela de Hollow Knight. Hornet explora un nuevo reino en este metroidvania desafiante.', 'https://cdn.cloudflare.steamstatic.com/steam/apps/1030300/library_600x900.jpg', '2025-06-01');

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
-- JUEGOS ADICIONALES PARA TESTING DE PAGINACIÓN
-- ============================================
INSERT INTO juego (nombre, descripcion, imagen_portada, fecha_salida) VALUES 
('Dark Souls III', 'El capítulo final de la aclamada serie Dark Souls. Enfréntate a jefes épicos en un mundo oscuro y decadente.', 'https://cdn.cloudflare.steamstatic.com/steam/apps/374320/library_600x900.jpg', '2016-04-12');

INSERT INTO juego (nombre, descripcion, imagen_portada, fecha_salida) VALUES 
('Sekiro: Shadows Die Twice', 'Un shinobi busca venganza en el Japón de la era Sengoku. Combate preciso y mecánicas de sigilo únicas.', 'https://cdn.cloudflare.steamstatic.com/steam/apps/814380/library_600x900.jpg', '2019-03-22');

INSERT INTO juego (nombre, descripcion, imagen_portada, fecha_salida) VALUES 
('Ghost of Tsushima', 'Jin Sakai defiende la isla de Tsushima contra la invasión mongola. Un épico mundo abierto en el Japón feudal.', 'https://cdn.cloudflare.steamstatic.com/steam/apps/2215430/library_600x900.jpg', '2020-07-17');

INSERT INTO juego (nombre, descripcion, imagen_portada, fecha_salida) VALUES 
('Horizon Zero Dawn', 'Aloy caza máquinas en un futuro post-apocalíptico. Descubre los secretos de un mundo dominado por robots.', 'https://cdn.cloudflare.steamstatic.com/steam/apps/1151640/library_600x900.jpg', '2017-02-28');

INSERT INTO juego (nombre, descripcion, imagen_portada, fecha_salida) VALUES 
('Horizon Forbidden West', 'Aloy viaja al oeste prohibido para descubrir la fuente de una misteriosa plaga. Secuela épica con nuevas máquinas.', 'https://cdn.cloudflare.steamstatic.com/steam/apps/2420110/library_600x900.jpg', '2022-02-18');

INSERT INTO juego (nombre, descripcion, imagen_portada, fecha_salida) VALUES 
('Spider-Man Remastered', 'Conviértete en Spider-Man y protege Nueva York. Combate fluido y traversal por la ciudad abierta.', 'https://cdn.cloudflare.steamstatic.com/steam/apps/1817070/library_600x900.jpg', '2018-09-07');

INSERT INTO juego (nombre, descripcion, imagen_portada, fecha_salida) VALUES 
('Spider-Man: Miles Morales', 'Miles Morales asume el manto de Spider-Man. Una historia personal con nuevos poderes eléctricos.', 'https://cdn.cloudflare.steamstatic.com/steam/apps/1817190/library_600x900.jpg', '2020-11-12');

INSERT INTO juego (nombre, descripcion, imagen_portada, fecha_salida) VALUES 
('Death Stranding', 'Sam Bridges reconecta una América fragmentada. Un juego único de Hideo Kojima sobre conexión humana.', 'https://cdn.cloudflare.steamstatic.com/steam/apps/1190460/library_600x900.jpg', '2019-11-08');

INSERT INTO juego (nombre, descripcion, imagen_portada, fecha_salida) VALUES 
('Resident Evil Village', 'Ethan Winters busca a su hija en un pueblo misterioso. Terror en primera persona con acción intensa.', 'https://cdn.cloudflare.steamstatic.com/steam/apps/1196590/library_600x900.jpg', '2021-05-07');

INSERT INTO juego (nombre, descripcion, imagen_portada, fecha_salida) VALUES 
('Resident Evil 4 Remake', 'El clásico reinventado. Leon S. Kennedy rescata a la hija del presidente en la España rural.', 'https://cdn.cloudflare.steamstatic.com/steam/apps/2050650/library_600x900.jpg', '2023-03-24');

INSERT INTO juego (nombre, descripcion, imagen_portada, fecha_salida) VALUES 
('Final Fantasy XVI', 'Clive Rosfield busca venganza en un mundo de fantasía. Combate de acción en tiempo real y Eikons épicos.', 'https://cdn.cloudflare.steamstatic.com/steam/apps/2515020/library_600x900.jpg', '2023-06-22');

INSERT INTO juego (nombre, descripcion, imagen_portada, fecha_salida) VALUES 
('Final Fantasy VII Rebirth', 'La segunda parte del remake de FF7. Cloud y sus aliados continúan su viaje fuera de Midgar.', 'https://cdn.cloudflare.steamstatic.com/steam/apps/2484110/library_600x900.jpg', '2024-02-29');

INSERT INTO juego (nombre, descripcion, imagen_portada, fecha_salida) VALUES 
('Monster Hunter Rise', 'Caza monstruos en un mundo inspirado en Japón feudal. Nuevas mecánicas de traversal con el Wirebugs.', 'https://cdn.cloudflare.steamstatic.com/steam/apps/1446780/library_600x900.jpg', '2021-03-26');

INSERT INTO juego (nombre, descripcion, imagen_portada, fecha_salida) VALUES 
('Monster Hunter World', 'La entrega más accesible de Monster Hunter. Caza criaturas gigantes en ecosistemas vivos.', 'https://cdn.cloudflare.steamstatic.com/steam/apps/582010/library_600x900.jpg', '2018-01-26');

INSERT INTO juego (nombre, descripcion, imagen_portada, fecha_salida) VALUES 
('Persona 5 Royal', 'Los Phantom Thieves roban corazones corruptos. JRPG con estilo único y simulación de vida escolar.', 'https://cdn.cloudflare.steamstatic.com/steam/apps/1687950/library_600x900.jpg', '2019-10-31');

INSERT INTO juego (nombre, descripcion, imagen_portada, fecha_salida) VALUES 
('NieR: Automata', 'Androides 2B y 9S luchan contra máquinas en una Tierra post-apocalíptica. Acción con narrativa profunda.', 'https://cdn.cloudflare.steamstatic.com/steam/apps/524220/library_600x900.jpg', '2017-02-23');

INSERT INTO juego (nombre, descripcion, imagen_portada, fecha_salida) VALUES 
('Disco Elysium', 'Un RPG de detectives sin combate. Resuelve un asesinato mientras lidias con tus demonios internos.', 'https://cdn.cloudflare.steamstatic.com/steam/apps/632470/library_600x900.jpg', '2019-10-15');

INSERT INTO juego (nombre, descripcion, imagen_portada, fecha_salida) VALUES 
('Stardew Valley', 'Hereda una granja y reconstruye tu vida en el campo. Farming sim con relaciones y exploración.', 'https://cdn.cloudflare.steamstatic.com/steam/apps/413150/library_600x900.jpg', '2016-02-26');

INSERT INTO juego (nombre, descripcion, imagen_portada, fecha_salida) VALUES 
('Celeste', 'Madeline escala la montaña Celeste. Un plataformas desafiante con mensaje sobre salud mental.', 'https://cdn.cloudflare.steamstatic.com/steam/apps/504230/library_600x900.jpg', '2018-01-25');

INSERT INTO juego (nombre, descripcion, imagen_portada, fecha_salida) VALUES 
('Hollow Knight', 'Explora Hallownest en este metroidvania. Un caballero insecto descubre los secretos de un reino caído.', 'https://cdn.cloudflare.steamstatic.com/steam/apps/367520/library_600x900.jpg', '2017-02-24');

-- Relaciones juegos adicionales con plataformas
INSERT INTO juego_plataforma (juego_id, plataforma_id) VALUES (11, 1);
INSERT INTO juego_plataforma (juego_id, plataforma_id) VALUES (11, 2);
INSERT INTO juego_plataforma (juego_id, plataforma_id) VALUES (11, 3);
INSERT INTO juego_plataforma (juego_id, plataforma_id) VALUES (11, 4);
INSERT INTO juego_plataforma (juego_id, plataforma_id) VALUES (11, 6);
INSERT INTO juego_plataforma (juego_id, plataforma_id) VALUES (12, 1);
INSERT INTO juego_plataforma (juego_id, plataforma_id) VALUES (12, 2);
INSERT INTO juego_plataforma (juego_id, plataforma_id) VALUES (12, 3);
INSERT INTO juego_plataforma (juego_id, plataforma_id) VALUES (12, 4);
INSERT INTO juego_plataforma (juego_id, plataforma_id) VALUES (12, 6);
INSERT INTO juego_plataforma (juego_id, plataforma_id) VALUES (13, 1);
INSERT INTO juego_plataforma (juego_id, plataforma_id) VALUES (13, 2);
INSERT INTO juego_plataforma (juego_id, plataforma_id) VALUES (13, 6);
INSERT INTO juego_plataforma (juego_id, plataforma_id) VALUES (14, 1);
INSERT INTO juego_plataforma (juego_id, plataforma_id) VALUES (14, 2);
INSERT INTO juego_plataforma (juego_id, plataforma_id) VALUES (14, 6);
INSERT INTO juego_plataforma (juego_id, plataforma_id) VALUES (15, 1);
INSERT INTO juego_plataforma (juego_id, plataforma_id) VALUES (15, 6);
INSERT INTO juego_plataforma (juego_id, plataforma_id) VALUES (16, 1);
INSERT INTO juego_plataforma (juego_id, plataforma_id) VALUES (16, 6);
INSERT INTO juego_plataforma (juego_id, plataforma_id) VALUES (17, 1);
INSERT INTO juego_plataforma (juego_id, plataforma_id) VALUES (17, 6);
INSERT INTO juego_plataforma (juego_id, plataforma_id) VALUES (18, 1);
INSERT INTO juego_plataforma (juego_id, plataforma_id) VALUES (18, 6);
INSERT INTO juego_plataforma (juego_id, plataforma_id) VALUES (19, 1);
INSERT INTO juego_plataforma (juego_id, plataforma_id) VALUES (19, 6);
INSERT INTO juego_plataforma (juego_id, plataforma_id) VALUES (20, 1);
INSERT INTO juego_plataforma (juego_id, plataforma_id) VALUES (20, 6);
INSERT INTO juego_plataforma (juego_id, plataforma_id) VALUES (21, 1);
INSERT INTO juego_plataforma (juego_id, plataforma_id) VALUES (21, 6);
INSERT INTO juego_plataforma (juego_id, plataforma_id) VALUES (22, 1);
INSERT INTO juego_plataforma (juego_id, plataforma_id) VALUES (22, 6);
INSERT INTO juego_plataforma (juego_id, plataforma_id) VALUES (23, 1);
INSERT INTO juego_plataforma (juego_id, plataforma_id) VALUES (23, 5);
INSERT INTO juego_plataforma (juego_id, plataforma_id) VALUES (23, 6);
INSERT INTO juego_plataforma (juego_id, plataforma_id) VALUES (24, 1);
INSERT INTO juego_plataforma (juego_id, plataforma_id) VALUES (24, 3);
INSERT INTO juego_plataforma (juego_id, plataforma_id) VALUES (24, 6);
INSERT INTO juego_plataforma (juego_id, plataforma_id) VALUES (25, 1);
INSERT INTO juego_plataforma (juego_id, plataforma_id) VALUES (25, 5);
INSERT INTO juego_plataforma (juego_id, plataforma_id) VALUES (25, 6);
INSERT INTO juego_plataforma (juego_id, plataforma_id) VALUES (26, 1);
INSERT INTO juego_plataforma (juego_id, plataforma_id) VALUES (26, 6);
INSERT INTO juego_plataforma (juego_id, plataforma_id) VALUES (27, 6);
INSERT INTO juego_plataforma (juego_id, plataforma_id) VALUES (28, 1);
INSERT INTO juego_plataforma (juego_id, plataforma_id) VALUES (28, 5);
INSERT INTO juego_plataforma (juego_id, plataforma_id) VALUES (28, 6);
INSERT INTO juego_plataforma (juego_id, plataforma_id) VALUES (29, 1);
INSERT INTO juego_plataforma (juego_id, plataforma_id) VALUES (29, 5);
INSERT INTO juego_plataforma (juego_id, plataforma_id) VALUES (29, 6);
INSERT INTO juego_plataforma (juego_id, plataforma_id) VALUES (30, 1);
INSERT INTO juego_plataforma (juego_id, plataforma_id) VALUES (30, 5);
INSERT INTO juego_plataforma (juego_id, plataforma_id) VALUES (30, 6);

-- Relaciones juegos adicionales con desarrolladoras
INSERT INTO juego_desarrolladora (juego_id, desarrolladora_id) VALUES (11, 1);
INSERT INTO juego_desarrolladora (juego_id, desarrolladora_id) VALUES (12, 1);

-- Relaciones juegos adicionales con géneros
INSERT INTO juego_genero (juego_id, genero_id) VALUES (11, 1);
INSERT INTO juego_genero (juego_id, genero_id) VALUES (11, 2);
INSERT INTO juego_genero (juego_id, genero_id) VALUES (12, 1);
INSERT INTO juego_genero (juego_id, genero_id) VALUES (12, 3);
INSERT INTO juego_genero (juego_id, genero_id) VALUES (13, 1);
INSERT INTO juego_genero (juego_id, genero_id) VALUES (13, 3);
INSERT INTO juego_genero (juego_id, genero_id) VALUES (14, 1);
INSERT INTO juego_genero (juego_id, genero_id) VALUES (14, 2);
INSERT INTO juego_genero (juego_id, genero_id) VALUES (14, 3);
INSERT INTO juego_genero (juego_id, genero_id) VALUES (15, 1);
INSERT INTO juego_genero (juego_id, genero_id) VALUES (15, 2);
INSERT INTO juego_genero (juego_id, genero_id) VALUES (15, 3);
INSERT INTO juego_genero (juego_id, genero_id) VALUES (16, 1);
INSERT INTO juego_genero (juego_id, genero_id) VALUES (16, 3);
INSERT INTO juego_genero (juego_id, genero_id) VALUES (17, 1);
INSERT INTO juego_genero (juego_id, genero_id) VALUES (17, 3);
INSERT INTO juego_genero (juego_id, genero_id) VALUES (18, 1);
INSERT INTO juego_genero (juego_id, genero_id) VALUES (18, 3);
INSERT INTO juego_genero (juego_id, genero_id) VALUES (19, 1);
INSERT INTO juego_genero (juego_id, genero_id) VALUES (19, 7);
INSERT INTO juego_genero (juego_id, genero_id) VALUES (20, 1);
INSERT INTO juego_genero (juego_id, genero_id) VALUES (20, 7);
INSERT INTO juego_genero (juego_id, genero_id) VALUES (21, 1);
INSERT INTO juego_genero (juego_id, genero_id) VALUES (21, 2);
INSERT INTO juego_genero (juego_id, genero_id) VALUES (22, 2);
INSERT INTO juego_genero (juego_id, genero_id) VALUES (23, 1);
INSERT INTO juego_genero (juego_id, genero_id) VALUES (23, 2);
INSERT INTO juego_genero (juego_id, genero_id) VALUES (24, 1);
INSERT INTO juego_genero (juego_id, genero_id) VALUES (24, 2);
INSERT INTO juego_genero (juego_id, genero_id) VALUES (25, 2);
INSERT INTO juego_genero (juego_id, genero_id) VALUES (26, 1);
INSERT INTO juego_genero (juego_id, genero_id) VALUES (26, 2);
INSERT INTO juego_genero (juego_id, genero_id) VALUES (27, 2);
INSERT INTO juego_genero (juego_id, genero_id) VALUES (27, 3);
INSERT INTO juego_genero (juego_id, genero_id) VALUES (28, 8);
INSERT INTO juego_genero (juego_id, genero_id) VALUES (29, 1);
INSERT INTO juego_genero (juego_id, genero_id) VALUES (29, 9);
INSERT INTO juego_genero (juego_id, genero_id) VALUES (30, 1);
INSERT INTO juego_genero (juego_id, genero_id) VALUES (30, 3);
INSERT INTO juego_genero (juego_id, genero_id) VALUES (30, 9);

-- ============================================
-- IMÁGENES DE GALERÍA DE JUEGOS
-- URLs verificadas de Steam CDN con hashes reales
-- ============================================

-- Elden Ring (id: 1) - Steam App ID: 1245620
INSERT INTO imagen_juego (url, alt, caption, juego_id) VALUES 
('https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/1245620/ss_e80a907c2c43337e53316c71555c3c3035a1343e.1920x1080.jpg', 'Combate épico contra jefe', 'Enfrentamientos legendarios', 1);
INSERT INTO imagen_juego (url, alt, caption, juego_id) VALUES 
('https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/1245620/ss_c372274833ae6e5437b952fa1979430546a43ad9.1920x1080.jpg', 'Exploración del mundo abierto', 'Mundo vasto por descubrir', 1);
INSERT INTO imagen_juego (url, alt, caption, juego_id) VALUES 
('https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/1245620/ss_b87601dee58f4dbc36e40a8d803dc6a53ceefe07.1920x1080.jpg', 'Mazmorra oscura', 'Peligros en cada esquina', 1);
INSERT INTO imagen_juego (url, alt, caption, juego_id) VALUES 
('https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/1245620/ss_3aec1455923ef49f4e777c2a94dbcd0256f77eb0.1920x1080.jpg', 'Tierras Intermedias', 'Paisajes épicos', 1);

-- Red Dead Redemption 2 (id: 2) - Steam App ID: 1174180
INSERT INTO imagen_juego (url, alt, caption, juego_id) VALUES 
('https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/1174180/ss_66b553f4c209476d3e4ce25fa4714002cc914c4f.1920x1080.jpg', 'Arthur Morgan a caballo', 'Libertad en el oeste', 2);
INSERT INTO imagen_juego (url, alt, caption, juego_id) VALUES 
('https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/1174180/ss_d1a8f5a69155c3186c65d1da90491fcfd43663d9.1920x1080.jpg', 'Paisajes impresionantes', 'Naturaleza salvaje', 2);
INSERT INTO imagen_juego (url, alt, caption, juego_id) VALUES 
('https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/1174180/ss_bac60bacbf5da8945103648c08d27d5e202444ca.1920x1080.jpg', 'Vida en el campamento', 'La banda Van der Linde', 2);
INSERT INTO imagen_juego (url, alt, caption, juego_id) VALUES 
('https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/1174180/ss_668dafe477743f8b50b818d5bbfcec669e9ba93e.1920x1080.jpg', 'Paisaje del salvaje oeste', 'Atardeceres épicos', 2);

-- The Witcher 3 (id: 3) - Steam App ID: 292030
INSERT INTO imagen_juego (url, alt, caption, juego_id) VALUES 
('https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/292030/ss_64eb760f9a2b67f6731a71cce3a8fb684b9af267.1920x1080.jpg', 'Geralt en combate', 'El brujo legendario', 3);
INSERT INTO imagen_juego (url, alt, caption, juego_id) VALUES 
('https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/292030/ss_eda99e7f705a113d04ab2a7a36068f3e7b343d17.1920x1080.jpg', 'Mundo abierto', 'Reinos por explorar', 3);
INSERT INTO imagen_juego (url, alt, caption, juego_id) VALUES 
('https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/292030/ss_107600c1337accc09104f7a8aa7f275f23cad096.1920x1080.jpg', 'Monstruos terroríficos', 'Cacería de bestias', 3);
INSERT INTO imagen_juego (url, alt, caption, juego_id) VALUES 
('https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/292030/ss_d1b73b18cbcd5e9e412c7a1dead3c5cd7303d2ad.1920x1080.jpg', 'Geralt en Toussaint', 'Aventura épica', 3);

-- The Last of Us Part I (id: 4) - Steam App ID: 1888930
INSERT INTO imagen_juego (url, alt, caption, juego_id) VALUES 
('https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/1888930/ss_3f1805ecddafacee7f61f87cb8e4624435a83ee3.1920x1080.jpg', 'Joel y Ellie', 'Un viaje inolvidable', 4);
INSERT INTO imagen_juego (url, alt, caption, juego_id) VALUES 
('https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/1888930/ss_89fffc2857dcae29dee2a09f1be33d745610e19d.1920x1080.jpg', 'Ciudad post-apocalíptica', 'Mundo devastado', 4);
INSERT INTO imagen_juego (url, alt, caption, juego_id) VALUES 
('https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/1888930/ss_8cd55ab975b2e47f4d4d9a0da4ae6948040ef807.1920x1080.jpg', 'Combate intenso', 'Supervivencia extrema', 4);
INSERT INTO imagen_juego (url, alt, caption, juego_id) VALUES 
('https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/1888930/ss_f4829000d3677a9b5b2f234482a7deff12b31ac9.1920x1080.jpg', 'Exploración', 'Mundo en ruinas', 4);

-- God of War Ragnarök (id: 5) - Steam App ID: 2322010
INSERT INTO imagen_juego (url, alt, caption, juego_id) VALUES 
('https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/2322010/ss_7c59382e67eadf779e0e15c3837ee91158237f11.1920x1080.jpg', 'Kratos y Atreus', 'Padre e hijo', 5);
INSERT INTO imagen_juego (url, alt, caption, juego_id) VALUES 
('https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/2322010/ss_05f27139b15c5410d07cd59b7b52adbdf73e13da.1920x1080.jpg', 'Combate brutal', 'Furia espartana', 5);
INSERT INTO imagen_juego (url, alt, caption, juego_id) VALUES 
('https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/2322010/ss_974a7b998c0c14da7fe52a342cf36c98850a57ac.1920x1080.jpg', 'Reinos nórdicos', 'Mundos épicos', 5);
INSERT INTO imagen_juego (url, alt, caption, juego_id) VALUES 
('https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/2322010/ss_78350297511e81f287b4bc361935efbc3016f6db.1920x1080.jpg', 'Batalla épica', 'Ragnarök se acerca', 5);

-- Baldurs Gate 3 (id: 6) - Steam App ID: 1086940
INSERT INTO imagen_juego (url, alt, caption, juego_id) VALUES 
('https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/1086940/ss_c73bc54415178c07fef85f54ee26621728c77504.1920x1080.jpg', 'Combate táctico', 'Estrategia por turnos', 6);
INSERT INTO imagen_juego (url, alt, caption, juego_id) VALUES 
('https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/1086940/ss_73d93bea842b93914d966622104dcb8c0f42972b.1920x1080.jpg', 'Compañeros de aventura', 'Relaciones profundas', 6);
INSERT INTO imagen_juego (url, alt, caption, juego_id) VALUES 
('https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/1086940/ss_cf936d31061b58e98e0c646aee00e6030c410cda.1920x1080.jpg', 'Mazmorras peligrosas', 'Exploración sin límites', 6);
INSERT INTO imagen_juego (url, alt, caption, juego_id) VALUES 
('https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/1086940/ss_b6a6ee6e046426d08ceea7a4506a1b5f44181543.1920x1080.jpg', 'Mundo de fantasía', 'RPG épico', 6);

-- Hades (id: 7) - Steam App ID: 1145360
INSERT INTO imagen_juego (url, alt, caption, juego_id) VALUES 
('https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/1145360/ss_c0fed447426b69981cf1721756acf75369801b31.1920x1080.jpg', 'Zagreus en combate', 'Acción frenética', 7);
INSERT INTO imagen_juego (url, alt, caption, juego_id) VALUES 
('https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/1145360/ss_8a9f0953e8a014bd3df2789c2835cb787cd3764d.1920x1080.jpg', 'Dioses del Olimpo', 'Bendiciones divinas', 7);
INSERT INTO imagen_juego (url, alt, caption, juego_id) VALUES 
('https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/1145360/ss_68300459a8c3daacb2ec687adcdbf4442fcc4f47.1920x1080.jpg', 'Combate en el Tártaro', 'Escapar del inframundo', 7);
INSERT INTO imagen_juego (url, alt, caption, juego_id) VALUES 
('https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/1145360/ss_bcb499a0dd001f4101823f99ec5094d2872ba6ee.1920x1080.jpg', 'Arte espectacular', 'Estilo visual único', 7);

-- DOOM Eternal (id: 8) - Steam App ID: 782330
INSERT INTO imagen_juego (url, alt, caption, juego_id) VALUES 
('https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/782330/ss_4f93a7c5003d49cb32f6c0c6e547452b284580a0.1920x1080.jpg', 'Doom Slayer en acción', 'Brutalidad máxima', 8);
INSERT INTO imagen_juego (url, alt, caption, juego_id) VALUES 
('https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/782330/ss_7e6a2148321c8024285e3924903d8897cac95358.1920x1080.jpg', 'Arsenal devastador', 'Armas legendarias', 8);
INSERT INTO imagen_juego (url, alt, caption, juego_id) VALUES 
('https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/782330/ss_af3b43c4be0029b52ceefaf55ebe1918e2cb3471.1920x1080.jpg', 'Hordas demoníacas', 'Infierno desatado', 8);
INSERT INTO imagen_juego (url, alt, caption, juego_id) VALUES 
('https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/782330/ss_c836f889d696fa2b81d5fe9f20f75dd925c1b499.1920x1080.jpg', 'Combate brutal', 'Rip and Tear', 8);

-- Cyberpunk 2077 (id: 9) - Steam App ID: 1091500
INSERT INTO imagen_juego (url, alt, caption, juego_id) VALUES 
('https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/1091500/ss_b529b0abc43f55fc23fe8058eddb6e37c9629a6a.1920x1080.jpg', 'V en Night City', 'Futuro distópico', 9);
INSERT INTO imagen_juego (url, alt, caption, juego_id) VALUES 
('https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/1091500/ss_8640d9db74f7cad714f6ecfb0e1aceaa3f887e58.1920x1080.jpg', 'Combate cyberpunk', 'Implantes letales', 9);
INSERT INTO imagen_juego (url, alt, caption, juego_id) VALUES 
('https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/1091500/ss_4bda6f67580d94832ed2d5814e41ebe018ba1d9e.1920x1080.jpg', 'Vehículos futuristas', 'Explora la megalópolis', 9);
INSERT INTO imagen_juego (url, alt, caption, juego_id) VALUES 
('https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/1091500/ss_872822c5e50dc71f345416098d29fc3ae5cd26c1.1920x1080.jpg', 'Night City de noche', 'Ciudad neón', 9);

-- Hollow Knight: Silksong (id: 10) - Steam App ID: 1030300
INSERT INTO imagen_juego (url, alt, caption, juego_id) VALUES 
('https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/1030300/26950369fe4b03c2268620eb9815c8a246aa0b06/ss_26950369fe4b03c2268620eb9815c8a246aa0b06.1920x1080.jpg', 'Hornet en combate', 'Nueva protagonista', 10);
INSERT INTO imagen_juego (url, alt, caption, juego_id) VALUES 
('https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/1030300/09ccaa6c16f158f9df8298feb5d196098506a028/ss_09ccaa6c16f158f9df8298feb5d196098506a028.1920x1080.jpg', 'Nuevos reinos', 'Mundo expandido', 10);
INSERT INTO imagen_juego (url, alt, caption, juego_id) VALUES 
('https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/1030300/d1a893ec6357b347a55ed929833ba793b57a79d2/ss_d1a893ec6357b347a55ed929833ba793b57a79d2.1920x1080.jpg', 'Arte dibujado a mano', 'Belleza artística', 10);
INSERT INTO imagen_juego (url, alt, caption, juego_id) VALUES 
('https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/1030300/856e33e755a0b9a785c645d116036516ea08812b/ss_856e33e755a0b9a785c645d116036516ea08812b.1920x1080.jpg', 'Exploración', 'Metroidvania épico', 10);

-- Dark Souls III (id: 11) - Steam App ID: 374320
INSERT INTO imagen_juego (url, alt, caption, juego_id) VALUES 
('https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/374320/ss_5efd318b85a3917d1c6e717f4cb813b47547cd6f.1920x1080.jpg', 'Caballero oscuro', 'Combate desafiante', 11);
INSERT INTO imagen_juego (url, alt, caption, juego_id) VALUES 
('https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/374320/ss_1c0fa39091901496d77cf4cecfea4ffb056d6452.1920x1080.jpg', 'Lothric majestuoso', 'Arquitectura gótica', 11);
INSERT INTO imagen_juego (url, alt, caption, juego_id) VALUES 
('https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/374320/ss_1318a04ef11d87f38aebe6d47a96124f8f888ca8.1920x1080.jpg', 'Jefe épico', 'Batallas legendarias', 11);
INSERT INTO imagen_juego (url, alt, caption, juego_id) VALUES 
('https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/374320/ss_61524dee9ebf72d462638f21adbbbea4c93d791d.1920x1080.jpg', 'Mundo decadente', 'Oscuridad envolvente', 11);

-- Sekiro: Shadows Die Twice (id: 12) - Steam App ID: 814380
INSERT INTO imagen_juego (url, alt, caption, juego_id) VALUES 
('https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/814380/ss_0f7b0f8ed9ffc49aba26f9328caa9a1d59ad60f0.1920x1080.jpg', 'Wolf el shinobi', 'Combate preciso', 12);
INSERT INTO imagen_juego (url, alt, caption, juego_id) VALUES 
('https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/814380/ss_2685dd844a2a523b6c7ec207d46a538db6a908cd.1920x1080.jpg', 'Japón feudal', 'Ambientación única', 12);
INSERT INTO imagen_juego (url, alt, caption, juego_id) VALUES 
('https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/814380/ss_15f0e9982621aed44900215ad283811af0779b1d.1920x1080.jpg', 'Garfio en acción', 'Movilidad vertical', 12);
INSERT INTO imagen_juego (url, alt, caption, juego_id) VALUES 
('https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/814380/ss_1e6f5540866a5564d65df915c22fe1e57e336a6f.1920x1080.jpg', 'Duelo samurái', 'Honor y venganza', 12);

-- Ghost of Tsushima (id: 13) - Steam App ID: 2215430
INSERT INTO imagen_juego (url, alt, caption, juego_id) VALUES 
('https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/2215430/ss_51eb1a47a41271abb0aa781de576f704d95b601b.1920x1080.jpg', 'Jin Sakai', 'Honor del samurái', 13);
INSERT INTO imagen_juego (url, alt, caption, juego_id) VALUES 
('https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/2215430/ss_d60e16422fc1605181e0fedee3e2cfc1e02c750e.1920x1080.jpg', 'Paisajes de Tsushima', 'Belleza japonesa', 13);
INSERT INTO imagen_juego (url, alt, caption, juego_id) VALUES 
('https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/2215430/ss_11409331d57966ef193d66ffcded569d02a4e034.1920x1080.jpg', 'Duelos épicos', 'Arte de la katana', 13);
INSERT INTO imagen_juego (url, alt, caption, juego_id) VALUES 
('https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/2215430/ss_bd593bab36968778b95ed4a1a12ec82d2350d351.1920x1080.jpg', 'Combate samurái', 'Camino del fantasma', 13);

-- Horizon Zero Dawn (id: 14) - Steam App ID: 1151640
INSERT INTO imagen_juego (url, alt, caption, juego_id) VALUES 
('https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/1151640/ss_d09106060fb7de8bf342c23df18b14debc8a15a3.1920x1080.jpg', 'Aloy la cazadora', 'Heroína legendaria', 14);
INSERT INTO imagen_juego (url, alt, caption, juego_id) VALUES 
('https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/1151640/ss_271f850eec3f96b22aa17be35b948268e0771c7f.1920x1080.jpg', 'Máquinas gigantes', 'Fauna robótica', 14);
INSERT INTO imagen_juego (url, alt, caption, juego_id) VALUES 
('https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/1151640/ss_15f5759c441e4e5f51e1a8ee333e4ab9df9aa783.1920x1080.jpg', 'Mundo post-apocalíptico', 'Naturaleza recuperada', 14);
INSERT INTO imagen_juego (url, alt, caption, juego_id) VALUES 
('https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/1151640/ss_f7cf51f1ccd909264f2c5814f328e3f72e7b62bd.1920x1080.jpg', 'Combate con máquinas', 'Caza épica', 14);

-- Horizon Forbidden West (id: 15) - Steam App ID: 2420110
INSERT INTO imagen_juego (url, alt, caption, juego_id) VALUES 
('https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/2420110/ss_7c1ead4b3d952fd0fb92735397945bd8732bba53.1920x1080.jpg', 'Nuevos territorios', 'Exploración expandida', 15);
INSERT INTO imagen_juego (url, alt, caption, juego_id) VALUES 
('https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/2420110/ss_2d05273cef37bcc3651dc9dbea42dbeca5f5f196.1920x1080.jpg', 'Nuevas máquinas', 'Peligros mecánicos', 15);
INSERT INTO imagen_juego (url, alt, caption, juego_id) VALUES 
('https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/2420110/ss_87750b2dbc34d82d1ffef7aaab40a9f46d970d99.1920x1080.jpg', 'Gráficos next-gen', 'Belleza visual', 15);
INSERT INTO imagen_juego (url, alt, caption, juego_id) VALUES 
('https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/2420110/ss_a4a19b86e80488f3d608e835e5ae3086760db866.1920x1080.jpg', 'Aloy en acción', 'Oeste prohibido', 15);

-- Spider-Man Remastered (id: 16) - Steam App ID: 1817070
INSERT INTO imagen_juego (url, alt, caption, juego_id) VALUES 
('https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/1817070/ss_dfe778bf6d66e952e4acd4e1f926f7615b609ddf.1920x1080.jpg', 'Web-slinging por NYC', 'Traversal fluido', 16);
INSERT INTO imagen_juego (url, alt, caption, juego_id) VALUES 
('https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/1817070/ss_427677cf78195df94702f0a963cd9eaeb9d8935a.1920x1080.jpg', 'Combate espectacular', 'Acción arácnida', 16);
INSERT INTO imagen_juego (url, alt, caption, juego_id) VALUES 
('https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/1817070/ss_dfba6f2477bfa42be69ddfdffbd421d3943d20bf.1920x1080.jpg', 'Nueva York detallada', 'Ciudad icónica', 16);
INSERT INTO imagen_juego (url, alt, caption, juego_id) VALUES 
('https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/1817070/ss_5b5448df07bc74ba236f2c007fd0ec19cc1d22b6.1920x1080.jpg', 'Peter Parker', 'El héroe de NYC', 16);

-- Spider-Man: Miles Morales (id: 17) - Steam App ID: 1817190
INSERT INTO imagen_juego (url, alt, caption, juego_id) VALUES 
('https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/1817190/ss_a240e0c6f37569493ed749d9317718d8ce9f5d18.1920x1080.jpg', 'Miles en acción', 'Poderes bioeléctricos', 17);
INSERT INTO imagen_juego (url, alt, caption, juego_id) VALUES 
('https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/1817190/ss_02bb2ac97c3ce854344a537d9ed89c70ba45c3d3.1920x1080.jpg', 'NYC invernal', 'Ambientación navideña', 17);
INSERT INTO imagen_juego (url, alt, caption, juego_id) VALUES 
('https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/1817190/ss_616a0e2ab905281a483d99d0e1f07fc0749770d2.1920x1080.jpg', 'Venom Strike', 'Nuevas habilidades', 17);
INSERT INTO imagen_juego (url, alt, caption, juego_id) VALUES 
('https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/1817190/ss_1950c472438a5ccde0f9e7c112dceaddd7cd52f1.1920x1080.jpg', 'Web-slinging', 'Nuevo Spider-Man', 17);

-- Death Stranding (id: 18) - Steam App ID: 1850570
INSERT INTO imagen_juego (url, alt, caption, juego_id) VALUES 
('https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/1850570/ss_f64a1140651ff5af30eb63bb6e5b41753d00a98e.1920x1080.jpg', 'Sam Porter Bridges', 'Entrega legendaria', 18);
INSERT INTO imagen_juego (url, alt, caption, juego_id) VALUES 
('https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/1850570/ss_4b6d7d010d1701b2b57bf8ef1b4975a04b3d632f.1920x1080.jpg', 'Paisajes desolados', 'América fragmentada', 18);
INSERT INTO imagen_juego (url, alt, caption, juego_id) VALUES 
('https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/1850570/ss_bc8812817c074772822c1d1e8a6b016983cf05e8.1920x1080.jpg', 'BTs misteriosos', 'Enemigos invisibles', 18);
INSERT INTO imagen_juego (url, alt, caption, juego_id) VALUES 
('https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/1850570/ss_d47bde2e349606b3ef1f641e2d8fb7ccf1adba77.1920x1080.jpg', 'Conexiones', 'Reconectar el mundo', 18);

-- Resident Evil Village (id: 19) - Steam App ID: 1196590
INSERT INTO imagen_juego (url, alt, caption, juego_id) VALUES 
('https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/1196590/ss_d25704b01be292d1337df4fea0fba2aab322b58a.1920x1080.jpg', 'Lady Dimitrescu', 'Villana icónica', 19);
INSERT INTO imagen_juego (url, alt, caption, juego_id) VALUES 
('https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/1196590/ss_8113ec993ec474055c4cdce5ee86f91f7cf6663f.1920x1080.jpg', 'Castillo tenebroso', 'Terror atmosférico', 19);
INSERT INTO imagen_juego (url, alt, caption, juego_id) VALUES 
('https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/1196590/ss_50283e6df9d2f3f24ff4a1a36a94ae307e21cee8.1920x1080.jpg', 'Combate survival', 'Acción y horror', 19);
INSERT INTO imagen_juego (url, alt, caption, juego_id) VALUES 
('https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/1196590/ss_363d9c05ee0a974b766938610a3352e7a89b9c92.1920x1080.jpg', 'Ethan Winters', 'Terror en el pueblo', 19);

-- Resident Evil 4 Remake (id: 20) - Steam App ID: 2050650
INSERT INTO imagen_juego (url, alt, caption, juego_id) VALUES 
('https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/2050650/ss_59d1b19964cc532213df92c8287b75a0bffeb33c.1920x1080.jpg', 'Leon S. Kennedy', 'Agente legendario', 20);
INSERT INTO imagen_juego (url, alt, caption, juego_id) VALUES 
('https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/2050650/ss_ab807f8ad9e968a620777caf483cb6020367b9ee.1920x1080.jpg', 'Aldea española', 'Terror rural', 20);
INSERT INTO imagen_juego (url, alt, caption, juego_id) VALUES 
('https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/2050650/ss_0442f7fb4327d79802c2db8ea8d23d228a28d896.1920x1080.jpg', 'Ganados peligrosos', 'Enemigos mejorados', 20);
INSERT INTO imagen_juego (url, alt, caption, juego_id) VALUES 
('https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/2050650/ss_69810f4cd155912fdfdd21da70181df7d454c874.1920x1080.jpg', 'Combate intenso', 'El clásico reinventado', 20);

-- Final Fantasy XVI (id: 21) - Steam App ID: 2515020
INSERT INTO imagen_juego (url, alt, caption, juego_id) VALUES 
('https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/2515020/ss_99530c1f839832ceeab2cf3450d5c0905312de47.1920x1080.jpg', 'Clive Rosfield', 'Protagonista oscuro', 21);
INSERT INTO imagen_juego (url, alt, caption, juego_id) VALUES 
('https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/2515020/ss_7620e893321e1661bdf821617f349196c2b0019f.1920x1080.jpg', 'Batallas de Eikons', 'Titanes en guerra', 21);
INSERT INTO imagen_juego (url, alt, caption, juego_id) VALUES 
('https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/2515020/ss_04ef537e3123d4a8dcbbadccc190cf87dee67783.1920x1080.jpg', 'Combate en tiempo real', 'Acción frenética', 21);
INSERT INTO imagen_juego (url, alt, caption, juego_id) VALUES 
('https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/2515020/ss_d3aea73c0bea755c7152ee339ebb7f7dfefe8f91.1920x1080.jpg', 'Fantasía épica', 'Mundo de Valisthea', 21);

-- Final Fantasy VII Rebirth (id: 22) - Steam App ID: 2909400
INSERT INTO imagen_juego (url, alt, caption, juego_id) VALUES 
('https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/2909400/ss_7a83a64967a06edbf0d43821153a0188471d596a.1920x1080.jpg', 'Cloud y compañía', 'Héroes icónicos', 22);
INSERT INTO imagen_juego (url, alt, caption, juego_id) VALUES 
('https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/2909400/ss_7c389d8ed52b6bd2350a3bc9866ac45c919fb2e9.1920x1080.jpg', 'Mundo abierto', 'Exploración libre', 22);
INSERT INTO imagen_juego (url, alt, caption, juego_id) VALUES 
('https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/2909400/ss_5540aef3258019f77559ca77ef29ba893b61010f.1920x1080.jpg', 'Sistema de combate', 'Acción estratégica', 22);
INSERT INTO imagen_juego (url, alt, caption, juego_id) VALUES 
('https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/2909400/ss_45513682d4c2e77b2a89e7bea00ec2851c110116.1920x1080.jpg', 'Sephiroth', 'El villano regresa', 22);

-- Monster Hunter Rise (id: 23) - Steam App ID: 1446780
INSERT INTO imagen_juego (url, alt, caption, juego_id) VALUES 
('https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/1446780/ss_f8249da14987e3c2d10fd4024736f28774c713da.1920x1080.jpg', 'Wirebug en acción', 'Movilidad aérea', 23);
INSERT INTO imagen_juego (url, alt, caption, juego_id) VALUES 
('https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/1446780/ss_25686086b61ca88a859bc20d588682be92ab4d63.1920x1080.jpg', 'Monstruos gigantes', 'Bestias temibles', 23);
INSERT INTO imagen_juego (url, alt, caption, juego_id) VALUES 
('https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/1446780/ss_d8d96313f1049c800d37a3fc521f06f926fca3ac.1920x1080.jpg', 'Aldea Kamura', 'Estética japonesa', 23);
INSERT INTO imagen_juego (url, alt, caption, juego_id) VALUES 
('https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/1446780/ss_961c552a99c5c64689bebf0e272b13c80947f644.1920x1080.jpg', 'Caza épica', 'Monster Hunter', 23);

-- Monster Hunter World (id: 24) - Steam App ID: 582010
INSERT INTO imagen_juego (url, alt, caption, juego_id) VALUES 
('https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/582010/ss_a262c53b8629de7c6547933dc0b49d31f4e1b1f1.1920x1080.jpg', 'Caza de Rathalos', 'Monstruo icónico', 24);
INSERT INTO imagen_juego (url, alt, caption, juego_id) VALUES 
('https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/582010/ss_6b4986a37c7b5c185a796085c002febcdd5357b5.1920x1080.jpg', 'Ecosistema vivo', 'Mundo dinámico', 24);
INSERT INTO imagen_juego (url, alt, caption, juego_id) VALUES 
('https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/582010/ss_0dfb20f6f09c196bfc317bd517dc430ed6e6a2a4.1920x1080.jpg', 'Caza cooperativa', 'Hasta 4 jugadores', 24);
INSERT INTO imagen_juego (url, alt, caption, juego_id) VALUES 
('https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/582010/ss_25902a9ae6977d6d10ebff20b87e8739e51c5b8b.1920x1080.jpg', 'Nuevo Mundo', 'Exploración épica', 24);

-- Persona 5 Royal (id: 25) - Steam App ID: 1687950
INSERT INTO imagen_juego (url, alt, caption, juego_id) VALUES 
('https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/1687950/ss_663171dc3afce8fe987e57e8659f91b69faa39bc.1920x1080.jpg', 'Phantom Thieves', 'Ladrones de corazones', 25);
INSERT INTO imagen_juego (url, alt, caption, juego_id) VALUES 
('https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/1687950/ss_a3258aba84ae2f2ff13a02a160f7495bfc152adb.1920x1080.jpg', 'Estilo visual único', 'UI revolucionaria', 25);
INSERT INTO imagen_juego (url, alt, caption, juego_id) VALUES 
('https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/1687950/ss_ddcc016b8e5c434ccbd1a89c0157ce73acf905ae.1920x1080.jpg', 'Combate con Personas', 'Sistema estratégico', 25);
INSERT INTO imagen_juego (url, alt, caption, juego_id) VALUES 
('https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/1687950/ss_c665872b4c5cb3a4e4fd3a4abde97ee60fe51e33.1920x1080.jpg', 'Joker', 'El líder phantom', 25);

-- NieR: Automata (id: 26) - Steam App ID: 524220
INSERT INTO imagen_juego (url, alt, caption, juego_id) VALUES 
('https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/524220/ss_d0314b4c134329a483b5e43af951f60274abc66b.1920x1080.jpg', '2B en combate', 'Androide letal', 26);
INSERT INTO imagen_juego (url, alt, caption, juego_id) VALUES 
('https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/524220/ss_8b29f7e1ce9a8b9313dc3eb50dbe76a4cf94eef9.1920x1080.jpg', 'Mundo devastado', 'Tierra sin humanos', 26);
INSERT INTO imagen_juego (url, alt, caption, juego_id) VALUES 
('https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/524220/ss_2c265df38c3d2d393d74ee8e74d79bdafa16b143.1920x1080.jpg', 'Acción PlatinumGames', 'Combate fluido', 26);
INSERT INTO imagen_juego (url, alt, caption, juego_id) VALUES 
('https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/524220/ss_831e0e7c9d514393b711e9ed1d6796042521a80c.1920x1080.jpg', '9S y 2B', 'Historia profunda', 26);

-- Disco Elysium (id: 27) - Steam App ID: 632470
INSERT INTO imagen_juego (url, alt, caption, juego_id) VALUES 
('https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/632470/ss_b3694e99ffdb686d1bbbbe16a540d3d2ccd509c4.1920x1080.jpg', 'Detective en Revachol', 'Investigación profunda', 27);
INSERT INTO imagen_juego (url, alt, caption, juego_id) VALUES 
('https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/632470/ss_9125a718ee9ba85386ae5d4eb820f3266073fc97.1920x1080.jpg', 'Sistema de diálogo', 'Decisiones complejas', 27);
INSERT INTO imagen_juego (url, alt, caption, juego_id) VALUES 
('https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/632470/ss_4f5fdc3cf42feca8dafb1f7d2910ef96e62708a2.1920x1080.jpg', 'Arte pintado', 'Estilo visual único', 27);
INSERT INTO imagen_juego (url, alt, caption, juego_id) VALUES 
('https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/632470/ss_fc6969799ebf19fd2a2c8a986c9419e053606a17.1920x1080.jpg', 'RPG revolucionario', 'Narrativa profunda', 27);

-- Stardew Valley (id: 28) - Steam App ID: 413150
INSERT INTO imagen_juego (url, alt, caption, juego_id) VALUES 
('https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/413150/ss_b887651a93b0525739049eb4194f633de2df75be.1920x1080.jpg', 'Tu granja', 'Cultiva y prospera', 28);
INSERT INTO imagen_juego (url, alt, caption, juego_id) VALUES 
('https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/413150/ss_9ac899fe2cda15d48b0549bba77ef8c4a090a71c.1920x1080.jpg', 'Pueblo Pelican', 'Comunidad acogedora', 28);
INSERT INTO imagen_juego (url, alt, caption, juego_id) VALUES 
('https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/413150/ss_4fa0866709ede3753fdf2745349b528d5e8c4054.1920x1080.jpg', 'Las minas', 'Aventura y recursos', 28);
INSERT INTO imagen_juego (url, alt, caption, juego_id) VALUES 
('https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/413150/ss_d836f0a5b0447fb6a2bdb0a6ac5f954949d3c41e.1920x1080.jpg', 'Vida rural', 'Simulador de granja', 28);

-- Celeste (id: 29) - Steam App ID: 504230
INSERT INTO imagen_juego (url, alt, caption, juego_id) VALUES 
('https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/504230/ss_1ad297c2044cdcf450ee83e56350cafb590da755.1920x1080.jpg', 'Madeline escalando', 'Plataformas precisas', 29);
INSERT INTO imagen_juego (url, alt, caption, juego_id) VALUES 
('https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/504230/ss_03bfe6bd5ddac7f747c8d2aa1a4f82cfd53c6dcb.1920x1080.jpg', 'Niveles desafiantes', 'Supera tus límites', 29);
INSERT INTO imagen_juego (url, alt, caption, juego_id) VALUES 
('https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/504230/ss_4b0f0222341b64a37114033aca9994551f27c161.1920x1080.jpg', 'Pixel art vibrante', 'Arte hermoso', 29);
INSERT INTO imagen_juego (url, alt, caption, juego_id) VALUES 
('https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/504230/ss_1012b11ad364ad6c138a25a654108de28de56c5f.1920x1080.jpg', 'La montaña', 'Historia emotiva', 29);

-- Hollow Knight (id: 30) - Steam App ID: 367520
INSERT INTO imagen_juego (url, alt, caption, juego_id) VALUES 
('https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/367520/ss_5384f9f8b96a0b9934b2bc35a4058376211636d2.1920x1080.jpg', 'El Caballero', 'Héroe silencioso', 30);
INSERT INTO imagen_juego (url, alt, caption, juego_id) VALUES 
('https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/367520/ss_d5b6edd94e77ba6db31c44d8a3c09d807ab27751.1920x1080.jpg', 'Jefes épicos', 'Combates desafiantes', 30);
INSERT INTO imagen_juego (url, alt, caption, juego_id) VALUES 
('https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/367520/ss_a81e4231cc8d55f58b51a4a938898af46503cae5.1920x1080.jpg', 'Arte dibujado a mano', 'Belleza oscura', 30);
INSERT INTO imagen_juego (url, alt, caption, juego_id) VALUES 
('https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/367520/ss_62e10cf506d461e11e050457b08aa0e2a1c078d0.1920x1080.jpg', 'Hallownest', 'Mundo subterráneo', 30);

-- ============================================
-- USUARIO ADMINISTRADOR
-- ============================================
-- Email: admin@looking4rate.com
-- Contraseña: RAPture23.
-- Rol: ADMIN

INSERT INTO usuario (nombre, email, contrasenia, fecha_registro, avatar, rol, activo) VALUES 
('Admin', 'admin@looking4rate.com', '$2a$10$hgC/q19Z1mm1RIkl8/Tg9uKqTEd3cbsgd9.jf42XDtr9lqQ3/loRy', '2026-01-04', NULL, 'ADMIN', true);