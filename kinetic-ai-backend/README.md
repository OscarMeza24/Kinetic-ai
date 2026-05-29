# Kinetic AI Backend

Backend de producción para Kinetic AI Studio - Plataforma de automatización de YouTube Shorts.

## 📋 Stack Técnico

- **Runtime**: Node.js 20+
- **Framework**: Express.js + TypeScript
- **Base de Datos**: Supabase (PostgreSQL)
- **Auth**: JWT + Supabase Auth
- **Logging**: Winston
- **Validación**: Zod

## 🚀 Quick Start

### Prerequisitos

- Node.js 18+ y npm 9+
- Cuenta de Supabase (https://supabase.com)
- Variables de entorno configuradas

### 1. Instalación

```bash
cd kinetic-ai-backend
npm install
```

### 2. Configurar Variables de Entorno

```bash
cp .env.example .env.local
```

Luego edita `.env.local` con tus valores:

```bash
NODE_ENV=development
PORT=3000

# Supabase (obtener de https://app.supabase.com/projects)
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_ANON_KEY=eyxx...
SUPABASE_SERVICE_ROLE_KEY=eyxx...
SUPABASE_JWT_SECRET=your_jwt_secret

# Frontend (para CORS)
FRONTEND_URL=http://localhost:8081

# APIs (opcional por ahora)
OPENAI_API_KEY=sk-...
ELEVENLABS_API_KEY=sk_...
```

### 3. Crear Tablas en Supabase

1. Ve a https://app.supabase.com
2. Abre SQL Editor
3. Copia y ejecuta el contenido de `migrations/001_initial_schema.sql`

O usa el script automático (pronto disponible):
```bash
npm run migrate
```

### 4. Ejecutar en Desarrollo

```bash
npm run dev
```

La API estará disponible en `http://localhost:3000`

```bash
# Test de health check
curl http://localhost:3000/health
```

### 5. Build para Producción

```bash
npm run build
npm start
```

## 📚 Estructura del Proyecto

```
src/
├── config/           # Configuración (env, logger, supabase)
├── middleware/       # Auth, error handling, CORS
├── routes/          # Definición de endpoints
├── controllers/     # Lógica de request handling
├── services/        # Lógica de negocio y DB
├── types/           # Tipos TypeScript
├── utils/           # Helpers y utilidades
├── jobs/            # Background jobs (BullMQ)
└── index.ts         # Entry point
```

## 🔌 Endpoints (Fase 1)

### Auth

```bash
# Register
POST /api/auth/register
{
  "email": "user@example.com",
  "password": "password123",
  "fullName": "John Doe"
}

# Login
POST /api/auth/login
{
  "email": "user@example.com",
  "password": "password123"
}

# Get current user (requiere auth)
GET /api/auth/me
Authorization: Bearer <token>
```

### Projects

```bash
# Get all projects
GET /api/projects
Authorization: Bearer <token>

# Create project
POST /api/projects
Authorization: Bearer <token>
{
  "title": "My Project",
  "description": "Description",
  "niche": "AI Tools"
}

# Get single project
GET /api/projects/:projectId
Authorization: Bearer <token>

# Update project
PATCH /api/projects/:projectId
Authorization: Bearer <token>
{
  "title": "Updated title"
}

# Delete project
DELETE /api/projects/:projectId
Authorization: Bearer <token>
```

### Drafts

```bash
# Get all drafts in a project
GET /api/projects/:projectId/drafts
Authorization: Bearer <token>

# Create draft
POST /api/projects/:projectId/drafts
Authorization: Bearer <token>
{
  "prompt": "Create a short about productivity",
  "tone": "Formal",
  "style": "Minimalista"
}

# Get single draft
GET /api/projects/:projectId/drafts/:draftId
Authorization: Bearer <token>

# Update draft
PATCH /api/projects/:projectId/drafts/:draftId
Authorization: Bearer <token>
{
  "title": "Updated title"
}

# Delete draft
DELETE /api/projects/:projectId/drafts/:draftId
Authorization: Bearer <token>
```

## 🔐 Autenticación

El backend usa JWT tokens generados por Supabase. Todos los endpoints requieren el header:

```
Authorization: Bearer <access_token>
```

## 📝 Logging

Los logs se guardan en:
- `logs/combined.log` - Todos los logs
- `logs/error.log` - Solo errores
- `logs/exceptions.log` - Excepciones no manejadas

Nivel de log configurable en `LOG_LEVEL`:
- `debug` - Máximo detalle
- `info` - Información general
- `warn` - Advertencias
- `error` - Solo errores

## 🧪 Testing

```bash
# Run tests
npm run test

# Watch mode
npm run test:watch
```

## 📦 Deployment

### En Vercel

```bash
npm install -g vercel
vercel
```

### En Railway

```bash
npm install -g @railway/cli
railway up
```

### En Render

Conectar repositorio y configurar:
- Build command: `npm run build`
- Start command: `npm start`

## 🔄 Fases de Desarrollo

### ✅ Fase 1: Persistencia (ACTUAL)
- [x] Estructura base
- [x] Auth básico
- [x] CRUD Projects
- [x] CRUD Drafts
- [ ] Integración con frontend

### 🔜 Fase 2: IA Real
- [ ] OpenAI integration
- [ ] Generación real de scripts
- [ ] Modelo seleccionable

### 🔜 Fase 3: Voz
- [ ] ElevenLabs integration
- [ ] Generación de audio
- [ ] Storage de audio

### 🔜 Fase 4: Render
- [ ] FFmpeg integration
- [ ] Job queue para renders
- [ ] Notificaciones de progreso

### 🔜 Fase 5: YouTube
- [ ] OAuth con YouTube
- [ ] Upload a YouTube Shorts
- [ ] Analytics en tiempo real

## 🛠️ Troubleshooting

### Error: "Supabase connection failed"

```bash
# Verificar variables de entorno
cat .env.local

# Asegurarse que Supabase URL y keys son correctas
# Las keys deben empezar con 'eyJ...'
```

### Error: "EADDRINUSE :::3000"

Puerto 3000 ya está en uso:
```bash
# Cambiar puerto
PORT=3001 npm run dev

# O matar el proceso
lsof -i :3000 | grep LISTEN | awk '{print $2}' | xargs kill -9
```

### Error: "Request timeout"

- Verificar conexión a Supabase
- Revisar tamaño de payload (máximo 50MB)
- Verificar logs: `tail -f logs/combined.log`

## 📖 Documentación Adicional

- [Swagger/OpenAPI](./docs/api.yml) - Documentación de API (próximo)
- [Database Schema](./migrations) - Esquema de base de datos
- [Tipo de Errores](./docs/ERRORS.md) - Códigos de error y soluciones (próximo)

## 📞 Soporte

¿Preguntas o problemas?

- Revisar logs en `logs/`
- Verificar `.env.local`
- Revisar documentación de Supabase

## 📝 Notas

- **Seguridad**: Las passwords se hashean con bcrypt en producción (actualmente base64 para demo)
- **Rate Limiting**: No está implementado, agregar para producción
- **CORS**: Configurado para desarrollo, ajustar para producción
- **JWT Secret**: Debe ser el mismo que en Supabase

---

**Versión**: 1.0.0  
**Última actualización**: 29 de mayo 2026  
**Ambiente**: Development
