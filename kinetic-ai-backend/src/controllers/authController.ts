import { Request, Response } from 'express';
import { supabaseAdmin } from '../config/supabase.js';
import { logger } from '../config/logger.js';
import { asyncHandler, AppError } from '../middleware/errorHandler.js';
import * as dbService from '../services/database.service.js';
import type { ApiResponse, AuthResponse } from '../types/index.js';

// Helper para generar tokens JWT
async function generateTokens(userId: string, email: string) {
  const { error } = await supabaseAdmin.auth.admin.generateLink({
    type: 'magiclink',
    email: email,
    options: {
      redirectTo: `${process.env.FRONTEND_URL}/auth/callback`,
    },
  });

  if (error) throw error;

  // En producción, usarías Supabase Auth sessions
  // Por ahora, generamos un token JWT simple
  const token = Buffer.from(JSON.stringify({ userId, email, iat: Date.now() })).toString(
    'base64'
  );
  return token;
}

export const register = asyncHandler(
  async (req: Request, res: Response) => {
    const { email, password, fullName } = req.body;

    if (!email || !password || !fullName) {
      throw new AppError(400, 'MISSING_FIELDS', 'Email, password y nombre son requeridos');
    }

    // En producción, hashejar la password con bcrypt
    const passwordHash = Buffer.from(password).toString('base64');

    const user = await dbService.createUser(email, passwordHash, fullName);

    logger.info(`User registered: ${email}`);

    const response: ApiResponse<{ userId: string; email: string }> = {
      success: true,
      data: {
        userId: user.id,
        email: user.email,
      },
      timestamp: new Date().toISOString(),
    };

    res.status(201).json(response);
  }
);

export const login = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new AppError(400, 'MISSING_FIELDS', 'Email y password son requeridos');
  }

  const user = await dbService.getUserByEmail(email);

  if (!user) {
    throw new AppError(401, 'INVALID_CREDENTIALS', 'Email o contraseña incorrectos');
  }

  // En producción, comparar con bcrypt
  const passwordHash = Buffer.from(password).toString('base64');
  if (user.password_hash !== passwordHash) {
    throw new AppError(401, 'INVALID_CREDENTIALS', 'Email o contraseña incorrectos');
  }

  const accessToken = await generateTokens(user.id, user.email);

  logger.info(`User logged in: ${email}`);

  const response: ApiResponse<AuthResponse> = {
    success: true,
    data: {
      user: {
        id: user.id,
        email: user.email,
        fullName: user.full_name,
      },
      accessToken,
      refreshToken: '', // Implementar luego
    },
    timestamp: new Date().toISOString(),
  };

  res.status(200).json(response);
});

export const me = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) {
    throw new AppError(401, 'UNAUTHORIZED', 'Usuario no autenticado');
  }

  const user = await dbService.getUserById(req.user.userId);

  if (!user) {
    throw new AppError(404, 'NOT_FOUND', 'Usuario no encontrado');
  }

  const response: ApiResponse<any> = {
    success: true,
    data: {
      id: user.id,
      email: user.email,
      fullName: user.full_name,
    },
    timestamp: new Date().toISOString(),
  };

  res.status(200).json(response);
});
