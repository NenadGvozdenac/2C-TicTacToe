import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation } from '@apollo/client';
import { FETCH_PREVIOUS_GAMES, CREATE_GAME } from '../queries/overview_queries';

type Game = {
  id: string;
  gameType: string;
  status: string;
  startTime: string;
  endTime: string;
  creator: {
    id: string;
    username: string;
  };
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
};

const Overview: React.FC = () => {
  const username = localStorage.getItem('username') || 'User';
  const [gameId, setGameId] = useState<string | null>(null);
  const navigate = useNavigate();
  const [previousGames, setPreviousGames] = useState<Game[]>([]);
  const [invalidGameId, setInvalidGameId] = useState<boolean>(false);

  const fetchPreviousGames = useQuery(FETCH_PREVIOUS_GAMES, {
    variables: { userId: localStorage.getItem('userId') },
    onCompleted: (data) => {
      setPreviousGames(data.getAllGamesByUser);
    },
    onError: (error) => {
      console.error(error);
    }
  });

    // On reload fetch all previous games
    useEffect(() => {
      fetchPreviousGames.refetch();
    });

  const [createSingleplayerGame] = useMutation(CREATE_GAME, {
    variables: { creatorId: localStorage.getItem('userId'), gameType: 'SinglePlayer' },
    onCompleted: (data) => {
      navigate(`/singleplayer?gameid=${data.createGame.id}`);
    },
    onError: (error) => {
      console.error(error);
    }
  });

  const [createMultiplayerGame] = useMutation(CREATE_GAME, {
    variables: { creatorId: localStorage.getItem('userId'), gameType: 'MultiPlayer' },
    onCompleted: (data) => {
      navigate(`/multiplayer?gameid=${data.createGame.id}`);
    },
    onError: (error) => {
      console.error(error);
    }
  });

  const handleJoinGame = async (id: string) => {

  };

  function continueGame(e: React.MouseEvent<HTMLButtonElement, MouseEvent>, game: Game): void {
    e.preventDefault();
    if (game.gameType === 'Singleplayer') {
      navigate(`/singleplayer?gameid=${game.id}`);
    } else {
      navigate(`/multiplayer?gameid=${game.id}`);
    }
  }
  function navigateToGameHistory(e: React.MouseEvent<HTMLButtonElement, MouseEvent>, game: Game): void {
    e.preventDefault();
    navigate(`/history?gameid=${game.id}`);
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
                  <button className='btn btn-primary me-2' onClick={() => createSingleplayerGame()}>Create Singleplayer Game</button>
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
                  <button className='btn btn-secondary' onClick={() => createMultiplayerGame()}>Create Multiplayer Game</button>
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

        <div className='my-4'>
          <h5>Previous Games</h5>
          <div className='row'>
            {previousGames.map((game, index) => (
              <div key={index} className='col-md-6'>
                <div className='card mb-3'>
                  <div className='card-body'>
                    <h5 className='card-title'>{game.gameType} Game (#{game.id})</h5>
                    <p className='card-text'><strong>Creator:</strong> {game.creator.username}</p>
                    <p className='card-text'><strong>Player 1:</strong> {game.player1 ? game.player1.username : "Pending"}</p>
                    <p className='card-text'><strong>Player 2:</strong> {game.player2 ? game.player2.username : "Pending"}</p>
                    <p className='card-text'><strong>Start Time:</strong> {game.startTime ? new Date(Number(game.startTime)).toLocaleString() : "Not started yet!"}</p>
                    <p className='card-text'><strong>End Time:</strong> {game.endTime ? new Date(Number(game.endTime)).toLocaleString() : "Not started yet!"}</p>
                    <p className='card-text'><strong>Game Winner:</strong> {game.winner ? (game.winner.username === "Draw" ? "It's a draw! No winners!" : game.winner.username) : "No winners yet!"}</p>
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
