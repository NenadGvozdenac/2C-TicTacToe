import React from 'react';

interface SinglePlayerGameInfoProps {
    gameid: string | undefined;
    joined: boolean;
    joinGame: () => void;
}

const SinglePlayerGameInfo: React.FC<SinglePlayerGameInfoProps> = ({ gameid, joined, joinGame }) => {
    return (
        <div className="col-md-4">
            <div className="card">
                <div className="card-body">
                    <h5 className="card-title">Join Game</h5>
                    <p>Game ID: {gameid}</p>
                    {!joined && <button className="btn btn-primary" onClick={joinGame}>
                        Join Game
                    </button>}
                </div>
            </div>
        </div>
    );
}

export default SinglePlayerGameInfo;
