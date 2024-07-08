import { gql } from "@apollo/client";

const ADD_PLAYER_TO_GAME = gql`
    mutation addPlayerToGame($gameId: ID!, $playerId: ID!) {
        addPlayerToGame(gameId: $gameId, playerId: $playerId) {
            id
            status
        }
    }
`

const START_GAME = gql`
  mutation startMultiplayerGame($gameId: ID!) {
    startMultiplayerGame(gameId: $gameId) {
      id
      status
    }
  }
`

const MAKE_MOVE = gql`
  mutation createMove($gameId: ID!, $playerId: ID!, $row: Int!, $col: Int!, $value: String!) {
    createMove(gameId: $gameId, playerId: $playerId, row: $row, col: $col, value: $value) {
      game {
        nextPlayer {
          id
          username
        }
      }
    }
  }
`

const PLAYER_JOINED_SUBSCRIPTION = gql`
  subscription OnPlayerJoined($gameId: ID!) {
    playersJoined(gameId: $gameId) {
      id
      username
    }
  }
`;

const GAME_STARTED_SUBSCRIPTION = gql`
  subscription OnGameStarted($gameId: ID!) {
    gameStarted(gameId: $gameId) {
      id
      board
      status
      moves {
        id
        player {
          id
          username
        }
        row
        col
        timestamp
        value
      }
      nextPlayer {
        id
        username
      }
    }
  }
`

const MOVE_MADE_SUBSCRIPTION = gql`
  subscription OnMoveMade($gameId: ID!) {
    moveMade(gameId: $gameId) {
      id
      row
      col
      timestamp
      player {
        id
        username
      }
      game {
        board
        nextPlayer {
          id
          username
        }
        winner {
          id
          username
        }
      }
    }
  }
`

export { ADD_PLAYER_TO_GAME, START_GAME, MAKE_MOVE, PLAYER_JOINED_SUBSCRIPTION, GAME_STARTED_SUBSCRIPTION, MOVE_MADE_SUBSCRIPTION };