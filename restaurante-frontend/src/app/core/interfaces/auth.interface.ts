// src/app/core/interfaces/auth.interface.ts

export interface Usuario {
  id: number;
  nombres: string;
  apellidos: string;
  email: string;
  telefono?: string;
  direccion?: string;
  id_rol: number;
  fecha_registro: string;
  foto_perfil?: string;
}

export interface LoginResponse {
  mensaje: string;
  token: string;
  usuario: Usuario;
}

export interface RegisterRequest {
  nombres: string;
  apellidos: string;
  email: string;
  password: string;
  telefono?: string;
}
