// src/app/pages/admin/configuracion-admin/configuracion-admin.component.ts

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { 
  UsuariosService, 
  PerfilUsuario, 
  ActualizarPerfilDto,
  CambiarPasswordDto 
} from '../../../core/services/usuarios.service';

interface FormularioPerfilData {
  nombres: string;
  apellidos: string;
  email: string;
  telefono?: string;
  fecha_nacimiento?: string;
  genero?: string;
  direccion?: string;
}

@Component({
  selector: 'app-configuracion-admin',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './configuracion-admin.component.html',
  styleUrls: ['./configuracion-admin.component.scss']
})
export class ConfiguracionAdminComponent implements OnInit {
  perfil: PerfilUsuario | null = null;
  
  formularioPerfil: FormularioPerfilData = {
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

  // Propiedades para foto de perfil
  fotoSeleccionada: File | null = null;
  previewFoto: string | null = null;
  subiendoFoto = false;

  constructor(private usuariosService: UsuariosService) {}

  ngOnInit(): void {
    this.cargarPerfil();
  }

  // ==================== GESTIÓN DE PERFIL ====================

  cargarPerfil(): void {
    this.loadingPerfil = true;

    this.usuariosService.obtenerMiPerfil().subscribe({
      next: (response) => {
        console.log('📦 Respuesta completa del servidor:', response);
        console.log('👤 Usuario:', response.usuario);
        console.log('📸 Foto en respuesta:', response.usuario?.foto_perfil);
        
        this.perfil = response.usuario;
        this.loadingPerfil = false;
        
        console.log('📸 Foto en this.perfil:', this.perfil?.foto_perfil);
        console.log('✅ Perfil cargado correctamente');
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
    
    let fechaFormateada: string | undefined = undefined;
    if (this.perfil.fecha_nacimiento) {
      const fecha = new Date(this.perfil.fecha_nacimiento);
      if (!isNaN(fecha.getTime())) {
        fechaFormateada = fecha.toISOString().split('T')[0];
      }
    }
    
    this.formularioPerfil = {
      nombres: this.perfil.nombres,
      apellidos: this.perfil.apellidos,
      email: this.perfil.email,
      telefono: this.perfil.telefono || '',
      fecha_nacimiento: fechaFormateada,
      genero: this.perfil.genero || '',
      direccion: this.perfil.direccion || ''
    };
  }

  cancelarEdicion(): void {
    this.modoEdicion = false;
    this.limpiarFormularioPerfil();
  }

  guardarPerfil(): void {
    if (!this.validarFormularioPerfil()) {
      return;
    }

    this.loading = true;

    let fechaNacimiento: Date | undefined = undefined;
    if (this.formularioPerfil.fecha_nacimiento) {
      fechaNacimiento = new Date(this.formularioPerfil.fecha_nacimiento);
    }

    const datos: ActualizarPerfilDto = {
      nombres: this.formularioPerfil.nombres,
      apellidos: this.formularioPerfil.apellidos,
      email: this.formularioPerfil.email,
      telefono: this.formularioPerfil.telefono,
      fecha_nacimiento: fechaNacimiento,
      genero: this.formularioPerfil.genero,
      direccion: this.formularioPerfil.direccion
    };

    this.usuariosService.actualizarMiPerfil(datos).subscribe({
      next: (response) => {
        console.log('✅ Perfil actualizado:', response);
        alert('✅ Perfil actualizado correctamente');
        this.loading = false;
        this.modoEdicion = false;
        this.cargarPerfil();
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

  // ==================== GESTIÓN DE CONTRASEÑA ====================

  abrirModalPassword(): void {
    this.mostrarModalPassword = true;
    this.limpiarFormularioPassword();
  }

  cerrarModalPassword(): void {
    this.mostrarModalPassword = false;
    this.limpiarFormularioPassword();
  }

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

  // ==================== GESTIÓN DE TABS ====================

  cambiarTab(tab: 'informacion' | 'seguridad'): void {
    this.tabActiva = tab;
    if (this.modoEdicion) {
      this.cancelarEdicion();
    }
  }

  // ==================== UTILIDADES ====================

  calcularAntiguedad(): string {
    if (!this.perfil?.fecha_registro) return 'N/A';

    const ahora = new Date();
    const registro = new Date(this.perfil.fecha_registro);
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
    const nombres = this.perfil.nombres || '';
    const apellidos = this.perfil.apellidos || '';
    return `${nombres.charAt(0)}${apellidos.charAt(0)}`.toUpperCase();
  }

  // ==================== GESTIÓN DE FOTO DE PERFIL ====================

  getFotoActual(): string {
    if (this.previewFoto) {
      console.log('🔍 Usando preview:', this.previewFoto);
      return this.previewFoto;
    }
    if (this.perfil?.foto_perfil) {
      console.log('🔍 Usando foto del perfil:', this.perfil.foto_perfil);
      return this.perfil.foto_perfil;
    }
    console.log('⚠️ No hay foto disponible');
    return '';
  }

  tieneFoto(): boolean {
    const hasFoto = !!(this.previewFoto || this.perfil?.foto_perfil);
    console.log('🔍 tieneFoto:', hasFoto, 'URL:', this.perfil?.foto_perfil);
    return hasFoto;
  }

  // ✅ MANEJAR ERROR DE CARGA DE IMAGEN
  onImageError(event: any): void {
    console.error('❌ Error al cargar imagen');
    console.log('🔍 URL que falló:', event.target.src);
    
    // Ocultar la imagen y mostrar iniciales
    event.target.style.display = 'none';
    const parent = event.target.parentElement;
    if (parent) {
      const iniciales = parent.querySelector('.avatar-iniciales');
      if (iniciales) {
        (iniciales as HTMLElement).style.display = 'flex';
      }
    }
  }

  abrirSelectorFoto(): void {
    const input = document.getElementById('input-foto-perfil') as HTMLInputElement;
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

  subirFoto(): void {
    if (!this.fotoSeleccionada) {
      alert('⚠️ Seleccione una imagen primero');
      return;
    }

    if (!confirm('¿Está seguro que desea actualizar su foto de perfil?')) {
      return;
    }

    this.subiendoFoto = true;
    console.log('📤 Subiendo foto al servidor...');

    this.usuariosService.subirFotoPerfil(this.fotoSeleccionada).subscribe({
      next: (response) => {
        console.log('✅ Respuesta del servidor:', response);
        alert('✅ Foto de perfil actualizada correctamente');
        
        this.subiendoFoto = false;
        this.fotoSeleccionada = null;
        this.previewFoto = null;
        
        const input = document.getElementById('input-foto-perfil') as HTMLInputElement;
        if (input) input.value = '';
        
        // ✅ RECARGAR PERFIL PARA MOSTRAR LA NUEVA FOTO
        console.log('🔄 Recargando perfil...');
        this.cargarPerfil();
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
    
    const input = document.getElementById('input-foto-perfil') as HTMLInputElement;
    if (input) {
      input.value = '';
    }
  }

  eliminarFoto(): void {
    if (!confirm('¿Está seguro que desea eliminar su foto de perfil?')) {
      return;
    }

    alert('⚠️ Funcionalidad en desarrollo');
  }
}
