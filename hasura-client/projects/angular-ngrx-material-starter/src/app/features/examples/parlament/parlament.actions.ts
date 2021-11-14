import { createAction, props } from '@ngrx/store';
import { EntityUpdate, ID, Mo, Operation } from './parlament.model';

// operation actions
export const actionOperationDesiredByName = createAction(
  '[Operation] Desired By Name',
  props<{ names: string[] }>()
);

export const actionOperationFetchByIds = createAction(
  '[Operation] Fetch By Ids',
  props<{ ids: ID[] }>()
);

export const actionOperationUpserted = createAction(
  '[Operation] Upserted',
  props<{ upserted: Operation[] }>()
);

export const actionOperationDeleted = createAction(
  '[Operation] Deleted',
  props<{ deleted: ID[] }>()
);

// export const actionOperationFetchSuccess = createAction(
//   '[Operation] Fetch Success',
//   props<{ operations: Operation[] }>()
// );

// export const actionOperationDesiredByIds = createAction(
//   '[Operation] Desired',
//   props<{ ids: ID[] }>()
// );

// export const actionOperationUpdateStore = createAction(
//   '[Operation] Desired',
//   props<{ upserted: Operation[]; deleted: ID[] }>()
// );

// export const actionOperationFetchFailure = createAction(
//   '[Operation] Fetch Failure',
//   props<{ error: Error }>()
// );

// export const actionOperationSubscribeByIds = createAction(
//   '[Operation] Subscribe By Id',
//   props<{ ids: ID[] }>()
// );

export const actionNetworkFailure = createAction(
  'Network Failure',
  props<{ component: string; error: Error }>()
);

// export const actionOperationDeleted = createAction(
//   '[Operation] Deleted',
//   props<{ ids: ID[] }>()
// );

export const actionWsConnected = createAction('[ALL ENTITIES] WS Connected');

// mo actions
export const actionMoDesired = createAction(
  '[Mo] Desired',
  props<{ ids: ID[] }>()
);

export const actionMoFetchByIds = createAction(
  '[Mo] Fetch By Ids',
  props<{ ids: ID[] }>()
);

export const actionMoFetchSuccess = createAction(
  '[Mo] Fetch Success',
  props<{ mos: Mo[] }>()
);

export const actionMoFetchFailure = createAction(
  '[Mo] Fetch Failure',
  props<{ error: Error }>()
);

export const actionMoSubscribeByIds = createAction(
  '[Mo] Subscribe By Id',
  props<{ ids: ID[] }>()
);

export const actionMoSubscriptionFailure = createAction(
  '[Mo] Subscription Failure',
  props<{ error: Error }>()
);

export const actionMoUpdated = createAction(
  '[Mo] Updated',
  props<EntityUpdate>()
);

export const actionMoDeleted = createAction(
  '[Mo] Deleted',
  props<{ ids: ID[] }>()
);
