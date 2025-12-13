// src/app/core/services/auth.service.ts

import { Injectable, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';
import { Usuario, LoginResponse, RegistroResponse, VerificarTokenResponse } from '../models/usuario.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = `${environment.apiUrl}/auth`;
  private usuarioSubject = new BehaviorSubject<Usuario | null>(null);
  public usuario$ = this.usuarioSubject.asObservable();
  private platformId = inject(PLATFORM_ID);
  private isBrowser: boolean;

  constructor(
    private http: HttpClient,
    private router: Router
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
    if (this.isBrowser) {
      this.cargarUsuarioDesdeToken();
    }
  }

  login(credentials: { email: string; password: string }): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, credentials).pipe(
      tap((response) => {
        if (this.isBrowser) {
          localStorage.setItem('token', response.token);
        }
        this.usuarioSubject.next(response.usuario);
      })
    );
  }

  registro(data: {
    nombres: string;
    apellidos: string;
    email: string;
    password: string;
    telefono?: string;
  }): Observable<RegistroResponse> {
    return this.http.post<RegistroResponse>(`${this.apiUrl}/registro`, data).pipe(
      tap((response) => {
        if (this.isBrowser) {
          localStorage.setItem('token', response.token);
        }
        this.usuarioSubject.next(response.usuario);
      })
    );
  }

  verificarToken(): Observable<VerificarTokenResponse> {
    return this.http.get<VerificarTokenResponse>(`${this.apiUrl}/verificar`).pipe(
      tap((response) => {
        const usuario: Usuario = {
          id: response.usuario.id,
          nombres: '',
          apellidos: '',
          email: response.usuario.email,
          id_rol: response.usuario.id_rol,
          fecha_registro: new Date()
        };
        this.usuarioSubject.next(usuario);
      })
    );
  }

  logout(): void {
    if (this.isBrowser) {
      localStorage.removeItem('token');
    }
    this.usuarioSubject.next(null);
    this.router.navigate(['/login']);
  }

  getUsuario(): Usuario | null {
    return this.usuarioSubject.value;
  }

  isAuthenticated(): boolean {
    if (!this.isBrowser) return false;
    return !!localStorage.getItem('token');
  }

  private cargarUsuarioDesdeToken(): void {
    if (!this.isBrowser) return;
    
    const token = localStorage.getItem('token');
    if (token) {
      this.verificarToken().subscribe({
        error: () => this.logout()
      });
    }
  }

  getRutaInicioPorRol(idRol: number): string {
    switch (idRol) {
      case 1:
        return '/admin/dashboard';
      case 2:
        return '/cajero/pedidos';
      case 5:
        return '/cliente/menu';
      default:
        return '/login';
    }
  }
}
