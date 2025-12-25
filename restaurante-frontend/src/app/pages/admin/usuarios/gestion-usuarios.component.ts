// src/app/pages/admin/usuarios/gestion-usuarios.component.ts

import { Component, OnInit, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UsuariosService, UsuarioListado, FiltrosUsuarios, RespuestaListado, CrearUsuarioDto, ActualizarUsuarioDto } from '../../../core/services/usuarios.service';
import { ROLES } from '../../../shared/constants/roles.constants';

interface ConfigRol {
  idRol: number;
  nombreSingular: string;
  nombrePlural: string;
  icono: string;
  emoji: string;
  containerClass: string;
}

interface FormularioUsuario {
  id_documento: number;
  id_roles: number;
  nombres: string;
  apellidos: string;
  email: string;
  password: string;
  telefono: string;
  fecha_nacimiento: string | undefined;
  genero: string;
  direccion: string;
}

@Component({
  selector: 'app-gestion-usuarios',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './gestion-usuarios.component.html',
  styleUrls: ['./gestion-usuarios.component.scss']
})
export class GestionUsuariosComponent implements OnInit {
  @Input() tipoRol: 'admin' | 'cajero' | 'cliente' = 'cliente';
  
  usuarios: UsuarioListado[] = [];
  
  mostrarModal = false;
  mostrarModalDetalles = false;
  modoModal: 'crear' | 'editar' = 'crear';
  usuarioSeleccionado: UsuarioListado | null = null;
  usuarioDetalles: UsuarioListado | null = null;

  verInactivos = false;
  loading = false;

  filtros: FiltrosUsuarios = {
    pagina: 1,
    registros_por_pagina: 10,
    busqueda: '',
    id_rol: ROLES.CLIENTE
  };

  totalRegistros = 0;
  totalPaginas = 0;
  paginaActual = 1;
  opcionesPorPagina = [10, 20, 50, 100];

  // Propiedades para foto de perfil
  fotoSeleccionada: File | null = null;
  previewFoto: string | null = null;
  subiendoFoto = false;

  Math = Math;

  formulario: FormularioUsuario = {
    id_documento: 1,
    id_roles: ROLES.CLIENTE,
    nombres: '',
    apellidos: '',
    email: '',
    password: '',
    telefono: '',
    fecha_nacimiento: undefined,
    genero: '',
    direccion: ''
  };

  private readonly configuraciones: { [key: string]: ConfigRol } = {
    admin: {
      idRol: ROLES.ADMIN,
      nombreSingular: 'Administrador',
      nombrePlural: 'Administradores',
      icono: 'bi-shield-fill-check',
      emoji: '👑',
      containerClass: 'administradores-container'
    },
    cajero: {
      idRol: ROLES.CAJERO,
      nombreSingular: 'Cajero',
      nombrePlural: 'Cajeros',
      icono: 'bi-person-badge-fill',
      emoji: '💰',
      containerClass: 'cajeros-container'
    },
    cliente: {
      idRol: ROLES.CLIENTE,
      nombreSingular: 'Cliente',
      nombrePlural: 'Clientes',
      icono: 'bi-person-fill',
      emoji: '👤',
      containerClass: 'clientes-container'
    }
  };

  config!: ConfigRol;

  constructor(private usuariosService: UsuariosService) {}

  ngOnInit(): void {
    this.config = this.configuraciones[this.tipoRol];
    this.filtros.id_rol = this.config.idRol;
    this.formulario.id_roles = this.config.idRol;
    this.cargarUsuarios();
  }
  
  cargarUsuarios(): void {
    this.loading = true;
    
    const observable = this.verInactivos 
      ? this.usuariosService.listarUsuariosInactivos(this.filtros)
      : this.usuariosService.listarUsuariosActivos(this.filtros);

    observable.subscribe({
      next: (response: RespuestaListado) => {
        this.usuarios = response.usuarios.filter(u => u.id_roles === this.config.idRol);
        this.totalRegistros = this.usuarios.length;
        this.totalPaginas = response.paginacion.total_paginas;
        this.paginaActual = response.paginacion.pagina_actual;
        this.loading = false;
      },
      error: (error: any) => {
        console.error(`Error al cargar ${this.config.nombrePlural.toLowerCase()}:`, error);
        this.loading = false;
      }
    });
  }

  buscar(): void {
    this.filtros.pagina = 1;
    this.cargarUsuarios();
  }

  toggleVerInactivos(): void {
    this.verInactivos = !this.verInactivos;
    this.filtros.pagina = 1;
    this.cargarUsuarios();
  }

  tieneFiltrosActivos(): boolean {
    return !!this.filtros.busqueda;
  }

  limpiarTodosFiltros(): void {
    this.filtros = {
      pagina: 1,
      registros_por_pagina: this.filtros.registros_por_pagina,
      busqueda: '',
      id_rol: this.config.idRol
    };
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

  abrirModalCrear(): void {
    this.modoModal = 'crear';
    this.limpiarFormulario();
    this.mostrarModal = true;
  }

  abrirModalEditar(usuario: UsuarioListado): void {
    this.modoModal = 'editar';
    this.usuarioSeleccionado = usuario;
    
    let fechaFormateada: string | undefined = undefined;
    if (usuario.fecha_nacimiento) {
      const fecha = new Date(usuario.fecha_nacimiento);
      if (!isNaN(fecha.getTime())) {
        fechaFormateada = fecha.toISOString().split('T')[0];
      }
    }
    
    this.formulario = {
      id_documento: usuario.id_documento || 1,
      id_roles: this.config.idRol,
      nombres: usuario.nombres,
      apellidos: usuario.apellidos,
      email: usuario.email,
      password: '',
      telefono: usuario.telefono || '',
      fecha_nacimiento: fechaFormateada,
      genero: usuario.genero || '',
      direccion: usuario.direccion || ''
    };
    
    // Limpiar foto seleccionada al abrir modal de edición
    this.cancelarFoto();
    
    this.mostrarModal = true;
  }

  cerrarModal(): void {
    this.mostrarModal = false;
    this.cancelarFoto();
    this.limpiarFormulario();
  }

  limpiarFormulario(): void {
    this.formulario = {
      id_documento: 1,
      id_roles: this.config.idRol,
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

  getFotoUsuario(usuario: UsuarioListado | null): string {
    if (usuario?.foto_perfil) {
      return usuario.foto_perfil;
    }
    return 'https://cdn-icons-png.flaticon.com/512/149/149071.png';
  }

  tieneFoto(usuario: UsuarioListado | null): boolean {
    return !!(usuario?.foto_perfil);
  }

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
    const { nombres, apellidos, email, password } = this.formulario;

    if (!nombres || !apellidos || !email) {
      alert('Por favor complete todos los campos requeridos');
      return false;
    }

    if (this.modoModal === 'crear' && !password) {
      alert('La contraseña es requerida');
      return false;
    }

    if (this.modoModal === 'crear' && password.length < 6) {
      alert('La contraseña debe tener al menos 6 caracteres');
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      alert('Ingrese un email válido');
      return false;
    }

    return true;
  }

  crearUsuario(): void {
    this.loading = true;
    
    let fechaNacimiento: Date | undefined = undefined;
    if (this.formulario.fecha_nacimiento) {
      fechaNacimiento = new Date(this.formulario.fecha_nacimiento);
    }
    
    const usuarioData: CrearUsuarioDto = {
      id_documento: this.formulario.id_documento,
      id_roles: this.config.idRol,
      nombres: this.formulario.nombres.trim(),
      apellidos: this.formulario.apellidos.trim(),
      email: this.formulario.email.trim().toLowerCase(),
      password: this.formulario.password,
      telefono: this.formulario.telefono?.trim() || undefined,
      fecha_nacimiento: fechaNacimiento,
      genero: this.formulario.genero || undefined,
      direccion: this.formulario.direccion?.trim() || undefined
    };

    this.usuariosService.crearUsuario(usuarioData).subscribe({
      next: (response: any) => {
        console.log(`${this.config.nombreSingular} creado:`, response);
        alert(`${this.config.nombreSingular} creado exitosamente`);
        this.cerrarModal();
        this.cargarUsuarios();
      },
      error: (error: any) => {
        console.error(`Error al crear ${this.config.nombreSingular.toLowerCase()}:`, error);
        alert(error.error?.mensaje || `Error al crear ${this.config.nombreSingular.toLowerCase()}`);
        this.loading = false;
      }
    });
  }

  actualizarUsuario(): void {
    if (!this.usuarioSeleccionado) return;

    this.loading = true;
    
    let fechaNacimiento: Date | undefined = undefined;
    if (this.formulario.fecha_nacimiento) {
      fechaNacimiento = new Date(this.formulario.fecha_nacimiento);
    }
    
    const datos: ActualizarUsuarioDto = {
      id_documento: this.formulario.id_documento,
      id_roles: this.config.idRol,
      nombres: this.formulario.nombres.trim(),
      apellidos: this.formulario.apellidos.trim(),
      email: this.formulario.email.trim().toLowerCase(),
      telefono: this.formulario.telefono?.trim() || undefined,
      fecha_nacimiento: fechaNacimiento,
      genero: this.formulario.genero || undefined,
      direccion: this.formulario.direccion?.trim() || undefined
    };

    this.usuariosService.actualizarUsuario(this.usuarioSeleccionado.id_usuario, datos).subscribe({
      next: (response: any) => {
        console.log(`${this.config.nombreSingular} actualizado:`, response);
        alert(`${this.config.nombreSingular} actualizado exitosamente`);
        this.cerrarModal();
        this.cargarUsuarios();
      },
      error: (error: any) => {
        console.error(`Error al actualizar ${this.config.nombreSingular.toLowerCase()}:`, error);
        alert(error.error?.mensaje || `Error al actualizar ${this.config.nombreSingular.toLowerCase()}`);
        this.loading = false;
      }
    });
  }

  cambiarEstado(usuario: UsuarioListado, nuevoEstado: string): void {
    const accion = nuevoEstado === 'Activo' ? 'activar' : 'desactivar';
    
    if (confirm(`¿Está seguro que desea ${accion} a ${usuario.nombres} ${usuario.apellidos}?`)) {
      this.usuariosService.cambiarEstado(usuario.id_usuario, nuevoEstado).subscribe({
        next: () => {
          console.log(`Estado cambiado a ${nuevoEstado}`);
          alert(`${this.config.nombreSingular} ${nuevoEstado.toLowerCase()} exitosamente`);
          this.cargarUsuarios();
        },
        error: (error: any) => {
          console.error('Error al cambiar estado:', error);
          alert(error.error?.mensaje || 'Error al cambiar estado');
        }
      });
    }
  }

  getEstadoBadgeClass(estado: string): string {
    const clases: { [key: string]: string } = {
      'Activo': 'badge-success',
      'Inactivo': 'badge-danger',
      'Suspendido': 'badge-warning'
    };
    return clases[estado] || 'badge-default';
  }

  getBadgeRolClass(): string {
    return this.tipoRol === 'admin' ? 'badge-admin' : 'badge-success';
  }

  // ==================== GESTIÓN DE FOTO DE PERFIL ====================

  abrirSelectorFoto(): void {
    const input = document.getElementById('input-foto-usuario') as HTMLInputElement;
    if (input) {
      input.click();
    }
  }

  onFotoSeleccionada(event: Event): void {
    const input = event.target as HTMLInputElement;
    
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      
      if (!this.validarTipoImagen(file)) {
        alert('⚠️ Solo se permiten imágenes (JPG, JPEG, PNG, GIF)');
        input.value = '';
        return;
      }
      
      if (!this.validarTamañoImagen(file)) {
        alert('⚠️ La imagen no debe superar los 5MB');
        input.value = '';
        return;
      }
      
      this.fotoSeleccionada = file;
      this.generarPreview(file);
    }
  }

  validarTipoImagen(file: File): boolean {
    const tiposPermitidos = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
    return tiposPermitidos.includes(file.type);
  }

  validarTamañoImagen(file: File): boolean {
    const maxSize = 5 * 1024 * 1024; // 5MB
    return file.size <= maxSize;
  }

  generarPreview(file: File): void {
    const reader = new FileReader();
    
    reader.onload = (e: ProgressEvent<FileReader>) => {
      if (e.target?.result) {
        this.previewFoto = e.target.result as string;
        console.log('✅ Preview generado');
      }
    };
    
    reader.readAsDataURL(file);
  }

  subirFotoUsuario(): void {
    if (!this.fotoSeleccionada) {
      alert('⚠️ Seleccione una imagen primero');
      return;
    }

    if (!this.usuarioSeleccionado) {
      alert('⚠️ Debe seleccionar un usuario');
      return;
    }

    if (!confirm('¿Está seguro que desea actualizar la foto de perfil?')) {
      return;
    }

    this.subiendoFoto = true;
    console.log('📤 Subiendo foto al servidor...');

    this.usuariosService.subirFotoPerfil(this.fotoSeleccionada).subscribe({
      next: (response) => {
        console.log('✅ Respuesta del servidor:', response);
        alert('✅ Foto de perfil actualizada correctamente');
        
        this.subiendoFoto = false;
        this.cancelarFoto();
        this.cerrarModal();
        this.cargarUsuarios();
      },
      error: (error) => {
        console.error('❌ Error al subir foto:', error);
        alert('❌ ' + (error.error?.mensaje || 'Error al subir la foto'));
        this.subiendoFoto = false;
      }
    });
  }

  cancelarFoto(): void {
    this.fotoSeleccionada = null;
    this.previewFoto = null;
    
    const input = document.getElementById('input-foto-usuario') as HTMLInputElement;
    if (input) {
      input.value = '';
    }
  }

  getFotoActual(): string {
    if (this.previewFoto) {
      return this.previewFoto;
    }
    if (this.usuarioSeleccionado?.foto_perfil) {
      return this.usuarioSeleccionado.foto_perfil;
    }
    return 'https://cdn-icons-png.flaticon.com/512/149/149071.png';
  }
}
