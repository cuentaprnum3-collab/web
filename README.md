# ReadTrack UTS - Frontend Web

Aplicación web moderna para gestionar tu hábito lector, materias y seguimiento de lectura.

## Estructura del Proyecto

```
web/
├── src/
│   ├── components/
│   │   ├── Common/
│   │   │   └── Icons.jsx          # Iconos reutilizables
│   │   ├── Layout/                # Componentes de layout
│   │   ├── Auth/                  # Componentes de autenticación
│   │   └── Modals/                # Componentes modales
│   ├── pages/                     # Páginas de la aplicación
│   ├── services/
│   │   ├── api.js                 # Cliente HTTP genérico
│   │   └── index.js               # Servicios por módulo
│   ├── hooks/
│   │   └── useAuth.js             # Hook de autenticación
│   ├── context/
│   │   └── AuthContext.jsx        # Contexto de autenticación
│   ├── styles/
│   │   └── globals.css            # Estilos globales
│   ├── config.js                  # Configuración centralizada
│   ├── App.jsx                    # Componente principal
│   └── main.jsx                   # Punto de entrada
├── index.html
├── vite.config.js
├── package.json
└── .env.example
```

## Requisitos

- Node.js 16+
- npm o yarn

## Instalación

1. **Clonar repositorio y navegar al directorio web:**
   ```bash
   cd web
   ```

2. **Instalar dependencias:**
   ```bash
   npm install
   ```

3. **Crear archivo .env:**
   ```bash
   cp .env.example .env
   ```

4. **Configurar variables de entorno:**
   ```env
   VITE_API_URL=http://localhost:3000/api/v1
   VITE_FRONTEND_URL=http://localhost:5173
   ```

## Desarrollo

```bash
npm run dev
```

La aplicación se abrirá en `http://localhost:5173`

## Build para Producción

```bash
npm run build
```

## Características Principales

- **Autenticación**: Login y registro con correo institucional UTS
- **Dashboard**: Vista general de materias, libros y estadísticas
- **Gestión de Materias**: Crear, editar y organizar materias
- **Notas**: Crear y organizar notas por materia
- **Biblioteca**: Seguimiento de libros y sesiones de lectura
- **Metas**: Establecer y seguir metas de lectura semanal
- **Perfil**: Gestión de perfil y configuraciones
- **Rachas**: Seguimiento de rachas de lectura consecutivas
- **Logros**: Sistema de insignias y reconocimientos

## Arquitectura

### Servicios (services/)
- `api.js`: Cliente HTTP reutilizable con autenticación
- Servicios específicos por módulo (auth, materias, notas, libros, etc.)

### Contexto (context/)
- `AuthContext`: Maneja la sesión del usuario y autenticación

### Componentes (components/)
- Componentes reutilizables organizados por funcionalidad
- Iconos centralizados en `Common/Icons.jsx`

### Configuración
- `config.js`: Configuración centralizada (API URLs, colores, temas)

## API Endpoints

La aplicación se conecta con los siguientes endpoints:

- `/api/v1/auth` - Autenticación
- `/api/v1/materias` - Gestión de materias
- `/api/v1/notas` - Gestión de notas
- `/api/v1/libros` - Gestión de libros
- `/api/v1/sesiones` - Sesiones de lectura
- `/api/v1/metas` - Metas de lectura
- `/api/v1/stats` - Estadísticas
- `/api/v1/logros` - Sistema de logros

## Estilos

Los estilos están centralizados en `src/styles/globals.css` y en la configuración de temas en `config.js`.

Colores principales:
- Primario: #7c2a8e (Púrpura)
- Secundario: #bed52f (Lima)
- Neutro: #29313c (Oscuro)

## Ambiente de Desarrollo

Variables de entorno recomendadas para desarrollo:

```env
VITE_API_URL=http://localhost:3000/api/v1
VITE_FRONTEND_URL=http://localhost:5173
```

## Notas Importantes

1. **Token de Autenticación**: Se almacena en localStorage bajo la clave `readtrack_token`
2. **Datos del Usuario**: Se almacenan en localStorage bajo la clave `readtrack_user`
3. **CORS**: La API debe permitir CORS desde `http://localhost:5173`
4. **Headers**: Las peticiones incluyen `Authorization: Bearer {token}` automáticamente

## Próximos Pasos

- [ ] Integración de componentes modulares
- [ ] Refactorizar App.jsx en componentes más pequeños
- [ ] Agregar manejo de errores mejorado
- [ ] Implementar lazy loading de componentes
- [ ] Agregar pruebas unitarias
- [ ] Configurar CI/CD

## Contribuir

Para contribuir al proyecto, por favor:
1. Crear una rama feature
2. Hacer commit de los cambios
3. Crear un pull request

## Licencia

MIT
