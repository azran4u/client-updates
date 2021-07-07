import { gql } from 'apollo-server';

const operationInput = gql`
  input OperationInput {
    id: ID!
    name: String!
    mos: [ID]!
  }
`;

export { operationInput };
