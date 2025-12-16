// src/app/layout/sidebar/sidebar.component.ts

import { Component, OnInit, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

interface MenuItem {
  path: string;
  label: string;
  icon: string;
  roles: number[]; // Roles que pueden ver este item
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
  menuItems: MenuItem[] = [];

  private readonly menus: { [key: number]: MenuItem[] } = {
    // Admin (rol 1)
    1: [
      { path: '/admin/dashboard', label: 'Dashboard', icon: '📊', roles: [1] },
      { path: '/admin/usuarios', label: 'Usuarios', icon: '👥', roles: [1] },
      { path: '/admin/productos', label: 'Productos', icon: '🍽️', roles: [1] },
      { path: '/admin/pedidos', label: 'Pedidos', icon: '📦', roles: [1] },
      { path: '/admin/reportes', label: 'Reportes', icon: '📈', roles: [1] },
      { path: '/admin/perfil-admin', label: 'Perfil', icon: '🗂️', roles: [1] }
    ],
    // Cajero (rol 2)
    2: [
      { path: '/cajero/home', label: 'Inicio', icon: '🏠', roles: [2] },
      { path: '/cajero/caja', label: 'Caja', icon: '💰', roles: [2] },
      { path: '/cajero/pedidos', label: 'Pedidos', icon: '📦', roles: [2] },
      { path: '/cajero/productos', label: 'Productos', icon: '🍽️', roles: [2] }
    ],
    // Cliente (rol 3)
    3: [
      { path: '/cliente/home', label: 'Inicio', icon: '🏠', roles: [3] },
      { path: '/cliente/menu', label: 'Menú', icon: '📋', roles: [3] },
      { path: '/cliente/carrito', label: 'Carrito', icon: '🛒', roles: [3] },
      { path: '/cliente/pedidos', label: 'Mis Pedidos', icon: '📦', roles: [3] },
      { path: '/cliente/perfil', label: 'Mi Perfil', icon: '👤', roles: [3] }
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
      this.menuItems = this.menus[this.userRole] || [];
    }
  }

  logout(): void {
    if (confirm('¿Cerrar sesión?')) {
      this.authService.logout();
      this.router.navigate(['/auth/login']);
    }
  }
}
