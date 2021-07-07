import { ID } from '../../shared/ids.type';

export interface Operation {
  id: string;
  name: string;
  mos: ID[];
}

export interface OperationInput extends Omit<Operation, 'id'> {}

export interface OperationContext {}
