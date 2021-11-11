import { createAction, props } from '@ngrx/store';
import { EntityUpdate, ID, Mo, Operation } from './parlament.model';

// operation actions
export const actionOperationDesired = createAction(
  '[Operation] Desired',
  props<{ ids: ID[] }>()
);

export const actionOperationFetchByIds = createAction(
  '[Operation] Fetch By Ids',
  props<{ ids: ID[] }>()
);

export const actionOperationFetchSuccess = createAction(
  '[Operation] Fetch Success',
  props<{ operations: Operation[] }>()
);

export const actionOperationFetchFailure = createAction(
  '[Operation] Fetch Failure',
  props<{ error: Error }>()
);

export const actionOperationSubscribeByIds = createAction(
  '[Operation] Subscribe By Id',
  props<{ ids: ID[] }>()
);

export const actionOperationSubscriptionFailure = createAction(
  '[Operation] Subscription Failure',
  props<{ error: Error }>()
);

export const actionOperationUpdated = createAction(
  '[Operation] Updated',
  props<EntityUpdate>()
);

export const actionOperationDeleted = createAction(
  '[Operation] Deleted',
  props<{ ids: ID[] }>()
);

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
