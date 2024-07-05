import Game from "../../models/game";
import Move from "../../models/move";
import User from "../../models/user";

const moveMutation = {
    Mutation: {
        createMove: async (_: any, { gameId, playerId, row, col, value }: { gameId: string, playerId: string, row: number, col: number, value: string }) => {
            const game = await Game.findById(gameId);
            const player = await User.findById(playerId);

            if (!game || !player)
                throw new Error('Invalid game or player');

            if (game.gameStatus !== 'Started')
                throw new Error('Game has not started yet');

            if (game.nextPlayer_id !== playerId)
                throw new Error('It is not your turn');

            let move = new Move({
                gameId,
                playerId,
                row,
                col,
                value,
                timestamp: new Date()
            });

            await move.save();

            let board = game.board;

            if (!board) {
                throw new Error('Invalid board');
            }

            let index = row * 3 + col;

            board[index] = value;

            game.board = board;

            if (winningConditionMet(game)) {
                game.gameStatus = 'Finished';
                game.winner = playerId;
                game.endTime = new Date();

                await game.save();
                return move;
            }

            if (game.gameType === "MultiPlayer") {
                if (value === 'X')
                    game.nextPlayer_id = game.player2_id;
                else
                    game.nextPlayer_id = game.player1_id;
            } else {
                // Make the bot do a move
                if (game.board.includes(''))
                    saveBotMove(game);
                else {
                    game.gameStatus = 'Finished';
                    game.endTime = new Date();
                }


                if (winningConditionMet(game)) {
                    game.gameStatus = 'Finished';
                    game.winner = game.nextPlayer_id;
                    game.endTime = new Date();

                    await game.save();
                    return move;
                }

                game.nextPlayer_id = game.player1_id;
            }

            await game.save();

            return move;
        },

        deleteAllMoves: async () => {
            await Move.deleteMany({});
            return []
        }
    }
}

export default moveMutation;

async function saveBotMove(game: any) {
    let gameId = game.id;
    let playerId = game.player2_id;

    let board = game.board;

    let emptyIndexes = [];
    for (let i = 0; i < board.length; i++) {
        if (board[i] == '')
            emptyIndexes.push(i);
    }

    let randomIndex = Math.floor(Math.random() * emptyIndexes.length);

    let row = Math.floor(emptyIndexes[randomIndex] / 3);
    let col = emptyIndexes[randomIndex] % 3;

    let move = new Move({
        gameId,
        playerId,
        row,
        col,
        value: 'O',
        timestamp: new Date()
    });

    board[emptyIndexes[randomIndex]] = 'O';

    game.board = board;

    game.nextPlayer_id = playerId;

    await move.save();
}
function winningConditionMet(game: any) {
    let board = game.board;

    let winningCombinations = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8],
        [0, 3, 6], [1, 4, 7], [2, 5, 8],
        [0, 4, 8], [2, 4, 6]
    ];

    for (let i = 0; i < winningCombinations.length; i++) {
        let [a, b, c] = winningCombinations[i];

        if (board[a] && board[a] === board[b] && board[a] === board[c])
            return true;
    }

    return false;
}

