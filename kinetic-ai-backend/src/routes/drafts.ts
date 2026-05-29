import { Router } from 'express';
import * as draftController from '../controllers/draftController.js';
import { authMiddleware } from '../middleware/auth.js';

const router = Router({ mergeParams: true });

// Todos los endpoints requieren autenticación
router.use(authMiddleware);

router.get('/', draftController.getDrafts);
router.post('/', draftController.createDraft);
router.get('/:draftId', draftController.getDraft);
router.patch('/:draftId', draftController.updateDraft);
router.delete('/:draftId', draftController.deleteDraft);

export default router;
