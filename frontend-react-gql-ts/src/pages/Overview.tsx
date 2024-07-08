import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useApolloClient } from '@apollo/client';
import { FETCH_PREVIOUS_GAMES, CREATE_GAME } from '../queries/overview_queries';
import { GET_GAME_BY_ID } from '../queries/singleplayer_game_queries';

import UserInfoCard from '../components/UserInfoCard';
import GameInstructions from '../components/GameInstructions';
import JoinGameForm from '../components/JoinGameForm';
import PreviousGameCard from '../components/PreviousGameCard';

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
    const client = useApolloClient();
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

    useEffect(() => {
        fetchPreviousGames.refetch();
    }, []);

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
        if (id === null || id === '') {
            setInvalidGameId(true);
            return;
        }

        try {
            await client.query({
                query: GET_GAME_BY_ID,
                variables: { gameId: id }
            });
            navigate(`/multiplayer?gameid=${id}`);
        } catch (error) {
            setInvalidGameId(true);
            return;
        }
    };

    const continueGame = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>, game: Game) => {
        e.preventDefault();
        if (game.gameType === 'SinglePlayer') {
            navigate(`/singleplayer?gameid=${game.id}`);
        } else {
            navigate(`/multiplayer?gameid=${game.id}`);
        }
    };

    const navigateToGameHistory = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>, game: Game) => {
        e.preventDefault();
        navigate(`/history?gameid=${game.id}`);
    };

    return (
        <div className='d-flex flex-column justify-content-between min-vh-100'>
            <Navbar />

            <div className='container my-4'>
                <div className='row'>
                    <UserInfoCard username={username} />
                    <GameInstructions gameType='Singleplayer' createGame={createSingleplayerGame} />
                    <GameInstructions gameType='Multiplayer' createGame={createMultiplayerGame} />
                </div>

                <JoinGameForm gameId={gameId} setGameId={setGameId} handleJoinGame={handleJoinGame} invalidGameId={invalidGameId} />

                <div className='my-4'>
                    <h5>Previous Games</h5>
                    <div className='row'>
                        {previousGames.map((game, index) => (
                            <PreviousGameCard
                                key={index}
                                game={game}
                                continueGame={continueGame}
                                navigateToGameHistory={navigateToGameHistory}
                            />
                        ))}
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
};

export default Overview;
