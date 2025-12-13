// src/app/core/guards/auth.guard.ts

import { inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const platformId = inject(PLATFORM_ID);

  if (!isPlatformBrowser(platformId)) {
    return false;
  }

  // Verificación simple: si hay token, permite el acceso
  if (authService.isAuthenticated()) {
    console.log('✅ Usuario autenticado, acceso permitido');
    return true;
  }

  console.log('❌ Usuario no autenticado, redirigiendo a login');
  router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
  return false;
};
