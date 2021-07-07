import { gql } from 'apollo-server';
import { ID } from './ids.type';

export const idsSubscriptionFilter = gql`
  input IdsSubscriptionFilter {
    ids: [ID]!
  }
`;

export interface EntityChangesSubscriptionFilter {
  filter: { ids: ID[] };
}
