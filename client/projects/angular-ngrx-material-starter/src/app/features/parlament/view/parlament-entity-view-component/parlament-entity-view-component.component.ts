import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Input,
  Output,
  EventEmitter,
  ViewChild,
  SimpleChanges,
  OnChanges,
  AfterViewInit
} from '@angular/core';
import { ID, ParlamentEntity } from '../../parlament.model';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';

export interface ParlamentEntityWithChilds extends ParlamentEntity {
  childs: ID[];
}

@Component({
  selector: 'anms-parlament-entity-view-component',
  templateUrl: './parlament-entity-view-component.component.html',
  styleUrls: ['./parlament-entity-view-component.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ParlamentEntityViewComponentComponent
  implements OnInit, OnChanges, AfterViewInit
{
  @ViewChild(MatSort) sort: MatSort;

  @Input()
  data: ParlamentEntityWithChilds[];

  @Input()
  title: string;

  @Output()
  deleted = new EventEmitter<ID>();

  @Output()
  updated = new EventEmitter<ID>();

  dataSource: MatTableDataSource<ParlamentEntityWithChilds>;

  displayedColumns: string[] = ['id', 'name', 'childs'];

  constructor() {
    this.dataSource = new MatTableDataSource<ParlamentEntityWithChilds>();
  }

  refresh() {
    this.dataSource.data = this.data ?? [];
    this.dataSource.sort = this.sort;
  }

  ngOnInit(): void {
    this.refresh();
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.refresh();
  }

  ngAfterViewInit(): void {
    this.refresh();
  }
}
