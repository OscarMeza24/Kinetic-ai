import { Request, Response } from 'express';
import { asyncHandler, AppError } from '../middleware/errorHandler.js';
import * as dbService from '../services/database.service.js';
import { logger } from '../config/logger.js';
import type { ApiResponse } from '../types/index.js';

export const getDrafts = asyncHandler(
  async (req: Request, res: Response) => {
    if (!req.user) {
      throw new AppError(401, 'UNAUTHORIZED', 'Usuario no autenticado');
    }

    const { projectId } = req.params;

    // Verificar que el proyecto existe y pertenece al usuario
    const project = await dbService.getProjectById(projectId, req.user.userId);
    if (!project) {
      throw new AppError(404, 'NOT_FOUND', 'Proyecto no encontrado');
    }

    const drafts = await dbService.getDraftsByProjectId(projectId, req.user.userId);

    const response: ApiResponse<any> = {
      success: true,
      data: drafts,
      timestamp: new Date().toISOString(),
    };

    res.status(200).json(response);
  }
);

export const createDraft = asyncHandler(
  async (req: Request, res: Response) => {
    if (!req.user) {
      throw new AppError(401, 'UNAUTHORIZED', 'Usuario no autenticado');
    }

    const { projectId } = req.params;
    const { prompt, tone = 'Formal', style = 'Minimalista' } = req.body;

    if (!prompt) {
      throw new AppError(400, 'MISSING_FIELDS', 'Prompt es requerido');
    }

    // Verificar que el proyecto existe
    const project = await dbService.getProjectById(projectId, req.user.userId);
    if (!project) {
      throw new AppError(404, 'NOT_FOUND', 'Proyecto no encontrado');
    }

    const draft = await dbService.createDraft(
      projectId,
      req.user.userId,
      prompt,
      tone,
      style
    );

    logger.info(`Draft created: ${draft.id}`);

    const response: ApiResponse<any> = {
      success: true,
      data: draft,
      timestamp: new Date().toISOString(),
    };

    res.status(201).json(response);
  }
);

export const getDraft = asyncHandler(
  async (req: Request, res: Response) => {
    if (!req.user) {
      throw new AppError(401, 'UNAUTHORIZED', 'Usuario no autenticado');
    }

    const { draftId } = req.params;

    const draft = await dbService.getDraftById(draftId, req.user.userId);

    if (!draft) {
      throw new AppError(404, 'NOT_FOUND', 'Draft no encontrado');
    }

    const response: ApiResponse<any> = {
      success: true,
      data: draft,
      timestamp: new Date().toISOString(),
    };

    res.status(200).json(response);
  }
);

export const updateDraft = asyncHandler(
  async (req: Request, res: Response) => {
    if (!req.user) {
      throw new AppError(401, 'UNAUTHORIZED', 'Usuario no autenticado');
    }

    const { draftId } = req.params;
    const updates = req.body;

    // Validar que el draft existe
    const existingDraft = await dbService.getDraftById(draftId, req.user.userId);
    if (!existingDraft) {
      throw new AppError(404, 'NOT_FOUND', 'Draft no encontrado');
    }

    const draft = await dbService.updateDraft(draftId, req.user.userId, {
      ...updates,
      updated_at: new Date().toISOString(),
    });

    logger.info(`Draft updated: ${draftId}`);

    const response: ApiResponse<any> = {
      success: true,
      data: draft,
      timestamp: new Date().toISOString(),
    };

    res.status(200).json(response);
  }
);

export const deleteDraft = asyncHandler(
  async (req: Request, res: Response) => {
    if (!req.user) {
      throw new AppError(401, 'UNAUTHORIZED', 'Usuario no autenticado');
    }

    const { draftId } = req.params;

    // Verificar que el draft existe
    const draft = await dbService.getDraftById(draftId, req.user.userId);
    if (!draft) {
      throw new AppError(404, 'NOT_FOUND', 'Draft no encontrado');
    }

    await dbService.deleteDraft(draftId, req.user.userId);

    logger.info(`Draft deleted: ${draftId}`);

    const response: ApiResponse<null> = {
      success: true,
      timestamp: new Date().toISOString(),
    };

    res.status(200).json(response);
  }
);
