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
    status: {
        type: String,
        enum: ['Pending', 'Started', 'InProgress', 'Finished'],
        required: true,
        default: 'Started',
    },
});

const Game = mongoose.model('Game', gameSchema);

export default Game;