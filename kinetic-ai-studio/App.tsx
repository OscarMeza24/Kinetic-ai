// Importaciones de Expo y React Native para estructura base de la app
import { StatusBar } from 'expo-status-bar';
import { useEffect, useMemo, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';

// Gradientes visuales y fuentes tipográficas de Google Fonts
import { LinearGradient } from 'expo-linear-gradient';
import {
  Sora_400Regular,
  Sora_600SemiBold,
  Sora_700Bold,
  Sora_800ExtraBold,
  useFonts,
} from '@expo-google-fonts/sora';
// Componentes UI reutilizables y pantallas principales
import { BottomNav } from './src/components';
import {
  AnalyticsScreen,
  BrainScreen,
  DashboardScreen,
  EditorScreen,
  LibraryScreen,
  MoreScreen,
  SchedulerScreen,
  SettingsScreen,
  StudioScreen,
  SupportScreen,
  TrendsScreen,
} from './src/screens';

// Servicios, datos iniciales y tokens de diseño
import { initialAutomations, initialDraft, initialScheduledPosts } from './src/data';
import { advanceAutomation, buildRenderJob } from './src/services/kineticAi';
import { colors, fonts, spacing } from './src/theme';
import type { Automation, DraftShort, ScheduledPost, ScreenId } from './src/types';

// Títulos de pantallas mostrados en el encabezado, mapeados a ScreenId
const screenTitles: Record<ScreenId, string> = {
  dashboard: 'Dashboard',        // Panel principal con métricas y jobs
  studio: 'IA Studio',           // Generación de drafts con IA
  editor: 'Editor de Clips',     // Edición avanzada de videos
  trends: 'Tendencias',          // Ideas de contenido trending
  scheduler: 'Publicacion',      // Programación de publicaciones
  analytics: 'Analiticas',       // Análisis y métricas
  library: 'Biblioteca',         // Librería de medios
  brain: 'Cerebro IA',           // Configuración del bot de IA
  settings: 'Configuracion',     // Ajustes de usuario
  support: 'Soporte',            // Centro de ayuda
  more: 'Modulos',               // Hub de módulos secundarios
};

// Componente principal de la aplicación - gestor de navegación y estado global
export default function App() {
  // Carga de fuentes tipográficas Sora desde Google Fonts
  const [fontsLoaded] = useFonts({
    Sora_400Regular,
    Sora_600SemiBold,
    Sora_700Bold,
    Sora_800ExtraBold,
  });
  // Estado global de la aplicación
  const [activeScreen, setActiveScreen] = useState<ScreenId>('dashboard');          // Pantalla activa actual
  const [automations, setAutomations] = useState<Automation[]>(initialAutomations); // Cola de render jobs
  const [draft, setDraft] = useState<DraftShort>(initialDraft);                     // Draft en edición
  const [scheduledPosts, setScheduledPosts] = useState<ScheduledPost[]>(initialScheduledPosts); // Posts programados
  const [activity, setActivity] = useState('Sistema listo');                        // Mensaje de estado en header

  // Calcula el progreso promedio de todos los jobs en processing
  const totalProgress = useMemo(() => {
    const active = automations.filter((item) => item.status === 'processing');
    if (!active.length) {
      return 0; // Sin jobs activos = 0% de progreso
    }

    // Promedio de progreso de todos los jobs activos
    return Math.round(active.reduce((sum, item) => sum + item.progress, 0) / active.length);
  }, [automations]);

  // Automáticamente avanza el progreso de jobs cada 2.5 segundos
  useEffect(() => {
    const timer = setInterval(() => {
      setAutomations((items) => items.map((item) => advanceAutomation(item)));
    }, 2500); // Intervalo de 2.5s para actualizar progreso

    return () => clearInterval(timer); // Limpia el intervalo al desmontar
  }, []);

  // Handler cuando se genera un nuevo draft desde StudioScreen
  const handleGenerate = (nextDraft: DraftShort) => {
    setDraft(nextDraft);                                        // Actualiza draft actual
    setAutomations((items) => [buildRenderJob(nextDraft), ...items]); // Crea nuevo job de render
    setActivity('Nuevo render en cola');                         // Actualiza estado
    setActiveScreen('editor');                                  // Navega a editor
  };

  // Handler para abrir pantalla de scheduling desde EditorScreen
  const handleOpenScheduler = () => {
    setActivity('Metadata preparada');      // Actualiza estado
    setActiveScreen('scheduler');           // Navega a scheduler
  };

  // Handler para programar una publicación desde SchedulerScreen
  const handleSchedule = (post: ScheduledPost) => {
    setScheduledPosts((items) => [post, ...items]); // Agrega nuevo post a lista
    setAutomations((items) =>
      items.map((item, index) =>
        index === 0 // Actualiza primer job (el más reciente)
          ? {
              ...item,
              status: 'scheduled',                                    // Cambia estado a programado
              stage: 'Programado para publicacion',
              progress: 100,                                          // Completa el progreso
              eta: post.status === 'published' ? 'Publicado' : `${post.day} ${post.time}`, // Fecha/hora
            }
          : item,
      ),
    );
    // Actualiza mensaje de estado según si se publica ya o se programa
    setActivity(post.status === 'published' ? 'Publicado en canales seleccionados' : 'Publicacion programada');
    setActiveScreen('dashboard'); // Vuelve a dashboard
  };

  // Handler cuando se actualiza el draft en EditorScreen (regenerar, cambiar visuales, etc)
  const handleDraftUpdate = (nextDraft: DraftShort, message: string) => {
    setDraft(nextDraft);      // Actualiza contenido del draft
    setActivity(message);     // Actualiza mensaje de estado
  };

  // Renderiza la pantalla correcta según activeScreen
  const renderScreen = () => {
    switch (activeScreen) {
      case 'dashboard':
        return (
          <DashboardScreen
            automations={automations}
            scheduledPosts={scheduledPosts}
            totalProgress={totalProgress}
            goTo={setActiveScreen}
          />
        );
      case 'studio':
        return <StudioScreen draft={draft} onGenerate={handleGenerate} />;
      case 'editor':
        return <EditorScreen draft={draft} onDraftUpdate={handleDraftUpdate} onOpenScheduler={handleOpenScheduler} />;
      case 'trends':
        return <TrendsScreen onDraftFromTrend={handleGenerate} />;
      case 'scheduler':
        return <SchedulerScreen draft={draft} scheduledPosts={scheduledPosts} onSchedule={handleSchedule} />;
      case 'analytics':
        return <AnalyticsScreen />;
      case 'library':
        return <LibraryScreen />;
      case 'brain':
        return <BrainScreen />;
      case 'settings':
        return <SettingsScreen />;
      case 'support':
        return <SupportScreen />;
      case 'more':
        return <MoreScreen goTo={setActiveScreen} />;
      default:
        return (
          <DashboardScreen
            automations={automations}
            scheduledPosts={scheduledPosts}
            totalProgress={totalProgress}
            goTo={setActiveScreen}
          />
        );
    }
  };

  // Pantalla de carga mientras se cargan las fuentes
  if (!fontsLoaded) {
    return (
      <LinearGradient colors={[colors.background, colors.surfaceLow]} style={styles.root}>
        <View style={styles.loading}>
          <Text style={styles.loadingText}>Kinetic AI</Text>
        </View>
      </LinearGradient>
    );
  }

  // Interfaz principal de la app: header + contenido dinámico + bottom nav
  return (
    <SafeAreaProvider>
      <LinearGradient colors={[colors.background, colors.surfaceLow, '#191125']} style={styles.root}>
        <StatusBar style="light" />
        <SafeAreaView style={styles.safeArea}>
          {/* Encabezado con branding, título de pantalla y estado */}
          <View style={styles.header}>
            <View>
              <Text style={styles.brand}>Kinetic AI</Text>
              <Text style={styles.screenTitle}>{screenTitles[activeScreen]}</Text>
            </View>
            {/* Píldora de estado con indicador vivo y mensaje */}
            <View style={styles.statusPill}>
              <View style={styles.statusDot} />
              <Text style={styles.statusText}>{activity}</Text>
            </View>
          </View>

          {/* Contenido dinámico según pantalla activa */}
          <View style={styles.content}>{renderScreen()}</View>

          {/* Navegación inferior con 5 opciones principales */}
          <BottomNav active={activeScreen} goTo={setActiveScreen} />
        </SafeAreaView>
      </LinearGradient>
    </SafeAreaProvider>
  );
}

// Estilos de la aplicación principal
const styles = StyleSheet.create({
  // Contenedor raíz con gradiente de fondo
  root: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: colors.background,
  },
  // Área segura dentro del SafeAreaView (limita ancho a 390px para móvil)
  safeArea: {
    flex: 1,
    width: '100%',
    maxWidth: 390,
    overflow: 'hidden',
    backgroundColor: colors.surface,
    borderLeftWidth: StyleSheet.hairlineWidth,   // Bordes sutiles para simular device bezel
    borderRightWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  // Encabezado con branding y estado - layout horizontal
  header: {
    paddingHorizontal: spacing.md,
    paddingTop: spacing.sm,
    paddingBottom: spacing.xs,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.sm,
  },
  // Logo/marca "Kinetic AI" en el encabezado
  brand: {
    color: colors.primary,
    fontSize: 14,
    lineHeight: 20,
    fontFamily: fonts.extra,
    letterSpacing: 0,
    textTransform: 'uppercase',
  },
  // Título de la pantalla activa (Dashboard, IA Studio, etc)
  screenTitle: {
    color: colors.text,
    fontSize: 22,
    lineHeight: 29,
    fontFamily: fonts.extra,
    letterSpacing: 0,
  },
  // Píldora de estado con indicador vivo en el encabezado
  statusPill: {
    maxWidth: 148,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: 999,
    backgroundColor: colors.glass,
    paddingHorizontal: spacing.xs,
    paddingVertical: 6,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  // Punto indicador de estado vivo (cyan)
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 999,
    backgroundColor: colors.accent,
  },
  // Texto de estado (mensaje de actividad)
  statusText: {
    color: colors.text,
    fontSize: 10,
    lineHeight: 14,
    fontFamily: fonts.bold,
    letterSpacing: 0,
    flexShrink: 1,
  },
  // Área de contenido dinámico (renderiza pantalla activa)
  content: {
    flex: 1,
  },
  // Layout de pantalla de carga
  loading: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  // Texto "Kinetic AI" en pantalla de carga
  loadingText: {
    color: colors.primary,
    fontSize: 24,
    fontFamily: fonts.extra,
  },
});
