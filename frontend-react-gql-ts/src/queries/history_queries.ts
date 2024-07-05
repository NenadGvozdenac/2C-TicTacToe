import { gql } from '@apollo/client';

const GET_GAME_HISTORY = gql`
    query getGameById($gameId: ID!) {
        getGameById(gameId: $gameId) {
            id
            gameType
            status
            player1 {
                id
                username
            }
            player2 {
                id
                username
            }
            winner {
                id
                username
            }
            moves {
                player {
                    username
                }
                row
                col
                timestamp
            }
        }
    }
`;

export { GET_GAME_HISTORY };