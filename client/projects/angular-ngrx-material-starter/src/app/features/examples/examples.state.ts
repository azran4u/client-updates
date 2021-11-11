import { ActionReducerMap, createFeatureSelector } from '@ngrx/store';

import { AppState } from '../../core/core.module';
import { ParlamentState } from './parlament/parlament.state';
import { parlamentReducer } from './parlament/parlament.reducer';

export const FEATURE_NAME = 'examples';
export const selectExamples =
  createFeatureSelector<State, ExamplesState>(FEATURE_NAME);
export const reducers: ActionReducerMap<ExamplesState> = {
  parlament: parlamentReducer
};

export interface ExamplesState {
  parlament: ParlamentState;
}

export interface State extends AppState {
  examples: ExamplesState;
}
