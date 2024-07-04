import express from 'express';
import cors from 'cors';

import { secrets } from '../database/secrets';

import UserRoutes from '../routes/user_routes';
import GameRoutes from '../routes/game_routes';
import MoveRoutes from '../routes/move_routes';

const app = express();

app.use(express.json());

app.use(cors({
    origin: secrets.FE_URL
}));

app.use('/users', UserRoutes);
app.use('/games', GameRoutes);
app.use('/moves', MoveRoutes);

export default app;