import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

type Move = {
  _id: string;
  gameid: string;
  player: string;
  row: number;
  col: number;
  timestamp: Date;
  value: string;
};

const GameHistory: React.FC = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const gameid = searchParams.get("gameid");

  const navigate = useNavigate();

  const [moves, setMoves] = useState<Move[]>([]);

  useEffect(() => {
    axios.get(`http://localhost:3000/moves/${gameid}`).then(response => {
      setMoves(response.data);
    }).catch(error => {
      console.log('Error fetching moves:', error);
      navigate('/overview');
    })
  }, [gameid])
  
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
            {moves.map((move, index) => (
              <tr key={index}>
                <td>{move.player}</td>
                <td>{move.value}</td>
                <td>{move.row}</td>
                <td>{move.col}</td>
                <td>{new Date(move.timestamp).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Footer />
    </div>
  )
};

export default GameHistory;
