import { useMutation, useQuery, useSubscription } from "@apollo/client";
import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import {
    ADD_PLAYER_TO_GAME,
    START_GAME,
    MAKE_MOVE,
    PLAYER_JOINED_SUBSCRIPTION,
    GAME_STARTED_SUBSCRIPTION,
    MOVE_MADE_SUBSCRIPTION
} from "../queries/multiplayer_game_queries";
import { GET_GAME_BY_ID } from "../queries/singleplayer_game_queries";
import GameBoard from "./GameBoard";
import GameInfo from "./GameInfo";
import GameHistory from "./GameHistory";

const TicTacToeMultiplayer: React.FC = () => {
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

            if (winner) {
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

    const handleMakeMove = (index: number) => {
        makeMove({
            variables: {
                gameId: gameid,
                playerId: localStorage.getItem("userId"),
                row: Math.floor(index / 3),
                col: index % 3,
                value: currentValue
            }
        });
    };

    return (
        <div className="container">
            {displayedGameEnd && <div className="alert alert-success" role="alert">
                {displayedGameEnd}
            </div>}
            <div className="row d-flex flex-row justify-content-center my-3">
                <div className="col-md-8">
                    <GameBoard
                        board={board}
                        canMakeTurn={joined && canMakeTurn}
                        currentValue={currentValue}
                        makeMove={handleMakeMove}
                    />
                </div>
                {!gameStarted && <GameInfo
                    gameid={gameid as string}
                    joined={joined}
                    joinedPlayers={joinedPlayers}
                    enabledStartButton={enabledStartButton}
                    joinGame={() => joinGame()}
                    startGame={() => startGame()}
                />}
            </div>
            <div className="row">
                <GameHistory moves={moves} />
            </div>
        </div>
    );
}

export default TicTacToeMultiplayer;
