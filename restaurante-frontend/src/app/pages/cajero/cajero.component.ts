// src/app/pages/cajero/cajero.component.ts

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { SidebarComponent } from '../../layout/sidebar/sidebar.component';

@Component({
  selector: 'app-cajero',
  standalone: true,
  imports: [
    CommonModule, 
    RouterOutlet, 
    SidebarComponent // ✅ AGREGADO
  ],
  templateUrl: './cajero.component.html',
  styleUrls: ['./cajero.component.scss']
})
export class CajeroComponent {}
