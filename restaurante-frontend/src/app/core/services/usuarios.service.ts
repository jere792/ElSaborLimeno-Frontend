// src/app/core/services/usuarios.service.ts

import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Usuario {
  Id_Usuario: number;
  Nombres: string;
  Apellidos: string;
  Email: string;
  Telefono?: string;
  Estado: string;
  Fecha_Registro: Date;
  Id_Roles: number;
  Nombre_Rol: string;
}

export interface Rol {
  Id_Roles: number;
  Nombre: string;
  Descripcion: string;
}

export interface FiltrosUsuarios {
  pagina?: number;
  registrosPorPagina?: number;
  busqueda?: string;
  id_rol?: number;
  estado?: string;
  ordenarPor?: string;
  orden?: 'ASC' | 'DESC';
}

export interface RespuestaListado {
  codigo: number;
  mensaje: string;
  usuarios: Usuario[];
  paginacion: {
    total_registros: number;
    total_paginas: number;
    pagina_actual: number;
    registros_por_pagina: number;
  };
}

export interface CrearUsuarioDto {
  id_roles: number;
  nombres: string;
  apellidos: string;
  email: string;
  password: string;
  telefono?: string;
  genero?: string;
  direccion?: string;
}

@Injectable({
  providedIn: 'root'
})
export class UsuariosService {
  private apiUrl = 'http://localhost:8080/api/usuarios';

  constructor(private http: HttpClient) {}

  listarUsuarios(filtros: FiltrosUsuarios = {}): Observable<RespuestaListado> {
    let params = new HttpParams();
    
    if (filtros.pagina) params = params.set('pagina', filtros.pagina.toString());
    if (filtros.registrosPorPagina) params = params.set('registrosPorPagina', filtros.registrosPorPagina.toString());
    if (filtros.busqueda) params = params.set('busqueda', filtros.busqueda);
    if (filtros.id_rol) params = params.set('id_rol', filtros.id_rol.toString());
    if (filtros.estado) params = params.set('estado', filtros.estado);
    if (filtros.ordenarPor) params = params.set('ordenarPor', filtros.ordenarPor);
    if (filtros.orden) params = params.set('orden', filtros.orden);

    return this.http.get<RespuestaListado>(this.apiUrl, { params });
  }

  crearUsuario(usuario: CrearUsuarioDto): Observable<any> {
    return this.http.post(`${this.apiUrl}`, usuario);
  }

  obtenerUsuario(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}`);
  }

  actualizarUsuario(id: number, usuario: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, usuario);
  }

  cambiarEstado(id: number, estado: string): Observable<any> {
    return this.http.patch(`${this.apiUrl}/${id}/estado`, { estado });
  }

  eliminarUsuario(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  restablecerPassword(id: number, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/${id}/restablecer-password`, { password });
  }

  obtenerRoles(): Observable<{ codigo: number; mensaje: string; roles: Rol[] }> {
    return this.http.get<any>(`${this.apiUrl}/roles`);
  }

  obtenerEstadisticas(): Observable<any> {
    return this.http.get(`${this.apiUrl}/estadisticas`);
  }
}
