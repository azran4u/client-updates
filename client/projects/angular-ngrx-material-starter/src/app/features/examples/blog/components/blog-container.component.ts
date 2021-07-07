import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { select, Store } from '@ngrx/store';
import { Observable, of } from 'rxjs';

import {
  ROUTE_ANIMATIONS_ELEMENTS,
  NotificationService
} from '../../../../core/core.module';

import * as blogActions from '../blog.actions';
import { Blog, ID } from '../blog.model';
import * as blogSelectors from '../blog.selectors';
import { BlogService } from '../blog.service';
import { map, switchMap } from 'rxjs/operators';

@Component({
  selector: 'anms-blog',
  templateUrl: './blog-container.component.html',
  styleUrls: ['./blog-container.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BlogContainerComponent implements OnInit {
  routeAnimationsElements = ROUTE_ANIMATIONS_ELEMENTS;
  blogs$: Observable<Blog[]>;
  blogsFromService$: Observable<Blog[]>;

  constructor(
    public store: Store,
    public snackBar: MatSnackBar,
    public translateService: TranslateService,
    private notificationService: NotificationService,
    private blogService: BlogService
  ) {}

  ngOnInit() {
    this.store.dispatch(
      blogActions.actionBlogDesired({ ids: ['blog1', 'blog2'] })
    );
    this.blogs$ = this.store.pipe(select(blogSelectors.selectAllBlogs));
    this.blogsFromService$ = this.blogService.getAllBlogsLiveQuery();
  }

  deleteBlogById(id: ID) {
    this.blogService.updateBlogs([], [id]);
  }

  updateBlogById(id: ID) {
    this.blogService
      .getBlogsByIds([id])
      .pipe(
        map((blogs) => {
          if (blogs.length != 1) {
            console.error(`cannot find blog id ${id}`);
          }
          const blog = blogs[0];
          if (!blog) return;
          this.blogService.updateBlogs(
            [
              {
                ...blog,
                name: `${blog.name}-updated`
              }
            ],
            []
          );
        })
      )
      .subscribe();
  }
}
