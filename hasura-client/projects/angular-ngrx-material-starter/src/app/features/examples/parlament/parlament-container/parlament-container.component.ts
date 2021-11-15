import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  OnDestroy
} from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import { ROUTE_ANIMATIONS_ELEMENTS } from '../../../../core/core.module';

import * as parlamentAction from '../parlament.actions';
import { ID, ParlamentEntity } from '../parlament.model';
import * as parlamentSelectors from '../parlament.selectors';
import { map } from 'rxjs/operators';
import { ParlamentService } from '../parlament.service';

@Component({
  selector: 'anms-parlament',
  templateUrl: './parlament-container.component.html',
  styleUrls: ['./parlament-container.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ParlamentContainerComponent implements OnInit, OnDestroy {
  routeAnimationsElements = ROUTE_ANIMATIONS_ELEMENTS;
  operations$: Observable<ParlamentEntity[]>;
  operationsFromService$: Observable<ParlamentEntity[]>;

  mos$: Observable<ParlamentEntity[]>;
  mosFromService$: Observable<ParlamentEntity[]>;

  constructor(
    public store: Store,
    private parlamentService: ParlamentService
  ) {}

  ngOnInit() {
    this.openSubscription();
    this.operations$ = this.store.pipe(
      select(parlamentSelectors.selectAllOperations),
      map((op) =>
        op.map((o) => {
          return { ...o, childs: o.mos?.map((x) => x.id) ?? [] };
        })
      )
    );
    // this.operationsFromService$ = this.parlamentService.getAllOperations().pipe(
    //   map((op) =>
    //     op.map((o) => {
    //       return { ...o, childs: o.mosids };
    //     })
    //   )
    // );
    this.mos$ = this.store.pipe(
      select(parlamentSelectors.selectAllMo),
      map((mo) =>
        mo.map((o) => {
          return { ...o, childs: o.areas?.map((x) => x.id) ?? [] };
        })
      )
    );
    // this.mosFromService$ = this.parlamentService.getAllMo().pipe(
    //   map((op) =>
    //     op.map((o) => {
    //       return { ...o, childs: o.areas };
    //     })
    //   )
    // );
  }

  closeSubscription() {
    this.store.dispatch(
      parlamentAction.actionOperationDesiredByName({ names: [] })
    );
  }

  openSubscription() {
    this.store.dispatch(
      parlamentAction.actionOperationDesiredByName({ names: ['op1', 'op2'] })
    );
  }

  // deleteOperationById(id: ID) {
  //   this.parlamentService.updateOperations([], [id]);
  // }

  // updateBlogById(id: ID) {
  //   this.parlamentService
  //     .getOperationsByIds([id])
  //     .pipe(
  //       map((operations) => {
  //         if (operations.length != 1) {
  //           console.error(`cannot find blog id ${id}`);
  //         }
  //         const operation = operations[0];
  //         if (!operation) return;
  //         this.parlamentService.updateOperations(
  //           [
  //             {
  //               ...operation,
  //               name: `${operation.name}-updated`
  //             }
  //           ],
  //           []
  //         );
  //       })
  //     )
  //     .subscribe();
  // }

  ngOnDestroy(): void {
    this.closeSubscription();
  }
}
