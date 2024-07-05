import Game from "../../models/game";
import User from "../../models/user";

const gameMutations = {
    Mutation: {
        createGame: async(_: any, { creatorId, gameType }: { creatorId: string, gameType: string }) => {
            const game = new Game({
                creator_id: creatorId,
                gameType,
                gameStatus: 'Pending',
                board: Array(9).fill('')
            })

            return await game.save();
        },

        addPlayerToGame: async(_: any, { gameId, playerId }: { gameId: string, playerId: string }) => {
            const game = await Game.findById(gameId);

            if(!game) {
                throw new Error('Game not found');
            }

            if(game.gameStatus !== 'Pending') {
                throw new Error('Game already started');
            }

            if(game.player1_id) {
                game.player2_id = playerId;
            } else {
                game.player1_id = playerId;
            }

            if(game.gameType === 'SinglePlayer') {
                game.gameStatus = 'Started';
                game.startTime = new Date();
                game.nextPlayer_id = game.player1_id;

                let player2 = await User.findOne({ username: "Computer"});

                if(!player2) {
                    throw new Error('Computer player not found');
                }

                game.player2_id = player2.id;
            }

            return await game.save();
        },

        deleteAllGames: async() => {
            await Game.deleteMany({});
            return []
        }
    }
}

export default gameMutations;