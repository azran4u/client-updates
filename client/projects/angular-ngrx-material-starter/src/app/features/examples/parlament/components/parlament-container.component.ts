import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { select, Store } from '@ngrx/store';
import { Observable, of } from 'rxjs';

import {
  ROUTE_ANIMATIONS_ELEMENTS,
  NotificationService
} from '../../../../core/core.module';

import * as parlamentAction from '../parlament.actions';
import { ID, Operation } from '../parlament.model';
import * as parlamentSelectors from '../parlament.selectors';
import { map, switchMap } from 'rxjs/operators';
import { ParlamentService } from '../parlament.service';

@Component({
  selector: 'anms-parlament',
  templateUrl: './parlament-container.component.html',
  styleUrls: ['./parlament-container.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ParlamentContainerComponent implements OnInit {
  routeAnimationsElements = ROUTE_ANIMATIONS_ELEMENTS;
  operations$: Observable<Operation[]>;
  operationsFromService$: Observable<Operation[]>;

  constructor(
    public store: Store,
    private parlamentService: ParlamentService
  ) {}

  ngOnInit() {
    this.store.dispatch(
      parlamentAction.actionOperationDesired({ ids: ['op1', 'op2'] })
    );
    this.operations$ = this.store.pipe(
      select(parlamentSelectors.selectAllOperations)
    );
    this.operationsFromService$ = this.parlamentService.getAllOperations();
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