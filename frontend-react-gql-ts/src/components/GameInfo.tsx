import React from 'react';

interface GameInfoProps {
    gameid: string;
    joined: boolean;
    joinedPlayers: string[];
    enabledStartButton: boolean;
    joinGame: () => void;
    startGame: () => void;
}

const GameInfo: React.FC<GameInfoProps> = ({ gameid, joined, joinedPlayers, enabledStartButton, joinGame, startGame }) => {
    return (
        <div className="col-md-4">
            {joined && !enabledStartButton && joinedPlayers.length !== 2 && <div className="col-md-12 my-4">
                <div className="card">
                    <div className="card-body">
                        <h5 className="card-title">Waiting for other player...</h5>
                    </div>
                </div>
            </div>}
            {enabledStartButton && <div className="col-md-12 my-4">
                <div className="card">
                    <div className="card-body">
                        <h5 className="card-title">Waiting on start...</h5>
                    </div>
                </div>
            </div>}
            <div className="card">
                <div className="card-body">
                    <h5 className="card-title">Join Game</h5>
                    <p>Game ID: {gameid}</p>
                    {joinedPlayers.length > 0 && <p>Joined players: </p>}
                    <ul>
                        {joinedPlayers.filter(player => player !== "Pending").map((player, index) => (
                            <li key={index}>{player}</li>
                        ))}
                    </ul>
                    {!joined && <button className="btn btn-primary" onClick={joinGame}>
                        Join Game
                    </button>
                    }
                    {enabledStartButton && <button className="btn btn-primary" onClick={startGame}>
                        Start Game
                    </button>
                    }
                </div>
            </div>
        </div>
    );
}

export default GameInfo;
