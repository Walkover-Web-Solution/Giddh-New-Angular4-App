import { StockDetailResponse, StockGroupResponse } from '../../../models/api-models/Inventory';
import { AppState } from '../../../store/roots';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs/Rx';
import { IGroupsWithStocksHierarchyMinItem } from '../../../models/interfaces/groupsWithStocks.interface';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import * as _ from 'lodash';

@Component({
  selector: 'stock-list',
  styles: [`
    .active {
      color: #d35f29 !important;
    }
  `],
  template: `
  <ul class="list-unstyled stock-items" [hidden]="!Groups.isOpen" >
    <li  (click)="OpenStock(item, $event)" *ngFor="let item of Groups.stocks" >
      <div [ngClass]="{'active':  (activeStockUniqueName$ | async) === item.uniqueName}">{{item.name}}</div>
    </li>
  </ul>
  `
})
export class StockListComponent implements OnInit, OnDestroy {
  public activeStockUniqueName$: Observable<string>;
  public activeGroup$: Observable<StockGroupResponse>;
  public sub: Subscription;

  @Input()
  public Stocks: any[];
  @Input()
  public Groups: IGroupsWithStocksHierarchyMinItem;
  public stockUniqueName: string;
  private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
  constructor(private store: Store<AppState>, private route: ActivatedRoute, private _router: Router) {
    this.activeGroup$ = this.store.select(p => p.inventory.activeGroup);
    this.activeStockUniqueName$ = this.store.select(p => p.inventory.activeStockUniqueName);
  }
  public ngOnInit() {
    this.Groups.stocks = _.orderBy(this.Groups.stocks, ['name'], ['asc']);
  }
  public ngOnDestroy() {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }
  public OpenStock(item, e: Event) {
    e.stopPropagation();
    this.stockUniqueName = item.uniqueName;
    this._router.navigate(['/pages', 'inventory', 'add-group', this.Groups.uniqueName, 'stock-report', item.uniqueName]);
  }
}
