import { Component, OnInit, OnDestroy, ViewChild, TemplateRef } from '@angular/core';
import { AppState } from '../../../store';
import { Store, select } from '@ngrx/store';
import { takeUntil } from 'rxjs/operators';
import { ReplaySubject } from 'rxjs';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ASIDE_PANE_CONFIG } from '../../../app.constant';

/**
 * Handles Component functionality
 */
@Component({
    selector: 'inventory-inout-header',
    templateUrl: './inventory-header.component.html',
    standalone: false
})

/**
 * InventoryHeaderComponent class
 * Implements InventoryHeaderComponent functionality
 */
export class InventoryHeaderComponent implements OnInit, OnDestroy {
    /** Template reference for aside pane */
    @ViewChild('asideMenuTemplate', { static: true }) public asideMenuTemplate: TemplateRef<any>;
    /** Reference for aside pane dialog */
    public asideMenuDialogRef: MatDialogRef<any>;
    public selectedAsideView: string = '';
    /** Observable to unsubscribe all the store listeners to avoid memory leaks */
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

    /**
     * Creates an instance of class
     * Initializes component dependencies and sets up initial state
     */
    constructor(private _store: Store<AppState>, private dialog: MatDialog) {

    }

    /**
     * Handles ngOnInit functionality
     */
    public ngOnInit() {
        this._store.pipe(select(p => p.inventoryInOutState.entrySuccess), takeUntil(this.destroyed$)).subscribe(p => {
            /**
             * Handles if functionality
             */
            if (p) {
                this.openGroupStockAsidePaneDialog('');
            }
        });
    }

    /**
     * Opens groupstockasidepanedialog
     */
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
