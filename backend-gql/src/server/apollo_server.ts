import schemas from '../graphql/schemas/schemas';
import resolvers from '../graphql/resolvers/resolvers';
import mutations from '../graphql/mutations/mutations';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import { ApolloServer } from '@apollo/server';
import http from 'http';

import app from './app';

const startServer = async () => {
    const httpServer = http.createServer(app);

    const server = new ApolloServer({
        typeDefs: schemas,
        resolvers: [...resolvers, ...mutations],
        plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
    });

    await server.start();

    return server;
};

export default startServer;