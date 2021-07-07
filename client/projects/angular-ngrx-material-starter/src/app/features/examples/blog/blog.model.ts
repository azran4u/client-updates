export type ID = string;

export interface Blog {
  id: ID;
  name: string;
  posts: Post['id'][];
  author: User['id'];
}

export interface Post {
  id: ID;
  name: string;
  content: string;
  comments: Comment['id'][];
  author: User['id'];
}

export interface Comment {
  id: ID;
  title: string;
  content: string;
  author: User['id'];
}

export interface User {
  id: ID;
  name: string;
}

export interface BlogState {
  blogs: Map<ID, Blog>;
  posts: Map<ID, Post>;
  comments: Map<ID, Comment>;
  users: Map<ID, User>;
}
