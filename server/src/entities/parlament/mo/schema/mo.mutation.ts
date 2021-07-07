import { gql } from 'apollo-server';

export const moMutation = gql`
  type Mutation {
    changeMo(upserted: [MoInput]!, deleted: [ID]!): Boolean!
  }
`;
