import mongoose from 'mongoose';

const gameSchema = new mongoose.Schema({
    creator_id: {
        type: String,
        required: true,
    },
    player1_id: {
        type: String,
        required: false,
    },
    player2_id: {
        type: String,
        required: false,
    },
    startTime: {
        type: Date,
        required: false,
    },
    endTime: {
        type: Date,
        required: false,
    },
    winner: {
        type: String,
        required: false,
    },
    gameType: {
        type: String,
        enum: ['SinglePlayer', 'MultiPlayer'],
        required: true,
        default: 'SinglePlayer',
    },
    gameStatus: {
        type: String,
        enum: ['Pending', 'Started', 'Finished'],
        required: true,
        default: 'Started',
    },
    nextPlayer_id: {
        type: String,
        required: false,
    },
    board: {
        type: [String],
        required: false,
    },
});

const Game = mongoose.model('Game', gameSchema);

export default Game;