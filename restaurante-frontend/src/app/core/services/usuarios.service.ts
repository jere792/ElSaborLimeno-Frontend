// src/app/core/services/usuarios.service.ts

import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

// ==================== INTERFACES ====================

export interface UsuarioListado {
  Id_Usuario: number;
  Id_Documento?: number;
  Id_Roles: number;
  Nombres: string;
  Apellidos: string;
  Email: string;
  Telefono?: string;
  Fecha_Nacimiento?: Date;
  Genero?: string;
  Direccion?: string;
  Estado: string;
  Fecha_Registro: string;
  Nombre_Rol: string;
  Reservas_Canceladas?: number;
  Reservas_NoShow?: number;
  Estado_Reservas?: string;
  Total_Registros?: number;
  Total_Paginas?: number;
  Pagina_Actual?: number;
}

export interface Rol {
  Id_Roles: number;
  Nombre: string;
  Descripcion?: string;
}

export interface FiltrosUsuarios {
  pagina?: number;
  registrosPorPagina?: number;
  busqueda?: string;
  id_rol?: number;
  ordenarPor?: string;
  orden?: 'ASC' | 'DESC';
}

export interface RespuestaListado {
  codigo: number;
  mensaje: string;
  usuarios: UsuarioListado[];
  paginacion: {
    total_registros: number;
    total_paginas: number;
    pagina_actual: number;
    registros_por_pagina: number;
  };
}

export interface RespuestaRoles {
  codigo: number;
  mensaje: string;
  roles: Rol[];
}

export interface CrearUsuarioDto {
  id_documento: number;
  id_roles: number;
  nombres: string;
  apellidos: string;
  email: string;
  password: string;
  telefono?: string;
  fecha_nacimiento?: Date;
  genero?: string;
  direccion?: string;
}

export interface ActualizarUsuarioDto {
  id_documento: number;
  id_roles: number;
  nombres: string;
  apellidos: string;
  email: string;
  telefono?: string;
  fecha_nacimiento?: Date;
  genero?: string;
  direccion?: string;
}

// ✅ NUEVO: Interfaces para Perfil Propio
export interface PerfilUsuario {
  Id_Usuario: number;
  Id_Documento?: number;
  Id_Roles: number;
  Nombres: string;
  Apellidos: string;
  Email: string;
  Telefono?: string;
  Fecha_Nacimiento?: Date;
  Genero?: string;
  Direccion?: string;
  Estado: string;
  Fecha_Registro: Date;
  Nombre_Rol: string;
}

export interface RespuestaPerfil {
  codigo: number;
  mensaje: string;
  usuario: PerfilUsuario;
}

export interface ActualizarPerfilDto {
  nombres: string;
  apellidos: string;
  email: string;
  telefono?: string;
  fecha_nacimiento?: Date;
  genero?: string;
  direccion?: string;
}

export interface CambiarPasswordDto {
  password_actual: string;
  password_nueva: string;
}

@Injectable({
  providedIn: 'root'
})
export class UsuariosService {
  private apiUrl = 'http://localhost:8080/api/usuarios';

  constructor(private http: HttpClient) {}

  // ==================== LISTAR USUARIOS ACTIVOS ====================
  listarUsuariosActivos(filtros: FiltrosUsuarios = {}): Observable<RespuestaListado> {
    let params = new HttpParams();
    
    if (filtros.pagina) params = params.set('pagina', filtros.pagina.toString());
    if (filtros.registrosPorPagina) params = params.set('registrosPorPagina', filtros.registrosPorPagina.toString());
    if (filtros.busqueda) params = params.set('busqueda', filtros.busqueda);
    if (filtros.id_rol) params = params.set('id_rol', filtros.id_rol.toString());
    if (filtros.ordenarPor) params = params.set('ordenarPor', filtros.ordenarPor);
    if (filtros.orden) params = params.set('orden', filtros.orden);

    return this.http.get<RespuestaListado>(`${this.apiUrl}/activos`, { params });
  }

  // ==================== LISTAR USUARIOS INACTIVOS ====================
  listarUsuariosInactivos(filtros: FiltrosUsuarios = {}): Observable<RespuestaListado> {
    let params = new HttpParams();
    
    if (filtros.pagina) params = params.set('pagina', filtros.pagina.toString());
    if (filtros.registrosPorPagina) params = params.set('registrosPorPagina', filtros.registrosPorPagina.toString());
    if (filtros.busqueda) params = params.set('busqueda', filtros.busqueda);
    if (filtros.id_rol) params = params.set('id_rol', filtros.id_rol.toString());
    if (filtros.ordenarPor) params = params.set('ordenarPor', filtros.ordenarPor);
    if (filtros.orden) params = params.set('orden', filtros.orden);

    return this.http.get<RespuestaListado>(`${this.apiUrl}/inactivos`, { params });
  }

  // ==================== CREAR USUARIO ====================
  crearUsuario(usuario: CrearUsuarioDto): Observable<any> {
    return this.http.post(`${this.apiUrl}`, usuario);
  }

  // ==================== OBTENER USUARIO ====================
  obtenerUsuario(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}`);
  }

  // ==================== ACTUALIZAR USUARIO ====================
  actualizarUsuario(id: number, usuario: ActualizarUsuarioDto): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, usuario);
  }

  // ==================== CAMBIAR ESTADO ====================
  cambiarEstado(id: number, estado: string): Observable<any> {
    return this.http.patch(`${this.apiUrl}/${id}/estado`, { estado });
  }

  // ==================== ELIMINAR USUARIO ====================
  eliminarUsuario(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  // ==================== RESTABLECER PASSWORD ====================
  restablecerPassword(id: number, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/${id}/restablecer-password`, { password });
  }

  // ==================== OBTENER ROLES ====================
  obtenerRoles(): Observable<RespuestaRoles> {
    return this.http.get<RespuestaRoles>(`${this.apiUrl}/roles`);
  }

  // ==================== OBTENER ESTADÍSTICAS ====================
  obtenerEstadisticas(): Observable<any> {
    return this.http.get(`${this.apiUrl}/estadisticas`);
  }

  // ✅ ==================== PERFIL PROPIO ====================
  
  // Obtener perfil del usuario autenticado
  obtenerMiPerfil(): Observable<RespuestaPerfil> {
    return this.http.get<RespuestaPerfil>(`${this.apiUrl}/perfil`);
  }

  // Actualizar perfil propio
  actualizarMiPerfil(datos: ActualizarPerfilDto): Observable<any> {
    return this.http.put(`${this.apiUrl}/perfil`, datos);
  }

  // Cambiar contraseña propia
  cambiarMiPassword(datos: CambiarPasswordDto): Observable<any> {
    return this.http.post(`${this.apiUrl}/perfil/cambiar-password`, datos);
  }
}
