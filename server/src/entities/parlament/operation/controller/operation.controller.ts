import { Operation } from '../operation.model';
import { OperationEvents } from './operation.events';
import { pubsub } from '../../../../pubsub/pubsub';
import { EntityUpdate } from '../../../shared/entity.update';
import { ID } from '../../../shared/ids.type';

export class OperationController {
  constructor() {}

  private static operations = new Map<string, Operation>();

  public static async getAll(): Promise<Operation[]> {
    return Array.from(this.operations.values());
  }

  public static async getByIds(ids: string[]): Promise<Operation[]> {
    const res: Operation[] = [];
    ids.map((id) => res.push(this.operations.get(id)));
    return res.filter((x) => x !== undefined && x !== null);
  }

  public static async update(
    upserted: Operation[],
    deleted: ID[],
  ): Promise<Boolean> {
    deleted.map((id) => this.operations.delete(id));
    upserted.map((op) => {
      this.operations.set(op.id, op);
    });
    await pubsub.publish<EntityUpdate>(
      OperationEvents.OPERATIONS_CHANGED,
      {
        upserted: upserted.map((x) => x.id),
        deleted,
      },
    );
    return true;
  }
}
