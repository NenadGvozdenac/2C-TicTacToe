import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

import { ApolloProvider, ApolloClient, InMemoryCache, split } from "@apollo/client";
import { HttpLink } from "@apollo/client";
import { GraphQLWsLink } from '@apollo/client/link/subscriptions';
import { createClient } from 'graphql-ws';
import { getMainDefinition } from "@apollo/client/utilities";

const httpLink = new HttpLink({
  uri: 'http://localhost:4000/graphql',
});

const wsLink = new GraphQLWsLink(createClient({
  url: 'ws://localhost:4000/subscriptions',
}));

const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === 'OperationDefinition' &&
      definition.operation === 'subscription'
    );
  },
  wsLink,
  httpLink,
);

const client = new ApolloClient({
  link: splitLink,
  cache: new InMemoryCache(),
});

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ApolloProvider client={client}>
      <App />
    </ApolloProvider>
  </React.StrictMode>
);
