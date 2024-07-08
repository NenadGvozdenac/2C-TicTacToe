import React from 'react';

interface JoinGameFormProps {
    gameId: string | null;
    setGameId: React.Dispatch<React.SetStateAction<string | null>>;
    handleJoinGame: (id: string) => void;
    invalidGameId: boolean;
}

const JoinGameForm: React.FC<JoinGameFormProps> = ({ gameId, setGameId, handleJoinGame, invalidGameId }) => {
    return (
        <div className='my-4'>
            <h5>Join a Game</h5>
            {invalidGameId && <p className='text-danger'>Please enter a valid Game ID</p>}
            <div className='input-group mb-3'>
                <input
                    type='text'
                    className='form-control'
                    placeholder='Enter Game ID'
                    value={gameId || ''}
                    onChange={(e) => setGameId(e.target.value)}
                />
                <button
                    className='btn btn-primary'
                    onClick={() => gameId && handleJoinGame(gameId)}
                >
                    Join
                </button>
            </div>
        </div>
    );
}

export default JoinGameForm;
