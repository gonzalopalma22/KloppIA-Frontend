# KloppIA — Frontend

Frontend web de **KloppIA**, una plataforma para estudiantes que permite organizar materias, subir PDFs y obtener resúmenes automáticos generados con Gemini AI.

---

## Índice

1. [Requisitos previos](#1-requisitos-previos)
2. [Instalación](#2-instalación)
3. [Configuración](#3-configuración)
4. [Ejecución](#4-ejecución)
5. [Pruebas manuales](#5-pruebas-manuales)
6. [Estructura del proyecto](#6-estructura-del-proyecto)
7. [Rutas de la aplicación](#7-rutas-de-la-aplicación)
8. [Tecnologías](#8-tecnologías)

---

## 1. Requisitos previos

Antes de comenzar, asegúrate de tener instalado:

| Herramienta | Versión mínima | Verificar |
|---|---|---|
| Node.js | 18+ | `node -v` |
| npm | 9+ | `npm -v` |

También necesitas tener el **backend de KloppIA** corriendo. Por defecto se espera en `http://localhost:8080`. Si usas otra URL, ajústala en el archivo `.env` (ver sección 3).

---

## 2. Instalación

```bash
# 1. Clonar el repositorio
git clone <url-del-repo>
cd klopp-frontend

# 2. Instalar dependencias
npm install
```

---

## 3. Configuración

Crea un archivo `.env` en la raíz del proyecto con la URL base del backend:

```env
VITE_API_URL=http://localhost:8080
```

> El prefijo `VITE_` es obligatorio para que Vite exponga la variable al cliente.

---

## 4. Ejecución

### Modo desarrollo

```bash
npm run dev
```

La aplicación queda disponible en `http://localhost:5173` con Hot Module Replacement (HMR) activo.

### Build de producción

```bash
# Generar los archivos optimizados en /dist
npm run build

# Vista previa local del build de producción
npm run preview
```

### Linter

```bash
npm run lint
```

Ejecuta oxlint con las reglas configuradas en `.oxlintrc.json` (hooks de React y exportaciones de componentes).

---

## 5. Pruebas manuales

A continuación se describe cómo verificar cada funcionalidad de la aplicación una vez que el servidor de desarrollo esté corriendo.

### 5.1 Landing page

1. Abrir `http://localhost:5173`.
2. Verificar que se muestran la barra de navegación, la sección hero, las 3 cards de features y el footer.
3. Hacer clic en **"Regístrate gratis"** → debe redirigir a `/registro`.
4. Hacer clic en **"Iniciar sesión"** → debe redirigir a `/login`.

---

### 5.2 Registro de usuario

1. Ir a `http://localhost:5173/registro`.
2. Completar nombre, apellido, email y contraseña.
3. Hacer clic en **"Crear cuenta"**.
   - **Éxito:** redirige a `/login`.
   - **Error:** se muestra el mensaje `"Error al registrarse. Intenta de nuevo."`.

---

### 5.3 Inicio de sesión

1. Ir a `http://localhost:5173/login`.
2. Ingresar las credenciales del usuario recién creado.
3. Hacer clic en **"Iniciar sesión"**.
   - **Usuario normal:** redirige a `/materias`.
   - **Administrador (`ROLE_ADMIN`):** redirige a `/admin`.
   - **Error:** se muestra el mensaje `"Email o contraseña incorrectos."`.

Para verificar la persistencia de sesión, recarga la página — el usuario debe seguir autenticado.

---

### 5.4 Materias

> Requiere sesión iniciada. Acceder en `http://localhost:5173/materias`.

| Acción | Pasos | Resultado esperado |
|---|---|---|
| Crear materia | Completar nombre (y descripción opcional) → **+ Agregar** | La materia aparece en la grilla |
| Editar materia | Menú `⋮` → **Editar** → modificar → **Guardar cambios** | El nombre/descripción se actualiza |
| Eliminar materia | Menú `⋮` → **Eliminar** → confirmar en el diálogo | La materia desaparece de la grilla |
| Navegar a apuntes | Hacer clic en la card de una materia | Redirige a `/materias/:id/apuntes` |
| Cerrar sesión | Menú de usuario (esquina superior derecha) → **Cerrar sesión** | Redirige a `/` |

---

### 5.5 Apuntes y resúmenes IA

> Acceder desde una materia o directamente en `http://localhost:5173/materias/:id/apuntes`.

| Acción | Pasos | Resultado esperado |
|---|---|---|
| Subir apunte | Ingresar título → seleccionar un PDF → **Subir** | Se muestra la animación de carga; al terminar el apunte aparece en la lista |
| Ver resumen | Botón **"Ver resumen"** en la card del apunte | Se despliega el resumen generado por Gemini AI |
| Cambiar modo lectura | Botón **"☀️ Modo claro"** / **"🌙 Modo oscuro"** dentro del resumen | El fondo del resumen cambia de oscuro a claro y viceversa |
| Ocultar resumen | Botón **"Ocultar resumen"** | El resumen se colapsa |
| Editar título | Menú `⋮` → **Editar título** → **Guardar cambios** | El título se actualiza |
| Eliminar apunte | Menú `⋮` → **Eliminar** → confirmar | El apunte desaparece de la lista |
| Volver a materias | Botón **"← Volver a materias"** | Redirige a `/materias` |

---

### 5.6 Panel de administración

> Solo accesible con un usuario de rol `ROLE_ADMIN`. Ruta: `http://localhost:5173/admin`.
> Un usuario normal que intente acceder será redirigido a `/`.

| Acción | Pasos | Resultado esperado |
|---|---|---|
| Ver usuarios | Cargar la página | Tabla con todos los usuarios registrados |
| Editar usuario | Botón **"Editar"** → modificar campos o rol → **Guardar cambios** | La tabla se actualiza |
| Eliminar usuario | Botón **"Eliminar"** → confirmar | El usuario desaparece de la tabla |

---

### 5.7 Protección de rutas

| Escenario | Resultado esperado |
|---|---|
| Usuario no autenticado accede a `/materias` | Redirige a `/login` |
| Usuario no autenticado accede a `/admin` | Redirige a `/login` |
| Usuario normal (`ROLE_USER`) accede a `/admin` | Redirige a `/` |
| Ruta inexistente (ej. `/xyz`) | Redirige a `/` |

---

## 6. Estructura del proyecto

```
klopp-frontend/
├── public/
│   ├── favicon.svg
│   └── icons.svg
├── src/
│   ├── assets/               # Imágenes estáticas
│   ├── context/
│   │   └── AuthContext.jsx   # Estado global de sesión (user, login, logout)
│   ├── pages/
│   │   ├── Landing.jsx / Landing.module.css
│   │   ├── Login.jsx / Login.module.css
│   │   ├── Register.jsx / Register.module.css
│   │   ├── Materias.jsx / Materias.module.css
│   │   ├── Apuntes.jsx / Apuntes.module.css
│   │   └── AdminPanel.jsx / AdminPanel.module.css
│   ├── services/
│   │   └── api.js            # Axios con base URL e interceptor JWT
│   ├── App.jsx               # Router con rutas públicas, privadas y de admin
│   ├── main.jsx              # Punto de entrada — monta BrowserRouter + AuthProvider
│   ├── App.css
│   └── index.css             # Estilos globales y variables CSS
├── index.html
├── vite.config.js
├── .oxlintrc.json
├── .env                      # Variables de entorno (no subir al repo)
└── package.json
```

---

## 7. Rutas de la aplicación

| Ruta | Componente | Acceso |
|---|---|---|
| `/` | `Landing` | Público |
| `/login` | `Login` | Público |
| `/registro` | `Register` | Público |
| `/materias` | `Materias` | Autenticado |
| `/materias/:id/apuntes` | `Apuntes` | Autenticado |
| `/admin` | `AdminPanel` | Solo `ROLE_ADMIN` |
| `*` | — | Redirige a `/` |

---

## 8. Tecnologías

| Herramienta | Versión | Uso |
|---|---|---|
| React | 19 | UI y gestión de estado local |
| React Router DOM | 7 | Navegación SPA y rutas protegidas |
| Axios | 1 | Cliente HTTP con interceptor JWT |
| Vite | 8 | Bundler y servidor de desarrollo |
| CSS Modules | — | Estilos encapsulados por componente |
| oxlint | 1 | Linter de JavaScript/JSX |

## 📄 Licencia

© 2026 [gonzaloPalma22](https://github.com/gonzaloPalma22). Todos los derechos reservados.