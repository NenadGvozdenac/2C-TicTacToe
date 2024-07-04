import server from './server/server';

import { connectToDatabase } from './database/config'

connectToDatabase();

server.listen(4000, () => {
    console.log('Socket-io server is running on port 4000');
})