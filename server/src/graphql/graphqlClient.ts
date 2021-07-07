import { HttpLink } from 'apollo-link-http';
import { WebSocketLink } from 'apollo-link-ws';
import { SubscriptionClient } from 'subscriptions-transport-ws';
import ws from 'ws';
import { gql } from 'graphql-tag';
import { execute } from 'apollo-link';
import { DocumentNode } from 'graphql';

export class GraphqlClient {
  private webSocketClient: SubscriptionClient;
  private wsLink: WebSocketLink;
  
  constructor(url: string) {
    
    this.webSocketClient = new SubscriptionClient(
      url,
      { reconnect: true },
      ws,
    );

    this.wsLink = new WebSocketLink(this.webSocketClient);
  }

  public connect(
    query: DocumentNode,
    variables?: Record<string, any>,
  ) {
    return execute(this.wsLink, {
      query,
      variables,
    });
  }
  public close(): void {
    this.webSocketClient.unsubscribeAll();
    this.webSocketClient.close(true);
  }
}
