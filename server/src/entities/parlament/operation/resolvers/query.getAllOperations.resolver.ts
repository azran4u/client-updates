import { IFieldResolver } from 'graphql-tools';
import { OperationController } from '../controller/operation.controller';
import { OperationContext } from '../operation.model';

export const getAllOperations: IFieldResolver<
  any,
  OperationContext,
  any
> = async (source, args, context, info) => {
  return await OperationController.getAll();
};
