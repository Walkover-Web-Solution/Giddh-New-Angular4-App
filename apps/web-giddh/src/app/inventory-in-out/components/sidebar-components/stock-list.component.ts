import { Component, Input } from '@angular/core';
import { IStocksItem } from '../../../models/interfaces/stocksItem.interface';

@Component({
    selector: 'inout-stock-list',
    styles: [`
    .active > a {
      color: #d35f29 !important;
    }
  `],
    template: `
    <ul class="list-unstyled  stock-grp-list clearfix" *ngIf="stockList">
      <li routerLinkActive="active" *ngFor="let s of stockList"><a [routerLink]="['/pages','inventory-in-out','stock',s?.uniqueName]"> {{s.name}}</a></li>
    </ul>
  `
})
export class InOutStockListComponent {
    @Input() public stockList: IStocksItem[];
}
