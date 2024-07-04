import Game from "../models/game";
import User from "../models/user";

import { Request, Response } from 'express';

class GameController {
    static async getAllGames(req: Request, res: Response): Promise<Response> {
        const games = await Game.find();
        return res.status(200).json(games);
    }

    static async getGamesByUser(req: Request, res: Response): Promise<Response> {
        const { username } = req.query;

        const user = await User.findOne({ username });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        let games = await Game.find({ $or: [{ player1: username }, { player2: username }, { player1: user.id }, { player2: user.id }] });

        const creatorGames = await Game.find({ creator: username });

        for (let game of games) {
            if (!game.isSinglePlayer) {
                game.player1 = game.player1 != "Pending" ? (await User.findById(game.player1))?.username as string : "Pending";
                game.player2 = game.player2 != "Pending" ? (await User.findById(game.player2))?.username as string : "Pending";
            }
        }

        let uniqueGames = [...games, ...creatorGames].filter((game, index, self) => self.findIndex(t => t.id === game.id) === index);

        return res.status(200).json({
            games: uniqueGames
        });
    }

    static async createSingleplayerGame(req: Request, res: Response): Promise<Response> {
        const creator: string = req.body.username;
        const player1: string = req.body.username;
        const player2: string = 'Computer';
        const startTime: Date = new Date();
        const endTime: Date = new Date();
        const isSinglePlayer: boolean = true;
        const winner: string = '';
        const status: string = 'Pending';

        const game = new Game({ creator, player1, player2, startTime, endTime, isSinglePlayer, winner, status });

        try {
            await game.save();
            return res.status(201).json({ message: 'Game created', gameId: game.id });
        } catch (error) {
            console.log(error);
            return res.status(400).json({ message: 'Game creation failed' });
        }
    }

    static async joinSingleplayerGame(req: Request, res: Response): Promise<Response> {
        const gameId: string = req.body.gameId;
        const username: string = req.body.username;
        
        const game = await Game.findById(gameId);

        if(!game) {
            return res.status(404).json({ message: 'Game not found' });
        }

        if(game.player1 !== username) {
            return res.status(403).json({ message: 'Unauthorized' });
        }

        game.status = 'Started';
        game.startTime = new Date();

        try {
            await game.save();
            return res.status(200).json({ message: 'Game started' });
        } catch (error) {
            return res.status(400).json({ message: 'Game start failed' });
        }
    }

    static async endSingleplayerGame(req: Request, res: Response): Promise<Response> {
        const gameId: string = req.body.gameId;
        const winner: string = req.body.username;
        
        const game = await Game.findById(gameId);

        if(!game) {
            return res.status(404).json({ message: 'Game not found' });
        }

        if(game.player1 !== winner && game.player2 !== winner) {
            return res.status(403).json({ message: 'Unauthorized' });
        }

        game.status = 'Finished';
        game.endTime = new Date();

        try {
            await game.save();
            return res.status(200).json({ message: 'Game ended' });
        } catch (error) {
            return res.status(400).json({ message: 'Game end failed' });
        }
    }

    static async createMultiplayerGame(req: Request, res: Response): Promise<Response> {
        const creator: string = req.body.username;
        const player1: string = "Pending";
        const player2: string = 'Pending';
        const startTime: Date = new Date();
        const endTime: Date = new Date();
        const isSinglePlayer: boolean = false;
        const winner: string = '';
        const status: string = 'Pending';

        console.log(creator, player1, player2, startTime, endTime, isSinglePlayer, winner, status);

        const game = new Game({ creator, player1, player2, startTime, endTime, isSinglePlayer, winner, status });

        try {
            await game.save();
            return res.status(201).json({ message: 'Game created', gameId: game.id});
        } catch (error) {
            return res.status(400).json({ message: 'Game creation failed' });
        }
    }

    static async deleteAllGames(req: Request, res: Response): Promise<Response> {
        await Game.deleteMany({});
        return res.status(200).json({ message: 'All games deleted' });
    }

    static async hasPlayerJoinedSingleplayerGame(req: Request, res: Response): Promise<Response> {
        const gameId: string = req.body.gameId;
        const username: string = req.body.username;

        const game = await Game.findById(gameId);

        if (!game) {
            return res.status(404).json({ message: 'Game not found' });
        }

        if (game.player1 !== username) {
            return res.status(403).json({ message: 'Unauthorized' });
        }

        return res.status(200).json({ joined: game.status === 'Started' });
    }

    static async getPlayersOfMultiplayerGame(req: Request, res: Response): Promise<Response> {
        const gameId: string = req.params.gameid;

        const game = await Game.findById(gameId);

        if (!game) {
            return res.status(404).json({ message: 'Game not found' });
        }

        const players = [game.player1, game.player2];

        return res.status(200).json({ players });
    }

    static async getMultiplayerGame(req: Request, res: Response): Promise<Response> {
        const gameId: string = req.params.gameid;

        const game = await Game.findById(gameId);

        if (!game) {
            return res.status(404).json({ message: 'Game not found' });
        }

        return res.status(200).json(game);
    }
}

export default GameController;