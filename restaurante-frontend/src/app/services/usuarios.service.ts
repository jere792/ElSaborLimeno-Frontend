import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseService } from './base.service';

@Injectable({
  providedIn: 'root'
})
export class UsuariosService extends BaseService {
  
  login(credenciales: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/usuarios/login`, credenciales);
  }

  getUsuarios(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/usuarios`);
  }
}
