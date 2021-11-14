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
  (state) => state.mo
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
    const moidsarray = operations.map((op) => op.mosids);
    let moids: string[] = [];
    moids = [].concat.apply([], moidsarray);
    moids = _.uniq(moids);
    return moids ?? [];
  }
);

export const selectAllAreas = createSelector(selectAreasState, (map) =>
  Array.from(map.values())
);
