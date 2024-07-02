import { Router } from 'express';

import GameController from '../controllers/game_controller';

const router = Router();

router.get('/', GameController.getAllGames)
router.post('/create/singleplayer', GameController.createSingleplayerGame)
router.post('/join/singleplayer/check', GameController.hasPlayerJoinedSingleplayerGame)
router.post('/join/singleplayer', GameController.joinSingleplayerGame)
router.post('/end/singleplayer', GameController.endSingleplayerGame)

router.post('/create/multiplayer', GameController.createMultiplayerGame)
router.post('/join/multiplayer/:gameId', GameController.joinMultiplayerGame)
router.post('/end/multiplayer/:gameId', GameController.endMultiplayerGame)

router.get('/user', GameController.getGamesByUser)
router.delete('/', GameController.deleteAllGames)

export default router;