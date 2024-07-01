import express from 'express';

import UserRoutes from '../routes/user_routes';
import GameRoutes from '../routes/game_routes';
import MoveRoutes from '../routes/move_routes';

import { connectToDatabase } from '../database/config'

const app = express();

app.use(express.json());

connectToDatabase();

app.use('/users', UserRoutes);
app.use('/games', GameRoutes);
app.use('/moves', MoveRoutes);

export default app;