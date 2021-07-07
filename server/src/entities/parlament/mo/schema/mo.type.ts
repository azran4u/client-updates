import { gql } from 'apollo-server';

export const moType = gql`
  type Mo {
    id: ID!
    name: String!
    areas: [ID]!
  }
`;
