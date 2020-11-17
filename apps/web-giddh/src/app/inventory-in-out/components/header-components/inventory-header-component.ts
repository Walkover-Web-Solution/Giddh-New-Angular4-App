import { Component, OnInit, OnDestroy } from '@angular/core';
import { AppState } from '../../../store';
import { Store, select } from '@ngrx/store';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { takeUntil } from 'rxjs/operators';
import { ReplaySubject } from 'rxjs';

@Component({
    selector: 'inventory-inout-header',
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
    templateUrl: './inventory-header.component.html'
})

export class InventoryHeaderComponent implements OnInit, OnDestroy {
    public asideMenuState: string = 'out';
    public selectedAsideView: string = '';
    /** Observable to unsubscribe all the store listeners to avoid memory leaks */
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

    constructor(private _store: Store<AppState>) {

    }

    public ngOnInit() {
        this._store.pipe(select(p => p.inventoryInOutState.entrySuccess), takeUntil(this.destroyed$)).subscribe(p => {
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

    /**
     * This will destroy all the memory used by this component
     *
     * @memberof InventoryHeaderComponent
     */
    public ngOnDestroy(): void {
        this.destroyed$.next(true);
        this.destroyed$.complete();       
	}
}
