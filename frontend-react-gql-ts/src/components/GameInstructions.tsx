import React from 'react';

interface GameInstructionsProps {
    gameType: 'Singleplayer' | 'Multiplayer';
    createGame: () => void;
}

const GameInstructions: React.FC<GameInstructionsProps> = ({ gameType, createGame }) => {
    return (
        <div className='col-md-4'>
            <div className='card'>
                <div className='card-body'>
                    <h5 className='card-title'>How to Start the Game ({gameType})</h5>
                    <p className='card-text'>
                        {gameType === 'Singleplayer' ? (
                            <>
                                1. Click on the "Start Game" button.<br />
                                2. Join the room.<br />
                                3. Enjoy playing!
                            </>
                        ) : (
                            <>
                                1. Click on the "Start Game" button.<br />
                                2. Invite a friend to join.<br />
                                3. Wait for the friend to join.<br />
                                4. Start the game.<br />
                                5. Enjoy playing!
                            </>
                        )}
                    </p>
                    <div className='mt-3'>
                        <button className='btn btn-primary' onClick={createGame}>
                            {gameType === 'Singleplayer' ? 'Create Singleplayer Game' : 'Create Multiplayer Game'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default GameInstructions;
