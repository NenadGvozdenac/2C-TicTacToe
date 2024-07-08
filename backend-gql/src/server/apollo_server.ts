import schemas from '../graphql/schemas/schemas';
import resolvers from '../graphql/resolvers/resolvers';
import mutations from '../graphql/mutations/mutations';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import { ApolloServer } from '@apollo/server';
import http from 'http';
import { useServer } from 'graphql-ws/lib/use/ws';

import app from './app';
import { WebSocketServer } from 'ws';
import { makeExecutableSchema } from '@graphql-tools/schema';

const startServer = async () => {
    const httpServer = http.createServer(app);

    const schema = makeExecutableSchema({ typeDefs: schemas, resolvers: [...resolvers, ...mutations] });

    const wsServer = new WebSocketServer({ server: httpServer, path: '/subscriptions' });

    const serverCleanup = useServer({ schema }, wsServer);

    const server = new ApolloServer({
        schema,
        plugins: [ApolloServerPluginDrainHttpServer({ httpServer }),
            {
                async serverWillStart() {
                    return {
                        async drainServer() {
                            await serverCleanup.dispose();
                        },
                    };
                },
            }
        ],
    })

    await server.start();

    return { httpServer, server };
};

export default startServer;