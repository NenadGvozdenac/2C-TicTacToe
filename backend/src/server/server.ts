import app from './app';
import http from 'http';
import { Server } from 'socket.io';

import { secrets } from '../database/secrets';

const server = http.createServer(app);

const io: Server = new Server(server, {
    cors: {
        origin: secrets.FE_URL,
        methods: ['GET', 'POST'],
    },
});

import MultiplayerGameController from '../controllers/multiplayer_game_controller';

io.on('connection', async (socket) => {
    // If user was already in a game, rejoin the game
    socket.on('rejoin', ({ gameid, username }) => {
        console.log('Player rejoined:', gameid, username);
        MultiplayerGameController.rejoinGame(gameid, username).then(data => {
            if (!data) {
                return;
            }

            let { player1, player2, board, nextPlayer, nextValue, history, hasStarted } = data;

            socket.join(gameid);

            socket.emit('rejoinGame', { player1, player2, board, nextPlayer, nextValue, history, hasStarted });
        });
    });

    socket.on('join', ({ gameid, username }) => {
        console.log('Player joined:', gameid, username);
        MultiplayerGameController.addPlayer(gameid, username).then((game) => {
            if (!game) {
                return;
            }
            // Want to create a new room for each game
            socket.join(gameid);
            console.log('Players:', game.player1, game.player2);
            io.to(gameid).emit('playerJoined', { players: [game.player1, game.player2] });
        });
    });

    socket.on('leave', ({ gameid, username }) => {
        console.log('Player left:', gameid, username);
        MultiplayerGameController.removePlayer(gameid, username).then((game) => {
            if (!game) {
                return;
            }
            console.log('Players:', game.player1, game.player2);
            io.to(gameid).emit('playerLeft', { players: [game.player1, game.player2] });
        });
    });

    socket.on('startGame', ({ gameid }) => {
        console.log('Game started:', gameid);
        MultiplayerGameController.startGame(gameid).then((game) => {
            if (!game) {
                return;
            }
            io.to(gameid).emit('gameStarted', { game: game, firstPlayer: game.player1 })
        });
    });

    socket.on('move', (data) => {
        MultiplayerGameController.makeMove(data.gameid, data.username, data.index, data.value).then((move) => {
            if(!move) {
                return;
            }

            io.to(data.gameid).emit('move', { move: move, board: move.board, nextPlayer: move.nextPlayer });

            MultiplayerGameController.checkGameStatus(data.gameid, data.username).then(game => {
                if (game) {
                    io.to(data.gameid).emit('gameIsOver', { game: game });
                }
            });
        });
    });
});

app.listen(secrets.EXPRESS_PORT, () => {
    console.log('Express server is running on port 3000');
})

export default server;