import { ActionReducer } from '@ngrx/store';

import { AppState } from '../core.state';

export function debug(
  reducer: ActionReducer<AppState>
): ActionReducer<AppState> {
  return function (state, action) {
    const newState = reducer(state, action);
    console.log(`[DEBUG] action: ${JSON.stringify(action, null, 4)}`, {
      payload: (<any>action).payload,
      oldState: state,
      newState
    });
    return newState;
  };
}
