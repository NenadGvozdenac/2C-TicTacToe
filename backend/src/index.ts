import server from './server/server';

import { connectToDatabase } from './database/config'

import { secrets } from './database/secrets';

connectToDatabase();

server.listen(secrets.SOCKETIO_PORT, () => {
    console.log('Socket-io server is running on port 4000');
})