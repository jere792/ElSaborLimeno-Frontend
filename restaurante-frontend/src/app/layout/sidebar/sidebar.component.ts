import { Component, OnInit, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

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

  private readonly menus: { [key: number]: MenuItem[] } = {
    1: [
      { path: '/admin/dashboard', label: 'Dashboard', icon: 'bi-speedometer2', roles: [1] },
      {
        path: '#', 
        label: 'Ver Vistas', 
        icon: 'bi-eye', 
        roles: [1],
        subItems: [
          { path: '/cajero/home', label: 'Vista Cajero', icon: 'bi-cash-coin' },
          { path: '/cliente/home', label: 'Vista Cliente', icon: 'bi-person-circle' }
        ]
      },
      { 
        path: '#', 
        label: 'Menú', 
        icon: 'bi-menu-button-wide', 
        roles: [1],
        subItems: [
          { path: '/admin/platillos', label: 'Platillos', icon: 'bi-egg-fried' },
          { path: '/admin/categorias', label: 'Categorías', icon: 'bi-tags' }
        ]
      },
      { path: '/admin/mesas', label: 'Mesas', icon: 'bi-table', roles: [1] },
      { path: '/admin/reservaciones', label: 'Reservaciones', icon: 'bi-calendar-check', roles: [1] },
      { path: '/admin/pedidos', label: 'Pedidos', icon: 'bi-receipt', roles: [1] },
      { path: '/admin/promociones', label: 'Promociones', icon: 'bi-tag', roles: [1] },
      { 
        path: '#', 
        label: 'Usuarios', 
        icon: 'bi-people', 
        roles: [1],
        subItems: [
          { path: '/admin/gestion-cajeros', label: 'Gestión de Cajeros', icon: 'bi-person-badge' },
          { path: '/admin/gestion-clientes', label: 'Gestión de Clientes', icon: 'bi-person' },
          { path: '/admin/gestion-admin', label: 'Gestión de Admin', icon: 'bi-person-lines-fill' }
        ]
      },
      { path: '/admin/turnos', label: 'Turnos', icon: 'bi-clock-history', roles: [1] },
      { path: '/admin/pagos-empleados', label: 'Pagos Empleados', icon: 'bi-cash-stack', roles: [1] },
      { path: '/admin/ventas', label: 'Ventas', icon: 'bi-graph-up-arrow', roles: [1] },
      { path: '/admin/configuracion-admin', label: 'Configuración', icon: 'bi-gear', roles: [1] }
    ],

    2: [
      { path: '/cajero/home', label: 'Inicio', icon: 'bi-house', roles: [2] }
    ],

    3: [ 
      { path: '/cliente/home', label: 'Inicio', icon: 'bi-house', roles: [3] }
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

  toggleSubmenu(itemLabel: string): void {
    this.menuExpandido[itemLabel] = !this.menuExpandido[itemLabel];
  }

  isSubmenuExpanded(itemLabel: string): boolean {
    return this.menuExpandido[itemLabel] || false;
  }

  esAdmin(): boolean {
    return this.userRole === 1;
  }

  logout(): void {
    if (confirm('¿Cerrar sesión?')) {
      this.authService.logout();
      this.router.navigate(['/auth/login']);
    }
  }
}
