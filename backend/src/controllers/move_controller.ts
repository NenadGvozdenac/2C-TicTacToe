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

            const winner = await checkForWinner(gameId);
            if (winner) {
                return res.status(200).json({ message: 'Game won', winner });
            }

            const newMove = await generateNewMove(gameId);

            if (newMove.row === -1) {
                return res.status(201).json({ newMove: { row: -1, col: -1 } });
            }

            const newBotMove = new Move({ gameId, player: "Computer", row: newMove.row, col: newMove.col, value: "O", timestamp: new Date() });
            await newBotMove.save();

            const newWinner = await checkForWinner(gameId);
            
            if (newWinner) {
                return res.status(200).json({ message: 'Game won', winner: newWinner, newMove });
            }

            return res.status(200).json({ newMove });
        } catch (error) {
            return res.status(400).json({ message: 'Move creation failed' });
        }
    }

    static async getMoves(req: Request, res: Response): Promise<Response> {
        const gameId = req.params.gameId;

        try {
            const game = await Game.findById(gameId);

            if (!game) {
                return res.status(404).json({ message: 'Game not found' });
            }
        } catch (error) {
            return res.status(404).json({ message: 'Game not found' });
        }

        try {
            const moves = await Move.find({ gameId });

            return res.status(200).json(moves);
        } catch (error) {
            return res.status(404).json({ message: 'Moves not found' });
        }
    }

    static async deleteMoves(req: Request, res: Response): Promise<Response> {
        await Move.deleteMany({});

        return res.status(200).json({ message: 'All moves deleted' });
    }

    static async getWinner(req: Request, res: Response): Promise<Response> {
        const gameId = req.body.gameId;
        const winner = await checkForWinner(gameId);
        return res.status(201).json({ winner });
    }
}

export default MoveController;

async function generateNewMove(gameId: any) {
    const moves = await Move.find({ gameId });

    if (moves.length >= 9) {
        return { row: -1, col: -1 };
    }

    const emptyCells = Array.from({ length: 9 }, (_, i) => i).filter((i) => !moves.some((move) => move.row * 3 + move.col === i));

    const newMove = emptyCells[Math.floor(Math.random() * emptyCells.length)];

    const row = Math.floor(newMove / 3);
    const col = newMove % 3;

    return { row, col };
}

async function checkForWinner(gameId: string): Promise<string> {
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

    for (const combination of winningCombinations) {
        const [a, b, c] = combination;

        if (board[a] && board[a] === board[b] && board[a] === board[c]) {
            const game = await Game.findById(gameId);

            const move = await Move.findOne({ gameId, value: board[a] });

            if (!move) {
                return 'Move not found';
            }

            let user;

            if (move.player === 'Computer') {
                user = await User.findOne({ username: 'Computer' });
            } else {
                user = await User.findById(move.player);
            }

            if (!user) {
                return 'User not found';
            }

            if (game) {
                game.winner = user.username;
                game.status = 'Finished';
                await game.save();
            }

            return board[a];
        }
    }

    if (moves.length >= 9) {
        const game = await Game.findById(gameId);

        if (game) {
            game.winner = 'Draw';
            game.status = 'Finished';
            await game.save();
        }

        return 'Draw';
    }

    return '';
}