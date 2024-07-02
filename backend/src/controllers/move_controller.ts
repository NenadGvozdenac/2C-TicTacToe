import Move from '../models/move';

import { Request, Response } from 'express';

class MoveController {
    static async createMove(req: Request, res: Response): Promise<Response> {
        const { gameId, player, row, col, value, timestamp } = req.body;

        const move = new Move({ gameId, player, row, col, value, timestamp });

        try {
            await move.save();
            return res.status(200).json({ message: 'Move created' });
        } catch (error) {
            return res.status(400).json({ message: 'Move creation failed' });
        }
    }

    static async getMoves(req: Request, res: Response): Promise<Response> {
        const gameId = req.params.gameId;

        const moves = await Move.find({ gameId });

        return res.status(200).json(moves);
    }
}

export default MoveController;