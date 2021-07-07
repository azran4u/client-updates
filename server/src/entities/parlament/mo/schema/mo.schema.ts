import { makeExecutableSchema } from 'apollo-server';
import { GraphQLSchema } from 'graphql';

// operation types
import { moInput } from './mo.input.type';
import { moMutation } from './mo.mutation';
import { moQuery } from './mo.query';
import { moSubscription } from './mo.subscription';
import { moType } from './mo.type';

// shared types
import { entityUpdateType } from '../../../shared/entity.update';
import { idsSubscriptionFilter } from '../../../shared/ids.subscription.filter';

// operation resolver
import { moResolver } from '../resolvers/mo.resolver';

export const moSchema: GraphQLSchema = makeExecutableSchema({
  typeDefs: [
    moInput,
    moType,
    moQuery,
    moMutation,
    moSubscription,
    entityUpdateType,
    idsSubscriptionFilter,
  ],
  resolvers: [moResolver],
});
