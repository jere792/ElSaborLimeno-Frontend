// src/app/pages/admin/perfil-admin/perfil-admin.component.ts

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { 
  UsuariosService, 
  PerfilUsuario, 
  ActualizarPerfilDto,
  CambiarPasswordDto 
} from '../../../core/services/usuarios.service';

@Component({
  selector: 'app-perfil-admin',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './perfil-admin.component.html',
  styleUrls: ['./perfil-admin.component.scss']
})
export class PerfilAdminComponent implements OnInit {
  perfil: PerfilUsuario | null = null;
  formularioPerfil: ActualizarPerfilDto = {
    nombres: '',
    apellidos: '',
    email: '',
    telefono: '',
    fecha_nacimiento: undefined,
    genero: '',
    direccion: ''
  };

  formularioPassword: CambiarPasswordDto & { password_confirmacion: string } = {
    password_actual: '',
    password_nueva: '',
    password_confirmacion: ''
  };

  modoEdicion = false;
  mostrarModalPassword = false;
  loading = false;
  loadingPerfil = true;
  mostrarPasswordActual = false;
  mostrarPasswordNueva = false;
  mostrarPasswordConfirmacion = false;
  tabActiva: 'informacion' | 'seguridad' = 'informacion';

  constructor(private usuariosService: UsuariosService) {}

  ngOnInit(): void {
    this.cargarPerfil();
  }

  // ✅ ACTUALIZADO: Usar obtenerMiPerfil()
  cargarPerfil(): void {
    this.loadingPerfil = true;

    this.usuariosService.obtenerMiPerfil().subscribe({
      next: (response) => {
        this.perfil = response.usuario;
        this.loadingPerfil = false;
        console.log('✅ Perfil cargado:', this.perfil);
      },
      error: (error) => {
        console.error('❌ Error al cargar perfil:', error);
        alert('❌ Error al cargar el perfil');
        this.loadingPerfil = false;
      }
    });
  }

  activarModoEdicion(): void {
    if (!this.perfil) return;

    this.modoEdicion = true;
    this.formularioPerfil = {
      nombres: this.perfil.Nombres,
      apellidos: this.perfil.Apellidos,
      email: this.perfil.Email,
      telefono: this.perfil.Telefono || '',
      fecha_nacimiento: this.perfil.Fecha_Nacimiento,
      genero: this.perfil.Genero || '',
      direccion: this.perfil.Direccion || ''
    };
  }

  cancelarEdicion(): void {
    this.modoEdicion = false;
    this.limpiarFormularioPerfil();
  }

  // ✅ ACTUALIZADO: Usar actualizarMiPerfil()
  guardarPerfil(): void {
    if (!this.validarFormularioPerfil()) {
      return;
    }

    this.loading = true;

    this.usuariosService.actualizarMiPerfil(this.formularioPerfil).subscribe({
      next: (response) => {
        console.log('✅ Perfil actualizado:', response);
        alert('✅ Perfil actualizado correctamente');
        this.loading = false;
        this.modoEdicion = false;
        this.cargarPerfil(); // Recargar datos actualizados
      },
      error: (error) => {
        console.error('❌ Error al actualizar perfil:', error);
        alert('❌ ' + (error.error?.mensaje || 'Error al actualizar el perfil'));
        this.loading = false;
      }
    });
  }

  validarFormularioPerfil(): boolean {
    const { nombres, apellidos, email } = this.formularioPerfil;

    if (!nombres || !apellidos || !email) {
      alert('⚠️ Complete los campos obligatorios');
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      alert('⚠️ Ingrese un email válido');
      return false;
    }

    return true;
  }

  limpiarFormularioPerfil(): void {
    this.formularioPerfil = {
      nombres: '',
      apellidos: '',
      email: '',
      telefono: '',
      fecha_nacimiento: undefined,
      genero: '',
      direccion: ''
    };
  }

  abrirModalPassword(): void {
    this.mostrarModalPassword = true;
    this.limpiarFormularioPassword();
  }

  cerrarModalPassword(): void {
    this.mostrarModalPassword = false;
    this.limpiarFormularioPassword();
  }

  // ✅ ACTUALIZADO: Usar cambiarMiPassword()
  cambiarPassword(): void {
    if (!this.validarFormularioPassword()) {
      return;
    }

    this.loading = true;

    const datos: CambiarPasswordDto = {
      password_actual: this.formularioPassword.password_actual,
      password_nueva: this.formularioPassword.password_nueva
    };

    this.usuariosService.cambiarMiPassword(datos).subscribe({
      next: (response) => {
        console.log('✅ Contraseña actualizada:', response);
        alert('✅ Contraseña actualizada correctamente');
        this.loading = false;
        this.cerrarModalPassword();
      },
      error: (error) => {
        console.error('❌ Error al cambiar contraseña:', error);
        alert('❌ ' + (error.error?.mensaje || 'Error al cambiar la contraseña'));
        this.loading = false;
      }
    });
  }

  validarFormularioPassword(): boolean {
    const { password_actual, password_nueva, password_confirmacion } = this.formularioPassword;

    if (!password_actual || !password_nueva || !password_confirmacion) {
      alert('⚠️ Complete todos los campos');
      return false;
    }

    if (password_nueva.length < 6) {
      alert('⚠️ La contraseña debe tener al menos 6 caracteres');
      return false;
    }

    if (password_nueva !== password_confirmacion) {
      alert('⚠️ Las contraseñas no coinciden');
      return false;
    }

    if (password_actual === password_nueva) {
      alert('⚠️ La nueva contraseña debe ser diferente a la actual');
      return false;
    }

    return true;
  }

  limpiarFormularioPassword(): void {
    this.formularioPassword = {
      password_actual: '',
      password_nueva: '',
      password_confirmacion: ''
    };
    this.mostrarPasswordActual = false;
    this.mostrarPasswordNueva = false;
    this.mostrarPasswordConfirmacion = false;
  }

  cambiarTab(tab: 'informacion' | 'seguridad'): void {
    this.tabActiva = tab;
    if (this.modoEdicion) {
      this.cancelarEdicion();
    }
  }

  toggleMostrarPassword(campo: 'actual' | 'nueva' | 'confirmacion'): void {
    switch (campo) {
      case 'actual':
        this.mostrarPasswordActual = !this.mostrarPasswordActual;
        break;
      case 'nueva':
        this.mostrarPasswordNueva = !this.mostrarPasswordNueva;
        break;
      case 'confirmacion':
        this.mostrarPasswordConfirmacion = !this.mostrarPasswordConfirmacion;
        break;
    }
  }

  calcularAntiguedad(): string {
    if (!this.perfil?.Fecha_Registro) return 'N/A';

    const ahora = new Date();
    const registro = new Date(this.perfil.Fecha_Registro);
    const diff = ahora.getTime() - registro.getTime();
    const dias = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (dias < 30) {
      return `${dias} días`;
    } else if (dias < 365) {
      const meses = Math.floor(dias / 30);
      return `${meses} ${meses === 1 ? 'mes' : 'meses'}`;
    } else {
      const años = Math.floor(dias / 365);
      const meses = Math.floor((dias % 365) / 30);
      return `${años} ${años === 1 ? 'año' : 'años'}${meses > 0 ? ` y ${meses} ${meses === 1 ? 'mes' : 'meses'}` : ''}`;
    }
  }

  getGeneroIcon(genero?: string): string {
    const iconos: { [key: string]: string } = {
      'Masculino': '👨',
      'Femenino': '👩',
      'Otro': '🧑'
    };
    return iconos[genero || ''] || '👤';
  }

  obtenerIniciales(): string {
    if (!this.perfil) return '??';
    const nombres = this.perfil.Nombres || '';
    const apellidos = this.perfil.Apellidos || '';
    return `${nombres.charAt(0)}${apellidos.charAt(0)}`.toUpperCase();
  }
}
