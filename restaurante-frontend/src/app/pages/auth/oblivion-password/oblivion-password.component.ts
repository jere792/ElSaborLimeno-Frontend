// src/app/features/auth/oblivion-password/oblivion-password.component.ts

import { Component } from '@angular/core';

import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-oblivion-password',
  standalone: true,
  imports: [RouterModule],
  template: `
    <div class="container">
      <h1>Recuperar Contraseña</h1>
      <p>Esta funcionalidad estará disponible próximamente.</p>
      <a routerLink="/login" class="btn-primary">Volver al Login</a>
    </div>
  `,
  styles: [`
    .container {
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      text-align: center;
      padding: 20px;
    }
    .btn-primary {
      margin-top: 20px;
      padding: 12px 24px;
      background: #667eea;
      color: white;
      text-decoration: none;
      border-radius: 5px;
    }
  `]
})
export class OblivionPasswordComponent {}
