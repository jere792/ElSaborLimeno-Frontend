export const ROLES = {
  ADMIN: 1,
  CAJERO: 2,
  CLIENTE: 3,
} as const;

export const ROLES_CONFIG = {
  [ROLES.ADMIN]: {
    nombre: 'Administrador',
    icono: '👑',
    ruta: '/admin/dashboard',
    badgeClass: 'badge-admin'
  },
  [ROLES.CAJERO]: {
    nombre: 'Cajero',
    icono: '💰',
    ruta: '/cajero/home',
    badgeClass: 'badge-cajero'
  },
  [ROLES.CLIENTE]: {
    nombre: 'Cliente',
    icono: '🍽️',
    ruta: '/cliente/home',
    badgeClass: 'badge-cliente'
  }
} as const;

export type RolId = 1 | 2 | 3;

export const getRolNombre = (rolId: number): string => {
  return ROLES_CONFIG[rolId as RolId]?.nombre || 'Desconocido';
};

export const getRolRuta = (rolId: number): string => {
  return ROLES_CONFIG[rolId as RolId]?.ruta || '/auth/login';
};

export const getRolIcono = (rolId: number): string => {
  return ROLES_CONFIG[rolId as RolId]?.icono || '👤';
};

export const getRolBadgeClass = (rolId: number): string => {
  return ROLES_CONFIG[rolId as RolId]?.badgeClass || 'badge-default';
};
