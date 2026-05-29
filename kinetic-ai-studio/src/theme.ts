// Sistema de tipografía con pesos de fuente de Google Fonts (Sora)
export const fonts = {
  regular: 'Sora_400Regular',     // Peso regular (400) para textos normales
  medium: 'Sora_600SemiBold',     // Peso semibold (600) para énfasis moderado
  bold: 'Sora_700Bold',           // Peso bold (700) para encabezados
  extra: 'Sora_800ExtraBold',     // Peso extra bold (800) para títulos principales
};

// Paleta de colores del tema dark - sistema de diseño glassmorphism
export const colors = {
  // Fondos y superficies
  background: '#0b0b0f',        // Fondo principal (negro profundo)
  surface: '#121217',           // Superficie primaria para componentes
  surfaceLow: '#171720',        // Superficie con elevación baja
  surfaceMid: '#20202a',        // Superficie con elevación media
  surfaceHigh: '#292936',       // Superficie con elevación alta
  // Efectos glass (transparencia)
  glass: 'rgba(255,255,255,0.075)',     // Glass effect sutil (7.5% opacity)
  glassStrong: 'rgba(139,92,246,0.16)', // Glass effect fuerte con tint púrpura
  border: 'rgba(255,255,255,0.12)',     // Bordes sutiles (12% opacity)
  // Textos
  text: '#f6f2ff',              // Texto principal (blanco con tint púrpura)
  muted: '#c8bfd8',            // Texto secundario/menos enfasis
  dim: '#8f879b',              // Texto tenue/deshabilitado
  // Colores de marca
  primary: '#d0bcff',           // Color primario (púrpura claro)
  primaryStrong: '#8b5cf6',     // Color primario intenso (púrpura oscuro)
  indigo: '#4f46e5',            // Azul indigo para variantes
  accent: '#2fd9f4',            // Color de acento (cyan) para énfasis
  // Estados semánticos
  success: '#54f3b2',           // Verde para estados exitosos
  danger: '#ff5540',            // Rojo/naranja para acciones destructivas
  warning: '#ffb4a8',           // Naranja suave para advertencias
};

// Escala de espaciado consistente para márgenes y paddings (en píxeles)
export const spacing = {
  xxs: 4,   // Extra extra pequeño (4px)
  xs: 8,    // Extra pequeño (8px)
  sm: 12,   // Pequeño (12px)
  md: 16,   // Medio (16px) - separación estándar
  lg: 20,   // Grande (20px)
  xl: 28,   // Extra grande (28px) - separación entre secciones
};

// Escala de bordes redondeados para consistencia visual (en píxeles)
export const radii = {
  sm: 8,    // Pequeño radio (8px) para controles pequeños
  md: 10,   // Radio medio (10px) para elementos estándar
  lg: 12,   // Radio grande (12px) para tarjetas
  xl: 18,   // Radio extra grande (18px) para componentes grandes
  full: 999,// Radio circular (999px) para botones redondos
};

// Estilos tipográficos predefinidos para componentes de UI
export const typography = {
  // Título principal - 22px extra bold con alto line-height
  title: {
    fontFamily: fonts.extra,      // Fuente extra bold para máximo impacto
    fontSize: 22,                 // Tamaño grande para encabezados
    lineHeight: 29,               // Espaciado de línea generoso
    letterSpacing: 0,             // Sin espaciado entre letras
  },
  // Encabezado de sección - 16px bold
  section: {
    fontFamily: fonts.bold,       // Fuente bold para jerarquía
    fontSize: 16,                 // Tamaño de encabezado
    lineHeight: 22,               // Line height balanceado
    letterSpacing: 0,
  },
  // Texto principal del cuerpo - 13px regular
  body: {
    fontFamily: fonts.regular,    // Fuente regular para legibilidad
    fontSize: 13,                 // Tamaño estándar de párrafo
    lineHeight: 19,               // Espaciado cómodo para lectura
    letterSpacing: 0,
  },
  // Etiquetas y textos pequeños - 11px bold
  label: {
    fontFamily: fonts.bold,       // Fuente bold para claridad
    fontSize: 11,                 // Muy pequeño para información secundaria
    lineHeight: 15,               // Compacto pero legible
    letterSpacing: 0,
  },
};
