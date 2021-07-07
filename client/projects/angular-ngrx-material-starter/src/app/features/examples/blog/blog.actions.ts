import { createAction, props } from '@ngrx/store';
import { Blog, ID } from './blog.model';

export const actionBlogDesired = createAction(
  '[Blog] Selected',
  props<{ ids: ID[] }>()
);

export const actionBlogFetchByIds = createAction(
  '[Blog] Fetch By Ids',
  props<{ ids: ID[] }>()
);

export const actionBlogFetchSuccess = createAction(
  '[Blog] Fetch Success',
  props<{ blogs: Blog[] }>()
);

export const actionBlogFetchFailure = createAction(
  '[Blog] Fetch Failure',
  props<{ error: Error }>()
);

export const actionBlogSubscribeByIds = createAction(
  '[Blog] Subscribe By Id',
  props<{ ids: ID[] }>()
);

export const actionBlogSubscriptionFailure = createAction(
  '[Blog] Subscription Failure',
  props<{ error: Error }>()
);

export const actionBlogUpdated = createAction(
  '[Blog] Updated',
  props<{ updated: ID[]; deleted: ID[] }>()
);

export const actionBlogDeleted = createAction(
  '[Blog] Deleted',
  props<{ ids: ID[] }>()
);
