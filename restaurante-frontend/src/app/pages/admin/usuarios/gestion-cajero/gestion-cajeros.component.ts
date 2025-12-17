import { Component } from '@angular/core';
import { GestionUsuariosComponent } from '../gestion-usuarios.component';

@Component({
  selector: 'app-gestion-cajeros',
  standalone: true,
  imports: [GestionUsuariosComponent],
  template: '<app-gestion-usuarios [tipoRol]="\'cajero\'"></app-gestion-usuarios>',
  styles: []
})
export class GestionCajerosComponent {}
