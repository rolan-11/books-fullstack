# Books Fullstack — Gestión de Biblioteca

Aplicación web full-stack para la gestión de un catálogo de libros con autenticación mediante Better Auth (Email/Password y GitHub OAuth), control de acceso por roles (`admin` / `user`), validación de formularios con React Hook Form + Zod y despliegue en producción en Render.

## Enlaces de Producción

* **Frontend (Static Site):** https://books-frontend-ib7q.onrender.com
* **Backend (Web Service):** https://books-backend-k4cf.onrender.com
* **Repositorio:** https://github.com/rolan-11/books-fullstack

> **Nota:** El backend corre en el plan gratuito de Render, por lo que la primera solicitud tras un período de inactividad puede demorar alrededor de 50 segundos mientras el servicio se reactiva.

## Stack Tecnológico

* **Frontend:** React, TypeScript, Vite, React Router, React Hook Form, Zod.
* **Backend:** Node.js, Express 5, TypeScript, Mongoose, Zod.
* **Base de datos:** MongoDB Atlas.
* **Autenticación:** Better Auth (Email/Password + GitHub OAuth).
* **Despliegue:** Render (Web Service para el backend y Static Site con rewrites `/api/*` y `/*` para el frontend).

## Rutas y Permisos

| Ruta | Acceso | Descripción |
| :--- | :--- | :--- |
| `/` | Público | Listado y búsqueda de libros del catálogo |
| `/books/:id` | Público | Vista de detalle de un libro |
| `/login` | Público | Inicio de sesión (Email/Password y GitHub OAuth) |
| `/register` | Público | Registro de nuevos usuarios |
| `/books/new` | Solo `admin` | Formulario para crear un libro |
| `/books/:id/edit` | Solo `admin` | Formulario para editar un libro existente |
| `/admin` | Solo `admin` | Panel de administración |

## Usuarios de Prueba

| Rol | Email | Contraseña |
| :--- | :--- | :--- |
| **Administrador** (`admin`) | `admin@books.com` | `Admin1234` |
| **Usuario estándar** (`user`) | `user@books.com` | `User1234` |

*(También se puede iniciar sesión directamente con cualquier cuenta de GitHub desde el botón **Continuar con GitHub**).*

## Variables de Entorno (`backend/.env`)

```env
MONGODB_URI=tu_uri_de_mongodb_atlas
BETTER_AUTH_SECRET=tu_clave_secreta
BETTER_AUTH_URL=http://localhost:5173
GITHUB_CLIENT_ID=tu_github_client_id
GITHUB_CLIENT_SECRET=tu_github_client_secret
NODE_ENV=development
```

## Ejecución Local

1. **Clonar el repositorio:**
   ```bash
   git clone [https://github.com/rolan-11/books-fullstack.git](https://github.com/rolan-11/books-fullstack.git)
   cd books-fullstack
   ```

2. **Levantar el Backend:**
   ```bash
   cd backend
   npm install
   npm run dev
   ```

3. **Levantar el Frontend (en otra terminal):**
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

La aplicación quedará disponible en `http://localhost:5173`.