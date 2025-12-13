// src/app/core/guards/role.guard.ts

import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const roleGuard = (rolesPermitidos: number[]): CanActivateFn => {
  return (route, state) => {
    const authService = inject(AuthService);
    const router = inject(Router);

    const usuario = authService.getUsuario();

    if (!usuario) {
      router.navigate(['/login']);
      return false;
    }

    if (!rolesPermitidos.includes(usuario.id_rol)) {
      // Redirigir según el rol del usuario
      switch (usuario.id_rol) {
        case 1: // Admin
          router.navigate(['/admin/dashboard']);
          break;
        case 2: // Cajero
          router.navigate(['/cajero/pedidos']);
          break;
        case 5: // Cliente
          router.navigate(['/cliente/menu']);
          break;
        default:
          router.navigate(['/login']);
      }
      return false;
    }

    return true;
  };
};
