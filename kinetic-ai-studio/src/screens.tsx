import { useMemo, useState, type ReactNode } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import {
  AudioLines,
  Bot,
  BrainCircuit,
  CalendarClock,
  CheckCircle2,
  Download,
  FileVideo,
  Layers3,
  MessageCircle,
  Palette,
  Play,
  Plus,
  RefreshCcw,
  Search,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  Wand2,
} from 'lucide-react-native';
import { Chip, EmptyVisual, GlassCard, GradientButton, ProgressBar, SectionTitle } from './components';
import { initialDraft, libraryItems, metrics, trends } from './data';
import {
  createScheduledPost,
  generateDraftFromPrompt,
  generateDraftFromTrend,
  regenerateScript,
  swapVisualPack,
} from './services/kineticAi';
import { colors, fonts, radii, spacing, typography } from './theme';
import type { Automation, DraftShort, ScheduledPost, ScreenId, Trend } from './types';

// Opciones de tono de voz para los shorts
const tones = ['Formal', 'Divertido', 'Inspirador'];
// Estilos visuales disponibles
const videoStyles = ['Minimalista', 'Cinematico', 'Animado'];
// Categorías de tendencias por nicho
const categories = ['All', 'Tech', 'Finance', 'Creators', 'Business'];
// Canales de distribución disponibles
const channels = ['YouTube Shorts', 'TikTok', 'Instagram Reels'];
// Días disponibles para programación
const days = ['Lun 18', 'Mar 19', 'Mie 20', 'Jue 21', 'Vie 22'];
// Horas disponibles para publicación
const times = ['09:00', '12:30', '18:00', '21:15'];

// Wrapper para scroll vertical con espaciado uniforme
function ScreenScroll({ children }: { children: ReactNode }) {
  return (
    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.screen}>
      {children}
    </ScrollView>
  );
}

function toneColor(tone: string) {
  if (tone === 'danger') return colors.danger;
  if (tone === 'accent') return colors.accent;
  if (tone === 'success') return colors.success;
  return colors.primary;
}

// Badge de estado con indicador visual puntual
function StatusBadge({ label, color = colors.primary }: { label: string; color?: string }) {
  return (
    <View style={[styles.badge, { borderColor: color }]}>
      <View style={[styles.badgeDot, { backgroundColor: color }]} />
      <Text style={styles.badgeText}>{label}</Text>
    </View>
  );
}

// Pantalla principal con resumen de pipeline, métricas y próximas publicaciones
export function DashboardScreen({
  automations,
  scheduledPosts,
  totalProgress,
  goTo,
}: {
  automations: Automation[];
  scheduledPosts: ScheduledPost[];
  totalProgress: number;
  goTo: (screen: ScreenId) => void;
}) {
  const activeJobs = automations.filter((item) => item.status === 'processing').length;

  return (
    <ScreenScroll>
      {/* Tarjeta héroe con resumen de pipeline activo */}
      <GlassCard style={styles.heroCard}>
        <View style={styles.heroCopy}>
          <Text style={styles.kicker}>Pipeline activo</Text>
          <Text style={styles.heroValue}>{String(activeJobs)}</Text>
          <Text style={styles.bodyMuted}>renders corriendo, {String(scheduledPosts.length)} publicaciones en agenda.</Text>
        </View>
        <View style={styles.heroOrb}>
          <Text style={styles.heroOrbText}>{String(totalProgress)}%</Text>
          <Text style={styles.heroOrbLabel}>avg render</Text>
        </View>
      </GlassCard>

      {/* Acciones rápidas para acceder a funciones principales */}
      <View style={styles.quickActions}>
        <Pressable onPress={() => goTo('studio')} style={styles.quickAction}>
          <Sparkles size={18} color={colors.primary} />
          <Text style={styles.quickActionText}>Generar</Text>
        </Pressable>
        <Pressable onPress={() => goTo('scheduler')} style={styles.quickAction}>
          <CalendarClock size={18} color={colors.danger} />
          <Text style={styles.quickActionText}>Programar</Text>
        </Pressable>
        <Pressable onPress={() => goTo('trends')} style={styles.quickAction}>
          <TrendingUp size={18} color={colors.accent} />
          <Text style={styles.quickActionText}>Trends</Text>
        </Pressable>
      </View>

      {/* Grid de métricas KPI del canal */}
      <View style={styles.metricGrid}>
        {metrics.map((metric) => (
          <GlassCard key={metric.label} style={styles.metricCard}>
            <Text style={styles.metricLabel}>{metric.label}</Text>
            <Text style={styles.metricValue}>{metric.value}</Text>
            <Text style={[styles.metricDelta, { color: toneColor(metric.tone) }]}>{metric.delta}</Text>
          </GlassCard>
        ))}
      </View>

      <SectionTitle title="Automatizaciones" action="live" />
      {automations.slice(0, 3).map((item) => (
        <GlassCard key={item.id} style={styles.automationCard}>
          <View style={styles.rowBetween}>
            <View style={styles.flexOne}>
              <Text numberOfLines={1} style={styles.cardTitle}>
                {item.title}
              </Text>
              <Text style={styles.bodyMuted}>{item.stage}</Text>
            </View>
            <StatusBadge label={item.eta} color={item.status === 'processing' ? colors.accent : colors.success} />
          </View>
          <ProgressBar value={item.progress} color={item.status === 'processing' ? colors.accent : colors.success} />
          <View style={styles.rowBetween}>
            <Text style={styles.smallMuted}>{item.channel}</Text>
            <Text style={styles.smallText}>{String(item.progress)}%</Text>
          </View>
        </GlassCard>
      ))}

      <SectionTitle title="Proxima publicacion" />
      {scheduledPosts[0] ? (
        <GlassCard style={styles.nextPostCard}>
          <Text numberOfLines={2} style={styles.cardTitle}>
            {scheduledPosts[0].title}
          </Text>
          <Text style={styles.bodyMuted}>
            {scheduledPosts[0].day} - {scheduledPosts[0].time} - {scheduledPosts[0].channels.join(', ')}
          </Text>
        </GlassCard>
      ) : (
        <GradientButton label="Programar primer short" icon={Plus} onPress={() => goTo('scheduler')} />
      )}
    </ScreenScroll>
  );
}

export function StudioScreen({ draft, onGenerate }: { draft: DraftShort; onGenerate: (draft: DraftShort) => void }) {
  const [prompt, setPrompt] = useState(draft.prompt);
  const [tone, setTone] = useState(draft.tone);
  const [style, setStyle] = useState(draft.style);

  const generatedDraft = useMemo(
    () =>
      generateDraftFromPrompt({
        prompt,
        tone,
        style,
      }),
    [prompt, style, tone],
  );

  const canGenerate = prompt.trim().length >= 12;

  return (
    <ScreenScroll>
      <GlassCard>
        <View style={styles.iconTitle}>
          <Sparkles size={20} color={colors.primary} />
          <Text style={styles.cardTitle}>Generador IA</Text>
        </View>
        <TextInput
          multiline
          value={prompt}
          onChangeText={setPrompt}
          placeholder="Ej: short sobre 3 herramientas IA para automatizar videos..."
          placeholderTextColor={colors.dim}
          style={styles.promptInput}
        />
        <View style={styles.hintRow}>
          <Text style={styles.smallMuted}>Prompt score</Text>
          <Text style={[styles.smallText, { color: canGenerate ? colors.success : colors.warning }]}>
            {Math.min(100, prompt.length)}%
          </Text>
        </View>

        <Text style={styles.fieldLabel}>Tono</Text>
        <View style={styles.chipRow}>
          {tones.map((item) => (
            <Chip key={item} label={item} active={tone === item} onPress={() => setTone(item)} />
          ))}
        </View>
        <Text style={styles.fieldLabel}>Estilo visual</Text>
        <View style={styles.chipRow}>
          {videoStyles.map((item) => (
            <Chip key={item} label={item} active={style === item} onPress={() => setStyle(item)} />
          ))}
        </View>
      </GlassCard>

      <GlassCard style={styles.previewCard}>
        <View style={styles.rowBetween}>
          <Text style={styles.kicker}>Draft generado</Text>
          <StatusBadge label={`${generatedDraft.viralityScore}%`} color={colors.accent} />
        </View>
        <Text numberOfLines={2} style={styles.cardTitle}>
          {generatedDraft.title}
        </Text>
        <Text style={styles.bodyMuted}>{generatedDraft.hook}</Text>
        <View style={styles.assetRow}>
          {generatedDraft.assets.slice(0, 3).map((asset) => (
            <View key={asset} style={styles.assetChip}>
              <Text numberOfLines={1} style={styles.assetText}>
                {asset}
              </Text>
            </View>
          ))}
        </View>
      </GlassCard>

      <GlassCard>
        <SectionTitle title="Escenas" action={`${String(generatedDraft.duration)}s`} />
        {generatedDraft.scenes.map((scene) => (
          <View key={scene.id} style={styles.sceneRow}>
            <View style={styles.sceneIndex}>
              <Text style={styles.sceneIndexText}>{String(scene.duration)}s</Text>
            </View>
            <View style={styles.flexOne}>
              <Text style={styles.smallText}>{scene.label}</Text>
              <Text style={styles.bodyMuted}>{scene.narration}</Text>
            </View>
          </View>
        ))}
      </GlassCard>

      <GradientButton
        label={canGenerate ? 'Generar y abrir editor' : 'Escribe un prompt mas claro'}
        icon={Wand2}
        onPress={() => {
          if (canGenerate) {
            onGenerate(generatedDraft);
          }
        }}
      />
    </ScreenScroll>
  );
}

export function EditorScreen({
  draft,
  onDraftUpdate,
  onOpenScheduler,
}: {
  draft: DraftShort;
  onDraftUpdate: (draft: DraftShort, message: string) => void;
  onOpenScheduler: () => void;
}) {
  const handleRegenerate = () => onDraftUpdate(regenerateScript(draft), 'Guion regenerado');
  const handleSwap = () => onDraftUpdate(swapVisualPack(draft), 'Visual pack cambiado');

  return (
    <ScreenScroll>
      <View style={styles.editorPreview}>
        <LinearGradient colors={[colors.primaryStrong, '#111827', colors.accent]} style={styles.videoFrame}>
          <View style={styles.videoTopBar}>
            <Text style={styles.previewLabel}>{draft.style}</Text>
            <Text style={styles.previewLabel}>{draft.duration}s</Text>
          </View>
          <Text numberOfLines={3} style={styles.previewTitle}>
            {draft.thumbnailText}
          </Text>
          <Pressable style={styles.playButton}>
            <Play size={30} color={colors.text} fill={colors.text} />
          </Pressable>
        </LinearGradient>
      </View>

      <View style={styles.toolRow}>
        <ToolButton icon={<RefreshCcw size={19} color={colors.primary} />} label="Guion" onPress={handleRegenerate} />
        <ToolButton icon={<Layers3 size={19} color={colors.accent} />} label="Visuales" onPress={handleSwap} />
        <ToolButton
          icon={<AudioLines size={19} color={colors.warning} />}
          label="Voz"
          onPress={() => onDraftUpdate({ ...draft, voice: draft.voice.includes('Adam') ? 'ElevenLabs - Josh' : 'ElevenLabs - Adam' }, 'Voz actualizada')}
        />
      </View>

      <GlassCard>
        <SectionTitle title="Timeline" action={`${String(draft.scenes.length)} escenas`} />
        <TimelineTrack
          icon={<FileVideo size={18} color={colors.primary} />}
          label="Video"
          blocks={draft.scenes.map((scene) => scene.label)}
        />
        <TimelineTrack
          icon={<MessageCircle size={18} color={colors.accent} />}
          label="Subs"
          blocks={draft.scenes.map((scene) => scene.narration.slice(0, 16))}
          compact
        />
        <TimelineTrack icon={<AudioLines size={18} color={colors.warning} />} label="Audio" blocks={[draft.voice, 'Beat', 'SFX']} compact />
      </GlassCard>

      <GlassCard>
        <SectionTitle title="Guion editable" action={`${String(draft.viralityScore)}% viral`} />
        {draft.scenes.map((scene) => (
          <View key={scene.id} style={styles.scriptBlock}>
            <Text style={styles.smallText}>{scene.label}</Text>
            <Text style={styles.bodyMuted}>{scene.narration}</Text>
            <Text style={styles.visualText}>{scene.visual}</Text>
          </View>
        ))}
      </GlassCard>

      <GradientButton label="Preparar publicacion" icon={CalendarClock} danger onPress={onOpenScheduler} />
    </ScreenScroll>
  );
}

function ToolButton({ icon, label, onPress }: { icon: ReactNode; label: string; onPress: () => void }) {
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.toolPressable, pressed && styles.pressed]}>
      <GlassCard style={styles.toolCard}>
        {icon}
        <Text style={styles.toolText}>{label}</Text>
      </GlassCard>
    </Pressable>
  );
}

function TimelineTrack({
  icon,
  label,
  blocks,
  compact,
}: {
  icon: ReactNode;
  label: string;
  blocks: string[];
  compact?: boolean;
}) {
  return (
    <View style={styles.timelineTrack}>
      <View style={styles.timelineLabel}>
        {icon}
        <Text style={styles.smallText}>{label}</Text>
      </View>
      <View style={[styles.timelineLane, compact && styles.timelineLaneCompact]}>
        {blocks.map((block, index) => (
          <View key={`${block}-${index}`} style={[styles.timelineBlock, index === 1 && styles.timelineBlockActive]}>
            <Text numberOfLines={1} style={styles.timelineBlockText}>
              {block}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}

export function TrendsScreen({ onDraftFromTrend }: { onDraftFromTrend: (draft: DraftShort) => void }) {
  const [category, setCategory] = useState('All');

  const visibleTrends = trends.filter((trend) => category === 'All' || trend.niche === category);

  const createFromTrend = (trend: Trend) => onDraftFromTrend(generateDraftFromTrend(trend));

  return (
    <ScreenScroll>
      <View style={styles.chipRow}>
        {categories.map((item) => (
          <Chip key={item} label={item} active={category === item} onPress={() => setCategory(item)} />
        ))}
      </View>

      {visibleTrends.map((trend) => (
        <GlassCard key={trend.id} style={styles.trendCard}>
          <View style={styles.rowBetween}>
            <View style={styles.flexOne}>
              <Text style={styles.kicker}>{trend.niche}</Text>
              <Text style={styles.cardTitle}>{trend.tag}</Text>
              <Text style={styles.bodyMuted}>{trend.idea}</Text>
            </View>
            <View style={styles.scoreBadge}>
              <Text style={styles.scoreText}>{String(trend.potential)}%</Text>
              <Text style={styles.scoreLabel}>viral</Text>
            </View>
          </View>
          <GradientButton label="Convertir en draft" icon={Sparkles} onPress={() => createFromTrend(trend)} />
        </GlassCard>
      ))}
    </ScreenScroll>
  );
}

// Pantalla de programación de publicaciones
// Permite seleccionar fecha, hora, canales y editar metadatos
export function SchedulerScreen({
  draft,
  scheduledPosts,
  onSchedule,
}: {
  draft: DraftShort;
  scheduledPosts: ScheduledPost[];
  onSchedule: (post: ScheduledPost) => void;
}) {
  const [selectedDay, setSelectedDay] = useState('Jue 21');
  const [selectedTime, setSelectedTime] = useState('18:00');
  const [selectedChannels, setSelectedChannels] = useState(['YouTube Shorts']);
  const [title, setTitle] = useState(draft.title);
  const [description, setDescription] = useState(draft.description);

  // Toggle para seleccionar/deseleccionar canales
  const toggleChannel = (channel: string) => {
    setSelectedChannels((items) => (items.includes(channel) ? items.filter((item) => item !== channel) : [...items, channel]));
  };

  // Crea un post programado o lo publica inmediatamente
  const schedule = (publishNow = false) => {
    if (!selectedChannels.length) {
      return;
    }

    onSchedule(
      createScheduledPost(
        {
          ...draft,
          title,
          description,
        },
        selectedDay,
        selectedTime,
        selectedChannels,
        publishNow,
      ),
    );
  };

  return (
    <ScreenScroll>
      {/* Selector de fecha con auto-slot recomendado */}
      <SectionTitle title="Fecha" action="auto slot" />
      <View style={styles.dateRow}>
        {days.map((day) => (
          <Pressable key={day} onPress={() => setSelectedDay(day)} style={[styles.datePill, selectedDay === day && styles.datePillActive]}>
            <Text style={[styles.dateNumber, selectedDay === day && styles.dateNumberActive]}>{day.split(' ')[1]}</Text>
            <Text style={[styles.smallMuted, selectedDay === day && styles.smallText]}>{day.split(' ')[0]}</Text>
          </Pressable>
        ))}
      </View>

      {/* Selector de hora de publicación */}
      <View style={styles.chipRow}>
        {times.map((time) => (
          <Chip key={time} label={time} active={selectedTime === time} onPress={() => setSelectedTime(time)} />
        ))}
      </View>

      <GlassCard>
        <Text style={styles.fieldLabel}>Titulo</Text>
        <TextInput value={title} onChangeText={setTitle} style={styles.singleInput} />
        <Text style={styles.fieldLabel}>Descripcion</Text>
        <TextInput multiline value={description} onChangeText={setDescription} style={[styles.singleInput, styles.descriptionInput]} />
        <View style={styles.assetRow}>
          {draft.hashtags.map((tag) => (
            <View key={tag} style={styles.assetChip}>
              <Text style={styles.assetText}>{tag}</Text>
            </View>
          ))}
        </View>
      </GlassCard>

      {/* Selector de canales de distribución */}
      <SectionTitle title="Canales" />
      <View style={styles.channelGrid}>
        {channels.map((channel) => (
          <Pressable key={channel} onPress={() => toggleChannel(channel)} style={styles.channelCard}>
            <CheckCircle2 size={20} color={selectedChannels.includes(channel) ? colors.accent : colors.dim} />
            <Text style={styles.smallText}>{channel}</Text>
          </Pressable>
        ))}
      </View>

      <View style={styles.buttonGrid}>
        <GradientButton label="Programar" icon={CalendarClock} onPress={() => schedule(false)} />
        <GradientButton label="Publicar ahora" icon={Download} danger onPress={() => schedule(true)} />
      </View>

      {/* Vista de posts ya programados */}
      <SectionTitle title="Agenda" action={`${String(scheduledPosts.length)} items`} />
      {scheduledPosts.slice(0, 3).map((post) => (
        <GlassCard key={post.id}>
          <View style={styles.rowBetween}>
            <View style={styles.flexOne}>
              <Text numberOfLines={1} style={styles.cardTitle}>
                {post.title}
              </Text>
              <Text style={styles.bodyMuted}>
                {post.day} - {post.time} - {post.channels.join(', ')}
              </Text>
            </View>
            <StatusBadge label={post.status} color={post.status === 'published' ? colors.success : colors.danger} />
          </View>
        </GlassCard>
      ))}
    </ScreenScroll>
  );
}

// Pantalla de análisis con síntesis de revenue y retención por escena
export function AnalyticsScreen() {
  const revenue = [32, 48, 42, 74, 62, 88, 96];

  return (
    <ScreenScroll>
      {/* Card de síntesis de ingresos con gráfico */}
      <GlassCard>
        <Text style={styles.kicker}>Revenue synthesis</Text>
        <Text style={styles.heroValue}>$2,840</Text>
        <Text style={styles.bodyMuted}>Proyeccion +21% segun clips publicados y retencion media.</Text>
        {/* Gráfico de barras que representa ingresos por día */}
        <View style={styles.chartRow}>
          {revenue.map((value, index) => (
            <View key={`${value}-${index}`} style={styles.chartColumn}>
              <View style={[styles.chartBar, { height: value }]} />
            </View>
          ))}
        </View>
      </GlassCard>

      {/* Curva de retención visual para cada escena */}
      <SectionTitle title="Retencion por escena" />
      <GlassCard>
        {[92, 84, 71, 63, 58].map((value, index) => (
          <View key={value} style={styles.retentionRow}>
            <View style={styles.rowBetween}>
              <Text style={styles.smallText}>Scene {String(index + 1)}</Text>
              <Text style={styles.smallMuted}>{String(value)}%</Text>
            </View>
            <ProgressBar value={value} color={index < 2 ? colors.accent : colors.primaryStrong} />
          </View>
        ))}
      </GlassCard>
    </ScreenScroll>
  );
}

// Pantalla de biblioteca de medios reutilizables
// Permite buscar y filtrar clips, música, marcas y assets generados
export function LibraryScreen() {
  const [tab, setTab] = useState('All');
  const [query, setQuery] = useState('');

  // Filtra items por tipo y búsqueda textual
  const items = libraryItems.filter((item) => {
    const matchesTab = tab === 'All' || item.type === tab;
    const normalized = query.toLowerCase();
    const matchesQuery =
      !normalized || item.title.toLowerCase().includes(normalized) || item.tags.some((tag) => tag.includes(normalized));
    return matchesTab && matchesQuery;
  });

  return (
    <ScreenScroll>
      {/* Barra de búsqueda global */}
      <View style={styles.searchBox}>
        <Search size={18} color={colors.dim} />
        <TextInput
          value={query}
          onChangeText={setQuery}
          placeholder="Buscar clips, musica o kits..."
          placeholderTextColor={colors.dim}
          style={styles.searchInput}
        />
      </View>
      <View style={styles.chipRow}>
        {['All', 'Generated', 'Uploaded', 'Music', 'Brand'].map((item) => (
          <Chip key={item} label={item} active={tab === item} onPress={() => setTab(item)} />
        ))}
      </View>

      {/* Grid de items de biblioteca */}
      <View style={styles.libraryGrid}>
        {items.map((item) => (
          <GlassCard key={item.id} style={styles.libraryCard}>
            <EmptyVisual label={item.type} color={item.color} />
            <Text numberOfLines={1} style={styles.cardTitle}>
              {item.title}
            </Text>
            <Text style={styles.bodyMuted}>{item.meta}</Text>
          </GlassCard>
        ))}
      </View>
    </ScreenScroll>
  );
}

// Pantalla de cerebro IA: configura la identidad del canal
// Define persona, voz sintetizada y brand kit
export function BrainScreen() {
  const [persona, setPersona] = useState('Tech');
  const [voiceSpeed, setVoiceSpeed] = useState(72);

  return (
    <ScreenScroll>
      {/* Selector de persona de canal */}
      <GlassCard>
        <View style={styles.iconTitle}>
          <BrainCircuit size={20} color={colors.primary} />
          <Text style={styles.cardTitle}>Identidad del canal</Text>
        </View>
        <Text style={styles.bodyMuted}>El perfil IA afecta guiones, tono, voz y sugerencias.</Text>
        <View style={styles.chipRow}>
          {['Tech', 'Finance', 'Comedy', 'Education'].map((item) => (
            <Chip key={item} label={item} active={persona === item} onPress={() => setPersona(item)} />
          ))}
        </View>
      </GlassCard>

      <GlassCard>
        <Text style={styles.kicker}>Voice profile</Text>
        <Text style={styles.cardTitle}>ElevenLabs - Adam</Text>
        <VoiceControl label="Velocidad" value={voiceSpeed} onPress={() => setVoiceSpeed(voiceSpeed >= 88 ? 60 : voiceSpeed + 8)} />
        <VoiceControl label="Energia" value={86} />
        <VoiceControl label="Emocion" value={64} />
      </GlassCard>

      <GlassCard>
        <View style={styles.iconTitle}>
          <Palette size={20} color={colors.accent} />
          <Text style={styles.cardTitle}>Brand Kit</Text>
        </View>
        <View style={styles.swatches}>
          {[colors.primaryStrong, colors.accent, colors.danger, '#111827'].map((item) => (
            <View key={item} style={[styles.swatch, { backgroundColor: item }]} />
          ))}
        </View>
      </GlassCard>
    </ScreenScroll>
  );
}

// Control de parámetro de voz con barra de progreso interactiva
function VoiceControl({ label, value, onPress }: { label: string; value: number; onPress?: () => void }) {
  return (
    <Pressable onPress={onPress} style={styles.voiceControl}>
      <View style={styles.rowBetween}>
        <Text style={styles.smallText}>{label}</Text>
        <Text style={styles.smallMuted}>{value}%</Text>
      </View>
      <ProgressBar value={value} color={colors.primary} />
    </Pressable>
  );
}

// Pantalla de configuración con perfil, seguridad y límites
export function SettingsScreen() {
  return (
    <ScreenScroll>
      {/* Tarjeta de perfil con límite de renders */}
      <GlassCard style={styles.profileCard}>
        <LinearGradient colors={[colors.primaryStrong, colors.indigo]} style={styles.avatar}>
          <Bot size={30} color="#fff" />
        </LinearGradient>
        <View style={styles.flexOne}>
          <Text style={styles.cardTitle}>Creator Pro</Text>
          <Text style={styles.bodyMuted}>Render limit: 82 / 100 este mes</Text>
        </View>
      </GlassCard>
      {/* Sección de configuración de seguridad */}
      <GlassCard>
        <View style={styles.iconTitle}>
          <ShieldCheck size={20} color={colors.success} />
          <Text style={styles.cardTitle}>Seguridad</Text>
        </View>
        <SettingRow title="2FA" value="Activo" />
        <SettingRow title="Password" value="Actualizada" />
        <SettingRow title="API Keys" value="Pendiente" />
      </GlassCard>
    </ScreenScroll>
  );
}

// Fila de configuración con título y valor
function SettingRow({ title, value }: { title: string; value: string }) {
  return (
    <View style={styles.settingRow}>
      <Text style={styles.smallText}>{title}</Text>
      <Text style={styles.smallMuted}>{value}</Text>
    </View>
  );
}

// Pantalla de soporte con FAQs y agente de soporte
export function SupportScreen() {
  const [query, setQuery] = useState('');
  // FAQs que se filtran según búsqueda
  const faqs = ['Publishing Automation', 'Voice synthesis', 'Render queue', 'YouTube API setup'].filter((item) =>
    item.toLowerCase().includes(query.toLowerCase()),
  );

  return (
    <ScreenScroll>
      {/* Búsqueda de FAQs */}
      <View style={styles.searchBox}>
        <Search size={18} color={colors.dim} />
        <TextInput
          value={query}
          onChangeText={setQuery}
          placeholder="Buscar en ayuda..."
          placeholderTextColor={colors.dim}
          style={styles.searchInput}
        />
      </View>
      {/* FAQs filtrados según búsqueda */}
      {faqs.map((title) => (
        <GlassCard key={title}>
          <Text style={styles.cardTitle}>{title}</Text>
          <Text style={styles.bodyMuted}>Guia rapida, problemas frecuentes y diagnostico asistido por IA.</Text>
        </GlassCard>
      ))}
      <GradientButton label="Abrir agente de soporte" icon={MessageCircle} />
    </ScreenScroll>
  );
}

// Pantalla adicional que agrupa módulos secundarios
// Proporciona acceso a tendencias, analíticas, biblioteca, cerebro, configuración y soporte
export function MoreScreen({ goTo }: { goTo: (screen: ScreenId) => void }) {
  const modules: Array<{ id: ScreenId; title: string; subtitle: string; icon: ReactNode }> = [
    { id: 'trends', title: 'Tendencias', subtitle: 'Ideas y potencial viral', icon: <TrendingUp size={20} color={colors.accent} /> },
    { id: 'analytics', title: 'Analiticas', subtitle: 'Revenue, retencion y audiencia', icon: <TrendingUp size={20} color={colors.accent} /> },
    { id: 'library', title: 'Biblioteca', subtitle: 'Assets, musica y brand kits', icon: <FileVideo size={20} color={colors.primary} /> },
    { id: 'brain', title: 'Cerebro IA', subtitle: 'Persona, voz y marca', icon: <BrainCircuit size={20} color={colors.primary} /> },
    { id: 'settings', title: 'Configuracion', subtitle: 'Perfil, seguridad y limites', icon: <ShieldCheck size={20} color={colors.success} /> },
    { id: 'support', title: 'Soporte', subtitle: 'FAQ y agente IA', icon: <MessageCircle size={20} color={colors.warning} /> },
  ];

  return (
    <ScreenScroll>
      {/* Lista de módulos disponibles */}
      {modules.map((module) => (
        <Pressable key={module.id} onPress={() => goTo(module.id)}>
          <GlassCard style={styles.moduleCard}>
            {module.icon}
            <View style={styles.flexOne}>
              <Text style={styles.cardTitle}>{module.title}</Text>
              <Text style={styles.bodyMuted}>{module.subtitle}</Text>
            </View>
          </GlassCard>
        </Pressable>
      ))}
    </ScreenScroll>
  );
}

// Estilos centralizados para todas las pantallas
// Mantiene coherencia visual y facilita actualizaciones de tema
const styles = StyleSheet.create({
  screen: {
    paddingHorizontal: spacing.md,
    paddingTop: spacing.xs,
    paddingBottom: spacing.lg,
    gap: spacing.sm,
  },
  heroCard: {
    minHeight: 118,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  heroCopy: {
    flex: 1,
    paddingRight: spacing.md,
  },
  kicker: {
    color: colors.primary,
    ...typography.label,
    textTransform: 'uppercase',
  },
  heroValue: {
    color: colors.text,
    fontSize: 34,
    lineHeight: 40,
    fontFamily: fonts.extra,
    letterSpacing: 0,
    marginVertical: 2,
  },
  heroOrb: {
    width: 76,
    height: 76,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.glassStrong,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroOrbText: {
    color: colors.accent,
    fontSize: 21,
    lineHeight: 27,
    fontFamily: fonts.extra,
    letterSpacing: 0,
  },
  heroOrbLabel: {
    color: colors.muted,
    ...typography.label,
  },
  quickActions: {
    flexDirection: 'row',
    gap: spacing.xs,
  },
  quickAction: {
    flex: 1,
    minHeight: 50,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.lg,
    backgroundColor: colors.glass,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
  },
  quickActionText: {
    color: colors.text,
    ...typography.label,
    fontSize: 10,
  },
  metricGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
  },
  metricCard: {
    flexBasis: '48%',
    flexGrow: 1,
    minHeight: 88,
  },
  metricLabel: {
    color: colors.muted,
    ...typography.label,
    textTransform: 'uppercase',
  },
  metricValue: {
    color: colors.text,
    fontSize: 22,
    lineHeight: 28,
    fontFamily: fonts.extra,
    letterSpacing: 0,
    marginTop: spacing.xs,
  },
  metricDelta: {
    color: colors.accent,
    ...typography.label,
    marginTop: 2,
  },
  automationCard: {
    gap: spacing.xs,
  },
  nextPostCard: {
    borderColor: 'rgba(255,85,64,0.32)',
  },
  rowBetween: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.sm,
  },
  flexOne: {
    flex: 1,
  },
  cardTitle: {
    color: colors.text,
    ...typography.section,
  },
  bodyMuted: {
    color: colors.muted,
    ...typography.body,
    marginTop: 3,
  },
  smallMuted: {
    color: colors.dim,
    ...typography.label,
  },
  smallText: {
    color: colors.text,
    ...typography.label,
  },
  badge: {
    borderRadius: radii.full,
    borderWidth: 1,
    paddingHorizontal: spacing.xs,
    paddingVertical: 5,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: 'rgba(255,255,255,0.05)',
  },
  badgeDot: {
    width: 6,
    height: 6,
    borderRadius: 999,
  },
  badgeText: {
    color: colors.text,
    ...typography.label,
    fontSize: 10,
  },
  iconTitle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    marginBottom: spacing.sm,
  },
  promptInput: {
    minHeight: 112,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.border,
    color: colors.text,
    backgroundColor: 'rgba(0,0,0,0.22)',
    padding: spacing.sm,
    textAlignVertical: 'top',
    ...typography.body,
  },
  hintRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: spacing.xs,
  },
  fieldLabel: {
    color: colors.muted,
    ...typography.label,
    marginTop: spacing.sm,
    marginBottom: spacing.xs,
    textTransform: 'uppercase',
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
  },
  previewCard: {
    gap: spacing.xs,
  },
  assetRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
    marginTop: spacing.sm,
  },
  assetChip: {
    borderRadius: radii.full,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.xs,
    paddingVertical: 5,
    maxWidth: '100%',
    backgroundColor: 'rgba(255,255,255,0.05)',
  },
  assetText: {
    color: colors.muted,
    ...typography.label,
    fontSize: 10,
  },
  sceneRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    paddingVertical: spacing.xs,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.07)',
  },
  sceneIndex: {
    width: 36,
    height: 36,
    borderRadius: radii.md,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.glassStrong,
  },
  sceneIndexText: {
    color: colors.primary,
    ...typography.label,
  },
  editorPreview: {
    alignItems: 'center',
  },
  videoFrame: {
    width: '60%',
    maxWidth: 250,
    minWidth: 210,
    aspectRatio: 9 / 16,
    borderRadius: radii.xl,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    alignItems: 'center',
    justifyContent: 'space-between',
    overflow: 'hidden',
  },
  videoTopBar: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  previewLabel: {
    color: colors.accent,
    ...typography.label,
  },
  previewTitle: {
    color: colors.text,
    fontSize: 24,
    lineHeight: 31,
    fontFamily: fonts.extra,
    letterSpacing: 0,
    textAlign: 'center',
  },
  playButton: {
    width: 58,
    height: 58,
    borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.18)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  toolRow: {
    flexDirection: 'row',
    gap: spacing.xs,
  },
  toolPressable: {
    flex: 1,
  },
  pressed: {
    opacity: 0.78,
    transform: [{ scale: 0.98 }],
  },
  toolCard: {
    minHeight: 62,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
  },
  toolText: {
    color: colors.text,
    ...typography.label,
  },
  timelineTrack: {
    gap: 6,
    marginBottom: spacing.sm,
  },
  timelineLabel: {
    flexDirection: 'row',
    gap: spacing.xs,
    alignItems: 'center',
  },
  timelineLane: {
    minHeight: 42,
    borderRadius: radii.md,
    backgroundColor: 'rgba(0,0,0,0.22)',
    padding: 6,
    flexDirection: 'row',
    gap: 6,
  },
  timelineLaneCompact: {
    minHeight: 34,
  },
  timelineBlock: {
    flex: 1,
    borderRadius: radii.sm,
    backgroundColor: 'rgba(255,255,255,0.09)',
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 5,
  },
  timelineBlockActive: {
    backgroundColor: colors.glassStrong,
    borderColor: colors.primary,
  },
  timelineBlockText: {
    color: colors.text,
    fontSize: 9,
    lineHeight: 12,
    fontFamily: fonts.bold,
    letterSpacing: 0,
  },
  scriptBlock: {
    paddingVertical: spacing.xs,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.07)',
  },
  visualText: {
    color: colors.accent,
    ...typography.body,
    marginTop: 3,
  },
  trendCard: {
    gap: spacing.sm,
  },
  scoreBadge: {
    width: 68,
    height: 68,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.glassStrong,
  },
  scoreText: {
    color: colors.accent,
    fontSize: 18,
    lineHeight: 24,
    fontFamily: fonts.extra,
    letterSpacing: 0,
  },
  scoreLabel: {
    color: colors.muted,
    ...typography.label,
  },
  dateRow: {
    flexDirection: 'row',
    gap: spacing.xs,
  },
  datePill: {
    flex: 1,
    minHeight: 58,
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.glass,
    alignItems: 'center',
    justifyContent: 'center',
  },
  datePillActive: {
    backgroundColor: colors.glassStrong,
    borderColor: colors.primary,
  },
  dateNumber: {
    color: colors.muted,
    fontSize: 18,
    lineHeight: 24,
    fontFamily: fonts.extra,
    letterSpacing: 0,
  },
  dateNumberActive: {
    color: colors.text,
  },
  singleInput: {
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.border,
    color: colors.text,
    backgroundColor: 'rgba(0,0,0,0.22)',
    padding: spacing.sm,
    ...typography.body,
  },
  descriptionInput: {
    minHeight: 74,
    textAlignVertical: 'top',
  },
  channelGrid: {
    gap: spacing.xs,
  },
  channelCard: {
    minHeight: 50,
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.glass,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingHorizontal: spacing.md,
  },
  buttonGrid: {
    gap: spacing.xs,
  },
  chartRow: {
    height: 112,
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: spacing.xs,
    marginTop: spacing.md,
  },
  chartColumn: {
    flex: 1,
    height: '100%',
    justifyContent: 'flex-end',
    borderRadius: radii.full,
    backgroundColor: 'rgba(255,255,255,0.05)',
    overflow: 'hidden',
  },
  chartBar: {
    borderRadius: radii.full,
    backgroundColor: colors.accent,
  },
  retentionRow: {
    gap: spacing.xs,
    marginBottom: spacing.sm,
  },
  searchBox: {
    minHeight: 48,
    borderRadius: radii.full,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.glass,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingHorizontal: spacing.md,
  },
  searchInput: {
    flex: 1,
    color: colors.text,
    ...typography.body,
  },
  libraryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
  },
  libraryCard: {
    flexBasis: '48%',
    flexGrow: 1,
    gap: spacing.xs,
  },
  voiceControl: {
    gap: spacing.xs,
    marginTop: spacing.sm,
  },
  swatches: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.sm,
  },
  swatch: {
    width: 42,
    height: 42,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  avatar: {
    width: 62,
    height: 62,
    borderRadius: radii.xl,
    alignItems: 'center',
    justifyContent: 'center',
  },
  settingRow: {
    minHeight: 46,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.08)',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  moduleCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
});
