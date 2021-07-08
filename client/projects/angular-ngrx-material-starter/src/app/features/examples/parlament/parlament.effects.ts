import { Injectable } from '@angular/core';
import { Action, select, Store } from '@ngrx/store';
import { Actions, ofType, createEffect } from '@ngrx/effects';
import {
  catchError,
  map,
  switchMap,
  tap,
  withLatestFrom
} from 'rxjs/operators';

import { LocalStorageService } from '../../../core/core.module';

import { State } from '../examples.state';
import * as parlamentAction from './parlament.actions';
import * as parlamentSelectors from './parlament.selectors';
import { ParlamentService } from './parlament.service';
import { of } from 'rxjs';

import * as _ from 'lodash';

export const PARLAMENT_KEY = 'EXAMPLES.PARLAMENT';

@Injectable()
export class ParlamentEffects {
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
      switchMap(({ ids }) =>
        this.parlamentService.getOperationsByIds(ids).pipe(
          map((operations) =>
            parlamentAction.actionOperationFetchSuccess({ operations })
          ),
          catchError((error) =>
            of(parlamentAction.actionOperationFetchFailure({ error }))
          )
        )
      )
    )
  );

  constructor(
    private actions$: Actions,
    private store: Store<State>,
    private localStorageService: LocalStorageService,
    private parlamentService: ParlamentService
  ) {}
}
