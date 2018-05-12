import { Component, Input } from '@angular/core';
import { IStocksItem } from '../../../models/interfaces/stocksItem.interface';

@Component({
  selector: 'stock-list',
  styles: [`
    .active {
      color: #d35f29 !important;
    }
  `],
  template: `
    <span>Stock</span>
    <ul class="list-unstyled  stock-grp-list clearfix" *ngIf="stockList">
      <li *ngFor="let s of stockList"><a [routerLink]="['/pages','inventory-in-out','stock',s.uniqueName]"> {{s.name}}</a></li>
    </ul>
  `
})
export class StockListComponent {
  @Input() public stockList: IStocksItem[];
}
