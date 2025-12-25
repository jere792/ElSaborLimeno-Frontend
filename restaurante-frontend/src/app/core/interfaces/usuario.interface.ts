// src/app/core/interfaces/usuario.interface.ts

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

export interface PerfilUsuario {
  id_usuario: number;
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
}

export interface RespuestaPerfil {
  codigo: number;
  mensaje: string;
  usuario: PerfilUsuario;
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

export interface SubirFotoResponse {
  codigo: number;
  mensaje: string;
  url: string;
}
