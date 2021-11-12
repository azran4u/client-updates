import { Injectable } from '@angular/core';
import { Action, select, Store } from '@ngrx/store';
import { Actions, ofType, createEffect } from '@ngrx/effects';
import {
  catchError,
  filter,
  map,
  pairwise,
  switchMap,
  tap,
  withLatestFrom
} from 'rxjs/operators';

import { LocalStorageService } from '../../../core/core.module';

import { State } from '../examples.state';
import * as parlamentAction from './parlament.actions';
import * as parlamentSelectors from './parlament.selectors';
import { ParlamentService } from './parlament.service';
import { of, Subscription } from 'rxjs';

import * as _ from 'lodash';
import { ID } from './parlament.model';

export const PARLAMENT_KEY = 'EXAMPLES.PARLAMENT';

@Injectable()
export class ParlamentEffects {
  constructor(
    private actions$: Actions,
    private store: Store<State>,
    private localStorageService: LocalStorageService,
    private parlamentService: ParlamentService
  ) {}
  desiredOperationByNames = createEffect(
    () =>
      this.actions$.pipe(
        ofType(parlamentAction.actionOperationDesiredByName),
        tap(() => {
          console.log(`action actionOperationDesiredByName`);
        }),
        switchMap(({ names }) => {
          if (_.isEmpty(names)) return of([]);
          else {
            return this.parlamentService
              .subscribeToOperationsByName(names)
              .pipe(
                tap((operations) => {
                  console.log(JSON.stringify(operations, null, 4));
                }),
                catchError((error) => {
                  console.error(error);
                  return of();
                })
              );
          }
        })
      ),
    { dispatch: false }
  );

  // this effect is responsible to fix the current store state to the desired state
  desiredOperationIds = createEffect(() =>
    this.actions$.pipe(
      ofType(parlamentAction.actionOperationDesired),
      withLatestFrom(
        this.store
          .pipe(select(parlamentSelectors.selectAllOperations))
          .pipe(
            map((operationsInStore) =>
              operationsInStore.map((operation) => operation.id)
            )
          )
      ),
      switchMap(([{ ids }, currentIds]) => {
        const idsToRemove = currentIds.filter(
          (current) => !ids.includes(current)
        );
        const addedIds = ids.filter((id) => !currentIds.includes(id));
        const idsToSubscribe = ids;

        const actions: Action[] = [];

        if (!_.isEqual(idsToSubscribe, currentIds)) {
          actions.push(
            parlamentAction.actionOperationSubscribeByIds({
              ids: idsToSubscribe
            })
          );
        }

        if (!_.isEmpty(idsToRemove)) {
          actions.push(
            parlamentAction.actionOperationDeleted({ ids: idsToRemove })
          );
        }

        if (!_.isEmpty(addedIds)) {
          actions.push(
            parlamentAction.actionOperationFetchByIds({ ids: addedIds })
          );
        }

        return actions;
      })
    )
  );

  // this effect is responsible to respond to changes in the data so the desired
  // state may change or some entities need to be updated
  operationsDataChanged = createEffect(() =>
    this.actions$.pipe(
      ofType(parlamentAction.actionOperationUpdated),
      withLatestFrom(
        this.store
          .pipe(select(parlamentSelectors.selectAllOperations))
          .pipe(
            map((operationsInStore) =>
              operationsInStore.map((operation) => operation.id)
            )
          )
      ),
      switchMap(([{ upserted, deleted }, currentIds]) => {
        const desiredIds = currentIds.filter(
          (current) => !deleted.includes(current)
        );
        const updatedIds = upserted;

        const actions: Action[] = [];

        if (!_.isEqual(desiredIds, currentIds)) {
          actions.push(
            parlamentAction.actionOperationDesired({ ids: desiredIds })
          );
        }

        if (!_.isEmpty(updatedIds)) {
          actions.push(
            parlamentAction.actionOperationFetchByIds({ ids: updatedIds })
          );
        }

        return actions;
      })
    )
  );

  subscribeOperationByIds = createEffect(() =>
    this.actions$.pipe(
      ofType(parlamentAction.actionOperationSubscribeByIds),
      switchMap(({ ids }) =>
        this.parlamentService.subscribeToOperationChanges(ids).pipe(
          map(({ upserted, deleted }) =>
            parlamentAction.actionOperationUpdated({ upserted, deleted })
          ),
          catchError((error) =>
            of(parlamentAction.actionOperationSubscriptionFailure({ error }))
          )
        )
      )
    )
  );

  fetchOperationsByIds = createEffect(() =>
    this.actions$.pipe(
      ofType(parlamentAction.actionOperationFetchByIds),
      filter(({ ids }) => ids.length > 0),
      withLatestFrom(
        this.store.pipe(select(parlamentSelectors.selectAllOperations))
      ),
      switchMap(([{ ids }, operationsInStore]) =>
        this.parlamentService.getOperationsByIds(ids).pipe(
          switchMap((operations) => {
            const currentIdsInStore = operationsInStore.map(
              (operation) => operation.id
            );
            const idsFromBackend = operations.map((op) => op.id);
            const deleted = currentIdsInStore.filter(
              (id) => !idsFromBackend.includes(id)
            );
            const added = idsFromBackend.filter(
              (id) => !currentIdsInStore.includes(id)
            );
            const isUpdated = !_.isEqual(operations, operationsInStore);
            const actions: Action[] = [];
            if (deleted.length > 0) {
              actions.push(
                parlamentAction.actionOperationDeleted({ ids: deleted })
              );
            }

            if (isUpdated) {
              actions.push(
                parlamentAction.actionOperationFetchSuccess({ operations })
              );
            }

            if (added.length > 0 || deleted.length > 0) {
              actions.push(
                parlamentAction.actionOperationDesired({ ids: idsFromBackend })
              );
            }

            return actions;
          }),
          catchError((error) =>
            of(parlamentAction.actionOperationFetchFailure({ error }))
          )
        )
      )
    )
  );

  wsConnected = createEffect(() =>
    this.actions$.pipe(
      ofType(parlamentAction.actionWsConnected),
      switchMap(() =>
        this.store
          .pipe(select(parlamentSelectors.selectAllOperations))
          .pipe(
            map((operationsInStore) =>
              operationsInStore.map((operation) => operation.id)
            )
          )
      ),
      switchMap((ids) => of(parlamentAction.actionOperationFetchByIds({ ids })))
    )
  );

  // track changes in operations in store and change the desired mo ids
  moChanges$ = createEffect(() =>
    this.store.select(parlamentSelectors.selectAllOperations).pipe(
      map((operations) => {
        let allMosIds: ID[] = [];
        operations.forEach((operation) => {
          allMosIds = _.uniq(_.sortBy(_.concat(allMosIds, operation.mos)));
        });
        return allMosIds;
      }),
      pairwise(),
      map(([from, to]) => (!_.isEqual(from, to) ? to : undefined)),
      filter((x) => x !== undefined),
      tap((ids) => console.log(`mo desired ids changed ${ids}`)),
      switchMap((ids) => of(parlamentAction.actionMoDesired({ ids })))
    )
  );

  desiredMoIds = createEffect(() =>
    this.actions$.pipe(
      ofType(parlamentAction.actionMoDesired),
      withLatestFrom(
        this.store
          .pipe(select(parlamentSelectors.selectAllMo))
          .pipe(map((moInStore) => moInStore.map((mo) => mo.id)))
      ),
      switchMap(([{ ids }, currentIds]) => {
        const idsToRemove = currentIds.filter(
          (current) => !ids.includes(current)
        );
        const addedIds = ids.filter((id) => !currentIds.includes(id));
        const idsToSubscribe = ids;

        const actions: Action[] = [];

        if (!_.isEqual(idsToSubscribe, currentIds)) {
          actions.push(
            parlamentAction.actionMoSubscribeByIds({
              ids: idsToSubscribe
            })
          );
        }

        if (!_.isEmpty(idsToRemove)) {
          actions.push(parlamentAction.actionMoDeleted({ ids: idsToRemove }));
        }

        if (!_.isEmpty(addedIds)) {
          actions.push(parlamentAction.actionMoFetchByIds({ ids: addedIds }));
        }

        return actions;
      })
    )
  );

  moDataChanged = createEffect(() =>
    this.actions$.pipe(
      ofType(parlamentAction.actionMoUpdated),
      withLatestFrom(
        this.store
          .pipe(select(parlamentSelectors.selectAllMo))
          .pipe(map((moInStore) => moInStore.map((mo) => mo.id)))
      ),
      switchMap(([{ upserted, deleted }, currentIds]) => {
        const desiredIds = currentIds.filter(
          (current) => !deleted.includes(current)
        );
        const updatedIds = upserted;

        const actions: Action[] = [];

        if (!_.isEqual(desiredIds, currentIds)) {
          actions.push(parlamentAction.actionMoDesired({ ids: desiredIds }));
        }

        if (!_.isEmpty(updatedIds)) {
          actions.push(parlamentAction.actionMoFetchByIds({ ids: updatedIds }));
        }

        return actions;
      })
    )
  );

  subscribeMoByIds = createEffect(() =>
    this.actions$.pipe(
      ofType(parlamentAction.actionMoSubscribeByIds),
      switchMap(({ ids }) =>
        this.parlamentService.subscribeToMoChanges(ids).pipe(
          map(({ upserted, deleted }) =>
            parlamentAction.actionMoUpdated({ upserted, deleted })
          ),
          catchError((error) =>
            of(parlamentAction.actionMoSubscriptionFailure({ error }))
          )
        )
      )
    )
  );

  fetchMoByIds = createEffect(() =>
    this.actions$.pipe(
      ofType(parlamentAction.actionMoFetchByIds),
      switchMap(({ ids }) =>
        this.parlamentService.getMoByIds(ids).pipe(
          map((mos) => parlamentAction.actionMoFetchSuccess({ mos })),
          catchError((error) =>
            of(parlamentAction.actionMoFetchFailure({ error }))
          )
        )
      )
    )
  );
}
