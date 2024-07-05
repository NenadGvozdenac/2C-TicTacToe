import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  gamesWon: {
    type: Number,
    default: 0,
  },
});

const User = mongoose.model('User', userSchema);

export default User;