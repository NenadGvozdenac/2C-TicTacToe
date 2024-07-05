import { expressMiddleware } from '@apollo/server/express4';

import { connectToDatabase } from './database/config';
import startServer from './server/apollo_server';
import app from './server/app';

connectToDatabase();

startServer().then((server) => {
    app.use("/graphql", expressMiddleware(server));

    app.listen({ port: 4000 }, () => {
        console.log(`🚀 Server ready at: http://localhost:4000/graphql`);
    });
});