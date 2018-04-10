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
    .stock-grp-list>li>a, .sub-grp>li>a {
      text-transform: capitalize;
    }
    .stock-items>li > a >div {
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
    .btn-link {
      padding-top:0 !important;
    }
  `],
  // [routerLink]="[ 'add-group', grp.uniqueName ]"
  template: `
    <ul class="list-unstyled stock-grp-list clearfix">
      <li  class="clearfix" [ngClass]="{'isGrp': grp.childStockGroups.length > 0,'grp_open': grp.isOpen}" *ngFor="let grp of Groups">
      <a (click)="OpenGroup(grp,$event)" class="pull-left" [routerLink]="[ 'group', grp.uniqueName, 'stock-report' ]">
       <div [ngClass]="{'active': (activeGroupUniqueName$ | async) === grp.uniqueName}">{{grp.name}}</div>
      </a>
      <i *ngIf="grp.childStockGroups.length > 0" class="icon-arrow-down pr" [ngClass]="{'open': grp.isOpen}" (click)="OpenGroup(grp,$event)" [routerLink]="[ 'group', grp.uniqueName, 'stock-report' ]"></i>
        <button class="btn btn-link btn-xs pull-right" (click)="goToManageGroup(grp)" *ngIf="grp.isOpen && (activeGroup.uniqueName === grp.uniqueName)">
          Edit
        </button>
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
  public activeGroup: any = null;
  private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

  constructor(private store: Store<AppState>, private route: ActivatedRoute, private sideBarAction: SidebarAction,
    private inventoryAction: InventoryAction) {
    this.activeGroup$ = this.store.select(p => p.inventory.activeGroup).takeUntil(this.destroyed$);
    this.activeStock$ = this.store.select(p => p.inventory.activeStock).takeUntil(this.destroyed$);
    this.activeGroupUniqueName$ = this.store.select(p => p.inventory.activeGroupUniqueName).takeUntil(this.destroyed$);
  }

  public ngOnInit() {
    this.activeGroup$.takeUntil(this.destroyed$).subscribe(a => {
      if (a) {
        this.activeGroup = a;
      }
    });
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

  public goToManageGroup(grp) {
    if (grp.uniqueName) {
      this.store.dispatch(this.inventoryAction.OpenInventoryAsidePane(true));
      this.setInventoryAsideState(true, true, true);
    }
  }

  /**
   * setInventoryAsideState
   */
  public setInventoryAsideState(isOpen, isGroup, isUpdate) {
    this.store.dispatch(this.inventoryAction.ManageInventoryAside( { isOpen, isGroup, isUpdate }));
  }

}
