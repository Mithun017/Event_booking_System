const { ApolloServer } = require('apollo-server-express');
const express = require('express');
const { typeDefs } = require('./schema');      // your GraphQL schema
const { resolvers } = require('./schema');     // resolvers with createEvent included

async function startServer() {
  const app = express();

  const server = new ApolloServer({
    typeDefs,
    resolvers,
  });

  await server.start();
  server.applyMiddleware({ app });

  app.listen({ port: 4000 }, () =>
    console.log(`Server ready at http://localhost:4000${server.graphqlPath}`)
  );
}

startServer();
