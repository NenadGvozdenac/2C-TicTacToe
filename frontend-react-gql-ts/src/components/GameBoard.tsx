import React from "react";

interface GameBoardProps {
    board: string[];
    canMakeTurn: boolean;
    currentValue: string;
    makeMove: (index: number) => void;
}

const GameBoard: React.FC<GameBoardProps> = ({ board, canMakeTurn, currentValue, makeMove }) => {
    return (
        <div className="card mb-3">
            <div className="card-body">
                <h5 className="card-title">Game Board</h5>
                <div className="row">
                    {board.map((cell, index) => (
                        <div
                            key={index}
                            className="col-4 border text-center d-flex flex-column justify-content-center align-items-center"
                            style={(!canMakeTurn || board[index]) ? { cursor: 'not-allowed', height: '200px', fontSize: '3em' } : { cursor: 'pointer', height: '200px', fontSize: '3em' }}
                            onClick={() => makeMove(index)}>
                            {cell}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default GameBoard;
