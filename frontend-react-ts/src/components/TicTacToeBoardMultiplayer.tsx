import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { io } from "socket.io-client";

const TicTacToeBoardMultiplayer: React.FC = () => {
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const gameid = searchParams.get("gameid");

    const [board, setBoard] = useState<string[]>(Array(9).fill(""));
    const [moves, setMoves] = useState<any[]>([]);
    const [joined, setJoined] = useState<boolean>(false);
    const [joinedPlayers, setJoinedPlayers] = useState<string[]>([]);
    const [enabledStartButton, setEnabledStartButton] = useState<boolean>(false);
    const [gameStarted, setGameStarted] = useState<boolean>(false);
    const [canMakeTurn, setCanMakeTurn] = useState<boolean>(false);

    const [currentValue, setCurrentValue] = useState<string>("X");

    let navigate = useNavigate();

    let socket = io("http://localhost:4000");

    // Initialize socket.io client connection
    useEffect(() => {
        // Connect to the server and get joinedPlayers
        socket.on("connect", () => {
            console.log("Connected to server.");
        });

        socket.on("loadGame", (data: any) => {
            console.log("Game loaded:", data);
            setBoard(data.board);
            setMoves(data.moves);
        })

        socket.on("move", (data: any) => {
            console.log("Move received:", data);
            data.move.value === "X" ? setCurrentValue("O") : setCurrentValue("X");
            
            let newBoard = data.move.board;
            let nextPlayer = data.move.nextPlayer;

            if(nextPlayer === localStorage.getItem("userId")) {
                setCanMakeTurn(true);
            } else {
                setCanMakeTurn(false);
            }

            setBoard(newBoard);

            let history = data.move.history;

            setMoves(history);
        });

        socket.on("playerJoined", (data: any) => {
            console.log("Players joined:", data);
            setJoinedPlayers(data.players);
            if (!data.players.includes("Pending")) {
                setEnabledStartButton(true);
            }
        });

        socket.on("playerLeft", (data: any) => {
            console.log("Player left:", data);
            setJoinedPlayers(data.players);
            setEnabledStartButton(false);
        });

        socket.on('gameStarted', (data: any) => {
            console.log('Game started:', data);
            let firstPlayer = data.firstPlayer;
            if (firstPlayer === localStorage.getItem("userId")) {
                setCanMakeTurn(true);
            }
            setGameStarted(true);
        });

        socket.on("gameIsOver", (data: any) => {
            console.log("Game over:", data);
            // Handle game over logic here
            if(data.winner != "Draw") {
                alert(`Player ${data.game.winner} wins!`);
            } else {
                alert("Game is a draw!");
            }

            navigate("/overview");
        });
    }, [gameid, socket]);

    function joinGame(): void {
        const username = localStorage.getItem("username");
        if (gameid && username) {
            socket.emit("join", { gameid, username });
            setJoined(true);
        } else {
            console.error("Game ID or username not available.");
        }
    }

    function handleMove(index: number): void {
        const username = localStorage.getItem("username");
        const userId = localStorage.getItem("userId");

        if (!username || !userId) {
            console.error("Username or user ID not available.");
            return;
        }

        if (!joined) {
            console.error("Player has not joined the game.");
            return;
        }

        if (!gameStarted) {
            console.error("Game has not started yet.");
            return;
        }

        if (!canMakeTurn) {
            console.error("Not your turn.");
            return;
        }

        if (board[index] !== "") {
            console.error("Cell is already taken.");
            return;
        }

        socket.emit("move", { gameid, username, userId, index, value: currentValue })
    }

    function leaveGame(): void {
        const username = localStorage.getItem("username");
        if (gameid && username) {
            socket.emit("leave", { gameid, username });
            setJoined(false);
        } else {
            console.error("Game ID or username not available.");
        }
    }

    function startGame(): void {
        socket.emit("startGame", { gameid });
    }

    return (
        <div className="container">
            <div className="row d-flex flex-row justify-content-center my-3">
                <div className="col-md-8">
                    <div className="card mb-3">
                        <div className="card-body">
                            <h5 className="card-title">Game Board</h5>
                            <div className="row">
                                {board.map((cell, index) => (
                                    <div
                                        key={index}
                                        className="col-4 border text-center d-flex flex-column justify-content-center align-items-center"
                                        style={(!joined || !canMakeTurn || board[index]) ? { cursor: 'not-allowed', height: '200px', fontSize: '3em' } : { cursor: 'pointer', height: '200px', fontSize: '3em' }}
                                        onClick={() => handleMove(index)}
                                    >
                                        {cell}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
                {!gameStarted && <div className="col-md-4">
                    <div className="card">
                        <div className="card-body">
                            <h5 className="card-title">Join Game</h5>
                            <p>Game ID: {gameid}</p>
                            {joinedPlayers.length > 0 && <p>Joined players: </p>}
                            <ul>
                                {joinedPlayers.filter(player => player !== "Pending").map((player, index) => (
                                    <li key={index}>{player}</li>
                                ))}
                            </ul>
                            {!joined && <button className="btn btn-primary" onClick={joinGame}>
                                Join Game
                            </button>
                            }
                            {enabledStartButton && <button className="btn btn-primary" onClick={startGame}>
                                Start Game
                            </button>
                            }
                            {joined && <button className="btn btn-danger" onClick={leaveGame}>
                                Leave Game
                            </button>}
                        </div>
                    </div>
                </div>
                }
            </div>
            <div className="row">
                <div className="col-md-12">
                    <div className="card">
                        <div className="card-body">
                            <h5 className="card-title">Game History</h5>
                            <table className="table">
                                <thead>
                                    <tr>
                                        <th>Move</th>
                                        <th>Player</th>
                                        <th>Position</th>
                                        <th>Timestamp</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {moves.map((move, index) => (
                                        <tr key={index}>
                                            <td>{index + 1}</td>
                                            <td>{move.player}</td>
                                            <td>{move.row}, {move.col}</td>
                                            <td>{new Date(move.timestamp).toLocaleString()}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default TicTacToeBoardMultiplayer;
