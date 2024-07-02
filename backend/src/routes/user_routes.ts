import { Router } from 'express';

import UserController from '../controllers/user_controller';

const router = Router();

router.post('/register', UserController.register);
router.post('/login', UserController.login);
router.get('/', UserController.getAllUsers)
router.delete('/:id', UserController.deleteUser)

export default router;