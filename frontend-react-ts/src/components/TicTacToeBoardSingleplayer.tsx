import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../styles/style.css";

interface TicTacToeBoardSingleplayerProps {
  gameid: string | undefined;
}

const TicTacToeBoardSingleplayer: React.FC<TicTacToeBoardSingleplayerProps> = ({ gameid }) => {
  const [board, setBoard] = useState<string[]>(Array(9).fill(""));
  const [moves, setMoves] = useState<any[]>([]);
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

        // Introduce a delay before updating with opponent's move
        setTimeout(() => {
          if (response.data.winner) {
            if (response.data.winner === "Draw") {
              alert("Game Over! It's a draw!");
              navigate("/overview");
              return;
            } else if (response.data.winner === "X") {
              alert(`Game Over! Winner: ${response.data.winner}`);
              navigate("/overview");
              return;
            }
          }

          const newMove = response.data.newMove;

          if (newMove.row === -1 && newMove.col === -1) {
            alert("Game Over! No more moves.");
            navigate("/overview");
            return;
          }

          const newIndex = newMove.row * 3 + newMove.col;

          setBoard((prevBoard) => {
            const updatedBoard = [...prevBoard];
            updatedBoard[newIndex] = "O";
            return updatedBoard;
          });

          setTimeout(() => {
            if (response.data.winner) {
              if (response.data.winner === "Draw") {
                alert("Game Over! It's a draw!");
                navigate("/overview");
                return;
              } else if (response.data.winner === "O") {
                alert(`Game Over! Winner: ${response.data.winner}`);
                navigate("/overview");
                return;
              }
            }
          }, 500);

          axios.get(`http://localhost:3000/moves/${gameid}`).then((responseMoves) => {
            // All moves where Player is not Computer, put them as You
            const newMoves = responseMoves.data.map((move: any) =>
              move.player === "Computer" ? { ...move, player: "Computer" } : { ...move, player: "You" }
            );

            setMoves(newMoves);
          })
        }, 1000);
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

        if (response.data.joined) {
          axios.get(`http://localhost:3000/moves/${gameid}`).then((response) => {
            console.log(response.data);
            const moves = response.data;
            const newBoard = Array(9).fill("");

            moves.forEach((move: any) => {
              newBoard[move.row * 3 + move.col] = move.value;
            });

            setBoard(newBoard);

            // Fetch all moves for the game
            axios.get(`http://localhost:3000/moves/${gameid}`).then((responseMoves) => {
              // All moves where Player is not Computer, put them as You
              const newMoves = responseMoves.data.map((move: any) => move.player === "Computer" ? { ...move, player: "Computer" } : { ...move, player: "You" });

              setMoves(newMoves);
            });
          }).catch((error) => {
            console.error(error);
          });
        }
      }).catch((error) => {
        console.error(error);
        navigate("/overview");
      })
    }
  }, [gameid]);

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
                    style={joinedGame && !board[index] ? { cursor: 'pointer', height: '200px', fontSize: '3em' } : { cursor: 'not-allowed', height: '200px', fontSize: '3em' }}
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
};

export default TicTacToeBoardSingleplayer;
