import { gql } from 'apollo-server';

export const moInput = gql`
  input MoInput {
    id: ID!
    name: String!
    areas: [ID]!
  }
`;
