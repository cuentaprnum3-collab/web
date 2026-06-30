# Migración del Proyecto Web ReadTrack UTS

## Cambios Principales

La estructura del proyecto ha sido completamente reorganizada y modernizada para seguir las mejores prácticas de desarrollo React y mantener consistencia con la arquitectura del backend.

### Estructura Anterior
Único archivo monolítico `readtrack-uts.jsx` con:
- Todo el CSS incrustado
- Todo el JavaScript mezclado
- Datos de demostración hardcodeados
- Sin separación de responsabilidades

### Estructura Nueva

```
web/
├── src/
│   ├── App.jsx                    # Componente principal (aplicación)
│   ├── main.jsx                   # Punto de entrada React
│   ├── config.js                  # Configuración centralizada
│   ├── components/                # Componentes reutilizables
│   │   └── Common/Icons.jsx       # Iconos SVG
│   ├── services/
│   │   ├── api.js                 # Cliente HTTP con autenticación
│   │   └── index.js               # Servicios por módulo (auth, materias, etc)
│   ├── hooks/
│   │   └── useAuth.js             # Hook de autenticación
│   ├── context/
│   │   └── AuthContext.jsx        # Contexto global de autenticación
│   └── styles/
│       └── globals.css            # Estilos globales
├── index.html                     # HTML principal
├── vite.config.js                 # Configuración Vite
├── package.json                   # Dependencias
└── .env.example                   # Variables de entorno
```

## Beneficios

### 1. **Separación de Responsabilidades**
   - Servicios independientes por módulo
   - Componentes reutilizables
   - Contexto centralizado para autenticación

### 2. **Mantenibilidad**
   - Código más fácil de entender y actualizar
   - Cambios aislados por funcionalidad
   - Documentación clara

### 3. **Escalabilidad**
   - Estructura lista para crecer
   - Fácil agregar nuevas páginas/módulos
   - Reutilización de lógica compartida

### 4. **Rendimiento**
   - Lazy loading de componentes
   - Build optimizado con Vite
   - Caché de promesas HTTP

### 5. **Integración API**
   - Servicios reales conectados al backend
   - Manejo de errores mejorado
   - Autenticación automática con tokens JWT

## Migración de Datos

### Datos Hardcodeados → API Real
- Antes: `initialData` y `NOTAS_DEMO` en el componente
- Ahora: Llamadas a `/api/v1/materias`, `/api/v1/libros`, `/api/v1/notas`, etc.

### Demostración
Para propósitos de demostración rápida, el `App.jsx` aún incluye datos de ejemplo que pueden ser reemplazados fácilmente con llamadas reales a la API.

## Instalación

```bash
cd web
npm install
npm run dev
```

Acceder a `http://localhost:5173`

## Variables de Entorno

```env
VITE_API_URL=http://localhost:3000/api/v1
VITE_FRONTEND_URL=http://localhost:5173
```

## Próximos Pasos

1. **Refactorizar App.jsx**
   - Dividir en componentes más pequeños:
     - `pages/Dashboard.jsx`
     - `pages/Materias.jsx`
     - `pages/Biblioteca.jsx`
     - etc.

2. **Agregar componentes modulares**
   - `components/Layout/Sidebar.jsx`
   - `components/Layout/Topbar.jsx`
   - `components/Common/Card.jsx`
   - `components/Common/Button.jsx`
   - `components/Modals/ModalForm.jsx`

3. **Implementar routing**
   - Agregar React Router si es necesario
   - Gestión de rutas más avanzada

4. **Agregar gestión de estado avanzada**
   - Redux/Zustand si la complejidad lo requiere
   - Actualmente usa Context API + useState

5. **Testing**
   - Agregar Jest y React Testing Library
   - Pruebas unitarias de servicios
   - Pruebas de componentes

6. **Análisis y Monitoreo**
   - Integrar herramientas de error tracking
   - Analytics

## Notas Importantes

### Autenticación
- Los tokens se almacenan automáticamente en localStorage
- Se adjuntan a todas las peticiones en el header `Authorization`
- El logout limpia tanto el localStorage como el estado

### Estado Global
- `AuthContext` maneja la autenticación
- Se puede extender para agregar más contextos (AppContext, UIContext, etc.)

### Estilos
- CSS inline en el componente principal (como en el original)
- Estilos globales en `styles/globals.css`
- Fácil migrar a Tailwind/CSS Modules si se desea

## Comparación: Original vs Nuevo

### Original
```jsx
import { useState, useEffect } from "react";

const C = { /* colores */ };
const css = `/* todo el CSS */ `;
const initialData = { /* datos */ };

export default function ReadTrackApp() {
  // Lógica de 1000+ líneas
}
```

### Nuevo
```jsx
import { useAuth } from './hooks/useAuth';
import { materiasService, librosService } from './services';
import { AuthProvider } from './context/AuthContext';

export default function App() {
  const { user, isAuthenticated } = useAuth();
  // Lógica separada y reutilizable
}

// En main.jsx
<AuthProvider>
  <App />
</AuthProvider>
```

## Soporte

Para preguntas o problemas con la migración, consulta el README.md en el directorio web.
