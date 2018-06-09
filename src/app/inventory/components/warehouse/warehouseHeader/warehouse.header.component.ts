import { AppState } from '../store/roots';
import { animate, Component, OnDestroy, OnInit, state, style, transition, trigger } from '@angular/core';

@Component({
  selector: 'warehouse-header',
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
          <button type="button" class="btn btn-link" (click)="toggleWarehouseAsidePane($event)">New</button>
        </div>
      </div>
    </div>
    <div class="aside-overlay" *ngIf="warehouseAsideMenuState === 'in'"></div>
    <warehouse-destination [class]="warehouseAsideMenuState" [@slideInOut]="warehouseAsideMenuState" (closeAsideEvent)="toggleWarehouseAsidePane($event)"></warehouse-destination>
  `
})
export class WarehouseHeaderComponent implements OnInit, OnDestroy {
  public warehouseAsideMenuState: string = 'out';
  constructor() {
    //
  }

  public ngOnInit() {
    //
  }

  public toggleBodyClass() {
    if (this.warehouseAsideMenuState === 'in' || this.warehouseAsideMenuState === 'in') {
      document.querySelector('body').classList.add('fixed');
    }else {
      document.querySelector('body').classList.remove('fixed');
    }
  }

  public toggleWarehouseAsidePane(event?): void {
    if (event) {
      event.preventDefault();
    }
    this.warehouseAsideMenuState = this.warehouseAsideMenuState === 'out' ? 'in' : 'out';
    this.toggleBodyClass();
  }

  public ngOnDestroy() {
    //
  }
}
