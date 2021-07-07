import { makeExecutableSchema } from 'apollo-server';
import { GraphQLSchema } from 'graphql';

// operation types
import { operationInput } from './operation.input.type';
import { operationMutation } from './operation.mutation';
import { operationQuery } from './operation.query';
import { operationSubscription } from './operation.subscription';
import { operationType } from './operation.type';

// shared types
import { entityUpdateType } from '../../../shared/entity.update';
import { idsSubscriptionFilter } from '../../../shared/ids.subscription.filter';

// operation resolver
import { operationResolver } from '../resolvers/operation.resolver';

export const operationSchema: GraphQLSchema = makeExecutableSchema({
  typeDefs: [
    operationInput,
    operationType,
    operationQuery,
    operationMutation,
    operationSubscription,
    entityUpdateType,
    idsSubscriptionFilter,
  ],
  resolvers: [operationResolver],
});
