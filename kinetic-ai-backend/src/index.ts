import express, { Request, Response, NextFunction } from 'express';
import helmet from 'helmet';
import { env } from './config/env.js';
import { logger } from './config/logger.js';
import { testSupabaseConnection } from './config/supabase.js';
import { corsConfig } from './middleware/cors.js';
import { errorHandler } from './middleware/errorHandler.js';

// Import routes
import healthRoutes from './routes/health.js';
import authRoutes from './routes/auth.js';
import projectRoutes from './routes/projects.js';
import draftRoutes from './routes/drafts.js';

const app = express();

// =====================
// MIDDLEWARE GLOBAL
// =====================

// Security
app.use(helmet());

// CORS
app.use(corsConfig);

// Body parsers
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Request logger
app.use((_req: Request, _res: Response, next: NextFunction) => {
  logger.info(`${_req.method} ${_req.path}`);
  next();
});

// =====================
// ROUTES
// =====================

// Health check (sin autenticación)
app.use('/health', healthRoutes);

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/projects/:projectId/drafts', draftRoutes);

// 404 handler
app.use((_req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    error: {
      message: 'Endpoint not found',
      code: 'NOT_FOUND',
    },
    timestamp: new Date().toISOString(),
  });
});

// =====================
// ERROR HANDLER (debe ser lo último)
// =====================
app.use(errorHandler);

// =====================
// STARTUP
// =====================

async function startServer() {
  try {
    // Test Supabase connection
    const supabaseOk = await testSupabaseConnection();
    if (!supabaseOk) {
      logger.error('Failed to connect to Supabase');
      process.exit(1);
    }

    // Start listening
    app.listen(env.PORT, () => {
      logger.info(`✅ Server running on port ${env.PORT}`);
      logger.info(`📝 Environment: ${env.NODE_ENV}`);
      logger.info(`🔗 Supabase: ${env.SUPABASE_URL}`);
    });
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
}

// Handle unhandled rejections
process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

process.on('uncaughtException', (error) => {
  logger.error('Uncaught Exception:', error);
  process.exit(1);
});

startServer();

export default app;
