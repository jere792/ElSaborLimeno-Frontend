El Sabor Limeño – Frontend (Angular 19)

Este proyecto corresponde al frontend del sistema web del restaurante El Sabor Limeño, desarrollado con Angular 19, TypeScript y Node.js.
Aquí encontrarás toda la configuración, comandos y pasos necesarios para trabajar correctamente con el proyecto.

📌 Requisitos previos

Antes de iniciar, asegúrate de tener instalado:

1. Node.js (versión recomendada)

Node.js 20.x LTS
Para verificar tu versión:

node -v

2. Angular CLI (versión 19)

Instalar globalmente:

npm install -g @angular/cli@19


Verificar versión:

ng version

🚀 Cómo iniciar el proyecto
1. Clonar el repositorio
git clone https://github.com/tuusuario/ElSaborLimeno-frontend.git

2. Entrar en la carpeta del proyecto
cd ElSaborLimeno-frontend

3. Instalar dependencias
npm install

4. Levantar el servidor de desarrollo
ng serve -o


Esto abrirá automáticamente el navegador en:

http://localhost:4200/

📁 Estructura del proyecto (Angular)
ElSaborLimeno-frontend/
│── src/
│   ├── app/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── models/
│   │   ├── guards/
│   │   └── app.module.ts
│   ├── assets/
│   ├── environments/
│   └── index.html
│
├── angular.json
├── package.json
├── tsconfig.json
└── README.md

🧩 Tecnologías utilizadas

Angular 19

TypeScript

RxJS

HTML5 / CSS3 / SCSS

Angular Material (opcional)

API REST (conexión al backend)

🔗 Conexión con el backend

El frontend se conecta al backend mediante servicios HTTP.
La URL base se gestiona en:

src/environments/environment.ts


Ejemplo:

export const environment = {
  apiUrl: 'http://localhost:8080/api'
};

🛠️ Comandos importantes
Construir la app para producción
ng build

Analizar el proyecto y auditoría
ng lint

Instalar una nueva dependencia
npm install nombre-paquete

🍽️ Descripción del proyecto – El Sabor Limeño

El Sabor Limeño es un restaurante especializado en gastronomía peruana.
El sistema frontend permite:

Gestión de pedidos

Visualización del menú digital

Administración de platos

Gestión de mesas

Registro de clientes y reservas

Panel administrativo para el personal

👨‍💻 Autores

Proyecto desarrollado para El Sabor Limeño

Frontend implementado con Angular 19

Equipo de desarrollo / estudiante: Jeremy Anton, Breider Catashunga
