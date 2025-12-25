// src/app/core/services/auth.service.ts

import { Injectable, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Router } from '@angular/router';

export interface Usuario {
  id: number;
  nombres: string;
  apellidos: string;
  email: string;
  telefono?: string;
  id_rol: number;
  nombre_rol?: string;
  estado?: string;
  foto_perfil?: string;  // ✅ AGREGAR ESTE CAMPO
}

interface LoginResponse {
  mensaje: string;
  token: string;
  usuario: Usuario;
}

interface RegisterData {
  id_roles: number;
  nombres: string;
  apellidos: string;
  email: string;
  password: string;
  telefono?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:8080/api';
  private platformId = inject(PLATFORM_ID);
  
  private currentUserSubject = new BehaviorSubject<Usuario | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(
    private http: HttpClient,
    private router: Router
  ) {
    this.loadUserFromStorage();
  }

  private loadUserFromStorage(): void {
    if (isPlatformBrowser(this.platformId)) {
      const userStr = localStorage.getItem('user');
      if (userStr) {
        try {
          const user = JSON.parse(userStr);
          this.currentUserSubject.next(user);
          console.log('✅ Usuario cargado al iniciar app:', user);
        } catch (error) {
          console.error('❌ Error al parsear usuario:', error);
        }
      }
    }
  }

  getCurrentUser(): Usuario | null {
    return this.currentUserSubject.value;
  }

  getCurrentUser$(): Observable<Usuario | null> {
    return this.currentUser$;
  }

  // ✅ AGREGAR ESTE MÉTODO NUEVO
  updateCurrentUser(userData: Partial<Usuario>): void {
    if (isPlatformBrowser(this.platformId)) {
      const currentUser = this.getCurrentUser();
      if (currentUser) {
        const updatedUser = { ...currentUser, ...userData };
        localStorage.setItem('user', JSON.stringify(updatedUser));
        this.currentUserSubject.next(updatedUser);
        console.log('✅ Usuario actualizado en memoria:', updatedUser);
      }
    }
  }

  login(email: string, password: string): Observable<LoginResponse> {
    console.log('🔵 Ejecutando login en AuthService...');
    
    return this.http.post<LoginResponse>(`${this.apiUrl}/auth/login`, {
      email,
      password
    }).pipe(
      tap(response => {
        console.log('📦 Respuesta recibida en AuthService:', response);
        console.log('  - Tiene token?', !!response.token);
        console.log('  - Tiene usuario?', !!response.usuario);
        
        if (response.token && response.usuario) {
          console.log('💾 EJECUTANDO setSession...');
          this.setSession(response.token, response.usuario);
        } else {
          console.error('❌ Faltan datos en la respuesta');
        }
      })
    );
  }

  register(data: RegisterData): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/register`, data);
  }

  private setSession(token: string, usuario: Usuario): void {
    console.log('  🔧 Dentro de setSession()');
    console.log('  🌐 isPlatformBrowser?', isPlatformBrowser(this.platformId));
    
    if (isPlatformBrowser(this.platformId)) {
      console.log('  📝 Guardando en localStorage...');
      
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(usuario));
      
      console.log('  ✅ Token guardado');
      console.log('  ✅ Usuario guardado');
      
      const check = localStorage.getItem('user');
      console.log('  🔍 Verificación inmediata:', check ? 'ENCONTRADO' : 'NO ENCONTRADO');
      
      this.currentUserSubject.next(usuario);
      console.log('  ✅ BehaviorSubject actualizado');
    } else {
      console.error('  ❌ NO está en navegador!');
    }
  }

  isAuthenticated(): boolean {
    if (!isPlatformBrowser(this.platformId)) {
      return false;
    }
    
    const token = localStorage.getItem('token');
    return !!token;
  }

  getToken(): string | null {
    if (isPlatformBrowser(this.platformId)) {
      return localStorage.getItem('token');
    }
    return null;
  }

  getUserRole(): number | null {
    const user = this.getCurrentUser();
    return user ? user.id_rol : null;
  }

  hasRole(roleId: number): boolean {
    const userRole = this.getUserRole();
    return userRole === roleId;
  }

  logout(): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      this.currentUserSubject.next(null);
      console.log('✅ Sesion cerrada');
      this.router.navigate(['/auth/login']);
    }
  }

  forgotPassword(email: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/forgot-password`, { email });
  }

  resetPassword(token: string, newPassword: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/reset-password`, {
      token,
      newPassword
    });
  }
}
