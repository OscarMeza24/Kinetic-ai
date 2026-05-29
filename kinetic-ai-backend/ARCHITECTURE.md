# 📐 Arquitectura Backend - Kinetic AI

## Resumen Ejecutivo

Este es un backend Node.js + Express diseñado para producción, integrado con Supabase (PostgreSQL) para persistencia y autenticación JWT.

## 🏗️ Arquitectura General

```
┌─────────────────────────────────────────────┐
│         Frontend (Expo/React Native)        │
└──────────────────┬──────────────────────────┘
                   │ HTTP API (REST JSON)
                   ↓
        ┌──────────────────────┐
        │   Express.js Server  │
        │   (Node.js 20+)      │
        └──────┬───────────────┘
               │
        ┌──────┴──────────────────────┐
        ↓                             ↓
   ┌─────────────┐            ┌───────────────┐
   │ Middleware  │            │   Routes &    │
   │ - Auth JWT  │            │ Controllers   │
   │ - CORS      │            │               │
   │ - Error     │            │ - Auth        │
   │ - Logger    │            │ - Projects    │
   └─────────────┘            │ - Drafts      │
                              │ - (Future)    │
                              └───────┬───────┘
                                      ↓
                              ┌───────────────┐
                              │   Services    │
                              │   - Database  │
                              │   - OpenAI    │
                              │   - ElevenLabs│
                              │   - FFmpeg    │
                              │   - YouTube   │
                              └───────┬───────┘
                                      ↓
        ┌─────────────────────────────┴──────────────┐
        ↓                                            ↓
   ┌──────────────┐                        ┌────────────────┐
   │   Supabase   │                        │  External APIs │
   │  PostgreSQL  │                        │  - OpenAI      │
   │  - Tables    │                        │  - ElevenLabs  │
   │  - Auth      │                        │  - YouTube     │
   │  - Storage   │                        └────────────────┘
   └──────────────┘
```

## 📁 Estructura de Carpetas

```
src/
├── config/
│   ├── env.ts                # Validación de variables de entorno (Zod)
│   ├── logger.ts             # Winston logger configurado
│   └── supabase.ts           # Cliente Supabase inicializado
│
├── middleware/
│   ├── auth.ts               # JWT validation middleware
│   ├── errorHandler.ts       # Global error handling
│   ├── cors.ts               # CORS configuration
│   └── logger.ts             # Request logging middleware
│
├── routes/
│   ├── auth.ts               # POST /api/auth/* endpoints
│   ├── projects.ts           # /api/projects endpoints
│   ├── drafts.ts             # /api/projects/:id/drafts endpoints
│   ├── voice.ts              # (Fase 2+) voice generation
│   ├── render.ts             # (Fase 3+) video rendering
│   └── health.ts             # /health endpoint
│
├── controllers/
│   ├── authController.ts     # Lógica de autenticación
│   ├── projectController.ts  # CRUD de proyectos
│   ├── draftController.ts    # CRUD de drafts
│   ├── voiceController.ts    # (Fase 2+)
│   └── renderController.ts   # (Fase 3+)
│
├── services/
│   ├── database.service.ts   # Queries a Supabase
│   ├── openai.service.ts     # (Fase 2) Integración OpenAI
│   ├── elevenlabs.service.ts # (Fase 3) Integración ElevenLabs
│   ├── ffmpeg.service.ts     # (Fase 4) Video rendering
│   ├── youtube.service.ts    # (Fase 5) YouTube upload
│   ├── storage.service.ts    # File upload to Supabase Storage
│   └── queue.service.ts      # BullMQ job queue
│
├── types/
│   ├── index.ts              # Tipos principales
│   ├── env.ts                # Tipos de variables de entorno
│   └── (otros tipos específicos)
│
├── utils/
│   ├── validators.ts         # Funciones de validación
│   ├── helpers.ts            # Utilidades generales
│   ├── prompts.ts            # Prompts para OpenAI
│   └── constants.ts          # Constantes globales
│
├── jobs/
│   ├── renderJob.ts          # (Fase 4) Worker para renders
│   ├── schedulerJob.ts       # (Fase 5) Worker para publicaciones
│   └── analyticsJob.ts       # (Fase 5) Worker para analytics
│
└── index.ts                  # Entry point principal
```

## 🔄 Flujo de Datos (Ejemplo: Crear Draft)

```
Frontend (Expo)
    │
    └─> POST /api/projects/:projectId/drafts
        {prompt: "...", tone: "Formal", style: "Animado"}
        │
        └─> Express Router (/routes/drafts.ts)
            │
            └─> Controller (draftController.ts)
                │
                ├─> Validar que proyecto existe
                │   (database.service.getProjectById)
                │
                ├─> Validar input (Zod)
                │
                └─> Crear en BD
                    (database.service.createDraft)
                    │
                    └─> Supabase API
                        │
                        └─> PostgreSQL (insert)
                            │
                            └─> Response JSON
                                {
                                  success: true,
                                  data: { id, prompt, ... },
                                  timestamp: "..."
                                }
```

## 🔐 Autenticación (JWT)

```
1. Usuario hace login
   POST /api/auth/login {email, password}
   
2. Backend:
   - Busca usuario en BD
   - Valida password
   - Genera JWT token usando SUPABASE_JWT_SECRET
   - Retorna token
   
3. Frontend guarda token en AsyncStorage
   
4. Siguientes requests:
   GET /api/projects
   Authorization: Bearer <token>
   
5. Middleware (authMiddleware):
   - Extrae token del header
   - Verifica firma JWT
   - Agrega decoded payload a req.user
   - Continúa con request
```

## ✅ Validación de Datos

Usamos **Zod** para validación type-safe:

```typescript
// En middleware o controller
const schema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

// Automáticamente:
// - Valida tipos
// - Retorna error si no cumple
// - Documentación automática
```

## 🚨 Manejo de Errores

```
Error en cualquier controller
    ↓
throw new AppError(
  statusCode: number,  // 400, 401, 404, 500, etc
  code: string,        // 'NOT_FOUND', 'INVALID_CREDENTIALS', etc
  message: string      // Mensaje para el usuario
)
    ↓
Capturado por errorHandler middleware
    ↓
Response JSON estructurado:
{
  success: false,
  error: {
    message: "...",
    code: "...",
    details: {...}  // Solo en desarrollo
  },
  timestamp: "..."
}
```

## 📊 Base de Datos (Supabase/PostgreSQL)

### Tablas Principales (Fase 1)

```
users
├── id (UUID) PK
├── email (unique)
├── password_hash
├── full_name
└── timestamps

projects
├── id (UUID) PK
├── user_id (FK) ← users
├── title
├── description
├── niche
└── timestamps

drafts
├── id (UUID) PK
├── project_id (FK) ← projects
├── user_id (FK) ← users
├── prompt
├── tone, style
├── title, hook, script, scenes, assets
├── hashtags, description
├── voice, virality_score, duration
├── status, ai_model
└── timestamps
```

### Índices para Performance

- `idx_users_email` - Búsqueda rápida por email
- `idx_projects_user_id` - Proyectos del usuario
- `idx_drafts_user_id` - Drafts del usuario
- `idx_drafts_status` - Filtrar por estado
- etc.

## 🔌 Integración con Frontend

### Cambios Necesarios en Frontend (kinetic-ai-studio)

**Actualmente**:
```typescript
import { generateDraftFromPrompt } from './services/kineticAi';
const draft = generateDraftFromPrompt({prompt, tone, style});
```

**Luego de integrar backend**:
```typescript
const response = await fetch('http://localhost:3000/api/projects/:id/drafts', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify({prompt, tone, style})
});
const {data: draft} = await response.json();
```

## 📈 Escalabilidad

### Fase 1 (Actual)
- Todo síncrono
- Requests bloqueantes
- OK para desarrollo

### Fase 2+
- Jobs queue (BullMQ + Redis)
- Procesos de fondo
- WebSockets para notificaciones en tiempo real
- Caché con Redis
- Horizontal scaling

## 🔒 Seguridad

- ✅ Helmet.js para headers HTTP
- ✅ CORS configurado
- ✅ JWT con secret seguro
- ✅ Validación de entrada (Zod)
- ⚠️ Passwords hasheadas (bcrypt en prod)
- ⚠️ Rate limiting (añadir)
- ⚠️ SQL injection prevention (Supabase lo maneja)
- ⚠️ HTTPS en producción

## 🧪 Testing

```
tests/
├── integration/
│   ├── auth.test.ts
│   ├── projects.test.ts
│   └── drafts.test.ts
└── unit/
    ├── database.service.test.ts
    └── validators.test.ts
```

## 🚀 Deployment

### Variables en Producción

```bash
NODE_ENV=production
PORT=3000
SUPABASE_URL=...
SUPABASE_SERVICE_ROLE_KEY=...
# Keys deben ser secretas en production!
```

### Services Recomendados

- **Hosting**: Vercel, Railway, Render, Heroku
- **Database**: Supabase managed PostgreSQL
- **Logs**: Datadog, LogRocket, Sentry
- **Monitoring**: New Relic, DataDog

## 🎯 Próximos Pasos

1. ✅ **Setup Supabase** y crear tablas
2. ✅ **Instalar dependencias** y verificar
3. **Conectar frontend** a estos endpoints
4. **Fase 2**: Integrar OpenAI para IA real
5. **Fase 3**: Integrar ElevenLabs para voz
6. Etc...

---

**Versión**: 1.0.0  
**Estado**: En desarrollo (Fase 1)
