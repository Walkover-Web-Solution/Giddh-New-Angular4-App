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
          <button (click)="toggleGroupStockAsidePane($event)" type="button" class="btn btn-default">New</button>
        </div>
      </div>
    </div>
    <aside-menu
      [class]="asideMenuState"
      [@slideInOut]="asideMenuState"
      (closeAsideEvent)="toggleGroupStockAsidePane($event)"></aside-menu>
    <!--  <div class="aside-overlay" *ngIf="accountAsideMenuState === 'in' || asideMenuStateForProductService === 'in'"></div>
      <aside-custom-stock [class]="accountAsideMenuState" [@slideInOut]="accountAsideMenuState" (closeAsideEvent)="toggleCustomUnitAsidePane($event)"></aside-custom-stock>-->

  `
})
// <button type="button" class="btn btn-default" (click)="goToAddGroup()">Add Group</button>
// <button type="button" *ngIf="activeGroupName$ | async" class="btn btn-default" (click)="goToAddStock()">Add Stock</button>
// [routerLink]="['custom-stock']"
export class InventoryHeaderComponent {
  public asideMenuState: string = 'out';

  public toggleGroupStockAsidePane(event?): void {
    if (event) {
      event.preventDefault();
    }
    this.asideMenuState = this.asideMenuState === 'out' ? 'in' : 'out';
    this.toggleBodyClass();
  }

  public toggleBodyClass() {
    if (this.asideMenuState === 'in') {
      document.querySelector('body').classList.add('fixed');
    } else {
      document.querySelector('body').classList.remove('fixed');
    }
  }
}
