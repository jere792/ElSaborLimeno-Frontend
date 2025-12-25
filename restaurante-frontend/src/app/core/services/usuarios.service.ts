// src/app/core/services/usuarios.service.ts

import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

// ==================== INTERFACES ====================

export interface UsuarioListado {
  id_usuario: number;
  id_documento?: number;
  id_roles: number;
  nombres: string;
  apellidos: string;
  email: string;
  telefono?: string;
  fecha_nacimiento?: string;
  genero?: string;
  direccion?: string;
  estado: string;
  fecha_registro: string;
  foto_perfil?: string;
  nombre_rol: string;
  reservas_canceladas?: number;
  reservas_noshow?: number;
  estado_reservas?: string;
  total_registros?: number;
  total_paginas?: number;
  pagina_actual?: number;
}

export interface Rol {
  id_roles: number;
  nombre: string;
  descripcion?: string;
}

export interface FiltrosUsuarios {
  pagina?: number;
  registros_por_pagina?: number;
  busqueda?: string;
  id_rol?: number;
  ordenar_por?: string;
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

export interface PerfilUsuario {
  id_usuario: number;
  id_documento?: number;
  id_rol: number;
  nombres: string;
  apellidos: string;
  email: string;
  telefono?: string;
  fecha_nacimiento?: string;
  genero?: string;
  direccion?: string;
  estado: string;
  fecha_registro: string;
  foto_perfil?: string;
  nombre_rol?: string; 
  reservas_canceladas?: number;
  reservas_noshow?: number;
  estado_reservas?: string;
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

export interface RespuestaSubirFoto {
  codigo: number;
  mensaje: string;
  url: string;
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
    if (filtros.registros_por_pagina) params = params.set('registrosPorPagina', filtros.registros_por_pagina.toString());
    if (filtros.busqueda) params = params.set('busqueda', filtros.busqueda);
    if (filtros.id_rol) params = params.set('id_rol', filtros.id_rol.toString());
    if (filtros.ordenar_por) params = params.set('ordenarPor', filtros.ordenar_por);
    if (filtros.orden) params = params.set('orden', filtros.orden);

    return this.http.get<RespuestaListado>(`${this.apiUrl}/activos`, { params });
  }

  // ==================== LISTAR USUARIOS INACTIVOS ====================
  listarUsuariosInactivos(filtros: FiltrosUsuarios = {}): Observable<RespuestaListado> {
    let params = new HttpParams();
    
    if (filtros.pagina) params = params.set('pagina', filtros.pagina.toString());
    if (filtros.registros_por_pagina) params = params.set('registrosPorPagina', filtros.registros_por_pagina.toString());
    if (filtros.busqueda) params = params.set('busqueda', filtros.busqueda);
    if (filtros.id_rol) params = params.set('id_rol', filtros.id_rol.toString());
    if (filtros.ordenar_por) params = params.set('ordenarPor', filtros.ordenar_por);
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
  
  obtenerMiPerfil(): Observable<RespuestaPerfil> {
    return this.http.get<RespuestaPerfil>(`${this.apiUrl}/perfil`);
  }

  actualizarMiPerfil(datos: ActualizarPerfilDto): Observable<any> {
    return this.http.put(`${this.apiUrl}/perfil`, datos);
  }

  subirFotoPerfil(file: File): Observable<RespuestaSubirFoto> {
    const formData = new FormData();
    formData.append('foto_perfil', file);
    
    return this.http.post<RespuestaSubirFoto>(`${this.apiUrl}/perfil/foto`, formData);
  }

  cambiarMiPassword(datos: CambiarPasswordDto): Observable<any> {
    return this.http.post(`${this.apiUrl}/perfil/cambiar-password`, datos);
  }
}
