// src/app/core/models/usuario.model.ts

export interface Usuario {
  id: number;
  nombres: string;
  apellidos: string;
  email: string;
  telefono?: string;
  direccion?: string;
  id_rol: number;
  fecha_registro: Date;
}

export interface LoginResponse {
  mensaje: string;
  token: string;
  usuario: Usuario;
}

export interface RegistroResponse {
  mensaje: string;
  token: string;
  usuario: Usuario;
}

export interface VerificarTokenResponse {
  mensaje: string;
  usuario: {
    id: number;
    email: string;
    id_rol: number;
  };
}
