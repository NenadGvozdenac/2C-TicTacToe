import { Router } from 'express';

import MoveController from '../controllers/move_controller';

const router = Router();

router.post('/create', MoveController.createMove);
router.delete('/', MoveController.deleteMoves);
router.post('/winner', MoveController.getWinner);
router.get('/:gameId', MoveController.getMoves);

export default router;