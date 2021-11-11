import { createSelector } from '@ngrx/store';

import { ExamplesState, selectExamples } from '../examples.state';

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

export const selectAllAreas = createSelector(selectAreasState, (map) =>
  Array.from(map.values())
);
