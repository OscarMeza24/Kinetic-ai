import { Router } from 'express';
import type { ApiResponse } from '../types/index.js';
import { Request, Response } from 'express';

const router = Router();

router.get('/health', (_req: Request, res: Response) => {
  const response: ApiResponse<{ status: string }> = {
    success: true,
    data: {
      status: 'ok',
    },
    timestamp: new Date().toISOString(),
  };
  res.status(200).json(response);
});

router.get('/version', (_req: Request, res: Response) => {
  const response: ApiResponse<{ version: string }> = {
    success: true,
    data: {
      version: '1.0.0',
    },
    timestamp: new Date().toISOString(),
  };
  res.status(200).json(response);
});

export default router;
