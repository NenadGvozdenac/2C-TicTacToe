import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/style.css";

import { useMutation, useQuery } from "@apollo/client";
import { ADD_PLAYER_TO_GAME, GET_GAME_BY_ID, CREATE_MOVE } from "../queries/singleplayer_game_queries";

interface TicTacToeBoardSingleplayerProps {
  gameid: string | undefined;
}

const TicTacToeBoardSingleplayer: React.FC<TicTacToeBoardSingleplayerProps> = ({ gameid }) => {
  const [board, setBoard] = useState<string[]>([]);
  const [moves, setMoves] = useState<any[]>([]);
  const [joinedGame, setJoinedGame] = useState<boolean>(false);
  const [canMakeMove, setCanMakeMove] = useState<boolean>(false);

  const navigate = useNavigate();

  useQuery(GET_GAME_BY_ID, {
    variables: { gameId: gameid },
    onCompleted: data => {
      const game = data.getGameById;
      setBoard(game.board);
      setMoves(game.moves);
      setJoinedGame(game.player1.id === localStorage.getItem("userId") || game.player2.id === localStorage.getItem("userId"));
      setCanMakeMove(game.nextPlayer.id === localStorage.getItem("userId"));
    },
    onError: (error) => {
      console.error(error);
    },
  });

  const [joinGame] = useMutation(ADD_PLAYER_TO_GAME, {
    variables: { gameId: gameid, playerId: localStorage.getItem("userId") },
    onCompleted: _ => {
      setJoinedGame(true);
      setCanMakeMove(true);
    },
    onError: (error) => {
      console.error(error);
    },
  });

  const [createMove] = useMutation(CREATE_MOVE, {
    onCompleted: data => {
      const move = data.createMove;
      setBoard(move.game.board)
      setMoves(move.game.moves)

      setTimeout(() => {
        if (move.game.winner) {
          if (move.game.winner.id == localStorage.getItem("userId")) {
            alert("You won!");
          }

          if (move.game.winner.id != localStorage.getItem("userId")) {
            alert("You lost!");
          }

          navigate(`/overview`);
          return;
        }

        if(!move.game.board.includes('')) {
          alert("It's a tie!");
          navigate(`/overview`);
        }
      }, 1000);
  },
    onError: (error) => {
      console.error(error);
    },
  });

const handleMove = (index: number) => {
  if (board[index] || !joinedGame) {
    return;
  }

  const row = Math.floor(index / 3);
  const col = index % 3;

  createMove({
    variables: {
      gameId: gameid,
      playerId: localStorage.getItem("userId"),
      row,
      col,
      value: "X",
    }
  })
}

return (
  <div className="container">
    <div className="row d-flex flex-row justify-content-center">
      <h1>Tic-Tac-Toe Game</h1>
      <div className={!joinedGame ? "col-md-8" : "col-md-8"}>
        <div className="card mb-3">
          <div className="card-body">
            <h5 className="card-title">Game Board</h5>
            <div className="row">
              {board.map((cell, index) => (
                <div
                  key={index}
                  className="col-4 border text-center d-flex flex-column justify-content-center align-items-center"
                  style={joinedGame && canMakeMove && !board[index] ? { cursor: 'pointer', height: '200px', fontSize: '3em' } : { cursor: 'not-allowed', height: '200px', fontSize: '3em' }}
                  onClick={() => handleMove(index)}>
                  {cell}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      {!joinedGame && (
        <div className="col-md-4">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Join Game</h5>
              <p>Game ID: {gameid}</p>
              <button className="btn btn-primary" onClick={() => joinGame()}>
                Join Game?
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
    {/* History of moves */}
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
};

export default TicTacToeBoardSingleplayer;
