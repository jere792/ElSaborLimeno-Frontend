// src/app/pages/cliente/cliente.component.ts

import { Component } from '@angular/core';
import { Router, RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-cliente',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './cliente.component.html',
  styleUrls: ['./cliente.component.scss']
})
export class ClienteComponent {
  menuItems = [
    { path: '/cliente/home', label: 'Inicio', icon: '🏠' },
    { path: '/cliente/menu', label: 'Menú', icon: '📋' },
    { path: '/cliente/carrito', label: 'Carrito', icon: '🛒' },
    { path: '/cliente/pedidos', label: 'Mis Pedidos', icon: '📦' },
    { path: '/cliente/perfil', label: 'Mi Perfil', icon: '👤' }
  ];

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
