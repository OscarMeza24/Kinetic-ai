# Kinetic AI Studio

MVP inicial en Expo/React Native para una plataforma de automatizacion de YouTube Shorts y contenido vertical.

## Que incluye

- Navegacion mobile-first con barra inferior persistente.
- Pantallas principales del PRD: Dashboard, IA Studio, Editor, Tendencias, Publicacion, Analiticas, Biblioteca, Cerebro IA, Configuracion y Soporte.
- Tema oscuro Kinetic AI con glassmorphism, violeta, cyan y acciones de publicacion en rojo.
- Servicio local `kineticAi` que simula generacion de guiones, escenas, assets, hashtags, render y programacion.
- Estado compartido para que Studio, Editor, Scheduler y Dashboard se actualicen entre si.
- Estructura lista para conectar APIs reales: OpenAI/Claude, ElevenLabs, YouTube Data API y servicio de render.

## Ejecutar

```bash
npm install
npm run web
```

Para probar en telefono:

```bash
npm start
```

Luego escanea el QR con Expo Go.

## Siguiente fase tecnica

1. Crear capa `services/` para APIs externas.
2. Reemplazar mocks por persistencia local o backend.
3. Agregar autenticacion y conexion OAuth con YouTube.
4. Implementar cola real de render y eventos de progreso.
5. Crear pruebas de flujos criticos: generar, editar, programar y publicar.
