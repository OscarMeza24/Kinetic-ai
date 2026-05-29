import type { Automation, DraftShort, ScheduledPost, Trend } from '../types';

// Estructura de entrada para generar drafts de shorts
type GenerateInput = {
  prompt: string;
  tone: string;
  style: string;
};

// Mapa de palabras clave para detectar nichos y generar hooks automáticos
const keywordMap = [
  // Nicho: Finanzas - Hook diseñado para captar atención sobre dinero e inversiones
  { match: ['finanza', 'crypto', 'dinero', 'inversion'], niche: 'Finance', hook: 'Tu dinero no necesita mas ruido: necesita un sistema simple.' },
  // Nicho: Gaming - Hook enfocado en recomendaciones de juegos
  { match: ['juego', 'gaming', 'cyberpunk'], niche: 'Gaming', hook: 'Este formato convierte una recomendacion gamer en un short imposible de saltar.' },
  // Nicho: Productividad - Hook sobre optimización de procesos
  { match: ['productividad', 'tiempo', 'automatiza'], niche: 'Productivity', hook: 'El truco no es trabajar mas rapido, es quitar pasos del proceso.' },
  // Nicho: Herramientas de IA - Hook sobre automatización y coordenación
  { match: ['ia', 'ai', 'herramienta', 'automatizacion'], niche: 'AI Tools', hook: 'La IA ya no solo escribe: ahora coordina todo el flujo creativo.' },
];

// Detecta el nicho basado en palabras clave en el prompt
// Retorna el nicho coincidido o por defecto AI Tools (índice 3)
function detectNiche(prompt: string) {
  const normalized = prompt.toLowerCase();
  return keywordMap.find((item) => item.match.some((word) => normalized.includes(word))) ?? keywordMap[3];
}

// Limpia y normaliza el título del prompt
// Limita a 58 caracteres, elimina puntuación final y añade elipsis si es necesario
function cleanTitle(text: string) {
  const trimmed = text.replace(/\s+/g, ' ').trim();
  if (!trimmed) {
    return 'Nuevo short generado por IA';
  }

  const withoutPunctuation = trimmed.replace(/[.?!]+$/g, '');
  return withoutPunctuation.length > 58 ? `${withoutPunctuation.slice(0, 55)}...` : withoutPunctuation;
}

// Genera un draft de short a partir de un prompt, tono y estilo visual
// Crea automáticamente las escenas, assets y hashtags basados en el nicho detectado
export function generateDraftFromPrompt({ prompt, tone, style }: GenerateInput): DraftShort {
  // Detectar nicho y procesar inputs
  const niche = detectNiche(prompt);
  const title = cleanTitle(prompt);
  const visualStyle = style.toLowerCase();
  const toneLabel = tone.toLowerCase();
  // Duración base del short en segundos, varía según el tono
  const duration = tone === 'Formal' ? 24 : tone === 'Divertido' ? 19 : 21;

  // Estructura de 4 escenas estándar: Hook -> Valor -> Prueba -> CTA
  // La duración se distribuye proporcionalmente según el tono y el total
  const scenes = [
    {
      id: 'scene-1',
      label: 'Hook',
      narration: niche.hook,
      visual: `Plano inicial ${visualStyle} con texto gigante y glitch sutil.`,
      duration: 4,
    },
    {
      id: 'scene-2',
      label: 'Valor',
      narration: `Explica la idea principal con tono ${toneLabel} y un ejemplo concreto.`,
      visual: `B-roll ${visualStyle}, capturas rapidas y marcadores cyan.`,
      duration: Math.max(8, Math.round(duration * 0.45)),
    },
    {
      id: 'scene-3',
      label: 'Prueba',
      narration: 'Muestra el antes y despues para que el beneficio sea visible.',
      visual: 'Comparacion de dos columnas con progreso de render.',
      duration: Math.max(5, Math.round(duration * 0.28)),
    },
    {
      id: 'scene-4',
      label: 'CTA',
      narration: 'Cierra con una accion simple: guardar, comentar o probar el flujo.',
      visual: 'Subtitulo cinetico, cierre de marca y beat final.',
      duration: 4,
    },
  ];

  return {
    title,
    prompt,
    tone,
    style,
    hook: niche.hook,
    script: scenes.map((scene) => `${scene.label}: ${scene.narration}`),
    scenes,
    assets: [
      `Visual pack ${niche.niche}`,
      `Plantilla ${style} 9:16`,
      `Voz ${tone}`,
      'Subtitulos con palabras clave',
      'Beat electronico corto',
    ],
    hashtags: [`#${niche.niche.replace(/\s/g, '')}`, '#KineticAI', '#Shorts', '#CreatorTech'],
    description: `Short generado para el nicho ${niche.niche}. Enfoque ${toneLabel}, estilo ${visualStyle} y CTA optimizado para retencion.`,
    thumbnailText: title.length > 24 ? title.slice(0, 24) : title,
    voice: tone === 'Formal' ? 'ElevenLabs - Antoni' : tone === 'Divertido' ? 'ElevenLabs - Josh' : 'ElevenLabs - Adam',
    viralityScore: Math.min(96, 72 + prompt.length % 18 + (style === 'Animado' ? 5 : 0)),
    duration,
  };
}

// Genera un draft a partir de una tendencia detectada
// Adapta el tono y estilo según el potencial y nicho de la tendencia
export function generateDraftFromTrend(trend: Trend): DraftShort {
  return generateDraftFromPrompt({
    prompt: `${trend.idea} ${trend.tag}`,
    // Tono inspirador para tendencias de alto potencial (>88)
    tone: trend.potential > 88 ? 'Inspirador' : 'Formal',
    // Estilo minimalista para finanzas, animado para otros nichos
    style: trend.niche === 'Finance' ? 'Minimalista' : 'Animado',
  });
}

// Regenera el script mejorado del draft existente
// Optimiza la narración para mayor impacto y mejora la puntuación de viralidad
export function regenerateScript(draft: DraftShort): DraftShort {
  // Reescribe las narraciones con énfasis en claridad visual
  const scenes = draft.scenes.map((scene, index) => ({
    ...scene,
    narration:
      index === 0
        ? `${draft.hook} Mira esto en ${scene.duration} segundos.`
        : `${scene.narration} Agrega un dato visual que se entienda sin audio.`,
  }));

  return {
    ...draft,
    scenes,
    script: scenes.map((scene) => `${scene.label}: ${scene.narration}`),
    // Incrementa la puntuación de viralidad hasta un máximo de 99
    viralityScore: Math.min(99, draft.viralityScore + 3),
  };
}

// Cambia el estilo visual del draft rotando entre: Cinematico -> Animado -> Minimalista
// Actualiza todas las descripciones visuales de las escenas
export function swapVisualPack(draft: DraftShort): DraftShort {
  // Rotación cíclica de estilos visuales disponibles
  const nextStyle = draft.style === 'Cinematico' ? 'Animado' : draft.style === 'Animado' ? 'Minimalista' : 'Cinematico';
  const scenes = draft.scenes.map((scene) => ({
    ...scene,
    visual: `${nextStyle}: ${scene.visual.replace(/^(Cinematico|Animado|Minimalista):\s*/, '')}`,
  }));

  return {
    ...draft,
    style: nextStyle,
    scenes,
    // Actualiza el asset visual al nuevo estilo
    assets: [`Visual pack ${nextStyle}`, ...draft.assets.slice(1)],
  };
}

// Crea un trabajo de renderización a partir del draft
// Inicializa la automatización con status 'processing' y etapa inicial
export function buildRenderJob(draft: DraftShort): Automation {
  return {
    // ID único basado en timestamp para seguimiento
    id: `auto-${Date.now()}`,
    title: draft.title,
    status: 'processing',
    stage: 'Analizando guion',
    progress: 8,
    channel: 'Render Cloud',
    eta: '04:20',
    updatedAt: 'ahora',
    // Pasos iniciales del proceso de renderización
    steps: ['Guion generado', 'Assets sugeridos'],
  };
}

// Avanza el progreso del trabajo de renderización automático
// Actualiza etapa, progreso y ETA según el estado actual
export function advanceAutomation(job: Automation): Automation {
  // Solo procesa trabajos en estado 'processing'
  if (job.status !== 'processing') {
    return job;
  }

  // Incrementa el progreso en 7% por cada llamada
  const nextProgress = Math.min(100, job.progress + 7);
  // Define la etapa según el porcentaje de avance
  const stage =
    nextProgress < 30
      ? 'Generando assets'
      : nextProgress < 62
        ? 'Sintetizando voz'
        : nextProgress < 92
          ? 'Rendering frames'
          : 'Listo para publicar';

  return {
    ...job,
    progress: nextProgress,
    // Cambia a 'ready' cuando se alcanza el 100%
    status: nextProgress >= 100 ? 'ready' : 'processing',
    stage,
    // Calcula ETA dinámicamente o muestra 'Ready' si está completo
    eta: nextProgress >= 100 ? 'Ready' : `0${Math.max(1, Math.ceil((100 - nextProgress) / 20))}:00`,
    updatedAt: 'ahora',
    // Añade paso final cuando el progreso supera 92%
    steps: nextProgress >= 92 ? [...new Set([...job.steps, 'Render finalizado'])] : job.steps,
  };
}

// Crea un post programado a partir del draft para uno o múltiples canales
// Permite publicación inmediata o programación para una fecha/hora específica
export function createScheduledPost(draft: DraftShort, day: string, time: string, channels: string[], publishNow = false): ScheduledPost {
  return {
    // ID único basado en timestamp
    id: `post-${Date.now()}`,
    title: draft.title,
    description: draft.description,
    channels,
    // Si publishNow es true, se publica inmediatamente; si no, se programa para el día especificado
    day: publishNow ? 'Ahora' : day,
    time: publishNow ? 'En cola' : time,
    // Status 'published' para publicación inmediata, 'scheduled' para programada
    status: publishNow ? 'published' : 'scheduled',
    hashtags: draft.hashtags,
  };
}
