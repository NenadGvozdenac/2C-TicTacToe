import { Router } from 'express';

import GameController from '../controllers/game_controller';

const router = Router();

router.get('/', GameController.getAllGames)
router.post('/create/singleplayer', GameController.createSingleplayerGame)
router.post('/create/multiplayer', GameController.createMultiplayerGame)
router.post('/join/:gameId', GameController.joinMultiplayerGame)
router.post('/end/:gameId', GameController.endMultiplayerGame)
router.get('/user', GameController.getGamesByUser)

export default router;