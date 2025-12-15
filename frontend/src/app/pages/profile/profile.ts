import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { ActivatedRoute, RouterLink, RouterOutlet } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';

/**
 * @component ProfilePage
 * @description Página de perfil de usuario.
 * 
 * @example
 * // Ruta: /usuario/1
 */
@Component({
  selector: 'app-profile',
  imports: [RouterLink, RouterOutlet],
  templateUrl: './profile.html',
  styleUrl: './profile.scss'
})
export default class ProfilePage implements OnInit, OnDestroy {
  private route = inject(ActivatedRoute);
  private destroy$ = new Subject<void>();
  
  userId: number | null = null;

  ngOnInit(): void {
    this.route.params
      .pipe(takeUntil(this.destroy$))
      .subscribe(params => {
        this.userId = parseInt(params['id'], 10) || null;
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
