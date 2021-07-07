import { gql } from 'apollo-server';

export const operationSubscription = gql`
  type Subscription {
    operationsChanges(filter: IdsSubscriptionFilter): EntityUpdate
  }
`;
