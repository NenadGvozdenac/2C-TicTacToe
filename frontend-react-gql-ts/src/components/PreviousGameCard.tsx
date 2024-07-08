import React from 'react';

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

interface PreviousGameCardProps {
    game: Game;
    continueGame: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>, game: Game) => void;
    navigateToGameHistory: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>, game: Game) => void;
}

const PreviousGameCard: React.FC<PreviousGameCardProps> = ({ game, continueGame, navigateToGameHistory }) => {
    return (
        <div className='col-md-6'>
            <div className='card mb-3'>
                <div className='card-body'>
                    <h5 className='card-title'>{game.gameType} Game (#{game.id})</h5>
                    <p className='card-text'><strong>Creator:</strong> {game.creator.username}</p>
                    <p className='card-text'><strong>Player 1:</strong> {game.player1 ? game.player1.username : "Pending"}</p>
                    <p className='card-text'><strong>Player 2:</strong> {game.player2 ? game.player2.username : "Pending"}</p>
                    <p className='card-text'><strong>Start Time:</strong> {game.startTime ? new Date(Number(game.startTime)).toLocaleString() : "Not started yet!"}</p>
                    <p className='card-text'><strong>End Time:</strong> {game.endTime ? new Date(Number(game.endTime)).toLocaleString() : "Not finished yet!"}</p>
                    <p className='card-text'><strong>Game Winner:</strong> {game.winner ? (game.winner.username === "Draw" ? "It's a draw! No winners!" : game.winner.username) : "No winners yet!"}</p>
                    <p className='card-text'><strong>Status:</strong> {game.status}</p>
                    <div className="d-flex justify-content-center align-items-center gap-2">
                        {game.status === "Finished" ? null : (
                            <button className='btn btn-primary col-6' onClick={e => continueGame(e, game)}>Continue Game</button>
                        )}
                        {game.status === "Finished" && (
                            <button className='btn btn-secondary col-6' onClick={e => navigateToGameHistory(e, game)}>Game History</button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default PreviousGameCard;
