import { Component, OnInit } from '@angular/core';
import { AppState } from '../../../store';
import { Store } from '@ngrx/store';
import { animate, state, style, transition, trigger } from '@angular/animations';

@Component({
    selector: 'inventory-inout-header',
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
    <div class="inline pull-right">
      <div class="">
        <div class="pull-right">

          <div class="btn-group" dropdown>
            <button id="button-basic" dropdownToggle type="button" class="btn btn-default btn-sm dropdown-toggle"
                    aria-controls="dropdown-basic">
              New <span class="caret"></span>
            </button>
            <ul id="dropdown-basic" *dropdownMenu class="dropdown-menu  dropdown-option dropdown-menu-right"
                role="menu" aria-labelledby="button-basic">
              <li role="menuitem"><a class="dropdown-item" href="javascript:void(0);" (click)="toggleGroupStockAsidePane('inward', $event)">Inward Note</a></li>
              <li role="menuitem"><a class="dropdown-item" href="javascript:void(0);" (click)="toggleGroupStockAsidePane('outward', $event)">Outward Note</a></li>
              <li role="menuitem"><a class="dropdown-item" href="javascript:void(0);" (click)="toggleGroupStockAsidePane('transfer', $event)">Transfer Note</a></li>
              <li role="menuitem"><a class="dropdown-item" href="javascript:void(0);" (click)="toggleGroupStockAsidePane('createStock', $event)">Create Stock</a></li>
              <li role="menuitem"><a class="dropdown-item" href="javascript:void(0);" (click)="toggleGroupStockAsidePane('createAccount', $event)">Create Account</a></li>
            </ul>
          </div>
          <!-- <button (click)="toggleGroupStockAsidePane($event)" type="button" class="btn btn-default">New</button> -->
        </div>
      </div>
    </div>
    <aside-menu
      [class]="asideMenuState"
      [@slideInOut]="asideMenuState"
      (closeAsideEvent)="toggleGroupStockAsidePane('', $event)" [selectedAsideView]="selectedAsideView"></aside-menu>
    <div class="aside-overlay" *ngIf="asideMenuState === 'in'"></div>
    <!-- <aside-custom-stock [class]="accountAsideMenuState" [@slideInOut]="accountAsideMenuState" (closeAsideEvent)="toggleCustomUnitAsidePane($event)"></aside-custom-stock>-->
  `
})
// <button type="button" class="btn btn-default" (click)="goToAddGroup()">Add Group</button>
// <button type="button" *ngIf="activeGroupName$ | async" class="btn btn-default" (click)="goToAddStock()">Add Stock</button>
// [routerLink]="['custom-stock']"
export class InventoryHeaderComponent implements OnInit {
    public asideMenuState: string = 'out';
    public selectedAsideView: string = '';

    constructor(private _store: Store<AppState>) {

    }

    public ngOnInit() {
        this._store
            .select(p => p.inventoryInOutState.entrySuccess)
            .subscribe(p => {
                if (p) {
                    this.toggleGroupStockAsidePane('');
                }
            });
    }

    public toggleGroupStockAsidePane(view, event?): void {
        if (event) {
            event.preventDefault();
        }
        this.asideMenuState = this.asideMenuState === 'out' ? 'in' : 'out';
        this.toggleBodyClass();
        this.selectedAsideView = view;
    }

    public toggleBodyClass() {
        if (this.asideMenuState === 'in') {
            document.querySelector('body').classList.add('fixed');
        } else {
            document.querySelector('body').classList.remove('fixed');
        }
    }
}
