import {
  Component,
  OnInit,
  Input,
  OnDestroy
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Rx';
import { IGroupsWithStocksHierarchyMinItem } from '../../../models/interfaces/groupsWithStocks.interface';

@Component({
  selector: 'stock-list',
  styles: [`
  `],
  template: `
  <ul class="list-unstyled stock-items" [hidden]="!Groups.isOpen" >
    <li  (click)="OpenStock(item, $event)" *ngFor="let item of Groups.stocks" >
      <div [routerLink]="[ 'add-group',Groups.uniqueName,'add-stock', item.uniqueName]" ng-class="{'active': stockUniqueName === item.uniqueName }">{{item.name}}</div>
    </li>
  </ul>
  `
})
export class StockListComponent implements OnInit, OnDestroy {

  public sub: Subscription;
  @Input()
  public Stocks: any[];

  @Input()
  public Groups: IGroupsWithStocksHierarchyMinItem;
  public stockUniqueName: any;
  constructor(private route: ActivatedRoute) {
  }
  public ngOnInit() {
    this.sub = this.route.params.subscribe(params => {
      this.stockUniqueName = params['stockUniqueName'];
    });
  }
  public ngOnDestroy() {
    this.sub.unsubscribe();
  }
  public OpenStock(item, e: Event) {
    e.stopPropagation();
  }
}
