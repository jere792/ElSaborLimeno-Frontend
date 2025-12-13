// src/app/pages/admin/usuarios/usuarios.component.ts

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UsuariosService, Usuario, Rol, FiltrosUsuarios } from '../../../core/services/usuarios.service';

@Component({
  selector: 'app-usuarios',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.scss']
})
export class UsuariosComponent implements OnInit {
  usuarios: Usuario[] = [];
  roles: Rol[] = [];
  
  filtros: FiltrosUsuarios = {
    pagina: 1,
    registrosPorPagina: 10,
    busqueda: '',
    estado: '',
    id_rol: undefined
  };

  totalRegistros = 0;
  totalPaginas = 0;
  paginaActual = 1;
  
  opcionesPorPagina = [10, 20, 50, 100];

  loading = false;
  mostrarModal = false;
  modoModal: 'crear' | 'editar' = 'crear';
  usuarioSeleccionado: Usuario | null = null;

  formulario = {
    id_roles: 5,
    nombres: '',
    apellidos: '',
    email: '',
    password: '',
    telefono: '',
    genero: '',
    direccion: ''
  };

  constructor(private usuariosService: UsuariosService) {}

  ngOnInit(): void {
    this.cargarRoles();
    this.cargarUsuarios();
  }

  cargarRoles(): void {
    this.usuariosService.obtenerRoles().subscribe({
      next: (response) => {
        this.roles = response.roles;
        console.log('✅ Roles cargados:', this.roles);
      },
      error: (error) => console.error('❌ Error al cargar roles:', error)
    });
  }

  cargarUsuarios(): void {
    this.loading = true;
    this.usuariosService.listarUsuarios(this.filtros).subscribe({
      next: (response) => {
        this.usuarios = response.usuarios;
        this.totalRegistros = response.paginacion.total_registros;
        this.totalPaginas = response.paginacion.total_paginas;
        this.paginaActual = response.paginacion.pagina_actual;
        this.loading = false;
        console.log('✅ Usuarios cargados:', this.usuarios.length);
      },
      error: (error) => {
        console.error('❌ Error al cargar usuarios:', error);
        this.loading = false;
      }
    });
  }

  buscar(): void {
    this.filtros.pagina = 1;
    this.cargarUsuarios();
  }

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

  filtrarPorRol(event: Event): void {
    const target = event.target as HTMLSelectElement;
    this.filtros.id_rol = target.value ? parseInt(target.value) : undefined;
    this.filtros.pagina = 1;
    this.cargarUsuarios();
  }

  filtrarPorEstado(event: Event): void {
    const target = event.target as HTMLSelectElement;
    this.filtros.estado = target.value || '';
    this.filtros.pagina = 1;
    this.cargarUsuarios();
  }

  abrirModalCrear(): void {
    this.modoModal = 'crear';
    this.limpiarFormulario();
    this.mostrarModal = true;
  }

  abrirModalEditar(usuario: Usuario): void {
    this.modoModal = 'editar';
    this.usuarioSeleccionado = usuario;
    this.formulario = {
      id_roles: usuario.Id_Roles,
      nombres: usuario.Nombres,
      apellidos: usuario.Apellidos,
      email: usuario.Email,
      password: '',
      telefono: usuario.Telefono || '',
      genero: '',
      direccion: ''
    };
    this.mostrarModal = true;
  }

  cerrarModal(): void {
    this.mostrarModal = false;
    this.limpiarFormulario();
  }

  limpiarFormulario(): void {
    this.formulario = {
      id_roles: 5,
      nombres: '',
      apellidos: '',
      email: '',
      password: '',
      telefono: '',
      genero: '',
      direccion: ''
    };
    this.usuarioSeleccionado = null;
  }

  guardarUsuario(): void {
    if (this.modoModal === 'crear') {
      this.crearUsuario();
    } else {
      this.actualizarUsuario();
    }
  }

  crearUsuario(): void {
    this.loading = true;
    
    const usuarioData = {
      ...this.formulario,
      id_roles: typeof this.formulario.id_roles === 'string' 
        ? parseInt(this.formulario.id_roles, 10) 
        : this.formulario.id_roles
    };
    
    console.log('📤 Creando usuario:', usuarioData);

    this.usuariosService.crearUsuario(usuarioData).subscribe({
      next: (response) => {
        console.log('✅ Usuario creado:', response);
        alert('Usuario creado exitosamente');
        this.cerrarModal();
        this.cargarUsuarios();
      },
      error: (error) => {
        console.error('❌ Error:', error);
        alert(error.error?.mensaje || 'Error al crear usuario');
        this.loading = false;
      }
    });
  }

  actualizarUsuario(): void {
    if (!this.usuarioSeleccionado) return;

    this.loading = true;
    
    const datos = {
      ...this.formulario,
      id_roles: typeof this.formulario.id_roles === 'string' 
        ? parseInt(this.formulario.id_roles, 10) 
        : this.formulario.id_roles
    };
    
    delete (datos as any).password;

    console.log('📤 Actualizando usuario:', datos);

    this.usuariosService.actualizarUsuario(this.usuarioSeleccionado.Id_Usuario, datos).subscribe({
      next: (response) => {
        console.log('✅ Usuario actualizado:', response);
        alert('Usuario actualizado exitosamente');
        this.cerrarModal();
        this.cargarUsuarios();
      },
      error: (error) => {
        console.error('❌ Error:', error);
        alert(error.error?.mensaje || 'Error al actualizar usuario');
        this.loading = false;
      }
    });
  }

  cambiarEstado(usuario: Usuario, nuevoEstado: string): void {
    if (confirm(`¿Cambiar estado a ${nuevoEstado}?`)) {
      this.usuariosService.cambiarEstado(usuario.Id_Usuario, nuevoEstado).subscribe({
        next: () => {
          alert('Estado actualizado');
          this.cargarUsuarios();
        },
        error: (error) => alert(error.error?.mensaje || 'Error')
      });
    }
  }

  eliminarUsuario(usuario: Usuario): void {
    if (confirm(`¿Eliminar a ${usuario.Nombres} ${usuario.Apellidos}?`)) {
      this.usuariosService.eliminarUsuario(usuario.Id_Usuario).subscribe({
        next: () => {
          alert('Usuario eliminado');
          this.cargarUsuarios();
        },
        error: (error) => alert(error.error?.mensaje || 'Error')
      });
    }
  }

  getRolBadgeClass(rolId: number): string {
    const clases: { [key: number]: string } = {
      1: 'badge-admin',
      2: 'badge-cajero',
      3: 'badge-mozo',
      4: 'badge-cocinero',
      5: 'badge-cliente',
      6: 'badge-repartidor'
    };
    return clases[rolId] || 'badge-default';
  }

  getEstadoBadgeClass(estado: string): string {
    const clases: { [key: string]: string } = {
      'Activo': 'badge-success',
      'Inactivo': 'badge-danger',
      'Suspendido': 'badge-warning'
    };
    return clases[estado] || 'badge-default';
  }
}
