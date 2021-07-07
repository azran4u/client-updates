import { gql } from 'apollo-server';

const operationMutation = gql`
  type Mutation {
    changeOperations(
      upserted: [OperationInput]!
      deleted: [ID]!
    ): Boolean!
  }
`;
export { operationMutation };
