import { logger } from './utils';
import { startExpressServer } from './app';

(async () => {
  const PORT = 8090;
  const { httpServer, apolloServer } = await startExpressServer();
  httpServer.listen(PORT, () => {
    logger.info(
      `🚀 Server ready at http://localhost:${PORT}${apolloServer.graphqlPath}`,
    );
    logger.info(
      `🚀 Subscriptions ready at ws://localhost:${PORT}${apolloServer.subscriptionsPath}`,
    );
  });
})();
