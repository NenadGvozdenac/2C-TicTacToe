import React from 'react';

interface GameHistoryProps {
    moves: any[];
}

const GameHistory: React.FC<GameHistoryProps> = ({ moves }) => {
    return (
        <div className="col-md-12">
            <div className="card">
                <div className="card-body">
                    <h5 className="card-title">Game History</h5>
                    <table className="table">
                        <thead>
                            <tr>
                                <th>Move</th>
                                <th>Player</th>
                                <th>Position</th>
                                <th>Timestamp</th>
                            </tr>
                        </thead>
                        <tbody>
                            {moves.map((move, index) => (
                                <tr key={index}>
                                    <td>{index + 1}</td>
                                    <td>{move.player.username}</td>
                                    <td>{move.row}, {move.col}</td>
                                    <td>{new Date(Number(move.timestamp)).toLocaleString()}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

export default GameHistory;
