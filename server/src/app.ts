import express from 'express';
import { apolloServer } from './graphql/apolloServer';
import http from 'http';
import router from './routes';
import { ApolloServer } from 'apollo-server-express';
import { graphqlExtractOperationMiddleware } from './utils/graphql-extract-operation-middlewatr';

export async function startExpressServer(): Promise<{
  httpServer: http.Server;
  apolloServer: ApolloServer;
}> {
  const app = express();
  app.use(express.json());
  // app.post('/graphql', graphqlExtractOperationMiddleware);
  // app.use('/graphql', async (req, res, next) => {
  //   const { operationName, operationType, subOperation } =
  //     req.graphql;
  //   const whiteList = ['changeOperations', 'changeMo'];
  //   if (
  //     operationType === 'mutation' &&
  //     whiteList.includes(subOperation)
  //   ) {
  //     const upn = req.headers.upn;
  //     const userPermissions = await readUserPermissions(upn);
  //     if (!userPermissions.allowEdit) {
  //       console.log(
  //         `user ${upn} is unauthorized to execute mutation ${subOperation}`,
  //       );
  //       res.status(401);
  //     }
  //   }
  //   next();
  // });
  // async function readUserPermissions(upn) {
  //   if (upn === 's123') return { allowEdit: true };
  //   return { allowEdit: false };
  // }
  app.use(router);
  await apolloServer.start();
  apolloServer.applyMiddleware({ app });
  const httpServer = http.createServer(app);
  apolloServer.installSubscriptionHandlers(httpServer);
  return { httpServer, apolloServer };
}
