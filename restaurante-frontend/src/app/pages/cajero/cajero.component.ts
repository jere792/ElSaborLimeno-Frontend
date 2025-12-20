// src/app/pages/cajero/cajero.component.ts

import { Component } from '@angular/core';

import { RouterOutlet } from '@angular/router';
import { SidebarComponent } from '../../layout/sidebar/sidebar.component';

@Component({
  selector: 'app-cajero',
  standalone: true,
  imports: [
    RouterOutlet,
    SidebarComponent
],
  templateUrl: './cajero.component.html',
  styleUrls: ['./cajero.component.scss']
})
export class CajeroComponent {}
