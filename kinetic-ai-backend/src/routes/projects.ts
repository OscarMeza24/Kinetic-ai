import { Router } from 'express';
import * as projectController from '../controllers/projectController.js';
import { authMiddleware } from '../middleware/auth.js';

const router = Router();

// Todos los endpoints requieren autenticación
router.use(authMiddleware);

router.get('/', projectController.getProjects);
router.post('/', projectController.createProject);
router.get('/:projectId', projectController.getProject);
router.patch('/:projectId', projectController.updateProject);
router.delete('/:projectId', projectController.deleteProject);

export default router;
