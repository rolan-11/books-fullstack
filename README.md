# BooksApp — Catálogo de Libros Full-Stack

Aplicación web full-stack para gestionar un catálogo de libros con autenticación (correo/contraseña y GitHub OAuth) y control de acceso basado en roles (`user` y `admin`).

## Tecnologías utilizadas

### Backend
- **Node.js + Express + TypeScript**
- **MongoDB Atlas + Mongoose** (persistencia de datos)
- **Better Auth** (autenticación, sesiones por cookies y OAuth con GitHub)
- **Zod** (validación de esquemas y requests)

### Frontend
- **React + TypeScript + Vite**
- **React Router DOM** (rutas públicas, privadas y protegidas por rol)
- **Better Auth Client** (`better-auth/react`)

## Estructura del proyecto

```text
books-fullstack/
├── backend/    # API REST, modelos, middlewares de auth/roles y Better Auth
└── frontend/   # Interfaz web en React + Vite con proxy hacia la API
```

## Control de acceso y rutas

| Nivel de acceso | Frontend | Backend (API) |
| :--- | :--- | :--- |
| **Público** | `/`, `/login`, `/register` | `GET /api/books`, `GET /api/books/:id`, `GET /api/health` |
| **Privado (sesión iniciada)** | `/books/new`, `/books/:id/edit` | `GET /api/me`, `POST /api/books`, `PUT /api/books/:id` |
| **Solo Administrador (`admin`)** | `/admin` (Panel Admin) y botón Eliminar | `DELETE /api/books/:id` |

## Variables de entorno

Creá un archivo `.env` dentro de la carpeta `backend/` con la siguiente configuración:

```env
PORT=3000
MONGODB_URI=tu_uri_de_mongodb_atlas
BETTER_AUTH_SECRET=tu_clave_secreta_larga
BETTER_AUTH_URL=http://localhost:5173
GITHUB_CLIENT_ID=tu_github_client_id
GITHUB_CLIENT_SECRET=tu_github_client_secret
```

> Para GitHub OAuth, configurá en tu OAuth App de GitHub la **Homepage URL** como `http://localhost:5173` y la **Redirect URI** como `http://localhost:5173/api/auth/callback/github`.

## Instalación y ejecución local

El proyecto requiere correr backend y frontend en **dos terminales en paralelo**.

### 1. Backend
```bash
cd backend
npm install
npm run dev
```
El servidor queda escuchando en `http://localhost:3000`.

### 2. Frontend
```bash
cd frontend
npm install
npm run dev
```
La aplicación web queda disponible en `http://localhost:5173` (con proxy automático hacia `/api` en el puerto `3000`).

## Asignar rol de Administrador

Por defecto, cada usuario nuevo se registra con rol `user`. Para habilitar el rol `admin`:

1. Ingresá a **MongoDB Atlas → Data Explorer**.
2. Abrí la colección **`user`** dentro de tu base de datos.
3. Editá el documento del usuario y cambiá el campo `"role"` de `"user"` a `"admin"`.
4. Recargá la aplicación (o cerrá sesión y volvé a entrar) para ver el **Panel Admin** y la opción de eliminar libros.