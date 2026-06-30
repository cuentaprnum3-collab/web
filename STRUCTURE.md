# Estructura Final del Proyecto Web ReadTrack UTS

## 📁 Estructura de Carpetas

```
web/
│
├── src/
│   ├── App.jsx                    ★ Componente principal (1000+ líneas)
│   ├── main.jsx                   ★ Punto de entrada React + AuthProvider
│   ├── config.js                  ★ Configuración: URLs, colores, temas
│   │
│   ├── components/
│   │   └── Common/
│   │       └── Icons.jsx          ★ Componentes de iconos SVG reutilizables
│   │
│   ├── services/
│   │   ├── api.js                 ★ Cliente HTTP genérico con autenticación JWT
│   │   └── index.js               ★ Servicios específicos por módulo:
│   │                                - authService
│   │                                - materiasService
│   │                                - notasService
│   │                                - librosService
│   │                                - sesionesService
│   │                                - metasService
│   │                                - statsService
│   │                                - logrosService
│   │                                - archivosService
│   │
│   ├── hooks/
│   │   └── useAuth.js             ★ Hook de autenticación (useAuth)
│   │
│   ├── context/
│   │   └── AuthContext.jsx        ★ Contexto global de autenticación
│   │                                - user, token, loading, error
│   │                                - login(), register(), logout()
│   │
│   └── styles/
│       └── globals.css            ★ Estilos globales CSS
│
├── index.html                     ★ HTML principal
├── package.json                   ★ Dependencias (React, Vite)
├── vite.config.js                 ★ Configuración de Vite
├── .env.example                   ★ Variables de entorno ejemplo
├── .gitignore                     ★ Archivos ignorados por Git
├── README.md                      ★ Documentación del proyecto
├── MIGRATION.md                   ★ Guía de migración del código antiguo
└── readtrack-uts.jsx.backup       ★ Backup del archivo original
```

## 🔧 Archivos Clave

### `config.js`
- URLs de la API
- Colores del tema
- Constantes de almacenamiento local

### `services/api.js`
- Cliente HTTP singleton
- Manejo automático de tokens JWT
- Métodos: get, post, put, patch, delete, postFormData
- Manejo de errores centralizado

### `services/index.js`
- 9 servicios independientes
- Métodos estructurados por endpoint
- Ejemplo: `authService.login()`, `materiasService.listar()`

### `context/AuthContext.jsx`
- Provider de autenticación global
- Estado: usuario, token, loading, error
- Métodos: login, register, logout, updateProfile
- Persistencia en localStorage

### `hooks/useAuth.js`
- Hook simple para acceder al contexto de autenticación
- Usado en componentes: `const { user, login } = useAuth()`

### `App.jsx` (Principal)
Contiene toda la lógica UI:
- Login/Registro
- Dashboard con estadísticas
- Materias y notas
- Biblioteca de libros
- Metas de lectura
- Perfil de usuario
- Modales para crear/editar elementos

## 🚀 Características Implementadas

### Autenticación ✅
- Login con email/password
- Registro con validaciones
- Verificación de dominio UTS
- Tokens JWT automáticos
- Persistencia en localStorage

### Dashboard ✅
- Estadísticas de materias, notas, libros
- Racha de lectura
- Actividad semanal (gráfico)
- Notas recientes
- Libros en progreso

### Materias ✅
- Listar materias activas
- Ver materia y sus notas
- Crear nueva materia
- Editar materia
- Eliminar materia
- Buscar materias

### Notas ✅
- Crear notas por materia
- Ver todas las notas de una materia
- Adjuntar enlaces
- Adjuntar archivos
- Eliminar notas
- Buscar notas

### Biblioteca ✅
- Listar libros (todos, leyendo, pendientes, terminados)
- Ver detalles del libro
- Crear libro
- Cambiar estado (Leyendo/Terminado/Pendiente)
- Registrar sesión de lectura
- Filtrar y buscar libros

### Metas ✅
- Ver meta actual semanal
- Historial de metas
- Cambiar meta semanal
- Progreso visual

### Perfil ✅
- Ver información del usuario
- Estadísticas globales
- Configuración (recordatorios, modo oscuro)
- Logros e insignias
- Cerrar sesión

## 🔌 Integración API

### Endpoints Utilizados

```
POST   /api/v1/auth/login              - Login
POST   /api/v1/auth/registro           - Registro
GET    /api/v1/auth/perfil             - Obtener perfil
PUT    /api/v1/auth/perfil             - Actualizar perfil
POST   /api/v1/auth/logout             - Logout

GET    /api/v1/materias                - Listar materias
GET    /api/v1/materias/:id            - Detalle materia
POST   /api/v1/materias                - Crear materia
PUT    /api/v1/materias/:id            - Actualizar materia
PATCH  /api/v1/materias/:id/archivar   - Archivar materia
DELETE /api/v1/materias/:id            - Eliminar materia

GET    /api/v1/notas                   - Listar notas
GET    /api/v1/notas/:id               - Detalle nota
POST   /api/v1/notas                   - Crear nota
PUT    /api/v1/notas/:id               - Actualizar nota
DELETE /api/v1/notas/:id               - Eliminar nota

GET    /api/v1/libros                  - Listar libros
GET    /api/v1/libros/:id              - Detalle libro
POST   /api/v1/libros                  - Crear libro
PUT    /api/v1/libros/:id              - Actualizar libro
PATCH  /api/v1/libros/:id/estado       - Cambiar estado
DELETE /api/v1/libros/:id              - Eliminar libro

... (y más para sesiones, metas, stats, logros)
```

## 📦 Dependencias

```json
{
  "dependencies": {
    "react": "^18.3.1",
    "react-dom": "^18.3.1"
  },
  "devDependencies": {
    "@vitejs/plugin-react": "^4.3.0",
    "vite": "^5.4.0"
  }
}
```

## 🎨 Tema y Colores

```js
{
  dark: '#29313c',       // Oscuro
  purple: '#7c2a8e',     // Púrpura (primario)
  lime: '#bed52f',       // Lima (secundario)
  limeDk: '#9ab022',     // Lima oscuro
  white: '#fff',
  g100: '#f6f7f8',       // Gris 100
  g200: '#eef0f2',       // Gris 200
  g300: '#dde0e4',       // Gris 300
  g400: '#b0b6be',       // Gris 400
  tPrimary: '#1a2030',   // Texto primario
  tSecondary: '#5a6372', // Texto secundario
  tHint: '#9ba3ad',      // Texto hint
}
```

## 🚦 Cómo Ejecutar

```bash
# 1. Instalar dependencias
npm install

# 2. Crear .env
cp .env.example .env

# 3. Configurar variables (si es necesario)
# VITE_API_URL=http://localhost:3000/api/v1

# 4. Ejecutar servidor de desarrollo
npm run dev

# 5. Acceder a http://localhost:5173
```

## 📝 Próximas Mejoras

### Corto Plazo
- [ ] Refactorizar App.jsx en componentes más pequeños
- [ ] Agregar validación de formularios mejorada
- [ ] Manejo de errores más robusto

### Mediano Plazo
- [ ] Agregar React Router para navegación avanzada
- [ ] Agregar Redux/Zustand para estado más complejo
- [ ] Testing unitario e integración
- [ ] PWA (Progressive Web App)

### Largo Plazo
- [ ] Offline-first con Service Workers
- [ ] Sincronización automática de datos
- [ ] Optimización de imágenes
- [ ] SEO improvements

## 📚 Documentación Adicional

- `README.md` - Documentación del proyecto
- `MIGRATION.md` - Guía de migración desde el código antiguo
- `.env.example` - Variables de entorno requeridas

## ✨ Características Únicas

1. **Separación Clara**: Servicios, contexto y componentes independientes
2. **Autenticación Centralizada**: Contexto global con persistencia
3. **Cliente HTTP Reutilizable**: `api.js` maneja todas las peticiones
4. **Escalable**: Estructura lista para crecer
5. **Modular**: Fácil agregar nuevas características
6. **Sin Dependencias Externas**: Solo React y Vite

---

**Última actualización:** 2026-05-28
**Versión:** 1.0.0
