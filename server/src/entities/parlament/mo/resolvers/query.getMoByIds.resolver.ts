import { IFieldResolver } from 'graphql-tools';
import { MoController } from '../controller/mo.controller';
import { EntityChangesSubscriptionFilter } from '../../../shared/ids.subscription.filter';
import { MoContext } from '../mo.model';

export const getMoByIds: IFieldResolver<
  any,
  MoContext,
  EntityChangesSubscriptionFilter['filter']
> = async (source, args, context, info) => {
  return await MoController.getByIds(args.ids);
};
