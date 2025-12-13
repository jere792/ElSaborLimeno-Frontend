// src/app/shared/constants/roles.constants.ts

export const ROLES = {
  ADMIN: 1,
  CAJERO: 2,
  CLIENTE: 5
} as const;

export const ROLES_NOMBRES = {
  1: 'Administrador',
  2: 'Cajero',
  5: 'Cliente'
} as const;

export type RolId = 1 | 2 | 5;
