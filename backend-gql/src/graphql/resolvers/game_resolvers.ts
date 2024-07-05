import Game from '../../models/game';
import Move from '../../models/move';
import User from '../../models/user';

const gameResolver = {
    Game: {
        creator: async (parent: any) => {
            return await User.findById(parent.creator_id);
        },

        player1: async (parent: any) => {
            return await User.findById(parent.player1_id);
        },

        player2: async (parent: any) => {
            return await User.findById(parent.player2_id);
        },

        winner: async (parent: any) => {
            return await User.findById(parent.winner);
        },

        status: async (parent: any) => {
            return parent.gameStatus;
        },

        nextPlayer: async (parent: any) => {
            return await User.findById(parent.nextPlayer_id);
        },

        moves: async (parent: any) => {
            return await Move.find({ gameId: parent.id });
        }
    },

    Query: {
        getAllGamesByUser: async (_: any, { userId }: { userId: string }) => {
            return await Game.find({ $or: [{ player1_id: userId }, { player2_id: userId }, { creator_id: userId }] });
        },

        getAllGamesByUsername: async (_: any, { username }: { username: string }) => {
            const user = await User.findOne({ username });

            if(!user)
                return [];

            return await Game.find({ $or: [{ player1: user.id }, { player2: user.id }, { creator: user.id }] });
        },

        getGameById: async (_: any, { gameId }: { gameId: string }) => {
            return await Game.findById(gameId);
        },

        getAllGames: async () => {
            return await Game.find();
        }
    }
}

export default gameResolver;