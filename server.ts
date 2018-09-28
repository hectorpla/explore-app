import express = require('express');
import { ApolloServer } from 'apollo-server-express';
import { schemaConfig } from './graphql';

import { setup } from './common';

const apolloServer = new ApolloServer(schemaConfig);
const app = express();

apolloServer.applyMiddleware({
  app,
  path: '/graphql'
});

setup().then(() => {
  app.listen(process.env.PORT || 3010, () => console.log('listening...'));
});
