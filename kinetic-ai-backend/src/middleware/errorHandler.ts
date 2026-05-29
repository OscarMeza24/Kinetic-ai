import { Request, Response, NextFunction } from 'express';
import { logger } from '../config/logger.js';
import type { ApiResponse } from '../types/index.js';

// Tipos de errores conocidos
export class AppError extends Error {
  constructor(
    public statusCode: number,
    public code: string,
    message: string,
    public details?: Record<string, any>
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export function errorHandler(
  error: Error | AppError,
  req: Request,
  res: Response,
  _next: NextFunction
): void {
  logger.error('Error handler:', {
    name: error.name,
    message: error.message,
    path: req.path,
    method: req.method,
  });

  if (error instanceof AppError) {
    const response: ApiResponse<null> = {
      success: false,
      error: {
        message: error.message,
        code: error.code,
        details: error.details,
      },
      timestamp: new Date().toISOString(),
    };
    res.status(error.statusCode).json(response);
    return;
  }

  // Error genérico
  const response: ApiResponse<null> = {
    success: false,
    error: {
      message: 'Internal server error',
      code: 'INTERNAL_SERVER_ERROR',
      details: process.env.NODE_ENV === 'development' ? { message: error.message } : undefined,
    },
    timestamp: new Date().toISOString(),
  };

  res.status(500).json(response);
}

// Wrapper para catch de async functions
export function asyncHandler(fn: Function) {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}
