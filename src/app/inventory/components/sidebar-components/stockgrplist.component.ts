import { StockDetailResponse, StockGroupResponse } from '../../../models/api-models/Inventory';
import { AppState } from '../../../store/roots';
import { IGroupsWithStocksHierarchyMinItem } from '../../../models/interfaces/groupsWithStocks.interface';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Rx';
import { SidebarAction } from '../../../services/actions/inventory/sidebar.actions';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
@Component({
  selector: 'stockgrp-list',
  styles: [`
    .active {
      color: #d35f29 !important;
    }
  `],
  template: `
    <ul class="list-unstyled stock-grp-list mrT1">
      <li (click)="OpenGroup(grp,$event)" class="pdL" *ngFor="let grp of Groups">
        <div [routerLink]="[ 'add-group', grp.uniqueName ]" [ngClass]="{'active': grp.isActive}">{{grp.name}}</div>
        <i *ngIf="grp.childStockGroups.length > 0" class="icon-arrow-down" [ngClass]="{'open': grp.isOpen}"></i>
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
  @Input()
  public Groups: IGroupsWithStocksHierarchyMinItem[];
  public stockUniqueName: string;

  constructor(private store: Store<AppState>, private route: ActivatedRoute, private sideBarAction: SidebarAction) {
    this.activeGroup$ = this.store.select(p => p.inventory.activeGroup);
    this.activeStock$ = this.store.select(p => p.inventory.activeStock);
  }

  public ngOnInit() {
    //
  }

  public ngOnDestroy() {
    // this.sub.unsubscribe();
  }

  public OpenGroup(grp: IGroupsWithStocksHierarchyMinItem, e: Event) {
    e.stopPropagation();
    if (grp.isOpen) {
      this.store.dispatch(this.sideBarAction.OpenGroup(grp.uniqueName));
    } else {
      this.store.dispatch(this.sideBarAction.GetInventoryGroup(grp.uniqueName));
    }
  }
}
