import mongoose from 'mongoose';

const gameSchema = new mongoose.Schema({
    creator: {
        type: String,
        required: true,
    },
    player1: {
        type: String,
        required: true,
    },
    player2: {
        type: String,
        required: true,
    },
    startTime: {
        type: Date,
        required: true,
    },
    endTime: {
        type: Date,
        required: false,
    },
    winner: {
        type: String,
        required: false,
    },
    isSinglePlayer: {
        type: Boolean,
        required: true,
    },
    inProgress: {
        type: Boolean,
        required: true,
    },
    finished: {
        type: Boolean,
        default: false
    },
});

const Game = mongoose.model('Game', gameSchema);

export default Game;