import { gql } from '@apollo/client';

const FETCH_PREVIOUS_GAMES = gql`
    query getAllGamesByUser($userId: ID!) {
        getAllGamesByUser(userId: $userId) {
            id
            gameType 
            status
            startTime,
            endTime
            creator {
                id
                username
            }
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
        }
    }
`

const CREATE_GAME = gql`
    mutation createGame($creatorId: ID!, $gameType: GameType!) {
        createGame(creatorId: $creatorId, gameType: $gameType) {
            id
            gameType
            creator {
                id
                username
            }
        }
    }
`

export { FETCH_PREVIOUS_GAMES, CREATE_GAME };