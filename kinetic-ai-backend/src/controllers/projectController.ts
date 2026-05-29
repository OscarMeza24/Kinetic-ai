import { Request, Response } from 'express';
import { asyncHandler, AppError } from '../middleware/errorHandler.js';
import * as dbService from '../services/database.service.js';
import { logger } from '../config/logger.js';
import type { ApiResponse } from '../types/index.js';

export const getProjects = asyncHandler(
  async (req: Request, res: Response) => {
    if (!req.user) {
      throw new AppError(401, 'UNAUTHORIZED', 'Usuario no autenticado');
    }

    const projects = await dbService.getProjectsByUserId(req.user.userId);

    const response: ApiResponse<any> = {
      success: true,
      data: projects,
      timestamp: new Date().toISOString(),
    };

    res.status(200).json(response);
  }
);

export const createProject = asyncHandler(
  async (req: Request, res: Response) => {
    if (!req.user) {
      throw new AppError(401, 'UNAUTHORIZED', 'Usuario no autenticado');
    }

    const { title, description, niche } = req.body;

    if (!title) {
      throw new AppError(400, 'MISSING_FIELDS', 'Título del proyecto es requerido');
    }

    const project = await dbService.createProject(
      req.user.userId,
      title,
      description || '',
      niche || 'AI Tools'
    );

    logger.info(`Project created: ${project.id}`);

    const response: ApiResponse<any> = {
      success: true,
      data: project,
      timestamp: new Date().toISOString(),
    };

    res.status(201).json(response);
  }
);

export const getProject = asyncHandler(
  async (req: Request, res: Response) => {
    if (!req.user) {
      throw new AppError(401, 'UNAUTHORIZED', 'Usuario no autenticado');
    }

    const { projectId } = req.params;

    const project = await dbService.getProjectById(projectId, req.user.userId);

    if (!project) {
      throw new AppError(404, 'NOT_FOUND', 'Proyecto no encontrado');
    }

    const response: ApiResponse<any> = {
      success: true,
      data: project,
      timestamp: new Date().toISOString(),
    };

    res.status(200).json(response);
  }
);

export const updateProject = asyncHandler(
  async (req: Request, res: Response) => {
    if (!req.user) {
      throw new AppError(401, 'UNAUTHORIZED', 'Usuario no autenticado');
    }

    const { projectId } = req.params;
    const { title, description, niche } = req.body;

    const updates: any = {};
    if (title) updates.title = title;
    if (description) updates.description = description;
    if (niche) updates.niche = niche;
    updates.updated_at = new Date().toISOString();

    const project = await dbService.updateProject(projectId, req.user.userId, updates);

    logger.info(`Project updated: ${projectId}`);

    const response: ApiResponse<any> = {
      success: true,
      data: project,
      timestamp: new Date().toISOString(),
    };

    res.status(200).json(response);
  }
);

export const deleteProject = asyncHandler(
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

    await dbService.deleteProject(projectId, req.user.userId);

    logger.info(`Project deleted: ${projectId}`);

    const response: ApiResponse<null> = {
      success: true,
      timestamp: new Date().toISOString(),
    };

    res.status(200).json(response);
  }
);
