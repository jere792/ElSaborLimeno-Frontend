// src/app/app.routes.ts

import { Routes } from '@angular/router';

// ============================================
// GUARDS
// ============================================
import { authGuard } from './core/guards/auth.guard';
import { roleGuard } from './core/guards/role.guard';

// ============================================
// AUTH COMPONENTS
// ============================================
import { LoginComponent } from './pages/auth/login/login.component';
import { RegisterComponent } from './pages/auth/register/register.component';
import { OblivionPasswordComponent } from './pages/auth/oblivion-password/oblivion-password.component';

// ============================================
// ADMIN COMPONENTS
// ============================================
import { AdminComponent } from './pages/admin/admin.component';
import { DashboardComponent } from './pages/admin/dashboard/dashboard.component';
import { PedidosComponent as AdminPedidosComponent } from './pages/admin/pedidos/pedidos.component';
import { ReportesComponent } from './pages/admin/reportes/reportes.component';

// ============================================
// CAJERO COMPONENTS
// ============================================
import { CajeroComponent } from './pages/cajero/cajero.component';
import { HomeCajeroComponent } from './pages/cajero/home-cajero/home.component';
import { CajaComponent } from './pages/cajero/caja/caja.component';
//import { PedidosComponent as CajeroPedidosComponent } from './pages/cajero/pedidos/pedidos.component';
//import { CajeroProductosComponent } from './pages/cajero/productos/productos.component';

// ============================================
// CLIENTE COMPONENTS
// ============================================
import { ClienteComponent } from './pages/cliente/cliente.component';
import { HomeClienteComponent } from './pages/cliente/home-cliente/home-cliente.component';
import { MenuComponent } from './pages/cliente/menu/menu.component';
import { CarritoComponent } from './pages/cliente/carrito/carrito.component';
//import { PedidosComponent as ClientePedidosComponent } from './pages/cliente/pedidos/pedidos.component';
import { PerfilComponent } from './pages/cliente/perfil/perfil.component';
import { ConfiguracionAdminComponent } from './pages/admin/configuracion-admin/configuracion-admin.component';
import { PlatillosComponent } from './pages/admin/menu/platillos/platillos.component';
import { CategoriaComponent } from './pages/admin/menu/categoria/categoria.component';
import { MesasComponent } from './pages/admin/mesas/mesas.component';
import { ReservasComponent } from './pages/admin/reservas/reservas.component';
import { PromocionesComponent } from './pages/admin/promociones/promociones.component';
import { TurnosComponent } from './pages/admin/turnos/turnos.component';
import { PagosEmpleadosComponent } from './pages/admin/pagos-empleados/pagos-empleados.component';
import { GestionClientesComponent } from './pages/admin/usuarios/gestion-clientes/gestion-clientes.component';
import { GestionCajerosComponent } from './pages/admin/usuarios/gestion-cajero/gestion-cajeros.component';
import { GestionAdminComponent } from './pages/admin/usuarios/gestion-admin/gestion-admin.component';

// ============================================
// RUTAS
// ============================================
export const routes: Routes = [
  // Ruta por defecto
  { path: '', redirectTo: '/auth/login', pathMatch: 'full' },

  // ============================================
  // AUTH - Sin protección
  // ============================================
  {
    path: 'auth',
    children: [
      { path: 'login', component: LoginComponent },
      { path: 'register', component: RegisterComponent },
      { path: 'oblivion-password', component: OblivionPasswordComponent }
    ]
  },

  // ============================================
  // ADMIN - Solo Rol 1 (Administrador)
  // ============================================
  {
    path: 'admin',
    component: AdminComponent,
    canActivate: [authGuard, roleGuard([1])],
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: DashboardComponent },
      { path: 'platillos', component: PlatillosComponent },
      { path: 'categorias', component: CategoriaComponent },
      { path: 'mesas', component: MesasComponent },
      { path: 'reservaciones', component: ReservasComponent },
      { path: 'pedidos', component: AdminPedidosComponent },
      { path: 'promociones', component: PromocionesComponent },
      { path: 'gestion-clientes', component: GestionClientesComponent },
      { path: 'gestion-cajeros', component: GestionCajerosComponent },
      { path: 'gestion-admin', component: GestionAdminComponent },
      { path: 'turnos', component: TurnosComponent },
      { path: 'pagos-empleados', component: PagosEmpleadosComponent },
      { path: 'ventas', component: ReportesComponent },
      { path: 'configuracion-admin', component: ConfiguracionAdminComponent }
    ]
  },

  // ============================================
  // CAJERO - Solo Rol 2 (Cajero)
  // ============================================
  {
    path: 'cajero',
    component: CajeroComponent,
    canActivate: [authGuard, roleGuard([2])],
    children: [
      { path: '', redirectTo: 'home', pathMatch: 'full' },
      { path: 'home', component: HomeCajeroComponent },
      { path: 'caja', component: CajaComponent },
      //{ path: 'pedidos', component: CajeroPedidosComponent },
      //{ path: 'productos', component: CajeroProductosComponent }
    ]
  },

  // ============================================
  // CLIENTE - Solo Rol 3 (Cliente)
  // ============================================
  {
    path: 'cliente',
    component: ClienteComponent,
    canActivate: [authGuard, roleGuard([3])],
    children: [
      { path: '', redirectTo: 'home', pathMatch: 'full' },
      { path: 'home', component: HomeClienteComponent },
      { path: 'menu', component: MenuComponent },
      { path: 'carrito', component: CarritoComponent },
      //{ path: 'pedidos', component: ClientePedidosComponent },
      { path: 'perfil', component: PerfilComponent }
    ]
  },

  // ============================================
  // REDIRECCIONES Y 404
  // ============================================
  { path: 'login', redirectTo: '/auth/login', pathMatch: 'full' },
  { path: 'register', redirectTo: '/auth/register', pathMatch: 'full' },
  { path: '**', redirectTo: '/auth/login' }
];
