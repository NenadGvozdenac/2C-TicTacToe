import { expressMiddleware } from '@apollo/server/express4';

import { connectToDatabase } from './database/config';
import startServer from './server/apollo_server';
import app from './server/app';

connectToDatabase();

startServer().then(({ httpServer, server }) => {
    app.use("/graphql", expressMiddleware(server));

    httpServer.listen({ port: 4000 }, () => {
        console.log(`🚀 Server ready at: http://localhost:4000/graphql`);
        console.log(`🚀 Subscriptions ready at: ws://localhost:4000/subscriptions`);
    });
});