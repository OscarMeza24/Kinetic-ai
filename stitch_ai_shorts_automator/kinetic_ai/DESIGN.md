---
name: Kinetic AI
colors:
  surface: '#131315'
  surface-dim: '#131315'
  surface-bright: '#39393b'
  surface-container-lowest: '#0e0e10'
  surface-container-low: '#1c1b1d'
  surface-container: '#201f22'
  surface-container-high: '#2a2a2c'
  surface-container-highest: '#353437'
  on-surface: '#e5e1e4'
  on-surface-variant: '#cbc3d7'
  inverse-surface: '#e5e1e4'
  inverse-on-surface: '#313032'
  outline: '#958ea0'
  outline-variant: '#494454'
  surface-tint: '#d0bcff'
  primary: '#d0bcff'
  on-primary: '#3c0091'
  primary-container: '#a078ff'
  on-primary-container: '#340080'
  inverse-primary: '#6d3bd7'
  secondary: '#ffb4a8'
  on-secondary: '#690100'
  secondary-container: '#ff5540'
  on-secondary-container: '#5c0000'
  tertiary: '#2fd9f4'
  on-tertiary: '#00363e'
  tertiary-container: '#009fb4'
  on-tertiary-container: '#002f36'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#e9ddff'
  primary-fixed-dim: '#d0bcff'
  on-primary-fixed: '#23005c'
  on-primary-fixed-variant: '#5516be'
  secondary-fixed: '#ffdad4'
  secondary-fixed-dim: '#ffb4a8'
  on-secondary-fixed: '#410000'
  on-secondary-fixed-variant: '#930100'
  tertiary-fixed: '#a2eeff'
  tertiary-fixed-dim: '#2fd9f4'
  on-tertiary-fixed: '#001f25'
  on-tertiary-fixed-variant: '#004e5a'
  background: '#131315'
  on-background: '#e5e1e4'
  surface-variant: '#353437'
typography:
  display-lg:
    fontFamily: Sora
    fontSize: 40px
    fontWeight: '800'
    lineHeight: 48px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Sora
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
    letterSpacing: -0.01em
  headline-lg-mobile:
    fontFamily: Sora
    fontSize: 28px
    fontWeight: '700'
    lineHeight: 36px
  headline-md:
    fontFamily: Sora
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  body-lg:
    fontFamily: Sora
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Sora
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  label-md:
    fontFamily: Sora
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 20px
    letterSpacing: 0.02em
  label-sm:
    fontFamily: Sora
    fontSize: 12px
    fontWeight: '700'
    lineHeight: 16px
    letterSpacing: 0.05em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 4px
  xs: 8px
  sm: 12px
  md: 16px
  lg: 24px
  xl: 32px
  margin-mobile: 20px
  gutter-mobile: 16px
---

## Brand & Style
This design system is built for the high-velocity world of short-form video creation. The brand personality is **energetic, precise, and futuristic**, positioning the AI not just as a tool, but as a creative co-pilot. 

The aesthetic blends **Glassmorphism** with **High-Contrast Modern** principles. It utilizes deep-space backgrounds to make video content the absolute protagonist, while UI elements appear as sophisticated, translucent overlays. The emotional response should be one of "effortless power"—where complex video automation feels as fluid as a swipe gesture. Visuals are punctuated by neon accents and subtle glows to signify active AI processing and high-tech sophistication.

## Colors
The palette is rooted in a **Midnight Black** base to ensure maximum contrast for RGB video content. 

- **Primary (Electric Purple):** Used for AI-driven actions, primary CTA states, and active processing indicators. It represents the "intelligence" layer.
- **Secondary (YouTube Red):** Reserved specifically for "Publish," "Live," or "Export to Shorts" actions to create a direct mental model with the target platform.
- **Accent (Neon Cyan):** Employed for success states, high-priority AI insights, and "magic" features.
- **Neutral:** A scale of deep slates and transperencies used to build the glass layers without distracting from the media.

Gradients should transition from Primary (#8B5CF6) to a deeper Indigo (#4F46E5) to provide depth to interactive surfaces.

## Typography
**Sora** is the sole typeface for this design system, chosen for its geometric clarity and tech-forward appearance. 

- **Headlines:** Utilize heavy weights (Bold/ExtraBold) with tight letter spacing to create an authoritative, "editorial" feel.
- **Body:** Regular weight is used for readability, though kept concise to favor visual-first layouts.
- **Labels:** Uppercase styling is encouraged for small labels and utility text to maintain a "dashboard" aesthetic.
- **Scaling:** On mobile, display sizes are reduced significantly to prioritize the video viewport while maintaining high legibility through weight.

## Layout & Spacing
The layout follows a **fluid grid model** optimized for a 9:16 aspect ratio. Content is pinned to a 4-column mobile grid.

- **Safe Zones:** Top and bottom margins are generous (32px+) to avoid overlap with OS-level overlays (Dynamic Island, navigation bars).
- **Rhythm:** A strict 4px base unit ensures mathematical harmony. Use 16px for standard component grouping and 24px for distinct section separation.
- **Contextual Overlays:** UI elements "float" over the video feed using 20px side margins, ensuring the interface feels like an augmented layer rather than a static container.

## Elevation & Depth
Depth is created through **Glassmorphism** rather than traditional drop shadows.

- **Surfaces:** Use a background blur (Backdrop Filter: 16px to 24px) combined with a 10% white or 10% primary-tinted fill.
- **Borders:** "Ghost borders" are essential. Use a 1px solid stroke at 15% opacity (White) to define edges.
- **AI Glow:** Elements involving active AI generation use an outer `box-shadow` with a high spread and low opacity using the Primary or Accent color to simulate a light-emitting source.
- **Z-Index:**
    1. Video Content (Base)
    2. Floating UI Controls (Glass)
    3. Modals/Overlays (Heavier Glass + Dimming)

## Shapes
The shape language is **distinctly rounded** to soften the high-tech edge, making the AI feel approachable.

- **Components:** Standard buttons and input fields use a `0.5rem` (8px) radius.
- **Containers:** Large cards and glass panels (like the "AI Prompt" drawer) use `1.5rem` (24px) to create a "nested" look that echoes modern smartphone hardware.
- **Active Elements:** Icons within buttons or circular "Record" buttons may utilize full pill-shaping (rounded-full) for maximum ergonomic comfort.

## Components
- **Buttons:**
    - *Primary:* Gradient fill (Purple to Indigo) with white text. High-contrast.
    - *Glass:* Translucent white (10%) with 20px blur and 1px border.
    - *Action:* The "Publish" button uses the Secondary YouTube Red to signal the final destination.
- **Input Fields:** Semi-transparent dark fills with Neon Cyan focus states. Labels are placed inside the field in `label-sm` style.
- **AI Chips:** Small, pill-shaped elements with a subtle Cyan inner-glow and bold line icons to represent auto-tags or AI suggestions.
- **Cards:** No solid backgrounds; use glass panels with `rounded-xl` corners. Headers inside cards should use `headline-md`.
- **Icons:** 2px stroke "bold line" style. Primary actions use the Primary color for icons; utility actions use high-opacity white.
- **Progress Bars:** Thin, Neon Cyan lines that pulse when AI is processing video frames.