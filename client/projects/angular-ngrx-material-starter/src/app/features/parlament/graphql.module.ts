import { InjectionToken, NgModule } from '@angular/core';
import { APOLLO_NAMED_OPTIONS, APOLLO_OPTIONS } from 'apollo-angular';
import { HttpLink } from 'apollo-angular/http';
import { createHttpLink, InMemoryCache, split } from '@apollo/client/core';
import { ApolloClientOptions } from '@apollo/client/core';
import { HttpLinkModule } from 'apollo-angular-link-http';
import { WebSocketLink } from '@apollo/client/link/ws';
import { getMainDefinition } from '@apollo/client/utilities';
import { ActionReducerMap, Store, StoreConfig, StoreModule } from '@ngrx/store';
import { ExamplesState, FEATURE_NAME } from '../examples/examples.state';
import { ParlamentState } from './parlament.state';
import * as fromFeature from '../examples/examples.state';
import { ExamplesModule } from '../examples/examples.module';
import * as parlamentActions from './parlament.actions';

export function createDefaultApollo(
  httpLink: HttpLink
): ApolloClientOptions<any> {
  return {
    link: httpLink.create({
      uri: 'http://localhost:8090/graphql'
    }),
    cache: new InMemoryCache()
  };
}

export function createNamedApollo(
  httpLink: HttpLink,
  store: Store
): Record<string, ApolloClientOptions<any>> {
  const httpParlament = httpLink.create({
    uri: 'http://localhost:8090/graphql'
  });

  // Create a WebSocket link:
  const wsParlament = new WebSocketLink({
    uri: 'ws://localhost:8090/graphql',
    options: {
      reconnect: true,
      inactivityTimeout: 5000,
      connectionCallback: (error, result) => {
        console.log(`ws reconnected error=${error} result=${result}`);
        store.dispatch(parlamentActions.actionWsConnected());
      }
    }
  });

  return {
    parlament: {
      name: 'parlament',
      link: split(
        // split based on operation type
        ({ query }) => {
          const definition = getMainDefinition(query);
          return (
            definition.kind === 'OperationDefinition' &&
            definition.operation === 'subscription'
          );
        },
        wsParlament,
        httpParlament
      ),
      cache: new InMemoryCache(),
      defaultOptions: {
        query: { fetchPolicy: 'no-cache' },
        mutate: { fetchPolicy: 'no-cache' },
        watchQuery: { fetchPolicy: 'no-cache' }
      }
    }
  };
}

// export const FEATURE_CONFIG_TOKEN = new InjectionToken<
//   StoreConfig<ExamplesState>
// >('examples');
@NgModule({
  imports: [ExamplesModule],
  // imports: [
  //   StoreModule.forFeature(
  //     fromFeature.FEATURE_NAME,
  //     fromFeature.reducers,
  //     FEATURE_CONFIG_TOKEN
  //   )
  // ],
  exports: [HttpLinkModule],
  providers: [
    // {
    //   provide: APOLLO_OPTIONS,
    //   deps: [HttpLink],
    //   useFactory: createDefaultApollo
    // },
    // {
    //   provide: FEATURE_CONFIG_TOKEN,
    //   deps: [SomeService],
    //   useFactory: getConfig,
    // },
    {
      provide: APOLLO_NAMED_OPTIONS,
      deps: [HttpLink, Store],
      useFactory: createNamedApollo
    }
  ],
  declarations: []
})
export class GraphQLModule {}
