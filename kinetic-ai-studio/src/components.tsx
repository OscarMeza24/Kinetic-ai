import type { ReactNode } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View, type StyleProp, type ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import {
  BarChart3,
  Bot,
  BrainCircuit,
  CalendarDays,
  CircleHelp,
  Clapperboard,
  Gauge,
  Home,
  Library,
  type LucideIcon,
  MoreHorizontal,
  Settings,
  Sparkles,
  TrendingUp,
} from 'lucide-react-native';
import { colors, fonts, radii, spacing, typography } from './theme';
import type { ScreenId } from './types';

// Props para componentes que aceptan children y estilos personalizados
type CardProps = {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
};

// Tarjeta de vidrio con efecto glassmorphism
// Componente base para contener contenido con estilo translucido
export function GlassCard({ children, style }: CardProps) {
  return <View style={[styles.card, style]}>{children}</View>;
}

// Botón con gradiente lineal y efecto press
// Soporta icono opcional, colores peligrosos y animaciones de feedback
export function GradientButton({
  label,
  onPress,
  icon: Icon,
  danger,
}: {
  label: string;
  onPress?: () => void;
  icon?: LucideIcon;
  danger?: boolean;
}) {
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.buttonShell, pressed && styles.pressed]}>
      {/* Gradiente rojo para botones peligrosos, azul-índigo para normales */}
      <LinearGradient
        colors={danger ? [colors.danger, '#b91c1c'] : [colors.primaryStrong, colors.indigo]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.button}
      >
        {Icon ? <Icon size={18} color="#fff" strokeWidth={2.4} /> : null}
        <Text style={styles.buttonText}>{label}</Text>
      </LinearGradient>
    </Pressable>
  );
}

// Chip selector con estado activo/inactivo
// Componente para seleccionar opciones o filtros
export function Chip({
  label,
  active,
  onPress,
}: {
  label: string;
  active?: boolean;
  onPress?: () => void;
}) {
  return (
    <Pressable onPress={onPress} style={[styles.chip, active && styles.chipActive]}>
      <Text style={[styles.chipText, active && styles.chipTextActive]}>{label}</Text>
    </Pressable>
  );
}

// Encabezado de sección con título y acción opcional
export function SectionTitle({ title, action }: { title: string; action?: string }) {
  return (
    <View style={styles.sectionTitle}>
      <Text style={styles.sectionText}>{title}</Text>
      {/* Acción opcional en el lado derecho (ej: "Ver todo") */}
      {action ? <Text style={styles.sectionAction}>{action}</Text> : null}
    </View>
  );
}

// Barra de progreso visual
// Muestra el avance con un relleno de porcentaje
export function ProgressBar({ value, color = colors.accent }: { value: number; color?: string }) {
  return (
    <View style={styles.progressTrack}>
      {/* El ancho se calcula como porcentaje, limitado entre 0-100 */}
      <View style={[styles.progressFill, { width: `${Math.max(0, Math.min(100, value))}%`, backgroundColor: color }]} />
    </View>
  );
}

// Navegación principal inferior con 5 opciones principales
// Aparece en el fondo de la pantalla en dispositivos móviles
const primaryNav: Array<{ id: ScreenId; label: string; icon: LucideIcon }> = [
  { id: 'dashboard', label: 'Home', icon: Home },
  { id: 'studio', label: 'Studio', icon: Sparkles },
  { id: 'editor', label: 'Editor', icon: Clapperboard },
  { id: 'scheduler', label: 'Agenda', icon: CalendarDays },
  { id: 'more', label: 'Mas', icon: MoreHorizontal },
];

// Rail de módulos laterales con todas las pantallas disponibles
// Se muestra en pantallas más grandes como columna vertical o horizontal scrollable
const moduleRail: Array<{ id: ScreenId; label: string; icon: LucideIcon }> = [
  { id: 'dashboard', label: 'Dashboard', icon: Gauge },
  { id: 'studio', label: 'IA Studio', icon: Sparkles },
  { id: 'editor', label: 'Clips', icon: Clapperboard },
  { id: 'trends', label: 'Tendencias', icon: TrendingUp },
  { id: 'scheduler', label: 'Publicar', icon: CalendarDays },
  { id: 'analytics', label: 'Analiticas', icon: BarChart3 },
  { id: 'library', label: 'Medios', icon: Library },
  { id: 'brain', label: 'Cerebro IA', icon: BrainCircuit },
  { id: 'settings', label: 'Ajustes', icon: Settings },
  { id: 'support', label: 'Soporte', icon: CircleHelp },
];

// Rail de módulos scrolleable horizontal
// Permite acceder a todos los módulos sin ocupar espacio vertical
export function ModuleRail({ active, goTo }: { active: ScreenId; goTo: (screen: ScreenId) => void }) {
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.moduleRail}>
      {moduleRail.map((item) => {
        const Icon = item.icon;
        // Resalta visualmente el módulo activo con colores y fondo diferentes
        const isActive = active === item.id;
        return (
          <Pressable key={item.id} onPress={() => goTo(item.id)} style={[styles.moduleItem, isActive && styles.moduleItemActive]}>
            <Icon size={16} color={isActive ? colors.text : colors.muted} strokeWidth={2.4} />
            <Text style={[styles.moduleText, isActive && styles.moduleTextActive]}>{item.label}</Text>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

// Navegación inferior con 5 opciones principales
// Componente principal para la navegación en dispositivos móviles
export function BottomNav({ active, goTo }: { active: ScreenId; goTo: (screen: ScreenId) => void }) {
  // Si la pantalla activa no está en primaryNav, muestra 'more' como activo
  const effectiveActive = primaryNav.some((item) => item.id === active) ? active : 'more';

  return (
    <View style={styles.bottomNav}>
      {primaryNav.map((item) => {
        const Icon = item.icon;
        // Resalta el elemento activo con color primario y fondo distinguido
        const isActive = effectiveActive === item.id;
        return (
          <Pressable key={item.id} onPress={() => goTo(item.id)} style={[styles.navItem, isActive && styles.navItemActive]}>
            <Icon size={20} color={isActive ? colors.primary : colors.dim} strokeWidth={2.4} />
            <Text style={[styles.navText, isActive && styles.navTextActive]}>{item.label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

// Composición visual de bot de IA para estados vacios
// Muestra un gradiente con icono y texto informativo
export function EmptyVisual({ label, color = colors.primaryStrong }: { label: string; color?: string }) {
  return (
    <LinearGradient colors={[color, '#111827']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.visual}>
      {/* Icono de bot de IA con opacidad semi-transparente */}
      <Bot size={32} color="rgba(255,255,255,0.84)" strokeWidth={2.2} />
      <Text style={styles.visualText}>{label}</Text>
    </LinearGradient>
  );
}

// Estilos centralizados para todos los componentes
// Mantiene coherencia visual y facilita actualizaciones de tema
const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.glass,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.lg,
    padding: 14,
    shadowColor: colors.primaryStrong,
    shadowOpacity: 0.1,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 7 },
    elevation: 2,
  },
  buttonShell: {
    borderRadius: radii.full,
    overflow: 'hidden',
  },
  pressed: {
    opacity: 0.82,
    transform: [{ scale: 0.98 }],
  },
  button: {
    minHeight: 44,
    paddingHorizontal: spacing.md,
    borderRadius: radii.full,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
  },
  buttonText: {
    color: '#fff',
    ...typography.label,
    fontSize: 13,
  },
  chip: {
    borderRadius: radii.full,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.sm,
    paddingVertical: 7,
    backgroundColor: 'rgba(255,255,255,0.05)',
  },
  chipActive: {
    borderColor: colors.primary,
    backgroundColor: colors.glassStrong,
  },
  chipText: {
    color: colors.muted,
    ...typography.label,
  },
  chipTextActive: {
    color: colors.text,
  },
  sectionTitle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  sectionText: {
    color: colors.text,
    ...typography.section,
  },
  sectionAction: {
    color: colors.primary,
    ...typography.label,
  },
  progressTrack: {
    height: 8,
    borderRadius: radii.full,
    backgroundColor: 'rgba(255,255,255,0.08)',
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: radii.full,
  },
  moduleRail: {
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.sm,
    gap: spacing.xs,
  },
  moduleItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingVertical: 7,
    paddingHorizontal: spacing.sm,
    borderRadius: radii.full,
    borderWidth: 1,
    borderColor: 'transparent',
    backgroundColor: 'rgba(255,255,255,0.04)',
  },
  moduleItemActive: {
    borderColor: colors.border,
    backgroundColor: colors.glassStrong,
  },
  moduleText: {
    color: colors.muted,
    ...typography.label,
  },
  moduleTextActive: {
    color: colors.text,
  },
  bottomNav: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: spacing.md,
    marginBottom: spacing.sm,
    padding: 6,
    borderRadius: radii.xl,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: 'rgba(19,19,21,0.92)',
  },
  navItem: {
    flex: 1,
    minHeight: 54,
    borderRadius: radii.md,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
  },
  navItemActive: {
    backgroundColor: colors.glassStrong,
  },
  navText: {
    color: colors.dim,
    fontSize: 10,
    lineHeight: 14,
    fontFamily: fonts.bold,
    letterSpacing: 0,
  },
  navTextActive: {
    color: colors.primary,
  },
  visual: {
    minHeight: 104,
    borderRadius: radii.md,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
    overflow: 'hidden',
  },
  visualText: {
    color: colors.text,
    ...typography.label,
  },
});
