# El Sabor Limeño – Frontend (Angular 19)

Este proyecto corresponde al frontend del sistema web del restaurante **El Sabor Limeño**, desarrollado con **Angular 19**, **TypeScript** y **Node.js**.  
Aquí encontrarás toda la configuración, comandos y pasos necesarios para trabajar correctamente con el proyecto.

---

## 📌 Requisitos previos

Antes de iniciar, asegúrate de tener instalado:

### ➡️ Node.js (versión recomendada)

- **Node.js 22.17.1 LTS**

Verifica tu versión:

node -v

text

### ➡️ Angular CLI (versión 19)

Instalar globalmente:

npm install -g @angular/cli@19

text

Verificar versión:

ng version

text

---

## 🚀 Cómo iniciar el proyecto

1. **Clonar el repositorio**

git clone https://github.com/tuusuario/ElSaborLimeno-frontend.git

text

2. **Entrar en la carpeta del proyecto**

cd ElSaborLimeno-frontend

text

3. **Instalar dependencias**

npm install

text

4. **Levantar el servidor de desarrollo**

ng serve -o

text

El proyecto se abrirá automáticamente en:  
👉 [http://localhost:4200/](http://localhost:4200/)

---

## 📁 Estructura del proyecto (Angular)

ElSaborLimeno-frontend/
│── src/
│ ├── app/
│ │ ├── components/
│ │ ├── pages/
│ │ ├── services/
│ │ ├── models/
│ │ ├── guards/
│ │ └── app.module.ts
│ ├── assets/
│ ├── environments/
│ └── index.html
│
├── angular.json
├── package.json
├── tsconfig.json
└── README.md

text

---

## 🧩 Tecnologías utilizadas

- Angular 19
- TypeScript
- RxJS
- HTML5 / CSS3 / SCSS
- Angular Material (opcional)
- API REST (conexión al backend)

---

## 🔗 Conexión con el backend

El frontend se conecta al backend mediante servicios HTTP.  
La URL base se gestiona en:

`src/environments/environment.ts`

export const environment = {
apiUrl: 'http://localhost:8080/api'
};

text

---

## 🛠️ Comandos importantes

### ✔️ Construir la app para producción

ng build

text

### ✔️ Analizar el proyecto y auditoría

ng lint

text

### ✔️ Instalar una nueva dependencia

npm install nombre-paquete

text

---

## 🍽️ Descripción del proyecto – El Sabor Limeño

**El Sabor Limeño** es un restaurante especializado en gastronomía peruana.

El sistema frontend permite:

- Gestión de pedidos
- Visualización del menú digital
- Administración de platos
- Gestión de mesas
- Registro de clientes y reservas
- Panel administrativo para el personal

---

## 👨‍💻 Autores

Proyecto desarrollado para **El Sabor Limeño**.  
Frontend implementado con **Angular 19**.

**Equipo de desarrollo / estudiantes:**

- Jeremy Anton
- Breider Catashunga
