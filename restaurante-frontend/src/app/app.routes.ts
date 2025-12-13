// src/app/app.routes.ts

import { Routes } from '@angular/router';

// Guards
import { authGuard } from './core/guards/auth.guard';
import { roleGuard } from './core/guards/role.guard';

// Auth Components
import { LoginComponent } from './pages/auth/login/login.component';
import { RegisterComponent } from './pages/auth/register/register.component';
import { OblivionPasswordComponent } from './pages/auth/oblivion-password/oblivion-password.component';

// Admin Components
import { AdminComponent } from './pages/admin/admin.component';
import { DashboardComponent } from './pages/admin/dashboard/dashboard.component';
import { UsuariosComponent } from './pages/admin/usuarios/usuarios.component';
import { ProductosComponent as AdminProductosComponent } from './pages/admin/productos/productos.component';
import { PedidosComponent as AdminPedidosComponent } from './pages/admin/pedidos/pedidos.component';
import { ReportesComponent } from './pages/admin/reportes/reportes.component';

// Cajero Components
import { CajeroComponent } from './pages/cajero/cajero.component';
import { HomeComponent as CajeroHomeComponent } from './pages/cajero/home/home.component';
import { CajaComponent } from './pages/cajero/caja/caja.component';
import { PedidosComponent as CajeroPedidosComponent } from './pages/cajero/pedidos/pedidos.component';
import { ProductosComponent as CajeroProductosComponent } from './pages/cajero/productos/productos.component';

// Cliente Components
import { ClienteComponent } from './pages/cliente/cliente.component';
import { HomeComponent as ClienteHomeComponent } from './pages/cliente/home/home.component';
import { MenuComponent } from './pages/cliente/menu/menu.component';
import { CarritoComponent } from './pages/cliente/carrito/carrito.component';
import { PedidosComponent as ClientePedidosComponent } from './pages/cliente/pedidos/pedidos.component';
import { PerfilComponent } from './pages/cliente/perfil/perfil.component';

export const routes: Routes = [
  // Ruta por defecto
  { path: '', redirectTo: '/login', pathMatch: 'full' },

  // AUTH - Sin protección
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'register',
    component: RegisterComponent
  },
  {
    path: 'oblivion-password',
    component: OblivionPasswordComponent
  },

  // ADMIN - Protegido con rol 1
  {
    path: 'admin',
    component: AdminComponent,
    canActivate: [authGuard, roleGuard],
    data: { roles: [1] },
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: DashboardComponent },
      { path: 'usuarios', component: UsuariosComponent },
      { path: 'productos', component: AdminProductosComponent },
      { path: 'pedidos', component: AdminPedidosComponent },
      { path: 'reportes', component: ReportesComponent }
    ]
  },

  // CAJERO - Protegido con rol 2
  {
    path: 'cajero',
    component: CajeroComponent,
    canActivate: [authGuard, roleGuard],
    data: { roles: [2] },
    children: [
      { path: '', redirectTo: 'home', pathMatch: 'full' },
      { path: 'home', component: CajeroHomeComponent },
      { path: 'caja', component: CajaComponent },
      { path: 'pedidos', component: CajeroPedidosComponent },
      { path: 'productos', component: CajeroProductosComponent }
    ]
  },

  // CLIENTE - Protegido con rol 5
  {
    path: 'cliente',
    component: ClienteComponent,
    canActivate: [authGuard, roleGuard],
    data: { roles: [5] },
    children: [
      { path: '', redirectTo: 'home', pathMatch: 'full' },
      { path: 'home', component: ClienteHomeComponent },
      { path: 'menu', component: MenuComponent },
      { path: 'carrito', component: CarritoComponent },
      { path: 'pedidos', component: ClientePedidosComponent },
      { path: 'perfil', component: PerfilComponent }
    ]
  },

  // 404
  { path: '**', redirectTo: '/login' }
];
