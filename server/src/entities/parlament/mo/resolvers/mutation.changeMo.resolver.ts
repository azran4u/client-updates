import { IFieldResolver } from 'graphql-tools';
import { MoController } from '../controller/mo.controller';
import { EntityUpdateInput } from '../../../shared/entity.update';
import { Mo, MoContext } from '../mo.model';

export const changeMo: IFieldResolver<
  any,
  MoContext,
  EntityUpdateInput<Mo>
> = async (source, args, context, info): Promise<Boolean> => {
  const { upserted, deleted } = args;
  return await MoController.update(upserted, deleted);
};
