import { StockDetailResponse, StockGroupResponse } from '../../../models/api-models/Inventory';
import { AppState } from '../../../store/roots';
import { IGroupsWithStocksHierarchyMinItem } from '../../../models/interfaces/groupsWithStocks.interface';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SidebarAction } from '../../../actions/inventory/sidebar.actions';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import { InventoryAction } from '../../../actions/inventory/inventory.actions';
@Component({
  selector: 'stockgrp-list',
  styles: [`
    .active {
      color: #d35f29 !important;
    }
    .stock-grp-list>li>div, .sub-grp>li>div {
      text-transform: capitalize;
      padding-left: 15px;
    }
    .stock-items>li>div {
      text-transform: capitalize;
    }
    .stock-grp-list li>i:focus {
      outline:0;
    }
    .grp_open {
      background: rgb(255, 255, 255);
    }
    .grp_open li {
      border: 0;
    }
  `],
  // [routerLink]="[ 'add-group', grp.uniqueName ]"
  template: `
    <ul class="list-unstyled stock-grp-list">
      <li (click)="OpenGroup(grp,$event)" class="pdL" [ngClass]="{'isGrp': grp.childStockGroups.length > 0,'grp_open': grp.isOpen}" *ngFor="let grp of Groups">
        <div [routerLink]="[ 'group', grp.uniqueName, 'stock-report' ]" [ngClass]="{'active': (activeGroupUniqueName$ | async) === grp.uniqueName}">{{grp.name}}</div>
        <i *ngIf="grp.childStockGroups.length > 0" [routerLink]="[ 'add-group', grp.uniqueName ]" class="icon-arrow-down" [ngClass]="{'open': grp.isOpen}"></i>
        <stock-list [Groups]='grp'>
        </stock-list>
        <stockgrp-list [Groups]='grp.childStockGroups' *ngIf="grp.childStockGroups.length > 0 && grp.isOpen">
        </stockgrp-list>
      </li>
    </ul>
  `
})
export class StockgrpListComponent implements OnInit, OnDestroy {
  public activeStock$: Observable<StockDetailResponse>;
  public activeGroup$: Observable<StockGroupResponse>;
  public activeGroupUniqueName$: Observable<string>;
  @Input()
  public Groups: IGroupsWithStocksHierarchyMinItem[];
  public stockUniqueName: string;
  private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

  constructor(private store: Store<AppState>, private route: ActivatedRoute, private sideBarAction: SidebarAction,
    private inventoryAction: InventoryAction) {
    this.activeGroup$ = this.store.select(p => p.inventory.activeGroup).takeUntil(this.destroyed$);
    this.activeStock$ = this.store.select(p => p.inventory.activeStock).takeUntil(this.destroyed$);
    this.activeGroupUniqueName$ = this.store.select(p => p.inventory.activeGroupUniqueName).takeUntil(this.destroyed$);
  }

  public ngOnInit() {
    //
  }

  public ngOnDestroy() {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }

  public OpenGroup(grp: IGroupsWithStocksHierarchyMinItem, e: Event) {
    e.stopPropagation();
    if (grp.isOpen) {
      this.store.dispatch(this.sideBarAction.OpenGroup(grp.uniqueName));
    } else {
      this.store.dispatch(this.sideBarAction.GetInventoryGroup(grp.uniqueName));
      this.store.dispatch(this.inventoryAction.resetActiveStock());
    }
  }

}
