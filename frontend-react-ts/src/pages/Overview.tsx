import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

type Game = {
  id: number;
  creator: string;
  player1: string;
  player2: string;
  startTime: Date;
  endTime: Date;
  winner: string;
  isSinglePlayer: boolean;
  inProgress: boolean;
};

const Overview: React.FC = () => {
  const username = localStorage.getItem('username') || 'User';
  const [gameId, setGameId] = useState<number | null>(null);
  const navigate = useNavigate();
  const [previousGames, setPreviousGames] = useState<Game[]>([]);

  useEffect(() => {
    const fetchPreviousGames = async () => {
      try {
        const response = await axios.get('http://localhost:3000/games/user', {
          params: { username }
        });
        setPreviousGames(response.data);
      } catch (error) {
        console.error('Error fetching previous games:', error);
      }
    };

    fetchPreviousGames();
  }, [username]);

  const handleJoinGame = (id: number) => {
    console.log(`Joining game with ID: ${id}`);
  };

  const createSingleplayerGame = () => {
    const data = { username };
    axios.post('http://localhost:3000/games/create/singleplayer', data)
      .then((response) => {
        console.log(response.data);
        navigate(`/singleplayer?gameid=${response.data.gameId}`);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  return (
    <div className='d-flex flex-column justify-content-between min-vh-100'>
      <Navbar />
      
      <div className='container my-4'>
        <div className='row'>
          <div className='col-md-6'>
            <div className='card'>
              <div className='card-body'>
                <h5 className='card-title'>Welcome, {username}!</h5>
              </div>
            </div>
          </div>
          <div className='col-md-6'>
            <div className='card'>
              <div className='card-body'>
                <h5 className='card-title'>How to Start the Game</h5>
                <p className='card-text'>
                  1. Click on the "Start Game" button.<br />
                  2. Invite a friend to join.<br />
                  3. Enjoy playing!
                </p>
                <div className='mt-3'>
                  <button className='btn btn-primary me-2' onClick={createSingleplayerGame}>Create Singleplayer Game</button>
                  <button className='btn btn-secondary'>Create Multiplayer Game</button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className='my-4'>
          <h5>Join a Game</h5>
          <div className='input-group mb-3'>
            <input
              type='text'
              className='form-control'
              placeholder='Enter Game ID'
              value={gameId === null ? '' : gameId}
              onChange={(e) => setGameId(Number(e.target.value))}
            />
            <button
              className='btn btn-primary'
              onClick={() => gameId !== null && handleJoinGame(gameId)}
            >
              Join
            </button>
          </div>
        </div>
        
        {/* Previous Games Section */}
        <div className='my-4'>
          <h5>Previous Games</h5>
          <div className='row'>
            {previousGames.map((game, index) => (
              <div key={index} className='col-md-6'>
                <div className='card mb-3'>
                  <div className='card-body'>
                    <h5 className='card-title'>Game {game.id}</h5>
                    <p className='card-text'><strong>Creator:</strong> {game.creator}</p>
                    <p className='card-text'><strong>Player 1:</strong> {game.player1}</p>
                    <p className='card-text'><strong>Player 2:</strong> {game.player2}</p>
                    <p className='card-text'><strong>Start Time:</strong> {new Date(game.startTime).toLocaleString()}</p>
                    <p className='card-text'><strong>End Time:</strong> {new Date(game.endTime).toLocaleString()}</p>
                    <p className='card-text'><strong>Winner:</strong> {game.winner}</p>
                    <p className='card-text'><strong>Single Player:</strong> {game.isSinglePlayer ? 'Yes' : 'No'}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default Overview;
