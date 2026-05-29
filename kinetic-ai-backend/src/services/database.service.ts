import { supabaseAdmin } from '../config/supabase.js';
import { logger } from '../config/logger.js';
import { AppError } from '../middleware/errorHandler.js';
import type { DbUser, DbProject, DbDraft } from '../types/index.js';

// =====================
// USERS SERVICE
// =====================

export async function createUser(email: string, passwordHash: string, fullName: string) {
  try {
    const { data, error } = await supabaseAdmin
      .from('users')
      .insert([
        {
          email,
          password_hash: passwordHash,
          full_name: fullName,
        },
      ])
      .select()
      .single();

    if (error) throw error;
    return data as DbUser;
  } catch (error: any) {
    if (error.code === '23505') {
      // Unique constraint violation
      throw new AppError(409, 'EMAIL_EXISTS', 'Este email ya está registrado');
    }
    logger.error('Error creating user:', error);
    throw new AppError(500, 'DB_ERROR', 'Error al crear usuario');
  }
}

export async function getUserByEmail(email: string) {
  try {
    const { data, error } = await supabaseAdmin
      .from('users')
      .select('*')
      .eq('email', email)
      .single();

    if (error && error.code === 'PGRST116') {
      // Not found
      return null;
    }

    if (error) throw error;
    return data as DbUser;
  } catch (error) {
    logger.error('Error fetching user:', error);
    throw new AppError(500, 'DB_ERROR', 'Error al buscar usuario');
  }
}

export async function getUserById(id: string) {
  try {
    const { data, error } = await supabaseAdmin
      .from('users')
      .select('*')
      .eq('id', id)
      .single();

    if (error && error.code === 'PGRST116') {
      return null;
    }

    if (error) throw error;
    return data as DbUser;
  } catch (error) {
    logger.error('Error fetching user by id:', error);
    throw new AppError(500, 'DB_ERROR', 'Error al buscar usuario');
  }
}

// =====================
// PROJECTS SERVICE
// =====================

export async function createProject(
  userId: string,
  title: string,
  description: string,
  niche: string
) {
  try {
    const { data, error } = await supabaseAdmin
      .from('projects')
      .insert([
        {
          user_id: userId,
          title,
          description,
          niche,
        },
      ])
      .select()
      .single();

    if (error) throw error;
    return data as DbProject;
  } catch (error: any) {
    if (error.code === '23505') {
      throw new AppError(409, 'PROJECT_EXISTS', 'Ya existe un proyecto con ese nombre');
    }
    logger.error('Error creating project:', error);
    throw new AppError(500, 'DB_ERROR', 'Error al crear proyecto');
  }
}

export async function getProjectsByUserId(userId: string) {
  try {
    const { data, error } = await supabaseAdmin
      .from('projects')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return (data || []) as DbProject[];
  } catch (error) {
    logger.error('Error fetching projects:', error);
    throw new AppError(500, 'DB_ERROR', 'Error al obtener proyectos');
  }
}

export async function getProjectById(projectId: string, userId: string) {
  try {
    const { data, error } = await supabaseAdmin
      .from('projects')
      .select('*')
      .eq('id', projectId)
      .eq('user_id', userId)
      .single();

    if (error && error.code === 'PGRST116') {
      return null;
    }

    if (error) throw error;
    return data as DbProject;
  } catch (error) {
    logger.error('Error fetching project:', error);
    throw new AppError(500, 'DB_ERROR', 'Error al obtener proyecto');
  }
}

export async function updateProject(
  projectId: string,
  userId: string,
  updates: Partial<DbProject>
) {
  try {
    const { data, error } = await supabaseAdmin
      .from('projects')
      .update(updates)
      .eq('id', projectId)
      .eq('user_id', userId)
      .select()
      .single();

    if (error && error.code === 'PGRST116') {
      throw new AppError(404, 'NOT_FOUND', 'Proyecto no encontrado');
    }

    if (error) throw error;
    return data as DbProject;
  } catch (error: any) {
    if (error instanceof AppError) throw error;
    logger.error('Error updating project:', error);
    throw new AppError(500, 'DB_ERROR', 'Error al actualizar proyecto');
  }
}

export async function deleteProject(projectId: string, userId: string) {
  try {
    const { error } = await supabaseAdmin
      .from('projects')
      .delete()
      .eq('id', projectId)
      .eq('user_id', userId);

    if (error) throw error;
  } catch (error) {
    logger.error('Error deleting project:', error);
    throw new AppError(500, 'DB_ERROR', 'Error al eliminar proyecto');
  }
}

// =====================
// DRAFTS SERVICE
// =====================

export async function createDraft(
  projectId: string,
  userId: string,
  prompt: string,
  tone: string,
  style: string
) {
  try {
    const { data, error } = await supabaseAdmin
      .from('drafts')
      .insert([
        {
          project_id: projectId,
          user_id: userId,
          prompt,
          tone,
          style,
          status: 'draft',
          title: '',
          hook: '',
          script: [],
          scenes: [],
          assets: [],
          hashtags: [],
          description: '',
          voice: '',
          virality_score: 0,
          duration: 0,
          ai_model: 'gpt-4-turbo',
        },
      ])
      .select()
      .single();

    if (error) throw error;
    return data as DbDraft;
  } catch (error) {
    logger.error('Error creating draft:', error);
    throw new AppError(500, 'DB_ERROR', 'Error al crear draft');
  }
}

export async function getDraftsByProjectId(projectId: string, userId: string) {
  try {
    const { data, error } = await supabaseAdmin
      .from('drafts')
      .select('*')
      .eq('project_id', projectId)
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return (data || []) as DbDraft[];
  } catch (error) {
    logger.error('Error fetching drafts:', error);
    throw new AppError(500, 'DB_ERROR', 'Error al obtener drafts');
  }
}

export async function getDraftById(draftId: string, userId: string) {
  try {
    const { data, error } = await supabaseAdmin
      .from('drafts')
      .select('*')
      .eq('id', draftId)
      .eq('user_id', userId)
      .single();

    if (error && error.code === 'PGRST116') {
      return null;
    }

    if (error) throw error;
    return data as DbDraft;
  } catch (error) {
    logger.error('Error fetching draft:', error);
    throw new AppError(500, 'DB_ERROR', 'Error al obtener draft');
  }
}

export async function updateDraft(draftId: string, userId: string, updates: Partial<DbDraft>) {
  try {
    const { data, error } = await supabaseAdmin
      .from('drafts')
      .update(updates)
      .eq('id', draftId)
      .eq('user_id', userId)
      .select()
      .single();

    if (error && error.code === 'PGRST116') {
      throw new AppError(404, 'NOT_FOUND', 'Draft no encontrado');
    }

    if (error) throw error;
    return data as DbDraft;
  } catch (error: any) {
    if (error instanceof AppError) throw error;
    logger.error('Error updating draft:', error);
    throw new AppError(500, 'DB_ERROR', 'Error al actualizar draft');
  }
}

export async function deleteDraft(draftId: string, userId: string) {
  try {
    const { error } = await supabaseAdmin
      .from('drafts')
      .delete()
      .eq('id', draftId)
      .eq('user_id', userId);

    if (error) throw error;
  } catch (error) {
    logger.error('Error deleting draft:', error);
    throw new AppError(500, 'DB_ERROR', 'Error al eliminar draft');
  }
}
