import { gql } from 'apollo-server';
import { ID } from './ids.type';

export const entityUpdateType = gql`
  type EntityUpdate {
    upserted: [ID]!
    deleted: [ID]!
  }
`;

export interface EntityUpdateInput<T> {
  upserted: T[];
  deleted: ID[];
}

export interface EntityUpdate {
  upserted: ID[];
  deleted: ID[];
}
