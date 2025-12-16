import { inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService, Usuario } from '../services/auth.service';
import { getRolRuta } from '../../shared/constants/roles.constants';


const obtenerUsuario = (authService: AuthService, platformId: Object): Usuario | null => {

  let usuario = authService.getCurrentUser();
  
  if (!usuario && isPlatformBrowser(platformId)) 
  {

    const userStr = localStorage.getItem('user');
    if (userStr)
    {
      try 
      {
        usuario = JSON.parse(userStr);
      } 
      catch (error) 
      {
        console.error('Error al parsear usuario desde localStorage:', error);
      }
    }
  }
  
  return usuario;
};


export const roleGuard = (rolesPermitidos: number[]): CanActivateFn => {
  return (route, state) => {
    const authService = inject(AuthService);
    const router = inject(Router);
    const platformId = inject(PLATFORM_ID);

    if (!isPlatformBrowser(platformId)) {
      return false;
    }

    const usuario = obtenerUsuario(authService, platformId);

    if (!usuario) {
      console.warn('🔒 Acceso denegado: No hay usuario autenticado');
      router.navigate(['/auth/login']);
      return false;
    }

    if (!rolesPermitidos.includes(usuario.id_rol)) 
    {
      console.warn(`🔒 Acceso denegado: Rol ${usuario.id_rol} no está en roles permitidos [${rolesPermitidos.join(', ')}]`);
      
      const rutaUsuario = getRolRuta(usuario.id_rol);
      router.navigate([rutaUsuario]);
      return false;
    }

    return true;
  };
};
