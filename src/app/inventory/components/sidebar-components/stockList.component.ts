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
  <ul class="list-unstyled stock-items" [hidden]="!Groups.visibleChilds" >
    <li *ngFor="let item of Groups.stocks" >
      <a href ng-class="{'active': stockUniqueName === item.uniqueName }">{{item.name}}</a>
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
}
