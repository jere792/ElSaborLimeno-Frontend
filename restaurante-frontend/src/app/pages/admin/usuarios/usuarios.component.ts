// src/app/pages/admin/usuarios/usuarios.component.ts

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { 
  UsuariosService, 
  UsuarioListado, 
  Rol, 
  FiltrosUsuarios,
  RespuestaListado,
  RespuestaRoles,
  CrearUsuarioDto,
  ActualizarUsuarioDto
} from '../../../core/services/usuarios.service';
import { getRolIcono, getRolBadgeClass } from '../../../shared/constants/roles.constants';

@Component({
  selector: 'app-usuarios',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.scss']
})
export class UsuariosComponent implements OnInit {
  // ==================== PROPIEDADES ====================
  
  usuarios: UsuarioListado[] = [];
  roles: Rol[] = [];
  
  // Modales
  mostrarModal = false;
  mostrarModalDetalles = false;
  modoModal: 'crear' | 'editar' = 'crear';
  usuarioSeleccionado: UsuarioListado | null = null;
  usuarioDetalles: UsuarioListado | null = null;

  // Control de estados
  verInactivos = false;
  loading = false;

  // Filtros
  filtros: FiltrosUsuarios = {
    pagina: 1,
    registrosPorPagina: 10,
    busqueda: '',
    id_rol: undefined
  };

  // Paginación
  totalRegistros = 0;
  totalPaginas = 0;
  paginaActual = 1;
  opcionesPorPagina = [10, 20, 50, 100];

  // Math para el template
  Math = Math;

  // Formulario
  formulario = {
    id_documento: 1,
    id_roles: 3,
    nombres: '',
    apellidos: '',
    email: '',
    password: '',
    telefono: '',
    fecha_nacimiento: undefined as Date | undefined,
    genero: '',
    direccion: ''
  };

  constructor(private usuariosService: UsuariosService) {}

  ngOnInit(): void {
    this.cargarRoles();
    this.cargarUsuarios();
  }

  // ==================== CARGA DE DATOS ====================
  
  cargarRoles(): void {
    this.usuariosService.obtenerRoles().subscribe({
      next: (response: RespuestaRoles) => {
        this.roles = response.roles;
        console.log('✅ Roles cargados:', this.roles);
      },
      error: (error: any) => {
        console.error('❌ Error al cargar roles:', error);
      }
    });
  }

  cargarUsuarios(): void {
    this.loading = true;
    
    const observable = this.verInactivos 
      ? this.usuariosService.listarUsuariosInactivos(this.filtros)
      : this.usuariosService.listarUsuariosActivos(this.filtros);

    observable.subscribe({
      next: (response: RespuestaListado) => {
        this.usuarios = response.usuarios;
        this.totalRegistros = response.paginacion.total_registros;
        this.totalPaginas = response.paginacion.total_paginas;
        this.paginaActual = response.paginacion.pagina_actual;
        this.loading = false;
        console.log(`✅ ${this.usuarios.length} usuarios cargados (${this.verInactivos ? 'inactivos' : 'activos'})`);
      },
      error: (error: any) => {
        console.error('❌ Error al cargar usuarios:', error);
        this.loading = false;
      }
    });
  }

  // ==================== FILTROS ====================

  buscar(): void {
    this.filtros.pagina = 1;
    this.cargarUsuarios();
  }

  aplicarFiltros(): void {
    this.filtros.pagina = 1;
    this.cargarUsuarios();
  }

  toggleVerInactivos(): void {
    this.verInactivos = !this.verInactivos;
    this.filtros.pagina = 1;
    this.cargarUsuarios();
  }

  // ==================== FILTROS ACTIVOS ====================

  tieneFiltrosActivos(): boolean {
    return !!(this.filtros.busqueda || this.filtros.id_rol);
  }

  limpiarBusqueda(): void {
    this.filtros.busqueda = '';
    this.buscar();
  }

  limpiarFiltroRol(): void {
    this.filtros.id_rol = undefined;
    this.filtros.pagina = 1;
    this.cargarUsuarios();
  }

  limpiarTodosFiltros(): void {
    this.filtros = {
      pagina: 1,
      registrosPorPagina: this.filtros.registrosPorPagina,
      busqueda: '',
      id_rol: undefined
    };
    this.cargarUsuarios();
  }

  getNombreRol(rolId: number | undefined): string {
    if (!rolId) return '';
    const rol = this.roles.find(r => r.Id_Roles === rolId);
    return rol ? rol.Nombre : '';
  }

  // ==================== PAGINACIÓN ====================

  cambiarPagina(pagina: number): void {
    if (pagina >= 1 && pagina <= this.totalPaginas) {
      this.filtros.pagina = pagina;
      this.cargarUsuarios();
    }
  }

  cambiarRegistrosPorPagina(): void {
    this.filtros.pagina = 1;
    this.cargarUsuarios();
  }

  // ==================== MODALES ====================

  abrirModalCrear(): void {
    this.modoModal = 'crear';
    this.limpiarFormulario();
    this.mostrarModal = true;
  }

  abrirModalEditar(usuario: UsuarioListado): void {
    this.modoModal = 'editar';
    this.usuarioSeleccionado = usuario;
    this.formulario = {
      id_documento: usuario.Id_Documento || 1,
      id_roles: usuario.Id_Roles,
      nombres: usuario.Nombres,
      apellidos: usuario.Apellidos,
      email: usuario.Email,
      password: '',
      telefono: usuario.Telefono || '',
      fecha_nacimiento: usuario.Fecha_Nacimiento,
      genero: usuario.Genero || '',
      direccion: usuario.Direccion || ''
    };
    this.mostrarModal = true;
  }

  cerrarModal(): void {
    this.mostrarModal = false;
    this.limpiarFormulario();
  }

  limpiarFormulario(): void {
    this.formulario = {
      id_documento: 1,
      id_roles: 3,
      nombres: '',
      apellidos: '',
      email: '',
      password: '',
      telefono: '',
      fecha_nacimiento: undefined,
      genero: '',
      direccion: ''
    };
    this.usuarioSeleccionado = null;
  }

  abrirModalDetalles(usuario: UsuarioListado): void {
    this.usuarioDetalles = usuario;
    this.mostrarModalDetalles = true;
  }

  cerrarModalDetalles(): void {
    this.mostrarModalDetalles = false;
    this.usuarioDetalles = null;
  }

  // ==================== CRUD ====================

  guardarUsuario(): void {
    if (!this.validarFormulario()) {
      return;
    }

    if (this.modoModal === 'crear') {
      this.crearUsuario();
    } else {
      this.actualizarUsuario();
    }
  }

  validarFormulario(): boolean {
    const { nombres, apellidos, email, password, id_roles } = this.formulario;

    if (!nombres || !apellidos || !email || !id_roles) {
      alert('⚠️ Por favor complete todos los campos requeridos');
      return false;
    }

    if (this.modoModal === 'crear' && !password) {
      alert('⚠️ La contraseña es requerida');
      return false;
    }

    if (this.modoModal === 'crear' && password.length < 6) {
      alert('⚠️ La contraseña debe tener al menos 6 caracteres');
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      alert('⚠️ Ingrese un email válido');
      return false;
    }

    return true;
  }

  crearUsuario(): void {
    this.loading = true;
    
    const usuarioData: CrearUsuarioDto = {
      id_documento: this.formulario.id_documento,
      id_roles: typeof this.formulario.id_roles === 'string' 
        ? parseInt(this.formulario.id_roles, 10) 
        : this.formulario.id_roles,
      nombres: this.formulario.nombres.trim(),
      apellidos: this.formulario.apellidos.trim(),
      email: this.formulario.email.trim().toLowerCase(),
      password: this.formulario.password,
      telefono: this.formulario.telefono?.trim() || undefined,
      fecha_nacimiento: this.formulario.fecha_nacimiento,
      genero: this.formulario.genero || undefined,
      direccion: this.formulario.direccion?.trim() || undefined
    };

    this.usuariosService.crearUsuario(usuarioData).subscribe({
      next: (response: any) => {
        console.log('✅ Usuario creado:', response);
        alert('✅ Usuario creado exitosamente');
        this.cerrarModal();
        this.cargarUsuarios();
      },
      error: (error: any) => {
        console.error('❌ Error al crear usuario:', error);
        alert('❌ ' + (error.error?.mensaje || 'Error al crear usuario'));
        this.loading = false;
      }
    });
  }

  actualizarUsuario(): void {
    if (!this.usuarioSeleccionado) return;

    this.loading = true;
    
    const datos: ActualizarUsuarioDto = {
      id_documento: this.formulario.id_documento,
      id_roles: typeof this.formulario.id_roles === 'string' 
        ? parseInt(this.formulario.id_roles, 10) 
        : this.formulario.id_roles,
      nombres: this.formulario.nombres.trim(),
      apellidos: this.formulario.apellidos.trim(),
      email: this.formulario.email.trim().toLowerCase(),
      telefono: this.formulario.telefono?.trim() || undefined,
      fecha_nacimiento: this.formulario.fecha_nacimiento,
      genero: this.formulario.genero || undefined,
      direccion: this.formulario.direccion?.trim() || undefined
    };

    this.usuariosService.actualizarUsuario(this.usuarioSeleccionado.Id_Usuario, datos).subscribe({
      next: (response: any) => {
        console.log('✅ Usuario actualizado:', response);
        alert('✅ Usuario actualizado exitosamente');
        this.cerrarModal();
        this.cargarUsuarios();
      },
      error: (error: any) => {
        console.error('❌ Error al actualizar usuario:', error);
        alert('❌ ' + (error.error?.mensaje || 'Error al actualizar usuario'));
        this.loading = false;
      }
    });
  }

  cambiarEstado(usuario: UsuarioListado, nuevoEstado: string): void {
    const accion = nuevoEstado === 'Activo' ? 'activar' : 'desactivar';
    
    if (confirm(`¿Está seguro que desea ${accion} a ${usuario.Nombres} ${usuario.Apellidos}?`)) {
      this.usuariosService.cambiarEstado(usuario.Id_Usuario, nuevoEstado).subscribe({
        next: () => {
          console.log(`✅ Estado cambiado a ${nuevoEstado}`);
          alert(`✅ Usuario ${nuevoEstado.toLowerCase()} exitosamente`);
          this.cargarUsuarios();
        },
        error: (error: any) => {
          console.error('❌ Error al cambiar estado:', error);
          alert('❌ ' + (error.error?.mensaje || 'Error al cambiar estado'));
        }
      });
    }
  }

  // ==================== HELPERS ====================

  getRolIcon(rolId: number): string {
    return getRolIcono(rolId);
  }

  getRolBadgeClass(rolId: number): string {
    return getRolBadgeClass(rolId);
  }

  getEstadoBadgeClass(estado: string): string {
    const clases: { [key: string]: string } = {
      'Activo': 'badge-success',
      'Inactivo': 'badge-danger',
      'Suspendido': 'badge-warning'
    };
    return clases[estado] || 'badge-default';
  }

  getGeneroIcon(genero?: string): string {
    const iconos: { [key: string]: string } = {
      'Masculino': '👨',
      'Femenino': '👩',
      'Otro': '🧑'
    };
    return iconos[genero || ''] || '👤';
  }
}
