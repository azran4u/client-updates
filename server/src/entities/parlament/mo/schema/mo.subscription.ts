import { gql } from 'apollo-server';

export const moSubscription = gql`
  type Subscription {
    moChanges(filter: IdsSubscriptionFilter): EntityUpdate
  }
`;
