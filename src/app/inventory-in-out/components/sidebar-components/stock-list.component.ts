import { Component } from '@angular/core';

@Component({
  selector: 'stock-list',
  styles: [`
    .active {
      color: #d35f29 !important;
    }
  `],
  template: `
    <span>Stock</span>
    <ul class="list-unstyled  stock-grp-list clearfix">
      <li><a [routerLink]="['/pages','inventory-in-out','stock','asd']"> Stock 1</a></li>
      <!--   <li class="clearfix" *ngFor="let item of Groups.stocks" >
           <a (click)="OpenStock(item, $event)" class="pull-left">
             <div [ngClass]="{'active':  (activeStockUniqueName$ | async) === item.uniqueName}">{{item.name}}</div>
           </a>
           <button class="btn btn-link btn-xs pull-right" (click)="goToManageStock(item)" *ngIf="(activeStockUniqueName$ | async) === item.uniqueName">
             Edit
           </button>
         </li>-->
    </ul>
  `
})
export class StockListComponent {

}
