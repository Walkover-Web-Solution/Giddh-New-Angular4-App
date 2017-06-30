import { IGroupsWithStocksHierarchyMinItem } from '../../../models/interfaces/groupsWithStocks.interface';
import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Rx';

@Component({
  selector: 'stockgrp-list',
  styles: [`
  `],
  template: `
  <ul class="list-unstyled stock-grp-list mrT1" >
      <li  [routerLink]="[ 'add-group', grp.uniqueName ]" class="pdL" *ngFor="let grp of Groups">
        <a href ng-class="{'active':  Groups.uniqueName ===groupUniqueName }">{{grp.name}}</a>
        <i *ngIf="grp.childStockGroups.length > 0 || grp.uniqueName ===groupUniqueName" class="icon-arrow-down" [ngClass]="{'open': grp.visibleChilds}"></i>
        <ng-template *ngFor="let item of grp.childStockGroups">
          <stock-list [Groups]='item'>
          </stock-list>
        </ng-template>
        <stockgrp-list [Groups]='grp.childStockGroups' *ngIf="grp.childStockGroups.length > 0 && grp.uniqueName === groupUniqueName">
        </stockgrp-list>

      </li>
  </ul>
  `
})
export class StockgrpListComponent implements OnInit, OnDestroy {
  public sub: Subscription;

  @Input()
  public Groups: IGroupsWithStocksHierarchyMinItem[];
  public groupUniqueName: any;
  constructor(private route: ActivatedRoute) {
  }
  public ngOnInit() {
    this.sub = this.route.params.subscribe(params => {
      this.groupUniqueName = params['groupUniqueName'];
    });
  }
  public ngOnDestroy() {
    this.sub.unsubscribe();
  }
}
