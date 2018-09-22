import express = require('express');
import { ApolloServer } from 'apollo-server-express';
import { areaSchemaConfig } from './graphql';

const apolloServer = new ApolloServer(areaSchemaConfig)
const app = express();

apolloServer.applyMiddleware({ app,
  path: '/graphql'
});

app.listen(process.env.PORT || 3000, () => console.log('listening...'));