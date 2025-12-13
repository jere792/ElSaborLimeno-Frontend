// src/app/pages/cajero/cajero.component.ts

import { Component } from '@angular/core';
import { Router, RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-cajero',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './cajero.component.html',
  styleUrls: ['./cajero.component.scss']
})
export class CajeroComponent {
  menuItems = [
    { path: '/cajero/home', label: 'Inicio', icon: '🏠' },
    { path: '/cajero/caja', label: 'Caja', icon: '💰' },
    { path: '/cajero/pedidos', label: 'Pedidos', icon: '📦' },
    { path: '/cajero/productos', label: 'Productos', icon: '🍽️' }
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
