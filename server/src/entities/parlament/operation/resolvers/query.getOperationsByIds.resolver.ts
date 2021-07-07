import { IFieldResolver } from 'graphql-tools';
import { OperationController } from '../controller/operation.controller';
import { EntityChangesSubscriptionFilter } from '../../../shared/ids.subscription.filter';
import { OperationContext } from '../operation.model';

export const getOperationsByIds: IFieldResolver<
  any,
  OperationContext,
  EntityChangesSubscriptionFilter
> = async (source, args, context, info) => {
  return await OperationController.getByIds(args.filter.ids);
};
