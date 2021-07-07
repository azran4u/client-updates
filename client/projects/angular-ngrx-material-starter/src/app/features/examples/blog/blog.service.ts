import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, Subject } from 'rxjs';
import { filter, map, tap } from 'rxjs/operators';
import { Blog, ID } from './blog.model';

@Injectable({
  providedIn: 'root'
})
export class BlogService {
  private blogs: Map<ID, Blog>;
  private blogChanges: Subject<{ updated: ID[]; deleted: ID[] }>;

  private blogsLiveQuery: BehaviorSubject<Blog[]>;

  constructor() {
    this.blogs = new Map<ID, Blog>();
    this.blogChanges = new Subject();

    this.blogs.set('blog1', {
      id: 'blog1',
      name: 'blog1',
      author: 'user1',
      posts: ['post1']
    });
    this.blogs.set('blog2', {
      id: 'blog2',
      name: 'blog2',
      author: 'user2',
      posts: ['post2']
    });
    this.blogs.set('blog3', {
      id: 'blog3',
      name: 'blog3',
      author: 'user3',
      posts: ['post3']
    });

    this.blogsLiveQuery = new BehaviorSubject<Blog[]>(
      Array.from(this.blogs.values())
    );
  }

  getAllBlogs(): Observable<Blog[]> {
    return of(Array.from(this.blogs.values()));
  }

  getAllBlogsLiveQuery(): Observable<Blog[]> {
    return this.blogsLiveQuery;
  }

  getBlogsByIds(ids: ID[]): Observable<Blog[]> {
    return of(
      ids
        .map((id) => this.blogs.get(id))
        .filter((blog) => blog !== undefined && blog !== null)
    );
  }

  updateBlogs(updated: Blog[], deleted: ID[]) {
    updated.map((blog) => this.blogs.set(blog.id, blog));
    deleted.map((id) => this.blogs.delete(id));
    this.blogChanges.next({ updated: updated.map((blog) => blog.id), deleted });
    this.blogsLiveQuery.next(Array.from(this.blogs.values()));
  }

  subscribeToBlogChanges(
    ids: ID[]
  ): Observable<{ updated: ID[]; deleted: ID[] }> {
    return this.blogChanges.pipe(
      map(({ updated, deleted }) => {
        updated = updated.filter((update) => ids.includes(update));
        deleted = deleted.filter((del) => ids.includes(del));
        return { updated, deleted };
      }),
      filter(({ updated, deleted }) => updated.length > 0 || deleted.length > 0)
    );
  }
}
