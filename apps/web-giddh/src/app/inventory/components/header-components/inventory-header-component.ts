import { take, takeUntil } from 'rxjs/operators';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { AppState } from '../../../store/roots';
import { InventoryAction } from '../../../actions/inventory/inventory.actions';
import { Observable, ReplaySubject } from 'rxjs';
import { animate, state, style, transition, trigger } from '@angular/animations';

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
    <!--<div class="stock-bar inline pull-right">
      <div class="">
        <div class="pull-right">
          <button (click)="toggleCustomUnitAsidePane($event)" type="button" class="btn btn-link">Custom Stock Unit</button>
          <button (click)="toggleGroupStockAsidePane($event);setInventoryAsideState(true, true, false)" type="button" class="btn btn-default">Create Group</button>
          <button (click)="toggleGroupStockAsidePane($event);setInventoryAsideState(true, false, false)" type="button" class="btn btn-default">Create Stock</button>
        </div>
      </div>
    </div>-->
    <div class="aside-overlay" *ngIf="accountAsideMenuState === 'in' || asideMenuStateForProductService === 'in'"></div>
    <aside-custom-stock [class]="accountAsideMenuState" [@slideInOut]="accountAsideMenuState" (closeAsideEvent)="toggleCustomUnitAsidePane($event)"
                        (onShortcutPress)="toggleCustomUnitAsidePane()"></aside-custom-stock>
    <aside-inventory-stock-group [autoFocus]="false" [class]="asideMenuStateForProductService" [@slideInOut]="asideMenuStateForProductService" (closeAsideEvent)="toggleGroupStockAsidePane($event)"
                                 (onShortcutPress)="toggleGroupStockAsidePane()"></aside-inventory-stock-group>
  `
})
// <button type="button" class="btn btn-default" (click)="goToAddGroup()">Add Group</button>
// <button type="button" *ngIf="activeGroupName$ | async" class="btn btn-default" (click)="goToAddStock()">Add Stock</button>
// [routerLink]="['custom-stock']"
export class InventoryHearderComponent implements OnDestroy, OnInit {
    public activeGroupName$: Observable<string>;
    public accountAsideMenuState: string = 'out';
    public asideMenuStateForProductService: string = 'out';
    public openGroupStockAsidePane$: Observable<boolean>;
    public openCustomUnitAsidePane$: Observable<boolean>;
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

    constructor(private router: Router, private store: Store<AppState>, private inventoryAction: InventoryAction) {

        this.openGroupStockAsidePane$ = this.store.select(s => s.inventory.showNewGroupAsidePane).pipe(takeUntil(this.destroyed$));
        this.openCustomUnitAsidePane$ = this.store.select(s => s.inventory.showNewCustomUnitAsidePane).pipe(takeUntil(this.destroyed$));
    }

    public ngOnInit() {
        // get activeGroup
        this.activeGroupName$ = this.store.select(s => s.inventory.activeGroupUniqueName).pipe(takeUntil(this.destroyed$));

        this.openGroupStockAsidePane$.subscribe(s => {
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
        this.activeGroupName$.pipe(take(1)).subscribe(s => groupName = s);
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
        } else {
            document.querySelector('body').classList.remove('fixed');
        }
    }

    /**
     * setInventoryAsideState
     */
    public setInventoryAsideState(isOpen, isGroup, isUpdate) {
        this.store.dispatch(this.inventoryAction.ManageInventoryAside({ isOpen, isGroup, isUpdate }));
    }

    public ngOnDestroy() {
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }
}
