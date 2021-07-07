import { createSelector } from '@ngrx/store';

import { ExamplesState, selectExamples } from '../examples.state';

export const selectBlogState = createSelector(
  selectExamples,
  (state: ExamplesState) => state.blog
);

export const selectBlogsState = createSelector(
  selectBlogState,
  (state) => state.blogs
);

export const selectAllBlogs = createSelector(selectBlogsState, (blogsMap) =>
  Array.from(blogsMap.values())
);

export const selectPostsItems = createSelector(
  selectBlogState,
  (state) => state.posts
);

export const selectCommentsItems = createSelector(
  selectBlogState,
  (state) => state.comments
);

export const selectUsersItems = createSelector(
  selectBlogState,
  (state) => state.users
);
