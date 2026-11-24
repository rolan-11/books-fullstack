# Books Fullstack — Gestión de Biblioteca

Aplicación web full-stack para la gestión de un catálogo de libros con autenticación mediante Better Auth (Email/Password y GitHub OAuth), control de acceso basado en roles (`admin` / `user`), validación de formularios con React Hook Form + Zod y despliegue en producción en Render.

## Entidad Elegida: `Book` (Libros)

La aplicación administra una colección de **libros** almacenada en MongoDB Atlas. Cada registro almacena los datos principales del libro combinando distintos tipos de datos (texto, número, booleano/fecha), validados con Zod tanto en el backend como en el frontend.

## Enlaces de Producción

* **Frontend (Static Site):** https://books-frontend-ib7q.onrender.com
* **Backend (Web Service):** https://books-backend-k4cf.onrender.com (endpoint de prueba: `https://books-backend-k4cf.onrender.com/api/books`)
* **Repositorio:** https://github.com/rolan-11/books-fullstack

> **Nota:** El backend corre en el plan gratuito de Render, por lo que la primera solicitud tras un período de inactividad puede demorar alrededor de 50 segundos mientras el servicio se reactiva.

## Stack Tecnológico

* **Frontend:** React, TypeScript, Vite, React Router, React Hook Form, Zod.
* **Backend:** Node.js, Express 5, TypeScript, Mongoose, Zod.
* **Base de datos:** MongoDB Atlas.
* **Autenticación:** Better Auth (Email/Password + GitHub OAuth).
* **Despliegue:** Render (Web Service para el backend y Static Site con rewrites `/api/*` y `/*` para el frontend).

## Endpoints de la API

| Método | Ruta | Rol requerido | Descripción |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/books` | Público | Lista todos los libros del catálogo |
| `GET` | `/api/books/:id` | Público | Obtiene el detalle de un libro por su ID |
| `POST` | `/api/books` | `admin` | Crea un nuevo libro (validación con Zod) |
| `PUT` | `/api/books/:id` | `admin` | Actualiza un libro existente |
| `DELETE` | `/api/books/:id` | `admin` | Elimina un libro del catálogo |
| `ALL` | `/api/auth/*` | Público / Autenticado | Endpoints de Better Auth (registro, login email/GitHub, sesión y logout) |

## Rutas del Frontend

| Ruta | Acceso | Descripción |
| :--- | :--- | :--- |
| `/` | Público | Listado de libros del catálogo |
| `/books/:id` | Público | Vista de detalle de un libro |
| `/login` | Público | Inicio de sesión (Email/Password y GitHub OAuth) |
| `/register` | Público | Registro de nuevos usuarios (rol `user` por defecto) |
| `/books/new` | Solo `admin` | Formulario para crear un libro |
| `/books/:id/edit` | Solo `admin` | Formulario para editar un libro existente |
| `/admin` | Solo `admin` | Panel de administración (ABM de libros) |

## Usuarios de Prueba

| Rol | Email | Contraseña |
| :--- | :--- | :--- |
| `admin` | `admin@books.com` | `Admin1234` |
| `user` | `user@books.com` | `User1234` |

*(También se puede iniciar sesión con cualquier cuenta de GitHub desde el botón **Continuar con GitHub**).*

## Variables de Entorno (`backend/.env`)

Tomar como plantilla el archivo `backend/.env.example`:

```env
PORT=3000
NODE_ENV=development
MONGODB_URI=mongodb+srv://<usuario>:<password>@cluster0.xxxxx.mongodb.net/booksdb?appName=Cluster0
BETTER_AUTH_URL=http://localhost:5173
BETTER_AUTH_SECRET=reemplazar_por_una_clave_secreta_de_al_menos_32_caracteres
GITHUB_CLIENT_ID=tu_github_client_id
GITHUB_CLIENT_SECRET=tu_github_client_secret
```

## Ejecución Local

1. **Clonar el repositorio:**
   ```bash
   git clone https://github.com/rolan-11/books-fullstack.git
   cd books-fullstack
   ```

2. **Configurar variables de entorno:** copiar `backend/.env.example` a `backend/.env` y completar los valores.

3. **Levantar el Backend:**
   ```bash
   cd backend
   npm install
   npm run dev
   ```

4. **Levantar el Frontend (en otra terminal):**
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

La aplicación quedará disponible en `http://localhost:5173`.