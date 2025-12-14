import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, RouterLink, RouterOutlet } from '@angular/router';

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
export default class ProfilePage implements OnInit {
  private route = inject(ActivatedRoute);
  
  userId: number | null = null;

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.userId = parseInt(params['id'], 10) || null;
    });
  }
}
