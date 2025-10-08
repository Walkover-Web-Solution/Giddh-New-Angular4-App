import { Component, OnInit, OnDestroy, ViewChild, TemplateRef } from '@angular/core';
import { AppState } from '../../../store';
import { Store, select } from '@ngrx/store';
import { takeUntil } from 'rxjs/operators';
import { ReplaySubject } from 'rxjs';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ASIDE_PANE_CONFIG } from '../../../app.constant';

@Component({
    selector: 'inventory-inout-header',
    templateUrl: './inventory-header.component.html'
})

export class InventoryHeaderComponent implements OnInit, OnDestroy {
    /** Template reference for aside pane */
    @ViewChild('asideMenuTemplate', { static: true }) public asideMenuTemplate: TemplateRef<any>;
    /** Reference for aside pane dialog */
    public asideMenuDialogRef: MatDialogRef<any>;
    public selectedAsideView: string = '';
    /** Observable to unsubscribe all the store listeners to avoid memory leaks */
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

    constructor(private _store: Store<AppState>, private dialog: MatDialog) {

    }

    public ngOnInit() {
        this._store.pipe(select(p => p.inventoryInOutState.entrySuccess), takeUntil(this.destroyed$)).subscribe(p => {
            if (p) {
                this.openGroupStockAsidePaneDialog('');
            }
        });
    }

    public openGroupStockAsidePaneDialog(view: string): void {
        this.asideMenuDialogRef = this.dialog.open(this.asideMenuTemplate, ASIDE_PANE_CONFIG);
        this.selectedAsideView = view;
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
