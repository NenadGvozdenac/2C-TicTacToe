import { gql } from '@apollo/client';

const ADD_PLAYER_TO_GAME = gql`
    mutation addPlayerToGame($gameId: ID!, $playerId: ID!) {
        addPlayerToGame(gameId: $gameId, playerId: $playerId) {
            id
            gameType
            status
            nextPlayer {
                id
                username
            }
        }
    }
`

const GET_GAME_BY_ID = gql`
    query getGameById($gameId: ID!) {
        getGameById(gameId: $gameId) {
            id
            gameType
            status
            board
            player1 {
                id
                username
            }
            player2 {
                id
                username
            }
            nextPlayer {
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
`

const CREATE_MOVE = gql`
    mutation createMove($gameId: ID!, $playerId: ID!, $row: Int!, $col: Int!, $value: String!) {
        createMove(gameId: $gameId, playerId: $playerId, row: $row, col: $col, value: $value) {
            id
            player {
                username
            }
            game {
                board
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
    }
`

export { ADD_PLAYER_TO_GAME, GET_GAME_BY_ID, CREATE_MOVE };