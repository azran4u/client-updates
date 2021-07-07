import { IResolverObject, withFilter } from 'apollo-server';
import { pubsub } from '../../../../pubsub/pubsub';
import { MoEvents } from '../controller/mo.events';
import { EntityChangesSubscriptionFilter } from '../../../shared/ids.subscription.filter';
import { EntityUpdate } from '../../../shared/entity.update';
import { default as _ } from 'lodash';
import { ID } from '../../../shared/ids.type';

export const moChangesSubscription: IResolverObject = {
  subscribe: withFilter(
    () => pubsub.asyncIterator(MoEvents.MO_CHANGED),
    (
      rootValue?: EntityUpdate,
      args?: EntityChangesSubscriptionFilter,
      context?: any,
      info?: any,
    ) => {
      const res = isRelevant(args.filter.ids, rootValue);
      return res.deleted.length > 0 || res.upserted.length > 0;
    },
  ),

  resolve: (
    source: EntityUpdate,
    args: EntityChangesSubscriptionFilter,
    context,
    info,
  ): EntityUpdate => {
    const res = isRelevant(args.filter.ids, source);
    return {
      upserted: res.upserted,
      deleted: res.deleted,
    };
  },
};

function isRelevant(
  filter: ID[],
  update: EntityUpdate,
): EntityUpdate {
  const res: EntityUpdate = {
    upserted: [],
    deleted: [],
  };
  if (!_.isEmpty(filter)) {
    res.upserted = update.upserted.filter((x) => {
      return filter.includes(x);
    });
    res.deleted = update.deleted.filter((x) => {
      return filter.includes(x);
    });
  }
  return res;
}
