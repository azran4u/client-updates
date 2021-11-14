import { Comparator2, differenceBy, differenceWith, remove } from 'lodash';
import { Observable } from 'rxjs';
import { concatMap, map, switchMap, tap, withLatestFrom } from 'rxjs/operators';
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

export enum PollEntityEnum {
  'rle',
  'child'
}
export interface BasePollOptions<Entity, IDType> {
  discriminator: PollEntityEnum;
  myStore: () => Observable<BaseEntity<IDType>[]>;
  byIds: (ids: IDType[]) => Observable<Entity[]>;
  upsert?: (entities: Entity[]) => void;
  remove?: (ids: IDType[]) => void;
  diff?: (
    prev: BaseEntity<IDType>[],
    current: BaseEntity<IDType>[]
  ) => EntityUpdate<IDType, IDType>;
  debug?: boolean;
}
export interface PollChildOptions<Entity, IDType>
  extends BasePollOptions<Entity, IDType> {
  discriminator: PollEntityEnum.child;
  livequery: (id: IDType[]) => Observable<BaseEntity<IDType>[]>;
  fatherStore?: () => Observable<IDType[]>;
}

export interface PollRleOptions<Entity, IDType>
  extends BasePollOptions<Entity, IDType> {
  discriminator: PollEntityEnum.rle;
  livequery: () => Observable<BaseEntity<IDType>[]>;
}

export type PollOptions<Entity, IDType> =
  | PollRleOptions<Entity, IDType>
  | PollChildOptions<Entity, IDType>;

export function pollEntity<Entity, IDType>(
  options: PollOptions<Entity, IDType>
): Observable<any> {
  const {
    livequery,
    myStore,
    byIds,
    upsert,
    remove,
    debug = false,
    diff = defaultDiff
  } = options;
  if (options.discriminator === PollEntityEnum.child) {
    return options.fatherStore().pipe(
      tap((data) => log(data, 'father', debug)),
      switchMap((ids) => livequery(ids).pipe(handleEntity()))
    );
  }
  if (options.discriminator === PollEntityEnum.rle) {
    return options.livequery().pipe(handleEntity());
  }

  function handleEntity() {
    return function (source: Observable<BaseEntity<IDType>[]>) {
      return source.pipe(
        tap((data) => log(data, 'livequery', debug)),
        withLatestFrom(myStore()),
        tap((data) => log(data, 'withLatestFromMyStore', debug)),
        map(([current, prev]) => diff(prev, current)),
        tap((data) => log(data, 'diff', debug)),
        tap(({ deleted, upserted }) => remove(deleted)),
        tap((data) => log(data, 'remove', debug)),
        concatMap(({ deleted, upserted }) => byIds(upserted)),
        tap((data) => log(data, 'byIds', debug)),
        tap((entities) => upsert(entities))
      );
    };
  }

  function log(data: any, name: string, debug: boolean) {
    if (debug) {
      console.log(`pollEntity ${name} ${JSON.stringify(data, null, 4)}`);
    }
  }
}

// export function pollRleEntity<Entity, IDType>(
//   options: PollRleOptions<Entity, IDType>
// ): Observable<any> {
//   const {
//     livequery,
//     myStore,
//     byIds,
//     upsert,
//     remove,
//     diff = defaultDiff
//   } = options;
//   return livequery().pipe(
//     tap((data) =>
//       console.log(`pollEntity entry ${JSON.stringify(data, null, 4)}`)
//     ),
//     withLatestFrom(myStore()),
//     tap((data) =>
//       console.log(`pollEntity withLatestFrom ${JSON.stringify(data, null, 4)}`)
//     ),
//     map(([curr, prev]) => diff(prev, curr)),
//     tap((data) =>
//       console.log(`pollEntity diff ${JSON.stringify(data, null, 4)}`)
//     ),
//     tap(({ deleted, upserted }) => remove(deleted)),
//     tap((data) =>
//       console.log(`pollEntity after remove ${JSON.stringify(data, null, 4)}`)
//     ),
//     concatMap(({ deleted, upserted }) => byIds(upserted)),
//     tap((data) =>
//       console.log(`pollEntity byIds ${JSON.stringify(data, null, 4)}`)
//     ),
//     tap((entities) => upsert(entities))
//   );
// }
