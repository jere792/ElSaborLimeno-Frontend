import { Component, OnInit } from '@angular/core';
import { ApiService } from './services/api.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  title = 'El Sabor Limeño';
  backendStatus = '';
  backendMessage = '';

  constructor(private apiService: ApiService) {}

  ngOnInit() {
    this.testBackendConnection();
  }

  testBackendConnection() {
    this.apiService.checkHealth().subscribe({
      next: (response) => {
        console.log('✅ Conexión exitosa con el backend:', response);
        this.backendStatus = response.status;
        this.backendMessage = response.message;
      },
      error: (error) => {
        console.error('❌ Error al conectar con el backend:', error);
        this.backendStatus = 'ERROR';
        this.backendMessage = 'No se pudo conectar con el backend';
      }
    });
  }
}
