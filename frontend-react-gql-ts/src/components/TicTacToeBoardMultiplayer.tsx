import { useMutation, useQuery, useSubscription } from "@apollo/client";
import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { ADD_PLAYER_TO_GAME, START_GAME, MAKE_MOVE, PLAYER_JOINED_SUBSCRIPTION, GAME_STARTED_SUBSCRIPTION, MOVE_MADE_SUBSCRIPTION } from "../queries/multiplayer_game_queries";
import { GET_GAME_BY_ID } from "../queries/singleplayer_game_queries";

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
    const [displayedGameEnd, setDisplayedGameEnd] = useState<string>("");
    const [currentValue, setCurrentValue] = useState<string>("X");

    const navigate = useNavigate();
    
    useQuery(GET_GAME_BY_ID, {
        variables: { gameId: gameid },
        onCompleted: (data) => {
            let game = data.getGameById;
            let players = [game.player1, game.player2].filter(player => player !== null).map(player => player.username)
            setBoard(game.board);
            setMoves(game.moves);
            setJoinedPlayers(players);
            setEnabledStartButton(players.length == 2 && players.includes(localStorage.getItem("username")));
            setGameStarted(game.status == "Started");
            setJoined(players.includes(localStorage.getItem("username")));
            setCanMakeTurn(game.nextPlayer.id === localStorage.getItem("userId"));
            setCurrentValue(game.nextPlayer.id === game.player1.id ? 'X' : 'O')
        }
    });

    useSubscription(GAME_STARTED_SUBSCRIPTION, {
        variables: { gameId: gameid },
        onSubscriptionData: ({ subscriptionData }) => {
            let game = subscriptionData.data.gameStarted;
            setBoard(game.board);
            setMoves(game.moves);
            setGameStarted(true);
            setCanMakeTurn(game.nextPlayer.id === localStorage.getItem("userId"));
        }
    });

    useSubscription(PLAYER_JOINED_SUBSCRIPTION, {
        variables: { gameId: gameid },
        onSubscriptionData: ({ subscriptionData }) => {
            let playersJoined = subscriptionData.data.playersJoined.map((player: any) => player.username);
            setJoinedPlayers(playersJoined);
            setEnabledStartButton(playersJoined.length == 2);
        }
    });


    useSubscription(MOVE_MADE_SUBSCRIPTION, {
        variables: { gameId: gameid },
        onSubscriptionData: ({ subscriptionData }) => {
            let move = subscriptionData.data.moveMade;
            let newBoard = move.game.board;
            let winner = move.game.winner;
            setBoard(newBoard);
            setMoves([...moves, move]);

            if(winner) {
                setCanMakeTurn(false);
                setDisplayedGameEnd(`Game ended. Winner: ${winner.username}`);
                setTimeout(() => navigate("/overview"), 3000)
            }

            setCanMakeTurn(move.game.nextPlayer.id === localStorage.getItem("userId"));
            setCurrentValue(currentValue === 'X' ? 'O' : 'X');
        }
    });

    const [joinGame] = useMutation(ADD_PLAYER_TO_GAME, {
        variables: { gameId: gameid, playerId: localStorage.getItem("userId") },
        onCompleted: _ => {
            console.log('Joined game');
            setJoined(true);
        },
        onError: (error) => {
            console.error(error);
        },
    });

    const [startGame] = useMutation(START_GAME, {
        variables: { gameId: gameid },
        onCompleted: _ => {
            console.log('Game started');
        },
        onError: (error) => {
            console.error(error);
        },
    });

    const [makeMove] = useMutation(MAKE_MOVE, {
        onCompleted: _ => {
            console.log('Move made');
        },
        onError: (error) => {
            console.error(error);
        },
    });

    return (
        <div className="container">
            <div className="row d-flex flex-row justify-content-center my-3">
                <div className="col-md-8">
                    <div className="card mb-3">
                        <div className="card-body">
                            <h5 className="card-title">Game Board</h5>
                            {displayedGameEnd && <div className="alert alert-primary" role="alert">
                                {displayedGameEnd}
                            </div>}
                            <div className="row">
                                {board.map((cell, index) => (
                                    <div
                                        key={index}
                                        className="col-4 border text-center d-flex flex-column justify-content-center align-items-center"
                                        style={(!joined || !canMakeTurn || board[index]) ? { cursor: 'not-allowed', height: '200px', fontSize: '3em' } : { cursor: 'pointer', height: '200px', fontSize: '3em' }}
                                        onClick={() => makeMove({variables: {
                                            gameId: gameid,
                                            playerId: localStorage.getItem("userId"),
                                            row: Math.floor(index / 3),
                                            col: index % 3,
                                            value: currentValue
                                        }})}>
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
                            {!joined && joinedPlayers.includes(localStorage.getItem("username") as string) && <button className="btn btn-primary" onClick={() => joinGame()}>
                                Join Game
                            </button>
                            }
                            {enabledStartButton && <button className="btn btn-primary" onClick={() => startGame()}>
                                Start Game
                            </button>
                            }
                            {joined && <button className="btn btn-danger">
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
                                            <td>{move.player.username}</td>
                                            <td>{move.row}, {move.col}</td>
                                            <td>{new Date(Number(move.timestamp)).toLocaleString()}</td>
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
