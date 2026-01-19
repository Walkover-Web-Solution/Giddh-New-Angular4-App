import { Component, Input } from '@angular/core';
import { IStocksItem } from '../../../models/interfaces/stocks-item.interface';

/**
 * Handles Component functionality
 */
@Component({
    selector: 'inout-stock-list',
    standalone: false,
    styles: [`
    .active > a {
      color: #d35f29 !important;
    }
  `],
    template: `
    <ul class="list-unstyled  stock-grp-list clear-both" *ngIf="stockList">
      <li routerLinkActive="active" *ngFor="let s of stockList"><a [routerLink]="['/pages','inventory-in-out','stock',s?.uniqueName]"> {{s.name}}</a></li>
    </ul>
  `
})
/**
 * InOutStockListComponent component
 * Handles inoutstocklist functionality and user interactions
 */
export class InOutStockListComponent {
    @Input() public stockList: IStocksItem[];
}
