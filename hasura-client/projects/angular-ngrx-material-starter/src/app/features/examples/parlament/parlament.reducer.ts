import { createReducer, on, Action } from '@ngrx/store';
import * as parlamentAction from './parlament.actions';
import { Area, ID, Mo, Operation } from './parlament.model';
import { produce, enableMapSet } from 'immer';
import { ParlamentState } from './parlament.state';

enableMapSet();
export const initialState: ParlamentState = {
  operations: new Map<ID, Operation>(),
  mos: new Map<ID, Mo>(),
  areas: new Map<ID, Area>()
};

const reducer = createReducer(
  initialState,
  on(parlamentAction.actionOperationUpserted, (state, { upserted }) =>
    produce(state, (draft) => {
      upserted.map((operation) =>
        draft.operations.set(operation.id, operation)
      );
    })
  ),
  on(parlamentAction.actionOperationDeleted, (state, { deleted }) =>
    produce(state, (draft) => {
      deleted.map((id) => draft.operations.delete(id));
    })
  ),
  // on(parlamentAction.actionOperationFetchSuccess, (state, { operations }) =>
  //   produce(state, (draft) => {
  //     operations.map((x) => draft.operations.set(x.id, x));
  //   })
  // ),
  // on(parlamentAction.actionOperationDeleted, (state, { ids }) =>
  //   produce(state, (draft) => {
  //     ids.map((id) => draft.operations.delete(id));
  //   })
  // ),
  on(parlamentAction.actionMoUpserted, (state, { upserted }) =>
    produce(state, (draft) => {
      upserted.map((x) => draft.mos.set(x.id, x));
    })
  ),
  on(parlamentAction.actionMoDeleted, (state, { deleted }) =>
    produce(state, (draft) => {
      deleted.map((id) => draft.mos.delete(id));
    })
  )
);

export function parlamentReducer(
  state: ParlamentState | undefined,
  action: Action
) {
  return reducer(state, action);
}
