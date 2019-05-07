import { takeUntil } from 'rxjs/operators';
import { StockDetailResponse, StockGroupResponse } from '../../../models/api-models/Inventory';
import { AppState } from '../../../store/roots';
import { IGroupsWithStocksHierarchyMinItem } from '../../../models/interfaces/groupsWithStocks.interface';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SidebarAction } from '../../../actions/inventory/sidebar.actions';
import { Store } from '@ngrx/store';
import { Observable, ReplaySubject } from 'rxjs';
import { InventoryAction } from '../../../actions/inventory/inventory.actions';

@Component({
  selector: 'stockgrp-list',
  styles: [`
    .active {
      color: #d35f29 !important;
    }

    .stock-grp-list > li > a, .sub-grp > li > a {
      text-transform: capitalize;
    }

    .stock-items > li > a > div {
      text-transform: capitalize;
    }

    .stock-grp-list li > i:focus {
      outline: 0;
    }

    .grp_open {
      background: rgb(255, 255, 255);
    }

    .grp_open li {
      border: 0;
    }

    .btn-link {
      padding-top: 0 !important;
    }
  `],
  // [routerLink]="[ 'add-group', grp.uniqueName ]"
  template: `
    <ul class="list-unstyled stock-grp-list clearfix">
      <li class="clearfix" [ngClass]="{'isGrp': grp.childStockGroups.length > 0,'grp_open': grp.isOpen}" *ngFor="let grp of Groups">
        <a (click)="OpenGroup(grp,$event)" class="pull-left" [routerLink]="[ 'group', grp.uniqueName, 'stock-report' ]">
          <div [ngClass]="{'active': grp.isOpen && (activeGroup && activeGroup.uniqueName === grp.uniqueName) && !(activeStockUniqueName$ | async)}">{{grp.name}}</div>
        </a>
        <!-- *ngIf="grp.isOpen && (activeGroup && activeGroup.uniqueName === grp.uniqueName) && (activeStockUniqueName$ | async)" -->
        <span class="pull-right">
        <!-- *ngIf="grp.isOpen && (activeGroup && activeGroup.uniqueName === grp.uniqueName)" -->
          <i *ngIf="grp.childStockGroups.length > 0 || grp.stocks.length > 0" class="icon-arrow-down pr" [ngClass]="{'open': grp.isOpen}" (click)="OpenGroup(grp,$event)" [routerLink]="[ 'group', grp.uniqueName, 'stock-report' ]"></i>
          <button class="btn btn-link btn-xs pull-right" (click)="goToManageGroup(grp)" *ngIf="grp.isOpen && (activeGroup && activeGroup.uniqueName === grp.uniqueName) && !(activeStockUniqueName$ | async)">
            Edit
          </button>
        </span>
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
  public activeStock: any = null;
  public activeStockUniqueName$: Observable<string>;
  private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

  constructor(private store: Store<AppState>, private route: ActivatedRoute, private sideBarAction: SidebarAction,
              private inventoryAction: InventoryAction) {
    this.activeGroup$ = this.store.select(p => p.inventory.activeGroup).pipe(takeUntil(this.destroyed$));
    this.activeStock$ = this.store.select(p => p.inventory.activeStock).pipe(takeUntil(this.destroyed$));
    this.activeGroupUniqueName$ = this.store.select(p => p.inventory.activeGroupUniqueName).pipe(takeUntil(this.destroyed$));
    this.activeStockUniqueName$ = this.store.select(p => p.inventory.activeStockUniqueName);
  }

  public ngOnInit() {
    this.activeGroup$.pipe(takeUntil(this.destroyed$)).subscribe(a => {
      if (a) {
        this.activeGroup = a;
      }
    });

    this.activeStock$.pipe(takeUntil(this.destroyed$)).subscribe(a => {
      if (a) {
        this.activeStock = a;
      }
    });
  }

  public ngOnDestroy() {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }

  public OpenGroup(grp: IGroupsWithStocksHierarchyMinItem, e: Event) {
    e.stopPropagation();
    this.store.dispatch(this.sideBarAction.ShowBranchScreen(false));
    if (grp.isOpen) {
      this.store.dispatch(this.sideBarAction.OpenGroup(grp.uniqueName));
      this.store.dispatch(this.inventoryAction.resetActiveStock());
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
    this.store.dispatch(this.inventoryAction.ManageInventoryAside({isOpen, isGroup, isUpdate}));
  }

}
