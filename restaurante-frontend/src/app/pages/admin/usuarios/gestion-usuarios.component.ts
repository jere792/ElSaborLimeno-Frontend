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
    registrosPorPagina: 10,
    busqueda: '',
    id_rol: ROLES.CLIENTE
  };

  totalRegistros = 0;
  totalPaginas = 0;
  paginaActual = 1;
  opcionesPorPagina = [10, 20, 50, 100];

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
        this.usuarios = response.usuarios.filter(u => u.Id_Roles === this.config.idRol);
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

  limpiarBusqueda(): void {
    this.filtros.busqueda = '';
    this.buscar();
  }

  limpiarTodosFiltros(): void {
    this.filtros = {
      pagina: 1,
      registrosPorPagina: this.filtros.registrosPorPagina,
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
    if (usuario.Fecha_Nacimiento) {
      const fecha = new Date(usuario.Fecha_Nacimiento);
      if (!isNaN(fecha.getTime())) {
        fechaFormateada = fecha.toISOString().split('T')[0];
      }
    }
    
    this.formulario = {
      id_documento: usuario.Id_Documento || 1,
      id_roles: this.config.idRol,
      nombres: usuario.Nombres,
      apellidos: usuario.Apellidos,
      email: usuario.Email,
      password: '',
      telefono: usuario.Telefono || '',
      fecha_nacimiento: fechaFormateada,
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

    this.usuariosService.actualizarUsuario(this.usuarioSeleccionado.Id_Usuario, datos).subscribe({
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
    
    if (confirm(`¿Está seguro que desea ${accion} a ${usuario.Nombres} ${usuario.Apellidos}?`)) {
      this.usuariosService.cambiarEstado(usuario.Id_Usuario, nuevoEstado).subscribe({
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
}
