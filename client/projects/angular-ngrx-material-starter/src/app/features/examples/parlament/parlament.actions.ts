import { createAction, props } from '@ngrx/store';
import { ID, Operation } from './parlament.model';

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
  props<{ updated: ID[]; deleted: ID[] }>()
);

export const actionOperationDeleted = createAction(
  '[Operation] Deleted',
  props<{ ids: ID[] }>()
);
