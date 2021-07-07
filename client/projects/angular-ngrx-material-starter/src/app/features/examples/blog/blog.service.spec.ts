import { TestBed } from '@angular/core/testing';

import { BlogService } from './blog.service';

fdescribe('BlogService', () => {
  let service: BlogService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BlogService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should emit update asfter change', () => {
    service
      .subscribeToBlogChanges(['testblog1', 'testblog3'])
      .subscribe(({ updated, deleted }) => {
        expect(updated).toEqual(['testblog1']);
        expect(deleted).toEqual(['testblog3']);
      }, fail);
    service.updateBlogs(
      [{ id: 'testblog1', name: 'testblog1', author: 'testuser1', posts: [] }],
      ['testblog3']
    );
    expect(service).toBeTruthy();
  });

  it('should not emit irrelevant update', () => {
    service
      .subscribeToBlogChanges(['testblog1', 'testblog3'])
      .subscribe(({ updated, deleted }) => {
        expect(updated).toEqual(['testblog1']);
        expect(deleted).toEqual(['testblog3']);
      }, fail);

    // irrelevant update
    service.updateBlogs(
      [{ id: 'testblog2', name: 'testblog1', author: 'testuser1', posts: [] }],
      []
    );

    // relevant update
    service.updateBlogs(
      [{ id: 'testblog1', name: 'testblog1', author: 'testuser1', posts: [] }],
      ['testblog3']
    );
  });
});
