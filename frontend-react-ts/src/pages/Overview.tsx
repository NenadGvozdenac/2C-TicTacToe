import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

type Game = {
  _id: string;
  creator: string;
  player1: string;
  player2: string;
  startTime: Date;
  endTime: Date;
  winner: string;
  isSinglePlayer: boolean;
  status: string;
};

const Overview: React.FC = () => {
  const username = localStorage.getItem('username') || 'User';
  const [gameId, setGameId] = useState<string | null>(null);
  const navigate = useNavigate();
  const [previousGames, setPreviousGames] = useState<Game[]>([]);
  const [invalidGameId, setInvalidGameId] = useState<boolean>(false);

  useEffect(() => {
    const fetchPreviousGames = async () => {
      try {
        const response = await axios.get('http://localhost:3000/games/user', {
          params: { username }
        });
        // First set the previous games that have status === 'Started', then set the rest
        setPreviousGames(response.data.games.filter((game: Game) => game.status === 'Started' || game.status === "Pending"));
        setPreviousGames((prevGames) => [...prevGames, ...response.data.games.filter((game: Game) => game.status !== 'Started' && game.status !== "Pending")]);
      } catch (error) {
        console.error('Error fetching previous games:', error);
      }
    };

    fetchPreviousGames();
  }, [username]);

  const handleJoinGame = async (id: string) => {
    console.log(`Joining game with ID: ${id}`);
    // Check if the game exists
    try {
      await axios.get(`http://localhost:3000/games/multiplayer/${id}`);
      navigate(`/multiplayer?gameid=${id}`);
    } catch (error) {
      console.error('Error joining game:', error);
      setInvalidGameId(true);
    }
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

  function continueGame(e: React.MouseEvent<HTMLButtonElement, MouseEvent>, game: Game): void {
    e.preventDefault();
    if (game.isSinglePlayer) {
      navigate(`/singleplayer?gameid=${game._id}`);
    } else {
      navigate(`/multiplayer?gameid=${game._id}`);
    }
  }
  function navigateToGameHistory(e: React.MouseEvent<HTMLButtonElement, MouseEvent>, game: Game): void {
    e.preventDefault();
    navigate(`/history?gameid=${game._id}`);
  }

  function createMultiplayerGame(): void {
    const data = { username };
    axios.post('http://localhost:3000/games/create/multiplayer', data)
      .then((response) => {
        console.log(response.data);
        navigate(`/multiplayer?gameid=${response.data.gameId}`);
      })
      .catch((error) => {
        console.error(error);
      });
  }

  return (
    <div className='d-flex flex-column justify-content-between min-vh-100'>
      <Navbar />

      <div className='container my-4'>
        <div className='row'>
          <div className='col-md-4'>
            <div className='card'>
              <div className='card-body'>
                <h5 className='card-title'>Welcome, {username}!</h5>
              </div>
            </div>
          </div>
          <div className='col-md-4'>
            <div className='card'>
              <div className='card-body'>
                <h5 className='card-title'>How to Start the Game (Singleplayer)</h5>
                <p className='card-text'>
                  1. Click on the "Start Game" button.<br />
                  2. Join the room.<br />
                  3. Enjoy playing!
                </p>
                <div className='mt-3'>
                  <button className='btn btn-primary me-2' onClick={createSingleplayerGame}>Create Singleplayer Game</button>
                </div>
              </div>
            </div>
          </div>
          <div className='col-md-4'>
            <div className='card'>
              <div className='card-body'>
                <h5 className='card-title'>How to Start the Game (Multiplayer)</h5>
                <p className='card-text'>
                  1. Click on the "Start Game" button.<br />
                  2. Invite a friend to join.<br />
                  3. Wait for the friend to join.<br />
                  4. Start the game.<br />
                  5. Enjoy playing!
                </p>
                <div className='mt-3'>
                  <button className='btn btn-secondary' onClick={createMultiplayerGame}>Create Multiplayer Game</button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className='my-4'>
          <h5>Join a Game</h5>
          {invalidGameId && <p className='text-danger'>Please enter a valid Game ID</p>}
          <div className='input-group mb-3'>
            <input
              type='text'
              className='form-control'
              placeholder='Enter Game ID'
              value={gameId === null ? '' : gameId}
              onChange={(e) => setGameId(e.target.value)}
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
                    <h5 className='card-title'>{game.isSinglePlayer ? "Singleplayer " : "Mutliplayer "} Game (#{game._id})</h5>
                    <p className='card-text'><strong>Creator:</strong> {game.creator}</p>
                    <p className='card-text'><strong>Player 1:</strong> {game.player1}</p>
                    <p className='card-text'><strong>Player 2:</strong> {game.player2}</p>
                    <p className='card-text'><strong>Start Time:</strong> {new Date(game.startTime).toLocaleString()}</p>
                    <p className='card-text'><strong>End Time:</strong> {new Date(game.endTime).toLocaleString()}</p>
                    <p className='card-text'><strong>Game Winner:</strong> {game.winner === "Draw" ? "It's a draw! No winners!" : game.winner == null ? 'No winners yet!' : game.winner}</p>
                    <p className='card-text'><strong>Status:</strong> {game.status}</p>
                    <div className="d-flex justify-content-center align-items center gap-2">
                      {game.winner ? null : <button className='btn btn-primary col-6' onClick={e => continueGame(e, game)}>Continue Game</button>}
                      {game.winner ? <button className='btn btn-secondary col-6' onClick={e => navigateToGameHistory(e, game)}>Game history</button> : <button className='btn btn-secondary col-6' onClick={e => navigateToGameHistory(e, game)}>Game history</button>}
                    </div>
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
