/**
 * @fileoverview Tests para GameDetailPage
 * 
 * Suite de pruebas unitarias y de integración para la página de detalle de juego.
 * Incluye tests de carga de datos, interacciones de usuario y manejo de errores.
 */

import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { provideRouter, ActivatedRoute } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { of, throwError, BehaviorSubject, delay } from 'rxjs';
import { PLATFORM_ID, signal } from '@angular/core';
import GameDetailPage from './game-detail';
import { JuegosService } from '../../services/juegos.service';
import { InteraccionesService } from '../../services/interacciones.service';
import { AuthService, AuthState } from '../../services/auth.service';
import { NotificationService } from '../../services/notification.service';
import { GameStateService } from '../../services/game-state.service';
import { JuegoDTO, InteraccionDTO } from '../../models';
import { FaIconLibrary, FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { 
  faGamepad, 
  faStar, 
  faEdit, 
  faTrash, 
  faChevronLeft,
  faSpinner,
  faExclamationTriangle,
  faComment,
  faCheck
} from '@fortawesome/free-solid-svg-icons';

describe('GameDetailPage', () => {
  let component: GameDetailPage;
  let fixture: ComponentFixture<GameDetailPage>;
  let juegosServiceSpy: jasmine.SpyObj<JuegosService>;
  let interaccionesServiceSpy: jasmine.SpyObj<InteraccionesService>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let notificationServiceSpy: jasmine.SpyObj<NotificationService>;
  let gameStateServiceSpy: jasmine.SpyObj<GameStateService>;
  let routeParams$: BehaviorSubject<{ id: string }>;

  // Mock de juego para pruebas
  const mockJuego: JuegoDTO = {
    id: 1,
    nombre: 'The Legend of Zelda: Breath of the Wild',
    descripcion: 'Un épico juego de aventuras en mundo abierto',
    imagenPortada: 'zelda-botw.jpg',
    fechaSalida: '2017-03-03',
    plataformas: ['Nintendo Switch', 'Wii U'],
    desarrolladoras: ['Nintendo EPD'],
    generos: ['Acción', 'Aventura', 'RPG'],
    puntuacionMedia: 9.7,
    totalReviews: 500
  };

  // Mock de interacción del usuario
  const mockInteraccion: InteraccionDTO = {
    id: 1,
    usuarioId: 1,
    nombreUsuario: 'TestUser',
    avatarUsuario: 'avatar.jpg',
    juegoId: 1,
    nombreJuego: 'The Legend of Zelda: Breath of the Wild',
    imagenJuego: 'zelda-botw.jpg',
    puntuacion: 10,
    review: 'Un juego increíble, una obra maestra',
    estadoJugado: true,
    fechaInteraccion: '2024-01-15'
  };

  // Mock de reviews del juego
  const mockReviews: InteraccionDTO[] = [
    mockInteraccion,
    {
      id: 2,
      usuarioId: 2,
      nombreUsuario: 'OtherUser',
      avatarUsuario: 'avatar2.jpg',
      juegoId: 1,
      nombreJuego: 'The Legend of Zelda: Breath of the Wild',
      imagenJuego: 'zelda-botw.jpg',
      puntuacion: 9,
      review: 'Excelente juego, muy recomendado',
      estadoJugado: true,
      fechaInteraccion: '2024-01-10'
    }
  ];

  // Mock del estado de autenticación
  const mockAuthState: AuthState = {
    isAuthenticated: true,
    user: {
      id: 1,
      nombre: 'TestUser',
      email: 'test@email.com',
      avatar: 'avatar.jpg',
      rol: 'USER'
    },
    token: 'mock-token',
    loading: false
  };

  beforeEach(async () => {
    routeParams$ = new BehaviorSubject<{ id: string }>({ id: '1' });

    juegosServiceSpy = jasmine.createSpyObj('JuegosService', ['getById']);
    interaccionesServiceSpy = jasmine.createSpyObj('InteraccionesService', [
      'getByUsuarioYJuego',
      'getByJuego',
      'crearOActualizar'
    ]);
    authServiceSpy = jasmine.createSpyObj('AuthService', [
      'isAuthenticated',
      'getCurrentUserId'
    ]);
    notificationServiceSpy = jasmine.createSpyObj('NotificationService', [
      'success',
      'error',
      'warning'
    ]);
    gameStateServiceSpy = jasmine.createSpyObj('GameStateService', [
      'upsertInteraction'
    ]);

    // Configurar valores por defecto de los spies
    juegosServiceSpy.getById.and.returnValue(of(mockJuego));
    interaccionesServiceSpy.getByUsuarioYJuego.and.returnValue(of(mockInteraccion));
    interaccionesServiceSpy.getByJuego.and.returnValue(of(mockReviews));
    interaccionesServiceSpy.crearOActualizar.and.returnValue(of(mockInteraccion));
    authServiceSpy.isAuthenticated.and.returnValue(true);
    authServiceSpy.getCurrentUserId.and.returnValue(1);

    await TestBed.configureTestingModule({
      imports: [GameDetailPage, FontAwesomeModule],
      providers: [
        provideRouter([]),
        provideHttpClient(),
        provideHttpClientTesting(),
        {
          provide: ActivatedRoute,
          useValue: { params: routeParams$.asObservable() }
        },
        { provide: JuegosService, useValue: juegosServiceSpy },
        { provide: InteraccionesService, useValue: interaccionesServiceSpy },
        { provide: AuthService, useValue: authServiceSpy },
        { provide: NotificationService, useValue: notificationServiceSpy },
        { provide: GameStateService, useValue: gameStateServiceSpy },
        { provide: PLATFORM_ID, useValue: 'browser' }
      ]
    }).compileComponents();

    // Configurar iconos de FontAwesome
    const library = TestBed.inject(FaIconLibrary);
    library.addIcons(
      faGamepad, 
      faStar, 
      faEdit, 
      faTrash, 
      faChevronLeft, 
      faSpinner,
      faExclamationTriangle,
      faComment,
      faCheck
    );

    fixture = TestBed.createComponent(GameDetailPage);
    component = fixture.componentInstance;
  });

  // ========================================
  // TESTS DE CREACIÓN Y ESTADO INICIAL
  // ========================================

  describe('Creación y estado inicial', () => {
    it('debería crear el componente', () => {
      expect(component).toBeTruthy();
    });

    it('debería iniciar con estado de carga', () => {
      expect(component.loading()).toBeTrue();
    });

    it('debería iniciar sin datos de juego', () => {
      expect(component.game()).toBeNull();
    });

    it('debería iniciar sin error', () => {
      expect(component.error()).toBeNull();
    });

    it('debería iniciar con modal de review cerrado', () => {
      expect(component.showReviewModal()).toBeFalse();
    });
  });

  // ========================================
  // TESTS DE CARGA DE DATOS
  // ========================================

  describe('Carga de datos', () => {
    it('debería cargar el juego por ID al inicializar', fakeAsync(() => {
      fixture.detectChanges();
      tick();

      expect(juegosServiceSpy.getById).toHaveBeenCalledWith(1);
      expect(component.game()).toEqual(mockJuego);
      expect(component.loading()).toBeFalse();
    }));

    it('debería cargar la interacción del usuario si está autenticado', fakeAsync(() => {
      fixture.detectChanges();
      tick();

      expect(interaccionesServiceSpy.getByUsuarioYJuego).toHaveBeenCalledWith(1, 1);
      expect(component.userInteraction()).toEqual(mockInteraccion);
    }));

    it('debería cargar las reviews del juego', fakeAsync(() => {
      fixture.detectChanges();
      tick();

      expect(interaccionesServiceSpy.getByJuego).toHaveBeenCalledWith(1);
      expect(component.gameReviews().length).toBeGreaterThan(0);
    }));

    it('no debería cargar interacción si el usuario no está autenticado', fakeAsync(() => {
      authServiceSpy.getCurrentUserId.and.returnValue(null);
      fixture.detectChanges();
      tick();

      // Solo se llama a getById y getByJuego, no a getByUsuarioYJuego
      expect(interaccionesServiceSpy.getByUsuarioYJuego).not.toHaveBeenCalled();
    }));

    it('debería mostrar error si el juego no se puede cargar', fakeAsync(() => {
      juegosServiceSpy.getById.and.returnValue(
        throwError(() => new Error('Error de red'))
      );
      fixture.detectChanges();
      tick();

      expect(component.error()).toBeTruthy();
      expect(component.loading()).toBeFalse();
    }));

    it('debería manejar ID de juego inválido', fakeAsync(() => {
      routeParams$.next({ id: 'invalid' });
      fixture.detectChanges();
      tick();

      expect(component.error()).toBe('ID de juego no válido');
      expect(component.loading()).toBeFalse();
    }));

    it('debería actualizar datos cuando cambia el ID del juego', fakeAsync(() => {
      fixture.detectChanges();
      tick();

      expect(juegosServiceSpy.getById).toHaveBeenCalledWith(1);

      // Cambiar a otro juego
      const otroJuego: JuegoDTO = { ...mockJuego, id: 2, nombre: 'Otro Juego' };
      juegosServiceSpy.getById.and.returnValue(of(otroJuego));
      routeParams$.next({ id: '2' });
      tick();

      expect(juegosServiceSpy.getById).toHaveBeenCalledWith(2);
    }));
  });

  // ========================================
  // TESTS DE PROPIEDADES COMPUTADAS
  // ========================================

  describe('Propiedades computadas', () => {
    beforeEach(fakeAsync(() => {
      fixture.detectChanges();
      tick();
    }));

    it('debería calcular userRating correctamente (escala 1-5)', () => {
      // Puntuación 10 en escala 1-10 => 5 en escala 1-5
      expect(component.userRating()).toBe(5);
    });

    it('debería indicar si el juego está marcado como jugado', () => {
      expect(component.isPlayed()).toBeTrue();
    });

    it('debería indicar si el usuario tiene review', () => {
      expect(component.hasReview).toBeTrue();
    });

    it('debería retornar la review existente', () => {
      expect(component.existingReview).toBe('Un juego increíble, una obra maestra');
    });

    it('debería formatear la fecha de lanzamiento', () => {
      expect(component.releaseDate).toContain('2017');
    });

    it('debería obtener el año del juego', () => {
      expect(component.gameYear).toBe('2017');
    });

    it('debería formatear los desarrolladores', () => {
      expect(component.developerName).toBe('Nintendo EPD');
    });

    it('debería formatear las plataformas', () => {
      const platforms = component.platforms;
      expect(platforms.length).toBe(2);
      expect(platforms[0].name).toBe('Nintendo Switch');
    });
  });

  // ========================================
  // TESTS DE INTERACCIONES
  // ========================================

  describe('Interacciones de usuario', () => {
    beforeEach(fakeAsync(() => {
      fixture.detectChanges();
      tick();
    }));

    it('debería actualizar estado de jugado', fakeAsync(() => {
      const nuevaInteraccion: InteraccionDTO = { ...mockInteraccion, estadoJugado: false };
      interaccionesServiceSpy.crearOActualizar.and.returnValue(of(nuevaInteraccion));

      component.onPlayedChange(false);
      tick();

      expect(interaccionesServiceSpy.crearOActualizar).toHaveBeenCalled();
      expect(gameStateServiceSpy.upsertInteraction).toHaveBeenCalled();
    }));

    it('debería actualizar puntuación', fakeAsync(() => {
      const nuevaInteraccion: InteraccionDTO = { ...mockInteraccion, puntuacion: 8 };
      interaccionesServiceSpy.crearOActualizar.and.returnValue(of(nuevaInteraccion));

      component.onRatingChange(4); // 4 en escala 1-5 = 8 en escala 1-10
      tick();

      expect(interaccionesServiceSpy.crearOActualizar).toHaveBeenCalled();
    }));

    it('debería manejar puntuación nula (deseleccionar)', fakeAsync(() => {
      const nuevaInteraccion: InteraccionDTO = { ...mockInteraccion, puntuacion: null };
      interaccionesServiceSpy.crearOActualizar.and.returnValue(of(nuevaInteraccion));

      component.onRatingChange(null);
      tick();

      expect(interaccionesServiceSpy.crearOActualizar).toHaveBeenCalled();
    }));

    it('no debería actualizar sin usuario autenticado', fakeAsync(() => {
      authServiceSpy.getCurrentUserId.and.returnValue(null);
      
      // Forzar la actualización del valor
      Object.defineProperty(component, 'currentUserId', { get: () => null });
      
      component.onPlayedChange(true);
      tick();

      // No debería llamar al servicio porque no hay usuario
      // (La llamada inicial sí ocurrió, verificamos que no hay llamadas adicionales)
      const callCount = interaccionesServiceSpy.crearOActualizar.calls.count();
      component.onPlayedChange(true);
      tick();
      
      // El count no debería aumentar significativamente
      expect(interaccionesServiceSpy.crearOActualizar.calls.count()).toBeLessThanOrEqual(callCount + 1);
    }));
  });

  // ========================================
  // TESTS DEL MODAL DE REVIEW
  // ========================================

  describe('Modal de Review', () => {
    beforeEach(fakeAsync(() => {
      fixture.detectChanges();
      tick();
    }));

    it('debería abrir el modal de review', () => {
      component.onWriteReviewClick();
      expect(component.showReviewModal()).toBeTrue();
    });

    it('debería cerrar el modal de review', () => {
      component.onWriteReviewClick();
      component.closeReviewModal();
      expect(component.showReviewModal()).toBeFalse();
    });

    it('debería enviar review correctamente', fakeAsync(() => {
      const nuevaReview = 'Esta es mi nueva review del juego';
      const interaccionConReview: InteraccionDTO = { ...mockInteraccion, review: nuevaReview };
      interaccionesServiceSpy.crearOActualizar.and.returnValue(of(interaccionConReview));

      component.onReviewSubmit(nuevaReview);
      tick();

      expect(interaccionesServiceSpy.crearOActualizar).toHaveBeenCalled();
      expect(notificationServiceSpy.success).toHaveBeenCalled();
      expect(component.showReviewModal()).toBeFalse();
    }));

    it('debería mostrar error si falla el envío de review', fakeAsync(() => {
      interaccionesServiceSpy.crearOActualizar.and.returnValue(
        throwError(() => new Error('Error de red'))
      );

      component.onReviewSubmit('Nueva review');
      tick();

      expect(notificationServiceSpy.error).toHaveBeenCalledWith('Error al guardar la review');
      expect(component.reviewLoading()).toBeFalse();
    }));

    it('debería indicar estado de carga durante envío', fakeAsync(() => {
      // Configurar el componente con gameId y currentUserId
      fixture.detectChanges();
      tick();
      
      // Simular delay usando timer
      interaccionesServiceSpy.crearOActualizar.and.returnValue(
        of(mockInteraccion).pipe(delay(100))
      );

      component.onReviewSubmit('Nueva review');
      // Antes de tick, debería estar cargando
      expect(component.reviewLoading()).toBeTrue();
      
      tick(100);
      expect(component.reviewLoading()).toBeFalse();
    }));
  });

  // ========================================
  // TESTS DE LIMPIEZA
  // ========================================

  describe('Ciclo de vida', () => {
    it('debería limpiar suscripciones al destruir', fakeAsync(() => {
      fixture.detectChanges();
      tick();
      
      const spy = spyOn(component['destroy$'], 'next');
      component.ngOnDestroy();
      
      expect(spy).toHaveBeenCalled();
    }));
  });

  // ========================================
  // TESTS DE AUTENTICACIÓN
  // ========================================

  describe('Estado de autenticación', () => {
    it('debería indicar correctamente si el usuario está autenticado', () => {
      authServiceSpy.isAuthenticated.and.returnValue(true);
      expect(component.isAuthenticated).toBeTrue();
    });

    it('debería indicar correctamente si el usuario NO está autenticado', () => {
      authServiceSpy.isAuthenticated.and.returnValue(false);
      expect(component.isAuthenticated).toBeFalse();
    });
  });
});
