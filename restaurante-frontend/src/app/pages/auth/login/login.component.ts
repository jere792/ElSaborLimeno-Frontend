// src/app/pages/auth/login/login.component.ts

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  loginForm: FormGroup;
  errorMessage: string = '';
  loading: boolean = false;
  showPassword: boolean = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      this.markFormGroupTouched(this.loginForm);
      return;
    }

    this.loading = true;
    this.errorMessage = '';

    console.log('🔵 Iniciando login...');

    const credentials = {
      email: this.loginForm.value.email,
      password: this.loginForm.value.password
    };

    this.authService.login(credentials.email, credentials.password).subscribe({
      next: (response) => {
        console.log('✅ Login exitoso:', response);
        console.log('🔑 Token guardado:', localStorage.getItem('token'));
        console.log('👤 Usuario:', response.usuario);
        console.log('🎭 Rol ID:', response.usuario.id_rol);
        
        this.loading = false;
        
        // Redirigir según el rol
        const rutaInicio = this.getRutaPorRol(response.usuario.id_rol);
        console.log('🚀 Redirigiendo a:', rutaInicio);
        
        this.router.navigate([rutaInicio]);
      },
      error: (error) => {
        console.error('❌ Error en login:', error);
        this.errorMessage = error.error?.mensaje || 'Credenciales inválidas';
        this.loading = false;
      }
    });
  }

  getRutaPorRol(idRol: number): string {
    const rutas: { [key: number]: string } = {
      1: '/admin/dashboard',      // Admin
      2: '/cajero/dashboard',     // Cajero
      3: '/mozo/dashboard',       // Mozo
      4: '/cocinero/dashboard',   // Cocinero
      5: '/cliente/dashboard',    // Cliente
      6: '/repartidor/dashboard'  // Repartidor
    };
    return rutas[idRol] || '/';
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.keys(formGroup.controls).forEach(key => {
      const control = formGroup.get(key);
      control?.markAsTouched();
    });
  }

  get email() {
    return this.loginForm.get('email');
  }

  get password() {
    return this.loginForm.get('password');
  }
}
