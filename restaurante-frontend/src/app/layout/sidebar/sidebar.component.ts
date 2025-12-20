// src/app/layout/sidebar/sidebar.component.ts

import { Component, OnInit, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { ROLES } from '../../shared/constants/roles.constants';

interface MenuItem {
  path: string;
  label: string;
  icon: string;
  roles: number[];
  subItems?: SubMenuItem[];
}

interface SubMenuItem {
  path: string;
  label: string;
  icon: string;
  cambiarVista?: number;  // ✅ NUEVO: ID de rol para cambiar vista
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {
  @Input() titulo: string = 'El Sabor Limeño';
  @Input() subtitulo: string = 'Panel';
  
  userRole: number = 0;
  vistaActual: number = 0;
  menuItems: MenuItem[] = [];
  
  menuExpandido: { [key: string]: boolean } = {};

  readonly ROLES = ROLES;

  private readonly menus: { [key: number]: MenuItem[] } = {
    // ==================== MENÚ ADMIN ====================
    [ROLES.ADMIN]: [
      { 
        path: '/admin/dashboard', 
        label: 'Dashboard', 
        icon: 'bi-speedometer2', 
        roles: [ROLES.ADMIN] 
      },
      {
        path: '#', 
        label: 'Ver Vistas', 
        icon: 'bi-eye', 
        roles: [ROLES.ADMIN],
        subItems: [
          { 
            path: '/cajero/home', 
            label: '💰 Vista Cajero', 
            icon: 'bi-cash-coin',
            cambiarVista: ROLES.CAJERO  // ✅ Cambiar al menú de cajero
          },
          { 
            path: '/cliente/home', 
            label: '👤 Vista Cliente', 
            icon: 'bi-person-circle',
            cambiarVista: ROLES.CLIENTE  // ✅ Cambiar al menú de cliente
          }
        ]
      },
      { 
        path: '#', 
        label: 'Menú', 
        icon: 'bi-menu-button-wide', 
        roles: [ROLES.ADMIN],
        subItems: [
          { path: '/admin/categorias', label: 'Categorías', icon: 'bi-tags' },
          { path: '/admin/platillos', label: 'Platillos', icon: 'bi-egg-fried' }
        ]
      },
      { 
        path: '/admin/mesas', 
        label: 'Mesas', 
        icon: 'bi-table', 
        roles: [ROLES.ADMIN] 
      },
      { 
        path: '/admin/reservas', 
        label: 'Reservas', 
        icon: 'bi-calendar-check', 
        roles: [ROLES.ADMIN] 
      },
      { 
        path: '/admin/pedidos', 
        label: 'Pedidos', 
        icon: 'bi-receipt', 
        roles: [ROLES.ADMIN] 
      },
      { 
        path: '/admin/promociones', 
        label: 'Promociones', 
        icon: 'bi-tag', 
        roles: [ROLES.ADMIN] 
      },
      { 
        path: '#', 
        label: 'Usuarios', 
        icon: 'bi-people', 
        roles: [ROLES.ADMIN],
        subItems: [
          { path: '/admin/gestion-admin', label: 'Administradores', icon: 'bi-shield-fill-check' },
          { path: '/admin/gestion-cajeros', label: 'Cajeros', icon: 'bi-person-badge' },
          { path: '/admin/gestion-clientes', label: 'Clientes', icon: 'bi-person' }
        ]
      },
      { 
        path: '/admin/turnos', 
        label: 'Turnos', 
        icon: 'bi-clock-history', 
        roles: [ROLES.ADMIN] 
      },
      { 
        path: '/admin/pagos-empleados', 
        label: 'Pagos Empleados', 
        icon: 'bi-cash-stack', 
        roles: [ROLES.ADMIN] 
      },
      { 
        path: '/admin/ventas', 
        label: 'Reportes', 
        icon: 'bi-graph-up-arrow', 
        roles: [ROLES.ADMIN] 
      },
      { 
        path: '/admin/configuracion-admin', 
        label: 'Configuración', 
        icon: 'bi-gear', 
        roles: [ROLES.ADMIN] 
      }
    ],

    // ==================== MENÚ CAJERO ====================
    [ROLES.CAJERO]: [
      { 
        path: '/cajero/home', 
        label: 'Inicio', 
        icon: 'bi-house', 
        roles: [ROLES.CAJERO] 
      },
      { 
        path: '/cajero/pedidos', 
        label: 'Pedidos', 
        icon: 'bi-receipt', 
        roles: [ROLES.CAJERO] 
      },
      { 
        path: '/cajero/mesas', 
        label: 'Mesas', 
        icon: 'bi-table', 
        roles: [ROLES.CAJERO] 
      },
      { 
        path: '/cajero/ventas', 
        label: 'Ventas', 
        icon: 'bi-cash-coin', 
        roles: [ROLES.CAJERO] 
      },
      { 
        path: '/cajero/generar-comprobante', 
        label: 'Generar Comprobante', 
        icon: 'bi-file-earmark-text', 
        roles: [ROLES.CAJERO] 
      },
      { 
        path: '/cajero/promociones', 
        label: 'Promociones', 
        icon: 'bi-tag', 
        roles: [ROLES.CAJERO] 
      },
      { 
        path: '/cajero/configuracion', 
        label: 'Mi Perfil', 
        icon: 'bi-person-circle', 
        roles: [ROLES.CAJERO] 
      }
    ],

    // ==================== MENÚ CLIENTE ====================
    [ROLES.CLIENTE]: [
      { 
        path: '/cliente/home', 
        label: 'Inicio', 
        icon: 'bi-house', 
        roles: [ROLES.CLIENTE] 
      },
      { 
        path: '/cliente/menu', 
        label: 'Menú', 
        icon: 'bi-egg-fried', 
        roles: [ROLES.CLIENTE] 
      },
      {
        path: '/cliente/carrito', 
        label: 'Mi Carrito', 
        icon: 'bi-cart', 
        roles: [ROLES.CLIENTE]
      },
      { 
        path: '/cliente/mis-pedidos', 
        label: 'Mis Pedidos', 
        icon: 'bi-receipt', 
        roles: [ROLES.CLIENTE] 
      },
      { 
        path: '/cliente/reservas', 
        label: 'Mis Reservas', 
        icon: 'bi-calendar-check', 
        roles: [ROLES.CLIENTE] 
      },
      { 
        path: '/cliente/promociones', 
        label: 'Promociones', 
        icon: 'bi-tag', 
        roles: [ROLES.CLIENTE] 
      },
      { 
        path: '/cliente/calificaciones', 
        label: 'Calificar', 
        icon: 'bi-star', 
        roles: [ROLES.CLIENTE] 
      },
      { 
        path: '/cliente/perfil', 
        label: 'Mi Perfil', 
        icon: 'bi-person-circle', 
        roles: [ROLES.CLIENTE] 
      }
    ]
  };

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadUserMenu();
  }

  loadUserMenu(): void {
    const user = this.authService.getCurrentUser();
    if (user) {
      this.userRole = user.id_rol;
      this.vistaActual = user.id_rol;
      this.cargarMenuPorVista(this.vistaActual);
    }
  }

  cargarMenuPorVista(vistaId: number): void {
    this.vistaActual = vistaId;
    this.menuItems = this.menus[vistaId] || [];
    this.menuExpandido = {};
  }

  // ✅ NUEVO: Manejar clicks en subItems con cambio de vista
  onSubItemClick(subItem: SubMenuItem): void {
    if (subItem.cambiarVista) {
      // Cambiar el menú lateral
      this.cargarMenuPorVista(subItem.cambiarVista);
    }
    // La navegación la hace routerLink automáticamente
  }

  toggleSubmenu(itemLabel: string): void {
    this.menuExpandido[itemLabel] = !this.menuExpandido[itemLabel];
  }

  isSubmenuExpanded(itemLabel: string): boolean {
    return this.menuExpandido[itemLabel] || false;
  }

  esAdmin(): boolean {
    return this.userRole === ROLES.ADMIN;
  }

  // ✅ NUEVO: Verificar si está en vista original
  enVistaOriginal(): boolean {
    return this.vistaActual === this.userRole;
  }

  // ✅ NUEVO: Volver a vista admin
  volverVistaAdmin(): void {
    if (this.esAdmin() && !this.enVistaOriginal()) {
      this.cargarMenuPorVista(ROLES.ADMIN);
      this.router.navigate(['/admin/dashboard']);
    }
  }

  // ✅ NUEVO: Obtener nombre de vista actual
  getNombreVistaActual(): string {
    const nombres: { [key: number]: string } = {
      [ROLES.ADMIN]: 'Administrador',
      [ROLES.CAJERO]: 'Cajero',
      [ROLES.CLIENTE]: 'Cliente'
    };
    return nombres[this.vistaActual] || 'Desconocida';
  }

  logout(): void {
    if (confirm('¿Cerrar sesión?')) {
      this.authService.logout();
      this.router.navigate(['/auth/login']);
    }
  }
}
