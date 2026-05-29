import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import { logger } from '../config/logger.js';
import type { JwtPayload } from '../types/index.js';

// Extender Request para incluir usuario
declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}

export function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');

    if (!token) {
      res.status(401).json({
        success: false,
        error: {
          message: 'Unauthorized - No token provided',
          code: 'NO_TOKEN',
        },
        timestamp: new Date().toISOString(),
      });
      return;
    }

    const decoded = jwt.verify(token, env.SUPABASE_JWT_SECRET) as JwtPayload;
    req.user = decoded;
    next();
  } catch (error) {
    logger.error('Auth middleware error:', error);
    res.status(401).json({
      success: false,
      error: {
        message: 'Unauthorized - Invalid token',
        code: 'INVALID_TOKEN',
      },
      timestamp: new Date().toISOString(),
    });
  }
}

// Opcional: middleware para operaciones que no requieren auth
export function optionalAuthMiddleware(
  req: Request,
  _res: Response,
  next: NextFunction
): void {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');

    if (token) {
      const decoded = jwt.verify(token, env.SUPABASE_JWT_SECRET) as JwtPayload;
      req.user = decoded;
    }

    next();
  } catch (error) {
    // Si el token es inválido, simplemente continuar sin usuario
    next();
  }
}
