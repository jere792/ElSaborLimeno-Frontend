import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  {
    path: 'cliente',  // Sin /**
    renderMode: RenderMode.Server
  },
  {
    path: 'auth',  // Sin /**
    renderMode: RenderMode.Server
  },
  {
    path: '**',
    renderMode: RenderMode.Server  // o RenderMode.Client según prefieras
  }
];
