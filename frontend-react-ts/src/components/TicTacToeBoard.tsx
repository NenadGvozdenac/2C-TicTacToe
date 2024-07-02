import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../styles/style.css";

interface TicTacToeBoardProps {
  gameid: string | undefined;
}

const TicTacToeBoard: React.FC<TicTacToeBoardProps> = ({ gameid }) => {
  const [board, setBoard] = useState<string[]>(Array(9).fill(""));
  const [joinedGame, setJoinedGame] = useState<boolean>(false);

  const navigate = useNavigate();

  // Function to handle a move in the game
  const handleMove = async (index: number) => {
    if (joinedGame && !board[index]) {
      const username = localStorage.getItem("username");

      try {
        const response = await axios.post("http://localhost:3000/moves/create", {
          gameId: gameid,
          username,
          row: Math.floor(index / 3),
          col: index % 3,
          value: "X",
          timestamp: new Date(),
        });

        // Update board with player's move immediately
        setBoard((prevBoard) => {
          const updatedBoard = [...prevBoard];
          updatedBoard[index] = "X";
          return updatedBoard;
        });

        const responseWinner = await axios.post("http://localhost:3000/moves/winner", {
          gameId: gameid,
        });

        if (responseWinner.data.winner && responseWinner.data.winner !== "Draw") {
          alert(`Game Over! Winner: ${responseWinner.data.winner}`);
          navigate("/overview");
          return;
        } else if(responseWinner.data.winner === "Draw") {
          alert("Game Over! It's a draw!");
          navigate("/overview");
          return;
        }

        // Introduce a half-second delay before updating with opponent's move
        setTimeout(() => {
          const newMove = response.data.newMove;
          const newIndex = newMove.row * 3 + newMove.col;

          setBoard((prevBoard) => {
            const updatedBoard = [...prevBoard];
            updatedBoard[newIndex] = "O";
            return updatedBoard;
          });
        }, 500);

      } catch (error) {
        console.log(error);
      }
    }
  };

  const joinGame = () => {
    if (gameid) {
      const username = localStorage.getItem("username");

      axios.post("http://localhost:3000/games/join/singleplayer", {
        gameId: gameid,
        username: username,
      }).then(_ => {
        setJoinedGame(true);
      }).catch((error) => {
        console.error(error);
      })
    }
  };

  useEffect(() => {
    if (gameid) {
      const username = localStorage.getItem("username");

      axios.post("http://localhost:3000/games/join/singleplayer/check", {
        gameId: gameid,
        username: username,
      }).then(response => {
        setJoinedGame(response.data.joined);
      }).catch((error) => {
        console.error(error);
        navigate("/");
      })
    }
  }, [gameid]);

  return (
    <div className="container d-flex flex-row justify-content-center">
      <div className="row">
        <h1>Tic-Tac-Toe Game</h1>
        <div className={!joinedGame ? "col-md-8" : "col-md-12"}>
          <div className="card mb-3">
            <div className="card-body">
              <h5 className="card-title">Game Board</h5>
              <div className="row">
                {board.map((cell, index) => (
                  <div
                    key={index}
                    className="col-4 border text-center p-3 d-flex flex-column justify-content-center align-items-center"
                    style={joinedGame ? { cursor: 'pointer', height: '200px', fontSize: '3em' } : { cursor: 'not-allowed', height: '200px', fontSize: '3em' }}
                    onClick={() => handleMove(index)}
                  >
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
                <button className="btn btn-primary" onClick={joinGame}>
                  Join Game?
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TicTacToeBoard;
