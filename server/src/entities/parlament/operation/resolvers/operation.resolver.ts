import { IResolvers } from 'graphql-tools';
import { changeOperations } from './mutation.changeOperations.resolver';
import { getAllOperations } from './query.getAllOperations.resolver';
import { getOperationsByIds } from './query.getOperationsByIds.resolver';
import { operationChangesSubscription } from './subscription.operationsChanges';

export const operationResolver: IResolvers = {
  Query: {
    getAllOperations,
    getOperationsByIds,
  },
  Mutation: {
    changeOperations,
  },
  Subscription: {
    operationsChanges: operationChangesSubscription,
  },
};
