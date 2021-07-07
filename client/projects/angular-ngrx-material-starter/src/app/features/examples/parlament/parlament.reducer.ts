import { createReducer, on, Action } from '@ngrx/store';
import * as parlamentAction from './parlament.actions';
import { Area, ID, Mo, Operation } from './parlament.model';
import { produce, enableMapSet } from 'immer';
import { ParlamentState } from './parlament.state';

enableMapSet();
export const initialState: ParlamentState = {
  operations: new Map<ID, Operation>(),
  mo: new Map<ID, Mo>(),
  areas: new Map<ID, Area>()
};

const reducer = createReducer(
  initialState,
  on(parlamentAction.actionOperationFetchSuccess, (state, { operations }) =>
    produce(state, (draft) => {
      operations.map((blog) => draft.operations.set(blog.id, blog));
    })
  ),
  on(parlamentAction.actionOperationDeleted, (state, { ids }) =>
    produce(state, (draft) => {
      ids.map((id) => draft.operations.delete(id));
    })
  )
);

export function parlamentReducer(
  state: ParlamentState | undefined,
  action: Action
) {
  return reducer(state, action);
}
