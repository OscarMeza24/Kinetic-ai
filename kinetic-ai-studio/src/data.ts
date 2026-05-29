import type { Automation, DraftShort, LibraryItem, ScheduledPost, Trend } from './types';

// Métricas de desempeño del canal
// Incluye vistas, suscriptores, tiempo de visionado y cantidad de shorts producidos
export const metrics = [
  { label: 'Views', value: '1.2M', delta: '+18%', tone: 'primary' },
  { label: 'Subs', value: '+14.5K', delta: '+9%', tone: 'danger' },
  { label: 'Watch', value: '3.2K h', delta: '7 dias', tone: 'accent' },
  { label: 'Shorts', value: '128', delta: '+24', tone: 'success' },
];

// Automatizaciones activas en el pipeline de producción
// Muestra el progreso de cada trabajo de renderizado y publicación
export const initialAutomations: Automation[] = [
  {
    id: 'auto-1',
    title: 'Tech News Daily - Episode 42',
    status: 'processing',
    stage: 'Rendering frames',
    progress: 65,
    channel: 'YouTube Shorts',
    eta: '02:14',
    updatedAt: 'hace 1 min',
    // Pasos completados en el pipeline de automatización
    steps: ['Guion aprobado', 'Voz generada', 'Renderizando escenas'],
  },
  {
    id: 'auto-2',
    title: 'Top 5 Cyberpunk Games',
    status: 'scheduled',
    stage: 'Metadata optimizada',
    progress: 100,
    channel: 'TikTok',
    eta: 'Hoy 18:00',
    updatedAt: 'hace 12 min',
    // Todos los pasos completados, listo para publicar
    steps: ['Render completo', 'Subtitulos listos', 'Publicacion agendada'],
  },
];

// Draft inicial de short para edición
// Incluye guion, escenas, assets y metadata para producción
export const initialDraft: DraftShort = {
  title: '3 herramientas IA para crear videos en minutos',
  prompt: 'Crea un short sobre herramientas de IA que ayudan a automatizar contenido.',
  tone: 'Inspirador',
  style: 'Cinematico',
  // Hook cautivador para los primeros segundos
  hook: 'La proxima ola de creadores no edita mas rapido: automatiza mejor.',
  // Script desglosado por acciones principales
  script: [
    'Abre con una comparacion visual entre edicion manual y pipeline IA.',
    'Muestra tres bloques: guion automatico, voz sintetica y render vertical.',
    'Cierra con una llamada a guardar la lista y probar una herramienta hoy.',
  ],
  // Escenas desglosadas con narracion, visual y duracion
  scenes: [
    {
      id: 'scene-1',
      label: 'Hook',
      narration: 'La proxima ola de creadores automatiza mejor.',
      visual: 'Split-screen: timeline manual vs pipeline IA.',
      duration: 4,
    },
    {
      id: 'scene-2',
      label: 'Demo',
      narration: 'Guion, voz y render pueden salir de un solo prompt.',
      visual: 'Dashboard oscuro con tarjetas de progreso.',
      duration: 8,
    },
    {
      id: 'scene-3',
      label: 'CTA',
      narration: 'Guarda esta lista si produces shorts cada semana.',
      visual: 'Texto cinetico y boton de guardar.',
      duration: 5,
    },
  ],
  assets: ['B-roll neon workstation', 'Capturas de dashboard', 'Subtitulos cineticos', 'Beat electronico 92 BPM'],
  hashtags: ['#AITools', '#ShortsAutomation', '#CreatorTech'],
  // Descripcion SEO para plataformas
  description: 'Tres formas de acelerar la produccion de Shorts usando IA sin perder control creativo.',
  // Texto para la miniatura, limitado a 24 caracteres
  thumbnailText: '3 IA para crear Shorts',
  // Voz sintetizada seleccionada
  voice: 'ElevenLabs - Adam',
  // Puntuación de viralidad calculada del 0-100
  viralityScore: 86,
  // Duracion total del short en segundos
  duration: 17,
};

export const trends: Trend[] = [
  {
    id: 'trend-1',
    tag: '#AI_Tools_2026',
    niche: 'Tech',
    potential: 94,
    // Idea de contenido basada en la tendencia
    idea: 'Ranking de automatizaciones IA que ahorran 10 horas por semana.',
  },
  {
    id: 'trend-2',
    tag: '#FacelessChannels',
    niche: 'Creators',
    potential: 89,
    // Enfoque en canales sin presentador en video
    idea: 'Como crear un canal sin aparecer en camara usando voz y clips generativos.',
  },
  {
    id: 'trend-3',
    tag: '#ProductivityStack',
    niche: 'Business',
    potential: 83,
    // Tendencia de productividad empresarial
    idea: 'Stack minimo para producir, publicar y medir shorts desde una sola app.',
  },
  {
    id: 'trend-4',
    tag: '#MoneySystems',
    niche: 'Finance',
    potential: 78,
    // Tendencia en educación financiera personalizada
    idea: 'Un sistema de 3 pasos para explicar finanzas personales en menos de 30 segundos.',
  },
];

// Posts programados para publicación automática
// Se publican en canales especificados en el día y hora indicados
export const initialScheduledPosts: ScheduledPost[] = [
  {
    id: 'post-1',
    title: 'Top 5 Cyberpunk Games',
    description: 'Short programado con metadata optimizada para audiencia gamer.',
    channels: ['TikTok', 'YouTube Shorts'],
    day: 'Vie 22',
    time: '18:00',
    status: 'scheduled',
    // Hashtags para descubrimiento y alcance
    hashtags: ['#Gaming', '#Cyberpunk', '#Shorts'],
  },
];

// Biblioteca de medios: clips, música, marcas y assets generados
// Reutilizables en múltiples proyectos
export const libraryItems: LibraryItem[] = [
  { id: 'lib-1', title: 'AI Gen Scene 2', type: 'Generated', meta: '9:16 - 00:12', color: '#8b5cf6', tags: ['ai', 'scene'] },
  { id: 'lib-2', title: 'Cyber City Intro', type: 'Uploaded', meta: 'MP4 - 4K', color: '#2fd9f4', tags: ['intro', 'video'] },
  { id: 'lib-3', title: 'Pulse Beat 92', type: 'Music', meta: 'Loop - EDM', color: '#ff5540', tags: ['audio', 'music'] },
  // Asset de marca con logo y colores corporativos
  { id: 'lib-4', title: 'Kinetic Brand Kit', type: 'Brand', meta: 'Logo + colors', color: '#54f3b2', tags: ['brand', 'logo'] },
];
