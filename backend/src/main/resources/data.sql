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
('Final Fantasy XVI', 'Clive Rosfield busca venganza en un mundo de fantasía. Combate de acción en tiempo real y Eikons épicos.', 'https://cdn.cloudflare.steamstatic.com/steam/apps/1651560/library_600x900.jpg', '2023-06-22');

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
-- USUARIO ADMINISTRADOR
-- ============================================
-- Email: admin@looking4rate.com
-- Contraseña: RAPture23.
-- Rol: ADMIN

INSERT INTO usuario (nombre, email, contrasenia, fecha_registro, avatar, rol, activo) VALUES 
('Admin', 'admin@looking4rate.com', '$2a$10$hgC/q19Z1mm1RIkl8/Tg9uKqTEd3cbsgd9.jf42XDtr9lqQ3/loRy', '2026-01-04', NULL, 'ADMIN', true);