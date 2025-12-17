import { Component } from '@angular/core';
import { GestionUsuariosComponent } from '../gestion-usuarios.component';

@Component({
  selector: 'app-gestion-admin',
  standalone: true,
  imports: [GestionUsuariosComponent],
  template: '<app-gestion-usuarios [tipoRol]="\'admin\'"></app-gestion-usuarios>',
  styles: []
})
export class GestionAdminComponent {}
