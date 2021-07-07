import { IFieldResolver } from 'graphql-tools';
import { MoController } from '../controller/mo.controller';
import { MoContext } from '../mo.model';

export const getAllMo: IFieldResolver<any, MoContext, any> = async (
  source,
  args,
  context,
  info,
) => {
  return await MoController.getAll();
};
