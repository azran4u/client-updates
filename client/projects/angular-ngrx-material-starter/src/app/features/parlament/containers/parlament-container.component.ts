import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import { ROUTE_ANIMATIONS_ELEMENTS } from '../../../core/core.module';

import * as parlamentAction from '../parlament.actions';
import { ID } from '../parlament.model';
import * as parlamentSelectors from '../parlament.selectors';
import { map } from 'rxjs/operators';
import { ParlamentService } from '../parlament.service';
import { ParlamentEntityWithChilds } from '../components/parlament-entity-view-component/parlament-entity-view-component.component';

@Component({
  selector: 'anms-parlament',
  templateUrl: './parlament-container.component.html',
  styleUrls: ['./parlament-container.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ParlamentContainerComponent implements OnInit {
  routeAnimationsElements = ROUTE_ANIMATIONS_ELEMENTS;
  operations$: Observable<ParlamentEntityWithChilds[]>;
  operationsFromService$: Observable<ParlamentEntityWithChilds[]>;

  mos$: Observable<ParlamentEntityWithChilds[]>;
  mosFromService$: Observable<ParlamentEntityWithChilds[]>;

  constructor(
    public store: Store,
    private parlamentService: ParlamentService
  ) {}

  ngOnInit() {
    this.store.dispatch(
      parlamentAction.actionOperationDesired({ ids: ['op1', 'op2'] })
    );
    this.operations$ = this.store.pipe(
      select(parlamentSelectors.selectAllOperations),
      map((op) =>
        op.map((o) => {
          return { id: o.id, name: o.name, childs: o.mos };
        })
      )
    );
    this.operationsFromService$ = this.parlamentService.getAllOperations().pipe(
      map((op) =>
        op.map((o) => {
          return { id: o.id, name: o.name, childs: o.mos };
        })
      )
    );
    this.mos$ = this.store.pipe(
      select(parlamentSelectors.selectAllMo),
      map((op) =>
        op.map((o) => {
          return { id: o.id, name: o.name, childs: o.areas };
        })
      )
    );
    this.mosFromService$ = this.parlamentService.getAllMo().pipe(
      map((op) =>
        op.map((o) => {
          return { id: o.id, name: o.name, childs: o.areas };
        })
      )
    );
  }

  deleteOperationById(id: ID) {
    this.parlamentService.updateOperations([], [id]);
  }

  updateBlogById(id: ID) {
    this.parlamentService
      .getOperationsByIds([id])
      .pipe(
        map((operations) => {
          if (operations.length != 1) {
            console.error(`cannot find blog id ${id}`);
          }
          const operation = operations[0];
          if (!operation) return;
          this.parlamentService.updateOperations(
            [
              {
                ...operation,
                name: `${operation.name}-updated`
              }
            ],
            []
          );
        })
      )
      .subscribe();
  }
}
