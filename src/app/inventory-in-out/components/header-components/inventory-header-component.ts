import { animate, Component, state, style, transition, trigger } from '@angular/core';

@Component({
  selector: 'inventory-header',
  styles: [`
  `],
  animations: [
    trigger('slideInOut', [
      state('in', style({
        transform: 'translate3d(0, 0, 0)'
      })),
      state('out', style({
        transform: 'translate3d(100%, 0, 0)'
      })),
      transition('in => out', animate('400ms ease-in-out')),
      transition('out => in', animate('400ms ease-in-out'))
    ]),
  ],
  template: `
    <div class="stock-bar inline pull-right">
      <div class="">
        <div class="pull-right">
          <button (click)="toggleGroupStockAsidePane($event);setInventoryAsideState(true, false, false)" type="button" class="btn btn-default">New</button>
        </div>
      </div>
    </div>
    <!--  <div class="aside-overlay" *ngIf="accountAsideMenuState === 'in' || asideMenuStateForProductService === 'in'"></div>
      <aside-custom-stock [class]="accountAsideMenuState" [@slideInOut]="accountAsideMenuState" (closeAsideEvent)="toggleCustomUnitAsidePane($event)"></aside-custom-stock>
      <aside-inventory-stock-group [class]="asideMenuStateForProductService" [@slideInOut]="asideMenuStateForProductService" (closeAsideEvent)="toggleGroupStockAsidePane($event)"></aside-inventory-stock-group>-->
  `
})
// <button type="button" class="btn btn-default" (click)="goToAddGroup()">Add Group</button>
// <button type="button" *ngIf="activeGroupName$ | async" class="btn btn-default" (click)="goToAddStock()">Add Stock</button>
// [routerLink]="['custom-stock']"
export class InventoryHeaderComponent {

}
