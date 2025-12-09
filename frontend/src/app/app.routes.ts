import { Routes } from '@angular/router';
import Home from './pages/home/home';

export const routes: Routes = [
  {
    path: '',
    component: Home,
    title: 'Looking4Rate - Inicio'
  },
  {
    path: 'style-guide',
    loadComponent: () => import('./pages/style-guide/style-guide'),
    title: 'Looking4Rate - Style Guide'
  }
];
