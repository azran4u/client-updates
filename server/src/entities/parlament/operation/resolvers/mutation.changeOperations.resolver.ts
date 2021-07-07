import { IFieldResolver } from 'graphql-tools';
import { OperationController } from '../controller/operation.controller';
import { EntityUpdateInput } from '../../../shared/entity.update';
import { Operation, OperationContext } from '../operation.model';

export const changeOperations: IFieldResolver<
  any,
  OperationContext,
  EntityUpdateInput<Operation>
> = async (source, args, context, info): Promise<Boolean> => {
  const { upserted, deleted } = args;
  return await OperationController.update(upserted, deleted);
};
