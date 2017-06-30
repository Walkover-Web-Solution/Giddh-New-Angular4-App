import { AppState } from '../../../store/roots';
import { IGroupsWithStocksHierarchyMinItem } from '../../../models/interfaces/groupsWithStocks.interface';
import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Rx';
import * as _ from 'lodash';
import { SidebarAction } from '../../../services/actions/inventory/sidebar.actions';
import { Store } from '@ngrx/store';
@Component({
  selector: 'stockgrp-list',
  styles: [`
  `],
  template: `
  <ul class="list-unstyled stock-grp-list mrT1" >
      <li  (click)="OpenGroup(grp,$event)"  class="pdL" *ngFor="let grp of Groups">
        <div [routerLink]="[ 'add-group', grp.uniqueName ]" [ngClass]="{'active': grp.isActive}" >{{grp.name}}</div>
        <i *ngIf="grp.childStockGroups.length > 0" class="icon-arrow-down" [ngClass]="{'open': grp.isOpen}"></i>
          <stock-list [Groups]='grp' >
          </stock-list>
        <stockgrp-list [Groups]='grp.childStockGroups' *ngIf="grp.childStockGroups.length > 0 && grp.isOpen">
        </stockgrp-list>

      </li>
  </ul>
  `
})
export class StockgrpListComponent implements OnInit, OnDestroy {
  public sub: Subscription;

  @Input()
  public Groups: IGroupsWithStocksHierarchyMinItem[];
  public groupUniqueName: string;
  constructor(private store: Store<AppState>, private route: ActivatedRoute, private sideBarAction: SidebarAction) {
  }

  public ngOnInit() {
    this.sub = this.route.params.subscribe(params => {
      this.groupUniqueName = params['groupUniqueName'];
    });
  }
  public ngOnDestroy() {
    this.sub.unsubscribe();
  }

  public OpenGroup(grp: IGroupsWithStocksHierarchyMinItem, e: Event) {
    e.stopPropagation();
    this.store.dispatch(this.sideBarAction.OpenGroup(grp.uniqueName));
    this.store.dispatch(this.sideBarAction.GetInventoryGroup(grp.uniqueName));
  }
}
