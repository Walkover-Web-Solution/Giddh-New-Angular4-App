import {
  Component,
  OnInit,
  Input,
  OnDestroy
} from '@angular/core';
import { ActivatedRoute, Router, NavigationStart } from '@angular/router';
import { Subscription } from 'rxjs/Rx';
import { IGroupsWithStocksHierarchyMinItem } from '../../../models/interfaces/groupsWithStocks.interface';

@Component({
  selector: 'stock-list',
  styles: [`
  `],
  template: `
  <ul class="list-unstyled stock-items" [hidden]="!Groups.isOpen" >
    <li  (click)="OpenStock(item, $event)" *ngFor="let item of Groups.stocks" >
      <div [ngClass]="{'active': stockUniqueName === item.uniqueName }">{{item.name}}</div>
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
  constructor(private route: ActivatedRoute, private _router: Router) {
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
    this._router.navigateByUrl(`/pages/inventory/add-group/${this.Groups.uniqueName}/stock-report/${item.uniqueName}`);
  }
}
