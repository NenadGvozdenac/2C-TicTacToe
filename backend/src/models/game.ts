import mongoose from 'mongoose';

const gameSchema = new mongoose.Schema({
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
        required: true,
    },
    winner: {
        type: String,
        required: true,
    },
    isSinglePlayer: {
        type: Boolean,
        required: true,
    },
});

const Game = mongoose.model('Game', gameSchema);

export default Game;