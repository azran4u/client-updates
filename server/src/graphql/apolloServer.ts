import { ApolloServer } from 'apollo-server-express';
import schemas from './schema';

let numOfConnectedWs = 0;
export const apolloServer = new ApolloServer({
  schema: schemas,
  subscriptions: {
    onConnect: (connectionParams, webSocket, context) => {
      numOfConnectedWs++;
      console.log(`ws connected, current ${numOfConnectedWs}`);
    },
    onDisconnect: (webSocket, context) => {
      numOfConnectedWs--;
      console.log(`ws disconnected, current ${numOfConnectedWs}`);
    },
    keepAlive: 1000,
  },
});
