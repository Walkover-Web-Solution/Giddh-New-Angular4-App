import { takeUntil } from 'rxjs/operators';
import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { AppState } from '../../../store';
import { Store } from '@ngrx/store';
import { SidebarAction } from '../../../actions/inventory/sidebar.actions';
import { Observable, ReplaySubject } from 'rxjs';

@Component({
    selector: 'ledger-aside-pane',
    templateUrl: './ledgerAsidePane.component.html',
    styleUrls: ['./ledgerAsidePane.component.scss'],
    styles: [`

  `]
})

export class LedgerAsidePaneComponent implements OnInit, OnDestroy {
    @Output() public closeAsideEvent: EventEmitter<boolean> = new EventEmitter(true);

    public isAddStockOpen: boolean = false;
    public isAddAccountOpen: boolean = false;
    public hideFirstScreen: boolean = false;
    public createStockSuccess$: Observable<boolean>;
    public createAccountIsSuccess$: Observable<boolean>;

    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

    constructor(private store: Store<AppState>, private _inventorySidebarAction: SidebarAction) {
        this.createStockSuccess$ = this.store.select(s => s.inventory.createStockSuccess).pipe(takeUntil(this.destroyed$));
        this.createAccountIsSuccess$ = this.store.select(s => s.groupwithaccounts.createAccountIsSuccess);
    }

    public ngOnInit() {
        this.store.dispatch(this._inventorySidebarAction.GetGroupsWithStocksHierarchyMin());
        // subscribe createStockSuccess for resting form
        this.createStockSuccess$.subscribe(s => {
            if (s) {
                this.backButtonPressed();
            }
        });

        this.createAccountIsSuccess$.subscribe(s => {
            if (s) {
                this.backButtonPressed();
            }
        });
    }

    public toggleStockPane() {
        this.hideFirstScreen = true;
        this.isAddAccountOpen = false;
        this.isAddStockOpen = !this.isAddStockOpen;
    }

    public toggleAccountPane() {
        this.hideFirstScreen = true;
        this.isAddStockOpen = false;
        this.isAddAccountOpen = !this.isAddAccountOpen;
    }

    public backButtonPressed() {
        this.hideFirstScreen = false;
        this.isAddStockOpen = false;
        this.isAddAccountOpen = false;
    }

    public closeAsidePane(e?: any) {
        this.hideFirstScreen = false;
        this.isAddStockOpen = false;
        this.isAddAccountOpen = false;
        if (e) {
            //
        } else {
            this.closeAsideEvent.emit();
        }
    }

    public ngOnDestroy() {
        // this.store.dispatch(this.inventoryAction.resetActiveStock());
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }
}
