import Game from "../models/game";
import User from "../models/user";

import { Request, Response } from 'express';

class GameController {
    static async getAllGames(req: Request, res: Response): Promise<Response> {
        const games = await Game.find();
        return res.status(200).json(games);
    }

    static async createSingleplayerGame(req: Request, res: Response): Promise<Response> {
        const creator: string = req.body.decoded_token.username;
        const player1: string = req.body.decoded_token.username;
        const player2: string = 'Computer';
        const startTime: Date = new Date();
        const endTime: Date = new Date();
        const isSinglePlayer: boolean = true;
        const winner: string = '';
        const inProgress: boolean = true;

        const game = new Game({ creator, player1, player2, startTime, endTime, isSinglePlayer, winner, inProgress });

        try {
            await game.save();
            return res.status(201).json({ message: 'Game created' });
        } catch (error) {
            return res.status(400).json({ message: 'Game creation failed' });
        }
    }

    static async createMultiplayerGame(req: Request, res: Response): Promise<Response> {
        const creator: string = req.body.decoded_token.username;
        const player1: string = req.body.decoded_token.username;
        const player2: string = 'Not yet joined';
        const startTime: Date = new Date();
        const endTime: Date = new Date();
        const isSinglePlayer: boolean = false;
        const winner: string = '';
        const inProgress: boolean = false;

        const game = new Game({ creator, player1, player2, startTime, endTime, isSinglePlayer, winner, inProgress });

        try {
            await game.save();
            return res.status(201).json({ message: 'Game created' });
        } catch (error) {
            return res.status(400).json({ message: 'Game creation failed' });
        }
    }

    static async joinMultiplayerGame(req: Request, res: Response): Promise<Response> {
        const gameId: string = req.params.gameId;
        const player2: string = req.body.decoded_token.username;

        const game = await Game.findById(gameId);

        if (!game) {
            return res.status(404).json({ message: 'Game not found' });
        }

        const user2 = await User.findOne({ username: player2 });

        if (!user2) {
            return res.status(404).json({ message: 'User not found' });
        }

        game.player2 = user2.id;

        try {
            await game.save();
            return res.status(200).json({ message: 'Player joined game' });
        } catch (error) {
            return res.status(400).json({ message: 'Player joining game failed' });
        }
    }

    static async startMultiplayerGame(req: Request, res: Response): Promise<Response> {
        const gameId: string = req.params.gameId;

        const game = await Game.findById(gameId);

        if (!game) {
            return res.status(404).json({ message: 'Game not found' });
        }

        game.inProgress = true;

        try {
            await game.save();
            return res.status(200).json({ message: 'Game started' });
        } catch (error) {
            return res.status(400).json({ message: 'Game start failed' });
        }
    }

    static async endMultiplayerGame(req: Request, res: Response): Promise<Response> {
        const gameId: string = req.params.gameId;
        const winner: string = req.body.decoded_token.username;

        const game = await Game.findById(gameId);

        if (!game) {
            return res.status(404).json({ message: 'Game not found' });
        }

        game.inProgress = false;
        game.endTime = new Date();
        
        const user = await User.findOne({ username: winner });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        user.gamesWon += 1
        game.winner = user.id;

        try {
            await game.save();
            await user.save();
            return res.status(200).json({ message: 'Game ended' });
        } catch (error) {
            return res.status(400).json({ message: 'Game end failed' });
        }
    }
}

export default GameController;