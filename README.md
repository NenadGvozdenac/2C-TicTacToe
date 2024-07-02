# TicTacToe game for multiple people
## Task specification
### Login / Registration
1. The user, after going to the homepage, should be prompted with a login screen
2. If they don't have an account, should create an account
3. After that, they will be prompted to the /overview page, where they will see their previous games
4. They will have a button on the side, where they can create a new game: either a singleplayer game or a multiplayer game
### Singleplayer game
1. After creating a singleplayer game, it will be automatically started, and the user will be going against an AI
2. User will be making moves, which will be sent to the server. Afterwards, the AI will send back moves, which will be sent to the server.
3. After the conditions for the game end have been met, the game will end. After ending, a winner will be shown. If there is no winner, the game will be a DRAW.
**Important**: The moves will be displayed on the side
### Multiplayer game
1. Upon clicking the multiplayer game, the game will be created, and the user will be able to join the game (it won't be started automatically).
2. Upon joining the game, the server will be waiting for the other participant.
3. After other participant enters, the creator of the game will be able to start the game.
4. User will be making moves, which will be sent to the server. Afterwards, the other user will send back moves, which will be sent to the server.
5. After the conditions for the game end have been met, the game will end. After ending, a winner will be shown. If there is no winner, the game will be a DRAW.
**Important**: The moves will be displayed on the side
### Game history
1. User will be able to click on the game in the /overview page.
2. After clicking on it, new page /game will be open, with query parameters id
3. The entire history will be shown, the moves of both players, etc.