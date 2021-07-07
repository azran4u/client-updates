import { EntityUpdate } from '../../shared/entity.update';
import { ID } from '../../shared/ids.type';

export interface Mo {
  id: string;
  name: string;
  areas: ID[];
}

export interface MoInput extends Omit<Mo, 'id'> {}

export interface MoContext {}

export interface MoChangesSubscriptionPayload {
  moChanges: EntityUpdate;
}
