import { StockDetailResponse, StockGroupResponse } from '../../../models/api-models/Inventory';
import { AppState } from '../../../store/roots';
import { IGroupsWithStocksHierarchyMinItem } from '../../../models/interfaces/groupsWithStocks.interface';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SidebarAction } from '../../../services/actions/inventory/sidebar.actions';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import { InventoryAction } from '../../../services/actions/inventory/inventory.actions';
@Component({
  selector: 'stockgrp-list',
  styles: [`
    .active {
      color: #d35f29 !important;
    }
    .stock-grp-list>li>div, .sub-grp>li>div {
      text-transform: uppercase;
    }
    .stock-items>li>div {
      text-transform: capitalize;
    }
  `],
  template: `
    <ul class="list-unstyled stock-grp-list mrT1">
      <li (click)="OpenGroup(grp,$event)" class="pdL" [ngClass]="{'isParent': grp.childStockGroups.length > 0}" *ngFor="let grp of Groups">
        <div [routerLink]="[ 'add-group', grp.uniqueName ]" [ngClass]="{'active': (activeGroupUniqueName$ | async) === grp.uniqueName}">{{grp.name}}</div>
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
