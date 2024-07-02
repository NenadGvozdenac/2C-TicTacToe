import Move from '../models/move';
import User from '../models/user';
import Game from '../models/game';

import { Request, Response } from 'express';

class MoveController {
    static async createMove(req: Request, res: Response): Promise<Response> {
        const { gameId, username, row, col, value, timestamp } = req.body;

        const nameUsername: string = username;

        const user = await User.findOne({ username: nameUsername });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const move = new Move({
            gameId,
            player: user.id,
            row,
            col,
            value,
            timestamp,
        });

        try {
            await move.save();

            const newMove = await generateNewMove(gameId);
        
            if(newMove.row === -1) {
                return res.status(201).json({ newMove: { row: -1, col: -1 } });
            }

            const newBotMove = new Move({gameId, player: "Computer", row: newMove.row, col: newMove.col, value: "O", timestamp: new Date()});
            await newBotMove.save();

            return res.status(200).json({ newMove });
        } catch (error) {
            return res.status(400).json({ message: 'Move creation failed' });
        }
    }

    static async getMoves(req: Request, res: Response): Promise<Response> {
        const gameId = req.params.gameId;

        const moves = await Move.find({ gameId });

        return res.status(200).json(moves);
    }

    static async deleteMoves(req: Request, res: Response): Promise<Response> {
        await Move.deleteMany({});

        return res.status(200).json({ message: 'All moves deleted' });
    }

    static async getWinner(req: Request, res: Response): Promise<Response> {
        const gameId = req.body.gameId;

        const moves = await Move.find({ gameId });

        const board = Array.from({ length: 9 }, () => '');

        moves.forEach((move) => {
            board[move.row * 3 + move.col] = move.value;
        });

        const winningCombinations = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8],
            [0, 3, 6], [1, 4, 7], [2, 5, 8],
            [0, 4, 8], [2, 4, 6],
        ];

        for(const combination of winningCombinations) {
            const [a, b, c] = combination;

            if(board[a] && board[a] === board[b] && board[a] === board[c]) {
                const game = await Game.findById(gameId);

                // Get current move
                const move = await Move.findOne({ gameId, value: board[a]})

                if(!move) {
                    return res.status(404).json({ message: 'Move not found' });
                }

                const user = await User.findById(move.player)

                if(!user) {
                    return res.status(404).json({ message: 'User not found' });
                }

                if(game) {
                    game.winner = user.username
                    game.status = 'Finished';
                    await game.save();
                }

                return res.status(201).json({ winner: board[a] });
            }
        }

        if(moves.length >= 9) {
            const game = await Game.findById(gameId);

            if(game) {
                game.winner = 'Draw';
                game.status = 'Finished';
                await game.save();
            }

            return res.status(201).json({ winner: 'Draw' });
        }

        return res.status(201).json({ winner: '' });
    }
}

export default MoveController;

async function generateNewMove(gameId: any) {
    const moves = await Move.find({ gameId });

    if(moves.length >= 9) {
        return { row: -1, col: -1 };
    }

    const emptyCells = Array.from({ length: 9 }, (_, i) => i).filter((i) => !moves.some((move) => move.row * 3 + move.col === i));

    console.log(emptyCells)

    const newMove = emptyCells[Math.floor(Math.random() * emptyCells.length)];

    const row = Math.floor(newMove / 3);
    const col = newMove % 3;

    return { row, col };
}