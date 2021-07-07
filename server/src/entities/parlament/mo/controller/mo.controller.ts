import { Mo } from '../mo.model';
import { MoEvents } from './mo.events';
import { pubsub } from '../../../../pubsub/pubsub';
import { EntityUpdate } from '../../../shared/entity.update';
import { ID } from '../../../shared/ids.type';

export class MoController {
  constructor() {}

  private static mos = new Map<string, Mo>();

  public static async getAll(): Promise<Mo[]> {
    return Array.from(this.mos.values());
  }

  public static async getByIds(ids: string[]): Promise<Mo[]> {
    const res: Mo[] = [];
    ids.map((id) => res.push(this.mos.get(id)));
    return res.filter((x) => x !== undefined && x !== null);
  }

  public static async update(
    upserted: Mo[],
    deleted: ID[],
  ): Promise<Boolean> {
    deleted.map((id) => this.mos.delete(id));
    upserted.map((op) => {
      this.mos.set(op.id, op);
    });
    await pubsub.publish<EntityUpdate>(MoEvents.MO_CHANGED, {
      upserted: upserted.map((x) => x.id),
      deleted,
    });
    return true;
  }
}
