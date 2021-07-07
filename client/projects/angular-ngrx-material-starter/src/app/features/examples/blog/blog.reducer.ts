import { createReducer, on, Action } from '@ngrx/store';
import * as blogAction from './blog.actions';
import { Blog, BlogState, Comment, ID, Post, User } from './blog.model';
import { produce, enableMapSet } from 'immer';

enableMapSet();
export const initialState: BlogState = {
  blogs: new Map<ID, Blog>(),
  posts: new Map<ID, Post>(),
  comments: new Map<ID, Comment>(),
  users: new Map<ID, User>()
};

const reducer = createReducer(
  initialState,
  on(blogAction.actionBlogFetchSuccess, (state, { blogs }) =>
    produce(state, (draft) => {
      blogs.map((blog) => draft.blogs.set(blog.id, blog));
    })
  ),
  on(blogAction.actionBlogDeleted, (state, { ids }) =>
    produce(state, (draft) => {
      ids.map((id) => draft.blogs.delete(id));
    })
  )
);

export function blogReducer(state: BlogState | undefined, action: Action) {
  return reducer(state, action);
}
