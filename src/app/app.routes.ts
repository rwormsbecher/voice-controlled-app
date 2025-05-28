import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'home',
    loadComponent: () =>
      import('./pages/home/home.component').then(m => m.HomeComponent),
  },
  {
    path: 'about',
    loadComponent: () =>
      import('./pages/about/about.component').then(m => m.AboutComponent),
  },
  {
    path: 'contact',
    loadComponent: () =>
      import('./pages/contact/contact.component').then(m => m.ContactComponent),
  },
  {
    path: 'animation',
    loadComponent: () =>
      import('./pages/animation-component/animation-component.component').then(m => m.AnimationComponent)
  },
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'home',
  },
];