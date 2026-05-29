# Plan de tesis: Kinetic AI Studio

## Objetivo general

Desarrollar un prototipo funcional de una aplicacion movil hibrida que automatice el flujo de creacion, edicion, programacion y analisis de contenido vertical para creadores de YouTube Shorts.

## Alcance del MVP

- Generacion asistida de guion desde un prompt.
- Sugerencias de assets, tono, estilo visual y hashtags.
- Editor visual simulado con preview 9:16 y timeline multi-track.
- Cola de automatizaciones con progreso de render.
- Programacion de publicacion con metadata optimizada.
- Analiticas simuladas para revenue, retencion y audiencia.
- Configuracion de identidad IA: nicho, voz y brand kit.

## Arquitectura propuesta

- Frontend: Expo + React Native + TypeScript.
- Estado inicial: React state local para prototipo.
- Estado siguiente: Zustand, Redux Toolkit o React Query segun backend elegido.
- Backend recomendado: Node.js/NestJS o Firebase/Supabase para acelerar la tesis.
- Integraciones futuras:
  - OpenAI o Claude para guiones y metadata.
  - ElevenLabs para voz sintetica.
  - YouTube Data API v3 para publicacion y analiticas.
  - Mux, AWS MediaConvert o servicio propio para render.

## Modulos principales

1. Dashboard: metricas, render activo y accesos rapidos.
2. IA Studio: prompt, tono, estilo y borrador de guion.
3. Editor de Clips: preview, herramientas y timeline.
4. Tendencias: descubrimiento y potencial viral.
5. Programador: calendario, canales y publish action.
6. Analiticas: revenue, retencion y demografia.
7. Biblioteca: clips, musica, assets IA y brand kits.
8. Cerebro IA: persona, voz y marca.
9. Configuracion y soporte: perfil, seguridad y FAQ.

## Fases de desarrollo

### Fase 1: Prototipo navegable

- Convertir pantallas visuales a app Expo.
- Usar datos mock.
- Validar flujo principal: generar -> editar -> programar.

### Fase 2: Backend minimo

- Crear usuarios, proyectos, drafts y automations.
- Persistir estados de render.
- Agregar autenticacion.

### Fase 3: Integracion IA

- Endpoint para generar guion.
- Endpoint para sugerir metadata.
- Endpoint para voz sintetica.

### Fase 4: Publicacion y analiticas

- OAuth con YouTube.
- Publicacion real o simulada segun permisos.
- Captura de metricas y dashboard.

### Fase 5: Evaluacion academica

- Pruebas de usabilidad con creadores.
- Medicion de tiempo ahorrado frente a flujo manual.
- Analisis de calidad percibida del contenido generado.

## Flujo demo para defensa

1. Entrar al Dashboard y mostrar metricas.
2. Crear un short desde IA Studio.
3. Revisar guion y assets sugeridos.
4. Abrir Editor y mostrar preview/timeline.
5. Programar publicacion en canales.
6. Mostrar analiticas simuladas del contenido.

## Riesgos y mitigaciones

- APIs externas costosas: iniciar con mocks y activar integraciones por modulo.
- Publicacion real restringida: usar modo sandbox o simulacion verificable.
- Render de video complejo: iniciar con pipeline simulado y luego integrar servicio cloud.
- Alcance demasiado amplio: defender como plataforma modular y desarrollar completo solo el flujo principal.
