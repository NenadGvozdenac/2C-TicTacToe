import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useLocation } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import { GET_GAME_HISTORY } from '../queries/history_queries';

type Game = {
  id: string;
  gameType: string;
  status: string;
  player1: {
    id: string;
    username: string;
  };
  player2: {
    id: string;
    username: string;
  };
  winner: {
    id: string;
    username: string;
  };
  moves: {
    player: {
      username: string;
    };
    row: number;
    col: number;
    timestamp: string;
  }[];
};

const GameHistory: React.FC = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const gameid = searchParams.get("gameid");

  const [game, setGame] = useState<Game | null>(null);

  const fetchGameHistory = useQuery(GET_GAME_HISTORY, {
    variables: { gameId: gameid },
    onCompleted: data => {
      setGame(data.getGameById);
    },
    onError: (error) => {
      console.error(error);
    },
  })

  useEffect(() => {
    fetchGameHistory.refetch();
  });
  
  return (
    <div className='d-flex flex-column justify-content-between min-vh-100'>
      <Navbar />
      <div className="container">
        <h1>Game History: #{gameid} </h1>
      </div>
      {/* Move history in a table */}
      <div className="container">
        <table className="table">
          <thead>
            <tr>
              <th scope="col">Player</th>
              <th scope="col">Value</th>
              <th scope="col">Row</th>
              <th scope="col">Column</th>
              <th scope="col">Timestamp</th>
            </tr>
          </thead>
          <tbody>
            {game?.moves.map((move, index) => (
              <tr key={index}>
                <td>{move.player.username}</td>
                <td>{index % 2 === 0 ? 'X' : 'O'}</td>
                <td>{move.row}</td>
                <td>{move.col}</td>
                <td>{new Date(Number(move.timestamp)).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Display winner */}
        <div>
          <h3>Winner: {game?.winner.username}</h3>
        </div>
      </div>
      <Footer />
    </div>
  )
};

export default GameHistory;
