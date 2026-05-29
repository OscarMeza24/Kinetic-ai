# Kinetic AI Studio

**Plataforma inteligente de automatización de YouTube Shorts y contenido vertical con IA**

MVP mobile-first desarrollado en Expo/React Native que revoluciona la creación y publicación de contenido corto mediante integración con inteligencia artificial, permitiendo a creadores automatizar procesos complejos de generación, edición y programación de contenido.

---

## 📋 Tabla de Contenidos

- [Descripción](#descripción)
- [Características Principales](#características-principales)
- [Requisitos Previos](#requisitos-previos)
- [Instalación](#instalación)
- [Uso](#uso)
- [Estructura del Proyecto](#estructura-del-proyecto)
- [Arquitectura](#arquitectura)
- [Configuración](#configuración)
- [Guía de Desarrollo](#guía-de-desarrollo)
- [Roadmap](#roadmap)
- [Tecnologías](#tecnologías)
- [Licencia](#licencia)

---

## 🎯 Descripción

**Kinetic AI Studio** es una solución integral para creadores de contenido que automatiza el flujo completo de producción de YouTube Shorts y videos verticales. La plataforma integra:

- Generación automática de guiones con IA
- Síntesis de voz natural en múltiples idiomas
- Búsqueda y descarga de assets visuales
- Edición no-lineal intuitiva
- Generación automática de metadatos (hashtags, títulos, descripciones)
- Programación inteligente de publicaciones
- Análisis avanzado de rendimiento

La plataforma está diseñada para ser **escalable**, **modular** y **lista para producción**, permitiendo integración inmediata con servicios externos como OpenAI, ElevenLabs y YouTube.

---

## ✨ Características Principales

### Interfaz de Usuario
- ✅ **Navegación Mobile-First** con barra inferior persistente e intuitiva
- ✅ **Tema Oscuro Kinetic AI** con diseño glassmorphism, paleta de colores (violeta, cyan, rojo)
- ✅ **Responsive Design** optimizado para tablets y dispositivos móviles
- ✅ **Componentes Reutilizables** construidos con React Native

### Funcionalidades Principales

#### 1. **Dashboard Inteligente**
   - Vista general de proyectos activos
   - Estadísticas de rendimiento en tiempo real
   - Accesos rápidos a funciones principales
   - Widget de trending topics

#### 2. **IA Studio**
   - Generación automática de guiones basada en prompts
   - Generación de múltiples variantes de contenido
   - Análisis de tendencias de YouTube
   - Recomendaciones de temas por nicho

#### 3. **Editor Visual**
   - Timeline interactivo para edición de clips
   - Importación de escenas y assets
   - Ajustes de transiciones y efectos
   - Sincronización de audio y vídeo
   - Previsualización en tiempo real

#### 4. **Tendencias & Sugerencias**
   - Análisis de trending topics en YouTube
   - Recomendaciones de contenido basadas en nicho
   - Insights de palabras clave populares
   - Análisis competitivo de canales similares

#### 5. **Publicación & Programación**
   - Programación automática de publicaciones
   - Cola de render en tiempo real
   - Múltiples destinos de publicación
   - Optimización automática de metadatos

#### 6. **Analíticas Avanzadas**
   - Métricas de rendimiento por video
   - Análisis de engagement y retención
   - Datos demográficos de audiencia
   - ROI por tipo de contenido

#### 7. **Biblioteca de Medios**
   - Gestión centralizada de assets
   - Búsqueda rápida con filtros avanzados
   - Organización por proyectos y etiquetas
   - Sincronización con APIs externas

#### 8. **Cerebro IA**
   - Configuración de parámetros de IA
   - Ajustes de voz y tono
   - Modelos personalizados
   - Memoria de preferencias del usuario

#### 9. **Configuración General**
   - Gestión de cuentas conectadas (YouTube, Google)
   - Preferencias de calidad de render
   - Configuración de idiomas y regiones
   - Límites y cuotas de API

#### 10. **Soporte & Documentación**
   - Centro de ayuda integrado
   - Tutoriales interactivos
   - Comunidad de usuarios
   - Reportar problemas

### Características Técnicas
- ✅ **Estado Compartido** para sincronización entre Studio, Editor, Scheduler y Dashboard
- ✅ **Servicio Local kineticAi** que simula IA para desarrollo sin costos
- ✅ **Arquitectura Modular** lista para APIs reales
- ✅ **Persistencia Local** con almacenamiento de proyectos
- ✅ **Type-Safe** con TypeScript en toda la aplicación

---

## 🔧 Requisitos Previos

Antes de comenzar, asegúrate de tener instalados:

- **Node.js** (versión 16.x o superior)
- **npm** (versión 7.x o superior) o **yarn**
- **Git** (para control de versiones)
- **Expo CLI** (para testing en dispositivos)

### Para desarrollo web:
- Cualquier navegador moderno (Chrome, Firefox, Safari, Edge)

### Para testing en dispositivo móvil:
- **Expo Go** instalado en tu dispositivo (iOS o Android)
- Conexión a la misma red WiFi que tu máquina de desarrollo

### Para contribuir al código:
- Editor recomendado: **Visual Studio Code** con extensión React Native
- Linter & Formatter: ESLint y Prettier (ya configurados)

---

## 📦 Instalación

### Paso 1: Clonar el Repositorio

```bash
git clone <tu-repositorio>
cd kinetic-ai-studio
```

### Paso 2: Instalar Dependencias

```bash
npm install
```

O si usas yarn:

```bash
yarn install
```

### Paso 3: Verificar Instalación

Comprueba que todo está correctamente instalado:

```bash
npm list expo react-native react
```

---

## 🚀 Uso

### Desarrollo Web

Para ejecutar la aplicación en el navegador:

```bash
npm run web
```

Esto iniciará un servidor de desarrollo en `http://localhost:19006`

### Desarrollo iOS

```bash
npm run ios
```

Requiere Xcode instalado en macOS.

### Desarrollo Android

```bash
npm run android
```

Requiere Android Studio o SDK de Android instalado.

### Testing en Dispositivo Físico

1. Instala **Expo Go** desde tu app store
2. Ejecuta:

```bash
npm start
```

3. Escanea el código QR con tu dispositivo (o ingresa el enlace manualmente)
4. La app cargará en Expo Go

### Desarrollo con Hot Reload

La mayoría de cambios se reflejan instantáneamente. Para cambios en `package.json`:

```bash
npm install
npm start
```

---

## 📁 Estructura del Proyecto

```
kinetic-ai-studio/
├── src/
│   ├── components.tsx          # Componentes reutilizables (Button, Card, Input, etc.)
│   ├── screens.tsx             # Pantallas principales de la aplicación
│   ├── types.ts                # Definiciones de tipos TypeScript
│   ├── data.ts                 # Datos mock y configuraciones
│   ├── theme.ts                # Sistema de temas y estilos globales
│   ├── services/
│   │   └── kineticAi.ts        # Servicio simulado de IA para desarrollo
│   └── [futuras carpetas de features]
│
├── assets/                     # Recursos estáticos (imágenes, iconos, fuentes)
├── docs/
│   └── tesis-plan.md          # Documentación técnica y roadmap
├── App.tsx                     # Componente raíz de la aplicación
├── app.json                    # Configuración de Expo
├── index.ts                    # Punto de entrada de la aplicación
├── tsconfig.json              # Configuración de TypeScript
├── package.json               # Dependencias y scripts
└── README.md                  # Este archivo
```

### Descripción de Archivos Clave

| Archivo | Propósito |
|---------|-----------|
| `App.tsx` | Componente raíz que configura la navegación y contexto global |
| `src/components.tsx` | Biblioteca reutilizable de componentes UI |
| `src/screens.tsx` | Definición de todas las pantallas de navegación |
| `src/types.ts` | Tipos TypeScript para type-safety completo |
| `src/theme.ts` | Paleta de colores, espaciados y estilos globales |
| `src/services/kineticAi.ts` | Simulador de IA que será reemplazado por APIs reales |
| `app.json` | Metadatos y configuración de la app para Expo |

---

## 🏗️ Arquitectura

### Arquitectura General

```
┌─────────────────────────────────────────┐
│       Expo / React Native               │
├─────────────────────────────────────────┤
│  Presentación (Screens & Components)    │
├─────────────────────────────────────────┤
│  Estado Compartido (Context/Redux)      │
├─────────────────────────────────────────┤
│  Servicios (kineticAi, APIs)            │
├─────────────────────────────────────────┤
│  APIs Externas (OpenAI, YouTube, etc.)  │
└─────────────────────────────────────────┘
```

### Flujo de Datos

1. **Usuario interactúa** con la pantalla
2. **Evento dispara** acción en componente
3. **Componente llama** servicio correspondiente
4. **Servicio procesa** y retorna datos
5. **Estado se actualiza** y UI se redibuja
6. **Pantallas sincronizadas** gracias a contexto compartido

### Capas Principales

- **Presentación**: Componentes visuales reutilizables
- **Navegación**: Stack y Tab navigation con Bottom Tab Bar
- **Estado**: Context API para estado global
- **Servicios**: Capa de negocio y APIs
- **Tipos**: TypeScript para seguridad de tipos

---

## ⚙️ Configuración

### Variables de Entorno

Crea un archivo `.env.local` en la raíz del proyecto:

```bash
# APIs Externas
OPENAI_API_KEY=sk-...
ELEVENLABS_API_KEY=...
YOUTUBE_API_KEY=...

# Configuración de Render
RENDER_SERVICE_URL=https://api.render.service
RENDER_QUALITY=1080p

# Configuración de Desarrollo
DEBUG_MODE=false
LOG_LEVEL=info
```

### Configuración de Tema

Edita [src/theme.ts](src/theme.ts) para personalizar:

```typescript
export const colors = {
  primary: '#7C3AED',        // Violeta principal
  secondary: '#06B6D4',      // Cyan
  accent: '#EF4444',         // Rojo para acciones de publicación
  dark: '#0F172A',           // Fondo oscuro
  // ... más colores
};
```

---

## 👨‍💻 Guía de Desarrollo

### Crear un Nuevo Componente

1. Agrega tu componente en `src/components.tsx`
2. Define tipos en `src/types.ts` si es necesario
3. Usa con los estilos definidos en `theme.ts`

Ejemplo:

```typescript
interface MyComponentProps {
  title: string;
  onPress: () => void;
}

export const MyComponent: React.FC<MyComponentProps> = ({ title, onPress }) => (
  <Pressable onPress={onPress}>
    <Text>{title}</Text>
  </Pressable>
);
```

### Crear una Nueva Pantalla

1. Agrega la pantalla en `src/screens.tsx`
2. Registrala en la navegación en `App.tsx`
3. Conecta los servicios necesarios

### Agregar una Nueva API

1. Crea un archivo en `src/services/`
2. Implementa funciones para interactuar con la API
3. Usa en componentes según sea necesario

Ejemplo estructura:

```typescript
// src/services/youtubeApi.ts
export const youtubeService = {
  uploadShort: async (videoData) => { /* ... */ },
  getAnalytics: async (videoId) => { /* ... */ },
};
```

### Debugging

#### Abrir DevTools de Expo:
```bash
npm start
# En la terminal, presiona 'd' para abrir menú
```

#### Usar React Native Debugger
```bash
# Instalar (una sola vez)
brew install react-native-debugger  # macOS
# O descargar desde: https://github.com/jhen0409/react-native-debugger

# Usar en desarrollo
npm start
# Presiona 'd' en el menú de Expo
```

#### Logs en Console
```typescript
console.log('Debug:', data);
console.warn('Warning:', message);
console.error('Error:', error);
```

---

## 🗺️ Roadmap

### Fase 1: MVP Actual ✅
- [x] Arquitectura base con Expo/React Native
- [x] Navegación móvil con 10 pantallas principales
- [x] Tema Kinetic AI con glassmorphism
- [x] Servicio mock de IA (kineticAi)
- [x] Estado compartido entre pantallas
- [x] TypeScript para type-safety

### Fase 2: Integración de APIs (En Progreso)
- [ ] Crear capa `services/` para APIs externas
- [ ] Conectar OpenAI para generación de guiones
- [ ] Integrar ElevenLabs para síntesis de voz
- [ ] Autenticación OAuth con Google/YouTube
- [ ] Conexión a YouTube Data API

### Fase 3: Persistencia & Backend
- [ ] Reemplazar mocks por persistencia local (AsyncStorage)
- [ ] Crear backend Node.js/Express
- [ ] Base de datos (PostgreSQL o Firebase)
- [ ] Sistema de autenticación robusto
- [ ] Sincronización en tiempo real

### Fase 4: Render & Publicación
- [ ] Implementar cola real de render
- [ ] Sistema de eventos de progreso
- [ ] Soporte para múltiples formatos de salida
- [ ] Publicación directa a YouTube
- [ ] Programación avanzada de contenido

### Fase 5: Analíticas & Optimización
- [ ] Dashboard de analíticas avanzadas
- [ ] Insights de rendimiento
- [ ] Recomendaciones basadas en IA
- [ ] Exportación de reportes
- [ ] Integración con Google Analytics

### Fase 6: Testing & QA
- [ ] Pruebas unitarias (Jest)
- [ ] Pruebas de integración
- [ ] Testing de flujos críticos
- [ ] Pruebas de rendimiento
- [ ] Testing de seguridad

---

## 🛠️ Tecnologías

### Frontend
| Tecnología | Versión | Propósito |
|------------|---------|----------|
| React Native | Latest | Framework base móvil |
| Expo | Latest | Herramienta de desarrollo |
| React | Latest | Librería de componentes |
| TypeScript | 5.x | Type-safety |

### Estilos & UI
| Tecnología | Propósito |
|------------|----------|
| StyleSheet (React Native) | Estilos base |
| Glassmorphism CSS | Efectos visuales |
| Custom Theme System | Temas personalizados |

### Gestión de Estado
- Context API (estado compartido)
- Preparación para: Redux Toolkit, Zustand

### Herramientas de Desarrollo
| Herramienta | Propósito |
|------------|----------|
| ESLint | Linting |
| Prettier | Formateo |
| TypeScript Compiler | Type-checking |
| Expo CLI | Herramienta CLI |

### APIs Planeadas
| API | Propósito |
|-----|----------|
| OpenAI / Claude | Generación de guiones |
| ElevenLabs | Síntesis de voz |
| YouTube Data API | Publicación & Analytics |
| Render Service | Generación de videos |

---

## 📚 Documentación Adicional

- **[Tesis Plan](docs/tesis-plan.md)** - Roadmap técnico detallado y documentación arquitectónica
- **[Convenciones de Código](docs/CODE_CONVENTIONS.md)** - Guía de estilo y nombres (próximamente)
- **[API Reference](docs/API_REFERENCE.md)** - Documentación de servicios (próximamente)

---

## 🤝 Contribución

Las contribuciones son bienvenidas. Por favor:

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

### Estándares de Código
- Usa TypeScript para nuevas funciones
- Sigue la guía de estilos (ESLint & Prettier)
- Agrega comentarios para lógica compleja
- Escribe tipos claros y descriptivos

---

## 📝 Licencia

Este proyecto está bajo licencia MIT. Ver archivo `LICENSE` para más detalles.

---

## 📞 Soporte

¿Preguntas o problemas?

- 📧 Email: support@kineticai.com
- 💬 Discord: [Únete a nuestra comunidad](https://discord.gg/kineticai)
- 🐛 Issues: [Reportar un bug](https://github.com/yourusername/kinetic-ai-studio/issues)
- 📖 Documentación: [Wiki del Proyecto](https://github.com/yourusername/kinetic-ai-studio/wiki)

---

## 🎉 Agradecimientos

Gracias a todos los que contribuyen al desarrollo de Kinetic AI Studio.

**Hecho con ❤️ por el equipo de Kinetic AI**

---

*Última actualización: 29 de mayo de 2026*
