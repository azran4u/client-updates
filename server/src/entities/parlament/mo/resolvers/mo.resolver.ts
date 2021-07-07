import { IResolvers } from 'graphql-tools';
import { changeMo } from './mutation.changeMo.resolver';
import { getAllMo } from './query.getAllMo.resolver';
import { getMoByIds } from './query.getMoByIds.resolver';
import { moChangesSubscription } from './subscription.moChanges';

export const moResolver: IResolvers = {
  Query: {
    getAllMo,
    getMoByIds,
  },
  Mutation: {
    changeMo,
  },
  Subscription: {
    moChanges: moChangesSubscription,
  },
};
