import { Injectable } from '@angular/core';
import { Action, select, Store } from '@ngrx/store';
import { Actions, ofType, createEffect } from '@ngrx/effects';
import {
  catchError,
  map,
  switchMap,
  tap,
  withLatestFrom
} from 'rxjs/operators';

import { LocalStorageService } from '../../../core/core.module';

import { State } from '../examples.state';
import * as blogAction from './blog.actions';
import * as blogSelectors from './blog.selectors';
import { BlogService } from './blog.service';
import { of } from 'rxjs';

import * as _ from 'lodash';

export const BLOG_KEY = 'EXAMPLES.BLOG';

@Injectable()
export class BlogEffects {
  // this effect is responsible to fix the current store state to the desired state
  desiredBlogsIds = createEffect(() =>
    this.actions$.pipe(
      ofType(blogAction.actionBlogDesired),
      withLatestFrom(
        this.store
          .pipe(select(blogSelectors.selectAllBlogs))
          .pipe(map((blogsInStore) => blogsInStore.map((blog) => blog.id)))
      ),
      switchMap(([{ ids }, currentIds]) => {
        const idsToRemove = currentIds.filter(
          (current) => !ids.includes(current)
        );
        const addedIds = ids.filter((id) => !currentIds.includes(id));
        const idsToSubscribe = ids;

        const actions: Action[] = [];

        if (!_.isEqual(idsToSubscribe, currentIds)) {
          actions.push(
            blogAction.actionBlogSubscribeByIds({ ids: idsToSubscribe })
          );
        }

        if (!_.isEmpty(idsToRemove)) {
          actions.push(blogAction.actionBlogDeleted({ ids: idsToRemove }));
        }

        if (!_.isEmpty(addedIds)) {
          actions.push(blogAction.actionBlogFetchByIds({ ids: addedIds }));
        }

        return actions;
      })
    )
  );

  // this effect is responsible to respond to changes in the data so the desired
  // state may change or some entities need to be updated
  blogsDataChanged = createEffect(() =>
    this.actions$.pipe(
      ofType(blogAction.actionBlogUpdated),
      withLatestFrom(
        this.store
          .pipe(select(blogSelectors.selectAllBlogs))
          .pipe(map((blogsInStore) => blogsInStore.map((blog) => blog.id)))
      ),
      switchMap(([{ updated, deleted }, currentIds]) => {
        const desiredIds = currentIds.filter(
          (current) => !deleted.includes(current)
        );
        const updatedIds = updated;

        const actions: Action[] = [];

        if (!_.isEqual(desiredIds, currentIds)) {
          actions.push(blogAction.actionBlogDesired({ ids: desiredIds }));
        }

        if (!_.isEmpty(updatedIds)) {
          actions.push(blogAction.actionBlogFetchByIds({ ids: updatedIds }));
        }

        return actions;
      })
    )
  );

  subscribeBlogsByIds = createEffect(() =>
    this.actions$.pipe(
      ofType(blogAction.actionBlogSubscribeByIds),
      switchMap(({ ids }) =>
        this.blogService.subscribeToBlogChanges(ids).pipe(
          map(({ updated, deleted }) =>
            blogAction.actionBlogUpdated({ updated, deleted })
          ),
          catchError((error) =>
            of(blogAction.actionBlogFetchFailure({ error }))
          )
        )
      )
    )
  );

  fetchBlogsByIds = createEffect(() =>
    this.actions$.pipe(
      ofType(blogAction.actionBlogFetchByIds),
      switchMap(({ ids }) =>
        this.blogService.getBlogsByIds(ids).pipe(
          map((blogs) => blogAction.actionBlogFetchSuccess({ blogs })),
          catchError((error) =>
            of(blogAction.actionBlogFetchFailure({ error }))
          )
        )
      )
    )
  );

  constructor(
    private actions$: Actions,
    private store: Store<State>,
    private localStorageService: LocalStorageService,
    private blogService: BlogService
  ) {}
}
