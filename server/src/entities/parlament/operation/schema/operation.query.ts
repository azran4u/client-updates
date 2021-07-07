import { gql } from 'apollo-server';

const operationQuery = gql`
  type Query {
    getAllOperations: [Operation]!
    getOperationsByIds(ids: [ID]!): [Operation]!
  }
`;
export { operationQuery };
