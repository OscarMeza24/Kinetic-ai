# 🔧 Guía Completa de Setup - Supabase + Backend

## Paso 1: Crear Proyecto Supabase

### 1.1 Registrarse en Supabase
- Ve a https://supabase.com
- Haz click en "Start your project"
- Usa tu cuenta GitHub o email
- Confirma el email

### 1.2 Crear Nuevo Proyecto
1. Click en "New Project"
2. **Name**: `kinetic-ai-studio`
3. **Database Password**: Genera una contraseña fuerte (guárdala)
4. **Region**: Elige cercano a tus usuarios (ej: us-east-1)
5. Click "Create new project"

⏳ Espera 2-3 minutos mientras Supabase provisiona la BD.

## Paso 2: Obtener Credenciales

Una vez que el proyecto esté listo:

### 2.1 Ir a Settings
1. En la barra lateral, click en **Settings** (engranaje)
2. Luego click en **API**

### 2.2 Copiar Credenciales
Verás dos secciones:

**Project URL**:
```
https://xxxxxxxxxxxxx.supabase.co
```
Copia esto → `SUPABASE_URL` en `.env.local`

**API Keys**:
- **anon public**: `eyJ...` (empieza con eyJ)
  Copia → `SUPABASE_ANON_KEY`
- **service_role secret**: `eyJ...` (más larga, empieza con eyJ)
  Copia → `SUPABASE_SERVICE_ROLE_KEY`

**⚠️ IMPORTANTE**: Nunca compartas el `service_role` key. Mantenlo secreto.

### 2.3 Copiar JWT Secret
1. En la misma página, baja hasta **JWT Settings**
2. Verás **JWT Secret** (una cadena larga aleatoria)
3. Copia → `SUPABASE_JWT_SECRET` en `.env.local`

## Paso 3: Crear Tablas

### 3.1 Ir a SQL Editor
1. En barra lateral, click en **SQL Editor**
2. Click en **New Query** (botón azul)

### 3.2 Copiar y Ejecutar Migrations
1. Abre `migrations/001_initial_schema.sql` (en el backend)
2. Copia TODO el contenido
3. Pega en el SQL editor de Supabase
4. Click en **Run** (botón azul en la esquina)

✅ Verás: "Success. No errors."

### 3.3 Verificar Tablas
1. En barra lateral, click en **Table Editor**
2. Deberías ver estas tablas:
   - `users`
   - `projects`
   - `drafts`
   - `voice_jobs`
   - `render_jobs`
   - `scheduled_posts`
   - `connected_accounts`
   - `analytics_snapshots`

## Paso 4: Configurar .env.local

Crea o edita `.env.local` en la carpeta `kinetic-ai-backend`:

```bash
# Node
NODE_ENV=development
PORT=3000

# Supabase - COMPLETA CON TUS VALORES
SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
SUPABASE_ANON_KEY=eyJ0eXAiOiJKV1QiLC...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_JWT_SECRET=super-secret-jwt-token-xxx

# Logging
LOG_LEVEL=debug

# CORS
FRONTEND_URL=http://localhost:8081
```

⚠️ **Nunca guardes esto en Git**. El `.gitignore` ya lo ignora.

## Paso 5: Instalar Dependencias

```bash
cd kinetic-ai-backend
npm install
```

Espera a que termine (2-3 minutos).

Verifica que no hay errores:
```bash
npm run type-check
```

## Paso 6: Probar Conexión

```bash
npm run dev
```

Deberías ver:

```
✅ Server running on port 3000
📝 Environment: development
🔗 Supabase: https://xxxxxxxxxxxxx.supabase.co
✅ Supabase connected successfully
```

✅ Si ves esto, ¡estás conectado!

## Paso 7: Probar Endpoints

### 7.1 Health Check (sin auth)
```bash
curl http://localhost:3000/health
```

Response:
```json
{
  "success": true,
  "data": {
    "status": "ok"
  },
  "timestamp": "2026-05-29T..."
}
```

### 7.2 Register (crear usuario)
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123",
    "fullName": "Test User"
  }'
```

Response:
```json
{
  "success": true,
  "data": {
    "userId": "uuid-aqui",
    "email": "test@example.com"
  },
  "timestamp": "2026-05-29T..."
}
```

### 7.3 Login
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

Response:
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid",
      "email": "test@example.com",
      "fullName": "Test User"
    },
    "accessToken": "eyJ0eXAiOiJKV1QiLC..."
  }
}
```

**Guarda el `accessToken`** para los próximos requests.

### 7.4 Crear Proyecto
```bash
# Reemplaza con tu token
TOKEN="eyJ0eXAiOiJKV1QiLC..."

curl -X POST http://localhost:3000/api/projects \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "title": "My First Project",
    "description": "Testing the backend",
    "niche": "AI Tools"
  }'
```

Response:
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "user_id": "user-uuid",
    "title": "My First Project",
    "description": "Testing the backend",
    "niche": "AI Tools",
    "created_at": "2026-05-29T...",
    "updated_at": "2026-05-29T..."
  }
}
```

**Guarda el `id` del proyecto** para crear drafts.

### 7.5 Crear Draft
```bash
PROJECT_ID="uuid-del-proyecto"
TOKEN="tu-token"

curl -X POST http://localhost:3000/api/projects/$PROJECT_ID/drafts \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "prompt": "Create a short about productivity automation",
    "tone": "Formal",
    "style": "Minimalista"
  }'
```

Response:
```json
{
  "success": true,
  "data": {
    "id": "draft-uuid",
    "project_id": "project-uuid",
    "user_id": "user-uuid",
    "prompt": "Create a short about productivity automation",
    "tone": "Formal",
    "style": "Minimalista",
    "status": "draft",
    "created_at": "2026-05-29T..."
  }
}
```

✅ **¡Funciona!** El backend está guardando datos en Supabase.

## Paso 8: Verificar en Supabase Dashboard

1. Ve a https://app.supabase.com
2. Click en tu proyecto
3. En **Table Editor**, busca `users`
4. Deberías ver tu usuario registrado
5. Click en `projects`
6. Deberías ver el proyecto que creaste
7. Click en `drafts`
8. Deberías ver el draft que creaste

✅ Si ves los datos, todo está funcionando.

## Troubleshooting

### Error: "Supabase connection failed"

**Causa**: Variables de entorno incorrectas

**Solución**:
1. Verifica que `.env.local` existe
2. Comprueba que SUPABASE_URL empieza con `https://`
3. Comprueba que SUPABASE_ANON_KEY y SERVICE_ROLE_KEY empiezan con `eyJ`
4. Copia de nuevo desde Supabase dashboard
5. Reinicia: `npm run dev`

### Error: "Request timeout"

**Causa**: Problema de conexión de red

**Solución**:
1. Verifica que tienes internet
2. Cierra el firewall/VPN temporalmente
3. Prueba con: `curl https://app.supabase.com` (verificar DNS)

### Error: "EADDRINUSE :::3000"

**Causa**: Puerto 3000 ya está en uso

**Solución**:
```bash
# Cambiar puerto
PORT=3001 npm run dev

# O matar el proceso anterior
lsof -i :3000 | grep LISTEN | awk '{print $2}' | xargs kill -9
```

### Error: 404 en endpoints

**Causa**: Rutas no registradas

**Solución**:
- Verifica que `src/index.ts` importa todas las rutas
- Verifica que el path es correcto: `/api/...`

### Error: 401 "Unauthorized"

**Causa**: Token inválido o expirado

**Solución**:
- Haz login de nuevo para obtener nuevo token
- Verifica que el header es: `Authorization: Bearer <token>`
- No hay espacios adicionales

## Próximos Pasos

1. ✅ Supabase setup completado
2. ✅ Backend funcionando
3. 🔜 **Conectar Frontend** a estos endpoints
4. 🔜 Reemplazar `generateDraftFromPrompt` mock
5. 🔜 Probar que los datos persisten

---

**Documento**: Guía de Setup Supabase  
**Versión**: 1.0.0  
**Fecha**: 29 de mayo 2026
