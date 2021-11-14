import { Comparator2, differenceBy, differenceWith, remove } from 'lodash';
import { Observable } from 'rxjs';
import { concatMap, map, tap, withLatestFrom } from 'rxjs/operators';
import { BaseEntity, EntityUpdate, ID } from './parlament.model';

const defaultComparator: Comparator2<BaseEntity<any>, BaseEntity<any>> = (
  a,
  b
) => a.id === b.id && a.updatedAt === b.updatedAt;

function defaultDiff<IDType>(
  prev: BaseEntity<IDType>[],
  current: BaseEntity<IDType>[]
): EntityUpdate<IDType, IDType> {
  const deleted = differenceBy(prev, current, 'id').map(({ id }) => id);
  const upserted = differenceWith(current, prev, defaultComparator).map(
    ({ id }) => id
  );
  return { deleted, upserted };
}
export interface PollOptions<Entity, IDType> {
  entries: () => Observable<BaseEntity<IDType>[]>;
  instore: () => Observable<BaseEntity<IDType>[]>;
  byIds: (ids: IDType[]) => Observable<Entity[]>;
  upsert?: (entities: Entity[]) => void;
  remove?: (ids: IDType[]) => void;
  diff?: (
    prev: BaseEntity<IDType>[],
    current: BaseEntity<IDType>[]
  ) => EntityUpdate<IDType, IDType>;
}
export function pollEntity<Entity, IDType>(
  options: PollOptions<Entity, IDType>
): Observable<any> {
  const {
    entries,
    instore,
    byIds,
    upsert,
    remove,
    diff = defaultDiff
  } = options;
  return entries().pipe(
    tap((data) =>
      console.log(`pollEntity entry ${JSON.stringify(data, null, 4)}`)
    ),
    withLatestFrom(instore()),
    tap((data) =>
      console.log(`pollEntity withLatestFrom ${JSON.stringify(data, null, 4)}`)
    ),
    map(([curr, prev]) => diff(prev, curr)),
    tap((data) =>
      console.log(`pollEntity diff ${JSON.stringify(data, null, 4)}`)
    ),
    tap(({ deleted, upserted }) => remove(deleted)),
    tap((data) =>
      console.log(`pollEntity after remove ${JSON.stringify(data, null, 4)}`)
    ),
    concatMap(({ deleted, upserted }) => byIds(upserted)),
    tap((data) =>
      console.log(`pollEntity byIds ${JSON.stringify(data, null, 4)}`)
    ),
    tap((entities) => upsert(entities))
  );
}
