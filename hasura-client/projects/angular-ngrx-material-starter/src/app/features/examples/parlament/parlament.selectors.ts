import { createSelector } from '@ngrx/store';

import { ExamplesState, selectExamples, State } from '../examples.state';
import { BaseEntity, ID, Operation } from './parlament.model';
import * as _ from 'lodash';

export const selectParlamentState = createSelector(
  selectExamples,
  (state: ExamplesState) => state.parlament
);

export const selectOperationsState = createSelector(
  selectParlamentState,
  (state) => state.operations
);

export const selectMoState = createSelector(
  selectParlamentState,
  (state) => state.mos
);

export const selectAreasState = createSelector(
  selectParlamentState,
  (state) => state.areas
);

export const selectAllOperations = createSelector(
  selectOperationsState,
  (map) => Array.from(map.values())
);

export const selectAllMo = createSelector(selectMoState, (map) =>
  Array.from(map.values())
);

export const selectAllOperationsMoIds = createSelector(
  selectOperationsState,
  (opmap) => {
    const operations = Array.from(opmap.values());
    const moids: ID[] = _.sortBy(
      _.uniq(_.flatten(operations.map((op) => op.mos.map((x) => x.id))))
    );

    // let moids: string[] = [];
    // moids = [].concat.apply([], moidsarray) as string[];
    // moids = moids.filter((mo) => !_.isNil(mo));
    // console.log(`moids ${JSON.stringify(moids, null, 4)}`);
    // moids = _.uniq(moids);
    // console.log(`moids after uniq ${JSON.stringify(moids, null, 4)}`);
    return moids ?? [];
  }
);

export const selectAllAreas = createSelector(selectAreasState, (map) =>
  Array.from(map.values())
);
