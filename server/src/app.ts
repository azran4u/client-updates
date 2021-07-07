import express from 'express';
import { apolloServer } from './graphql/apolloServer';
import http from 'http';
import router from './routes';
import { ApolloServer } from 'apollo-server-express';

export async function startExpressServer(): Promise<{
  httpServer: http.Server;
  apolloServer: ApolloServer;
}> {
  const app = express();
  app.use(router);
  await apolloServer.start();
  apolloServer.applyMiddleware({ app });
  const httpServer = http.createServer(app);
  apolloServer.installSubscriptionHandlers(httpServer);
  return { httpServer, apolloServer };
}
