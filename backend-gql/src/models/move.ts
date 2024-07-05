import mongoose from 'mongoose';

const moveSchema = new mongoose.Schema({
    gameId: {
        type: String,
        required: true,
    },
    playerId: {
        type: String,
        required: true,
    },
    row: {
        type: Number,
        required: true,
    },
    col: {
        type: Number,
        required: true,
    },
    value: {
        type: String,
        required: true,
    },
    timestamp: {
        type: Date,
        required: true,
    },
});

const Move = mongoose.model('Move', moveSchema);

export default Move;