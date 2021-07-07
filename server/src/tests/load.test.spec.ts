// import { gql } from 'graphql-tag';
// // import { getMainDefinition } from '@apollo/client/utilities';
// // import {
// //   split,
// //   HttpLink,
// //   ApolloClient,
// //   InMemoryCache,
// //   Observable,
// // } from '@apollo/client/core';
// // import fetch from 'cross-fetch';
// // import { execute } from 'apollo-link';
// // import { WebSocketLink } from 'apollo-link-ws';
// // import { SubscriptionClient } from 'subscriptions-transport-ws';
// // import ws from 'ws';
// import { GraphqlClient } from '../graphql/graphqlClient';

// describe(`load testing`, () => {
//   beforeEach(function () {});

//   afterEach(function () {});

//   const url = 'ws://localhost:8090/graphql';
//   const COUNTER_SUBSCRIPTION = gql`
//     subscription s1 {
//       counterChanged {
//         value
//       }
//     }
//   `;
//   it('load counter subscription', async () => {
//     const graphqlClient = new GraphqlClient(url);
//     const res$ = graphqlClient.connect(COUNTER_SUBSCRIPTION);
//     res$.subscribe(
//       (data) => {
//         debugger;
//         console.log(`data recieved ${data.data.counterChanged}`);
//       },
//       (error) => {
//         console.error(`ws error ${error}`);
//       },
//     );

//     setTimeout(() => {
//       graphqlClient.close();
//       console.log(`ws disconnected`);
//     }, 10000);
//   });
//   it.only('load counter subscription', async () => {
//     const numOfSubscribers = 10;
//     const graphqlClients: GraphqlClient[] = [];
//     for (let i = 1; i <= numOfSubscribers; i++) {
//       const graphqlClient = new GraphqlClient(url);
//       graphqlClients.push(graphqlClient);
//       graphqlClient.connect(COUNTER_SUBSCRIPTION).subscribe(
//         (data) => {
//           console.log(
//             `data recieved ${data.data.counterChanged.value}`,
//           );
//         },
//         (error) => {
//           console.error(`ws error ${error}`);
//         },
//       );
//       setTimeout(() => {
//         graphqlClient.close();
//         console.log(`unsubscribe`);
//       }, 1000 * i);
//     }
//   });
// });
