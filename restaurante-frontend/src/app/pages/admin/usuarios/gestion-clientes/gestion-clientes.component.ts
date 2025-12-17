import { Component } from '@angular/core';
import { GestionUsuariosComponent } from '../gestion-usuarios.component';

@Component({
  selector: 'app-gestion-clientes',
  standalone: true,
  imports: [GestionUsuariosComponent],
  template: '<app-gestion-usuarios [tipoRol]="\'cliente\'"></app-gestion-usuarios>',
  styles: []
})
export class GestionClientesComponent {}
