import Game from '../models/game';
import Move from '../models/move';
import User from '../models/user';

class MultiplayerGameController {
    static async addPlayer(gameid: string, username: string) {
        let game = await Game.findById(gameid);

        if (!game) {
            return null;
        }

        const player = await User.findOne({ username });

        if (!player) {
            return null;
        }

        if (game.player1 == "Pending") {
            game.player1 = player.id;
        } else if (game.player2 == "Pending") {
            game.player2 = player.id;
        } else {
            return null;
        }

        try {
            await game.save();
            return game;
        } catch (error) {
            console.error('Error adding player to game:', error);
            return null;
        }
    }

    static async removePlayer(gameid: string, username: string) {
        let game = await Game.findById(gameid);

        if(!game) {
            return null;
        }

        const player = await User.findOne({ username });

        if (!player) {
            return null;
        }

        if (game.player1 == player.id) {
            game.player1 = "Pending";
        } else if (game.player2 == player.id) {
            game.player2 = "Pending";
        } else {
            return null;
        }

        try {
            await game.save();
            return game;
        } catch (error) {
            console.error('Error removing player from game:', error);
            return null;
        }
    }

    static async makeMove(gameid: string, username: string, index: number, value: string) {
        let game = await Game.findById(gameid);

        if (!game) {
            return null;
        }

        const player = await User.findOne({ username });

        if (!player) {
            return null;
        }

        let move = new Move({
            gameId: game.id,
            player: player.id,
            row: Math.floor(index / 3),
            col: index % 3,
            value: value,
            timestamp: new Date(),
        })

        let currentPlayer = await User.findOne({ username });

        if(!currentPlayer) {
            return null;
        }

        try {
            await move.save();

            let newMove = {
                row: move.row,
                col: move.col,
                value: move.value,
                gameId: move.gameId,
                player: move.player,
                timestamp: move.timestamp,
                id: move.id,
                board: await GenerateBoard(gameid),
                nextPlayer: game.player1 == currentPlayer.id ? game.player2 : game.player1,
                history: await GetHistory(gameid)
            }

            return newMove;
        } catch (error) {
            console.error('Error making move:', error);
            return null;
        }
    }

    static async getPlayers(gameid: string) {
        let game = await Game.findById(gameid);

        if (!game) {
            return null;
        }

        let player1 = await User.findById(game.player1);
        let player2 = await User.findById(game.player2);

        return { player1, player2 };
    }

    static async startGame(gameId: string) {
        let game = await Game.findById(gameId);

        if(!game) {
            return null;
        }

        game.startTime = new Date();
        game.status = 'Started';

        try {
            await game.save();
            return game;
        } catch (error) {
            console.error('Error starting game:', error);
            return null;
        }
    }

    static async checkGameStatus(gameId: string, username: string) {
        let game = await Game.findById(gameId);

        if(!game) {
            return null;
        }

        let moves = await Move.find({ gameId });

        let board = Array(9).fill('');

        moves.forEach((move) => {
            board[move.row * 3 + move.col] = move.value;
        });

        let winningCombos = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8],
            [0, 3, 6], [1, 4, 7], [2, 5, 8],
            [0, 4, 8], [2, 4, 6]
        ];

        for (let combo of winningCombos) {
            if (board[combo[0]] && board[combo[0]] == board[combo[1]] && board[combo[0]] == board[combo[2]]) {
                game.winner = (await User.findOne({ username }))?.id;
                game.status = 'Finished';
                game.endTime = new Date();

                try {
                    await game.save();
                    return game;
                } catch (error) {
                    console.error('Error finishing game:', error);
                    return null;
                }
            }
        }

        if (moves.length == 9) {
            game.status = 'Finished';
            game.winner = 'Draw';
            game.endTime = new Date();

            try {
                await game.save();
                return game;
            } catch (error) {
                console.error('Error finishing game:', error);
                return null;
            }
        }
    }

    static async rejoinGame(gameId: string, username: string) {
        let game = await Game.findById(gameId);

        if (!game) {
            return null;
        }

        let player = await User.findOne({ username });

        if (!player) {
            return null;
        }

        if (game.player1 == player.id || game.player2 == player.id) {
            let board = await GenerateBoard(gameId);
            let history = await GetHistory(gameId);

            let lastMove = history[history.length - 1];

            if(lastMove){
                var nextValue = lastMove.value == 'X' ? 'O' : 'X';
    
                let nextPlayer = game.player1 == lastMove.player ? game.player2 : game.player1;
    
                let hasStarted = game.status == 'Started';

                return { player1: game.player1, player2: game.player2, board, nextPlayer, nextValue, history, hasStarted };
            }

            return { player1: game.player1, player2: game.player2, board, nextPlayer: game.player1, nextValue: 'X', history, hasStarted: false };
        }

        return null;
    }
}

export default MultiplayerGameController;

async function GenerateBoard(gameId: string): Promise<string[]> {
    let game = await Game.findById(gameId);

    if (!game) {
        return [];
    }

    let moves = await Move.find({ gameId });

    let board = Array(9).fill('');

    moves.forEach((move) => {
        board[move.row * 3 + move.col] = move.value;
    });

    return board;
}

async function GetHistory(gameId: string) {
    let moves = await Move.find({ gameId });

    if (!moves) {
        return [];
    }

    return moves;
}