// src/app/pages/cliente/cliente.component.ts

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { SidebarComponent } from '../../layout/sidebar/sidebar.component'; // ✅ AGREGADO

@Component({
  selector: 'app-cliente',
  standalone: true,
  imports: [
    CommonModule, 
    RouterOutlet, 
    SidebarComponent // ✅ AGREGADO
  ],
  templateUrl: './cliente.component.html',
  styleUrls: ['./cliente.component.scss']
})
export class ClienteComponent {}
