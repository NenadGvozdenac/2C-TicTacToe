import { Router } from 'express';

import MoveController from '../controllers/move_controller';

const router = Router();

router.post('/create', MoveController.createMove);
router.get('/:gameId', MoveController.getMoves);

export default router;