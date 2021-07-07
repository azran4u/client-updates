import { gql } from 'apollo-server';

export const operationType = gql`
  type Operation {
    id: ID!
    name: String!
    mos: [ID]!
  }
`;
