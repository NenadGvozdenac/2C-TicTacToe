import express from 'express';
import UserRoutes from '../routes/user_routes';
import { connectToDatabase } from '../database/config'

const app = express();

app.use(express.json());

connectToDatabase();

app.use('/users', UserRoutes);
// Add other routes here

export default app;