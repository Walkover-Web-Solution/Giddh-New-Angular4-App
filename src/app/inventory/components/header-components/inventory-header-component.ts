import { Component, OnDestroy, OnInit, animate, state, style, transition, trigger, ViewChild} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { AppState } from '../../../store/roots';
import { InventoryAction } from '../../../actions/inventory/inventory.actions';
import { StockGroupResponse } from '../../../models/api-models/Inventory';
import { Observable } from 'rxjs/Observable';
import { ReplaySubject } from 'rxjs/ReplaySubject';

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
  <div class="stock-bar">
  <div class="col-xs-12 top_bar bdrB">
    <div class="pull-right">
      <button (click)="toggleCustomUnitAsidePane($event)" type="button" class="btn btn-primary">Custom Stock Unit</button>
      <button (click)="toggleGroupStockAsidePane($event)" type="button" class="btn btn-primary">New <span class="caret"></span></button>

    </div>
  </div>
</div>
<div class="aside-overlay" *ngIf="accountAsideMenuState === 'in' || asideMenuStateForProductService === 'in'"></div>
<aside-custom-stock [class]="accountAsideMenuState" [@slideInOut]="accountAsideMenuState" (closeAsideEvent)="toggleCustomUnitAsidePane($event)"></aside-custom-stock>
<aside-inventory-stock-group [class]="asideMenuStateForProductService" [@slideInOut]="asideMenuStateForProductService" (closeAsideEvent)="toggleGroupStockAsidePane($event)"></aside-inventory-stock-group>
`
})
// <button type="button" class="btn btn-default" (click)="goToAddGroup()">Add Group</button>
// <button type="button" *ngIf="activeGroupName$ | async" class="btn btn-default" (click)="goToAddStock()">Add Stock</button>
// [routerLink]="['custom-stock']"
export class InventoryHearderComponent implements OnDestroy, OnInit {
  public activeGroupName$: Observable<string>;
  public accountAsideMenuState: string = 'out';
  public asideMenuStateForProductService: string = 'out';
  public openGroupAsidePane$: Observable<boolean>;
  public openCustomUnitAsidePane$: Observable<boolean>;
  private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
  constructor(private router: Router, private store: Store<AppState>, private inventoryAction: InventoryAction) {

    this.openGroupAsidePane$ = this.store.select(s => s.inventory.showNewGroupAsidePane).takeUntil(this.destroyed$);
    this.openCustomUnitAsidePane$ = this.store.select(s => s.inventory.showNewCustomUnitAsidePane).takeUntil(this.destroyed$);
  }
  public ngOnInit() {
    // get activeGroup
    this.activeGroupName$ = this.store.select(s => s.inventory.activeGroupUniqueName).takeUntil(this.destroyed$);

    this.openGroupAsidePane$.subscribe(s => {
      if (s) {
        this.toggleGroupStockAsidePane();
      }
    });

    this.openCustomUnitAsidePane$.subscribe(s => {
      if (s) {
        this.toggleCustomUnitAsidePane();
      }
    });
  }

  public goToAddGroup() {
    // this.store.dispatch(this.inventoryAction.resetActiveGroup());
    this.router.navigate(['/pages', 'inventory', 'add-group']);
  }
  public goToAddStock() {
    this.store.dispatch(this.inventoryAction.resetActiveStock());
    let groupName = null;
    this.activeGroupName$.take(1).subscribe(s => groupName = s);
    this.router.navigate(['/pages', 'inventory', 'add-group', groupName, 'add-stock']);
  }
  public toggleCustomUnitAsidePane(event?): void {
    if (event) {
      event.preventDefault();
    }
    this.accountAsideMenuState = this.accountAsideMenuState === 'out' ? 'in' : 'out';
    this.toggleBodyClass();
  }

  public toggleGroupStockAsidePane(event?): void {
    if (event) {
      event.preventDefault();
    }
    this.asideMenuStateForProductService = this.asideMenuStateForProductService === 'out' ? 'in' : 'out';
    this.toggleBodyClass();
  }

  public toggleBodyClass() {
    if (this.accountAsideMenuState === 'in' || this.asideMenuStateForProductService === 'in') {
      document.querySelector('body').classList.add('fixed');
    }else {
      document.querySelector('body').classList.remove('fixed');
    }
  }

  public ngOnDestroy() {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }
}
