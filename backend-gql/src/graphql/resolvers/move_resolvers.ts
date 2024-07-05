import Game from "../../models/game";
import Move from "../../models/move";
import User from "../../models/user";

const moveResolver = {
    Move: {
        game: async (parent: any) => {
            return await Game.findById(parent.gameId);
        },

        player: async (parent: any) => {
            return await User.findById(parent.playerId);
        }
    },

    Query: {
        getMovesByGame: async (_: any, { gameId }: { gameId: string }) => {
            return await Move.find({ gameId });
        },

        getMoveById: async (_: any, { moveId }: { moveId: string }) => {
            return await Move.findById(moveId);
        }
    }
}

export default moveResolver;