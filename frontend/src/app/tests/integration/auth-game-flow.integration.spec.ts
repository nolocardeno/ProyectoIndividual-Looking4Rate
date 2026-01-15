/**
 * @fileoverview Tests de Integración - Flujos Completos
 * 
 * Suite de pruebas de integración que verifica flujos completos de usuario:
 * - Flujo de autenticación (login/registro)
 * - Flujo de interacción con juegos (review, puntuación)
 * - Flujo de búsqueda
 * 
 * Estos tests simulan el comportamiento real del usuario y verifican
 * que los componentes y servicios trabajan correctamente juntos.
 */

import { TestBed, fakeAsync, tick, flush } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter, Router } from '@angular/router';
import { PLATFORM_ID } from '@angular/core';

import { AuthService } from '../../services/auth.service';
import { JuegosService } from '../../services/juegos.service';
import { InteraccionesService } from '../../services/interacciones.service';
import { EventBusService } from '../../services/event-bus.service';
import { AuthHttpService } from '../../services/auth-http.service';
import { JuegoDTO, JuegoResumenDTO, InteraccionDTO, AuthResponse } from '../../models';

/**
 * ============================================
 * FLUJO DE AUTENTICACIÓN - LOGIN
 * ============================================
 */
describe('Integración: Flujo de Login', () => {
  let authService: AuthService;
  let authHttpService: AuthHttpService;
  let eventBus: EventBusService;
  let httpMock: HttpTestingController;

  // Mock de respuesta de autenticación
  const mockAuthResponse: AuthResponse = {
    token: 'jwt-token-mock-12345',
    mensaje: 'Login exitoso',
    usuario: {
      id: 1,
      nombre: 'TestUser',
      email: 'test@example.com',
      avatar: 'avatar.jpg',
      rol: 'USER',
      fechaRegistro: '2024-01-01'
    }
  };

  beforeEach(() => {
    localStorage.clear();

    TestBed.configureTestingModule({
      providers: [
        AuthService,
        AuthHttpService,
        EventBusService,
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([])
      ]
    });

    authService = TestBed.inject(AuthService);
    authHttpService = TestBed.inject(AuthHttpService);
    eventBus = TestBed.inject(EventBusService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
    localStorage.clear();
  });

  it('debería completar flujo de login exitoso', fakeAsync(() => {
    let loginResult: any;
    let loginError: any;

    // 1. Verificar estado inicial no autenticado
    expect(authService.isAuthenticated()).toBeFalse();
    expect(authService.getCurrentUser()).toBeNull();

    // 2. Intentar login
    authService.login('test@example.com', 'Password123').subscribe({
      next: (user) => loginResult = user,
      error: (err) => loginError = err
    });

    // 3. Responder a la petición HTTP
    const req = httpMock.expectOne('/api/auth/login');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({
      email: 'test@example.com',
      contrasenia: 'Password123'
    });
    req.flush(mockAuthResponse);

    tick();

    // 4. Verificar resultado
    expect(loginError).toBeUndefined();
    expect(loginResult).toBeDefined();
    expect(loginResult.nombre).toBe('TestUser');

    // 5. Verificar estado autenticado
    expect(authService.isAuthenticated()).toBeTrue();
    expect(authService.getCurrentUser()?.email).toBe('test@example.com');
    expect(authService.getToken()).toBe('jwt-token-mock-12345');
  }));

  it('debería manejar error de credenciales inválidas', fakeAsync(() => {
    let loginError: any;

    authService.login('wrong@email.com', 'wrongpassword').subscribe({
      next: () => fail('No debería tener éxito'),
      error: (err) => loginError = err
    });

    const req = httpMock.expectOne('/api/auth/login');
    req.flush(
      { message: 'EMAIL_NOT_FOUND' },
      { status: 401, statusText: 'Unauthorized' }
    );

    tick();

    expect(loginError).toBeDefined();
    expect(authService.isAuthenticated()).toBeFalse();
  }));

  it('debería persistir sesión en localStorage', fakeAsync(() => {
    authService.login('test@example.com', 'Password123').subscribe();

    const req = httpMock.expectOne('/api/auth/login');
    req.flush(mockAuthResponse);
    tick();

    // Verificar que se guardó en localStorage
    expect(localStorage.getItem('l4r_auth_token')).toBe('jwt-token-mock-12345');
    expect(localStorage.getItem('l4r_auth_user')).toBeTruthy();

    const storedUser = JSON.parse(localStorage.getItem('l4r_auth_user') || '{}');
    expect(storedUser.email).toBe('test@example.com');
  }));

  it('debería cerrar sesión correctamente', fakeAsync(() => {
    // Primero hacer login
    authService.login('test@example.com', 'Password123').subscribe();
    const req = httpMock.expectOne('/api/auth/login');
    req.flush(mockAuthResponse);
    tick();

    expect(authService.isAuthenticated()).toBeTrue();

    // Luego cerrar sesión
    authService.logout();

    expect(authService.isAuthenticated()).toBeFalse();
    expect(authService.getCurrentUser()).toBeNull();
    expect(authService.getToken()).toBeNull();
    expect(localStorage.getItem('l4r_auth_token')).toBeNull();
  }));
});

/**
 * ============================================
 * FLUJO DE AUTENTICACIÓN - REGISTRO
 * ============================================
 */
describe('Integración: Flujo de Registro', () => {
  let authService: AuthService;
  let httpMock: HttpTestingController;

  const mockAuthResponse: AuthResponse = {
    token: 'jwt-token-nuevo-usuario',
    mensaje: 'Registro exitoso',
    usuario: {
      id: 2,
      nombre: 'NuevoUsuario',
      email: 'nuevo@example.com',
      avatar: null,
      rol: 'USER',
      fechaRegistro: '2024-01-15'
    }
  };

  beforeEach(() => {
    localStorage.clear();

    TestBed.configureTestingModule({
      providers: [
        AuthService,
        AuthHttpService,
        EventBusService,
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });

    authService = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
    localStorage.clear();
  });

  it('debería completar flujo de registro exitoso', fakeAsync(() => {
    let registered = false;

    authService.register('nuevo@example.com', 'NuevoUsuario', 'Password1!').subscribe({
      next: () => registered = true,
      error: () => fail('No debería fallar')
    });

    const req = httpMock.expectOne('/api/auth/registro');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({
      email: 'nuevo@example.com',
      nombre: 'NuevoUsuario',
      contrasenia: 'Password1!'
    });
    req.flush(mockAuthResponse);

    tick();

    expect(registered).toBeTrue();
    expect(authService.isAuthenticated()).toBeTrue();
    expect(authService.getCurrentUser()?.nombre).toBe('NuevoUsuario');
  }));

  it('debería manejar error de email duplicado', fakeAsync(() => {
    let registerError: any;

    authService.register('existente@example.com', 'Usuario', 'Password1!').subscribe({
      next: () => fail('No debería tener éxito'),
      error: (err) => registerError = err
    });

    const req = httpMock.expectOne('/api/auth/registro');
    req.flush(
      { message: 'EMAIL_ALREADY_EXISTS' },
      { status: 400, statusText: 'Bad Request' }
    );

    tick();

    expect(registerError).toBeDefined();
    expect(authService.isAuthenticated()).toBeFalse();
  }));
});

/**
 * ============================================
 * FLUJO DE BÚSQUEDA DE JUEGOS
 * ============================================
 */
describe('Integración: Flujo de Búsqueda de Juegos', () => {
  let juegosService: JuegosService;
  let httpMock: HttpTestingController;

  const mockJuegos: JuegoResumenDTO[] = [
    {
      id: 1,
      nombre: 'The Legend of Zelda: Breath of the Wild',
      imagenPortada: 'zelda.jpg',
      fechaSalida: '2017-03-03',
      puntuacionMedia: 9.7
    },
    {
      id: 2,
      nombre: 'The Legend of Zelda: Tears of the Kingdom',
      imagenPortada: 'zelda2.jpg',
      fechaSalida: '2023-05-12',
      puntuacionMedia: 9.5
    }
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        JuegosService,
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });

    juegosService = TestBed.inject(JuegosService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('debería buscar juegos por nombre', fakeAsync(() => {
    let resultados: JuegoResumenDTO[] = [];

    juegosService.buscar('zelda').subscribe(juegos => {
      resultados = juegos;
    });

    const req = httpMock.expectOne(req => 
      req.url === '/api/juegos/buscar' && 
      req.params.get('nombre') === 'zelda'
    );
    expect(req.request.method).toBe('GET');
    req.flush(mockJuegos);

    tick();

    expect(resultados.length).toBe(2);
    expect(resultados[0].nombre).toContain('Zelda');
  }));

  it('debería obtener juegos novedades', fakeAsync(() => {
    let novedades: JuegoResumenDTO[] = [];

    juegosService.getNovedades().subscribe(juegos => {
      novedades = juegos;
    });

    const req = httpMock.expectOne('/api/juegos/novedades');
    req.flush(mockJuegos);

    tick();

    expect(novedades.length).toBe(2);
  }));

  it('debería obtener top juegos valorados', fakeAsync(() => {
    let topJuegos: JuegoResumenDTO[] = [];

    juegosService.getTopRated(5).subscribe(juegos => {
      topJuegos = juegos;
    });

    const req = httpMock.expectOne(req => 
      req.url === '/api/juegos/top' && 
      req.params.get('limite') === '5'
    );
    req.flush(mockJuegos);

    tick();

    expect(topJuegos.length).toBe(2);
  }));

  it('debería obtener detalle de un juego', fakeAsync(() => {
    const mockJuegoDetalle: JuegoDTO = {
      id: 1,
      nombre: 'The Legend of Zelda: Breath of the Wild',
      descripcion: 'Un épico juego de aventuras en mundo abierto',
      imagenPortada: 'zelda.jpg',
      fechaSalida: '2017-03-03',
      plataformas: ['Nintendo Switch', 'Wii U'],
      desarrolladoras: ['Nintendo EPD'],
      generos: ['Acción', 'Aventura', 'RPG'],
      puntuacionMedia: 9.7,
      totalReviews: 500
    };

    let juego: JuegoDTO | null = null;

    juegosService.getById(1).subscribe(j => {
      juego = j;
    });

    const req = httpMock.expectOne('/api/juegos/1');
    req.flush(mockJuegoDetalle);

    tick();

    expect(juego).toBeDefined();
    expect(juego!.nombre).toBe('The Legend of Zelda: Breath of the Wild');
    expect(juego!.plataformas.length).toBe(2);
  }));
});

/**
 * ============================================
 * FLUJO DE INTERACCIONES - REVIEWS Y PUNTUACIONES
 * ============================================
 */
describe('Integración: Flujo de Interacciones', () => {
  let interaccionesService: InteraccionesService;
  let httpMock: HttpTestingController;

  const mockInteraccion: InteraccionDTO = {
    id: 1,
    usuarioId: 1,
    nombreUsuario: 'TestUser',
    avatarUsuario: 'avatar.jpg',
    juegoId: 1,
    nombreJuego: 'Zelda BOTW',
    imagenJuego: 'zelda.jpg',
    puntuacion: 10,
    review: 'Obra maestra absoluta',
    estadoJugado: true,
    fechaInteraccion: '2024-01-15'
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        InteraccionesService,
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });

    interaccionesService = TestBed.inject(InteraccionesService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('debería crear una nueva interacción (review)', fakeAsync(() => {
    let resultado: InteraccionDTO | null = null;

    interaccionesService.crear(1, {
      juegoId: 1,
      puntuacion: 10,
      review: 'Obra maestra absoluta',
      estadoJugado: true
    }).subscribe(interaccion => {
      resultado = interaccion;
    });

    const req = httpMock.expectOne('/api/interacciones/usuario/1');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({
      juegoId: 1,
      puntuacion: 10,
      review: 'Obra maestra absoluta',
      estadoJugado: true
    });
    req.flush(mockInteraccion);

    tick();

    expect(resultado).toBeDefined();
    expect(resultado!.review).toBe('Obra maestra absoluta');
  }));

  it('debería obtener interacción de usuario con juego específico', fakeAsync(() => {
    let interaccion: InteraccionDTO | null = null;

    interaccionesService.getByUsuarioYJuego(1, 1).subscribe(i => {
      interaccion = i;
    });

    const req = httpMock.expectOne('/api/interacciones/usuario/1/juego/1');
    req.flush(mockInteraccion);

    tick();

    expect(interaccion).toBeDefined();
    expect(interaccion!.puntuacion).toBe(10);
  }));

  it('debería retornar null si no existe interacción', fakeAsync(() => {
    let interaccion: InteraccionDTO | null = null;

    interaccionesService.getByUsuarioYJuego(1, 999).subscribe(i => {
      interaccion = i;
    });

    const req = httpMock.expectOne('/api/interacciones/usuario/1/juego/999');
    req.flush({ message: 'Not Found' }, { status: 404, statusText: 'Not Found' });

    tick();

    expect(interaccion).toBeNull();
  }));

  it('debería obtener reviews de un juego', fakeAsync(() => {
    const mockReviews: InteraccionDTO[] = [
      mockInteraccion,
      {
        ...mockInteraccion,
        id: 2,
        usuarioId: 2,
        nombreUsuario: 'OtroUser',
        puntuacion: 9,
        review: 'Excelente juego'
      }
    ];

    let reviews: InteraccionDTO[] = [];

    interaccionesService.getByJuego(1).subscribe(r => {
      reviews = r;
    });

    const req = httpMock.expectOne('/api/interacciones/juego/1');
    req.flush(mockReviews);

    tick();

    expect(reviews.length).toBe(2);
  }));

  it('debería obtener juegos jugados por usuario', fakeAsync(() => {
    let jugados: InteraccionDTO[] = [];

    interaccionesService.getJuegosJugados(1).subscribe(j => {
      jugados = j;
    });

    const req = httpMock.expectOne('/api/interacciones/usuario/1/jugados');
    req.flush([mockInteraccion]);

    tick();

    expect(jugados.length).toBe(1);
    expect(jugados[0].estadoJugado).toBeTrue();
  }));
});

/**
 * ============================================
 * FLUJO COMPLETO: USUARIO NO AUTENTICADO -> AUTENTICADO -> REVIEW
 * ============================================
 */
describe('Integración: Flujo Completo Usuario', () => {
  let authService: AuthService;
  let juegosService: JuegosService;
  let interaccionesService: InteraccionesService;
  let httpMock: HttpTestingController;

  const mockAuthResponse: AuthResponse = {
    token: 'jwt-token',
    mensaje: 'Login exitoso',
    usuario: {
      id: 1,
      nombre: 'TestUser',
      email: 'test@example.com',
      avatar: 'avatar.jpg',
      rol: 'USER',
      fechaRegistro: '2024-01-01'
    }
  };

  const mockJuego: JuegoDTO = {
    id: 1,
    nombre: 'Super Mario Odyssey',
    descripcion: 'Aventura 3D de Mario',
    imagenPortada: 'mario.jpg',
    fechaSalida: '2017-10-27',
    plataformas: ['Nintendo Switch'],
    desarrolladoras: ['Nintendo EPD'],
    generos: ['Plataformas', 'Aventura'],
    puntuacionMedia: 9.2,
    totalReviews: 300
  };

  beforeEach(() => {
    localStorage.clear();

    TestBed.configureTestingModule({
      providers: [
        AuthService,
        AuthHttpService,
        JuegosService,
        InteraccionesService,
        EventBusService,
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });

    authService = TestBed.inject(AuthService);
    juegosService = TestBed.inject(JuegosService);
    interaccionesService = TestBed.inject(InteraccionesService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
    localStorage.clear();
  });

  it('debería completar flujo: login -> ver juego -> crear review', fakeAsync(() => {
    // PASO 1: Usuario no autenticado
    expect(authService.isAuthenticated()).toBeFalse();

    // PASO 2: Login
    authService.login('test@example.com', 'Password123').subscribe();
    const loginReq = httpMock.expectOne('/api/auth/login');
    loginReq.flush(mockAuthResponse);
    tick();

    expect(authService.isAuthenticated()).toBeTrue();
    const userId = authService.getCurrentUserId();
    expect(userId).toBe(1);

    // PASO 3: Ver detalle de juego
    let juego: JuegoDTO | null = null;
    juegosService.getById(1).subscribe(j => juego = j);
    const juegoReq = httpMock.expectOne('/api/juegos/1');
    juegoReq.flush(mockJuego);
    tick();

    expect(juego).toBeDefined();
    expect(juego!.nombre).toBe('Super Mario Odyssey');

    // PASO 4: Crear review
    const mockNuevaInteraccion: InteraccionDTO = {
      id: 1,
      usuarioId: 1,
      nombreUsuario: 'TestUser',
      avatarUsuario: 'avatar.jpg',
      juegoId: 1,
      nombreJuego: 'Super Mario Odyssey',
      imagenJuego: 'mario.jpg',
      puntuacion: 9,
      review: 'Un juego fantástico para toda la familia',
      estadoJugado: true,
      fechaInteraccion: '2024-01-20'
    };

    let review: InteraccionDTO | null = null;
    interaccionesService.crear(userId!, {
      juegoId: 1,
      puntuacion: 9,
      review: 'Un juego fantástico para toda la familia',
      estadoJugado: true
    }).subscribe(r => review = r);

    const reviewReq = httpMock.expectOne('/api/interacciones/usuario/1');
    expect(reviewReq.request.method).toBe('POST');
    reviewReq.flush(mockNuevaInteraccion);
    tick();

    expect(review).toBeDefined();
    expect(review!.review).toBe('Un juego fantástico para toda la familia');

    // PASO 5: Verificar que la interacción se puede recuperar
    let interaccionRecuperada: InteraccionDTO | null = null;
    interaccionesService.getByUsuarioYJuego(1, 1).subscribe(i => interaccionRecuperada = i);
    const getReq = httpMock.expectOne('/api/interacciones/usuario/1/juego/1');
    getReq.flush(mockNuevaInteraccion);
    tick();

    expect(interaccionRecuperada).toBeDefined();
    expect(interaccionRecuperada!.puntuacion).toBe(9);
  }));
});
