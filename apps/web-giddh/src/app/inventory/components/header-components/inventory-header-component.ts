import { take, takeUntil } from 'rxjs/operators';
import { Component, OnDestroy, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Store, select } from '@ngrx/store';
import { AppState } from '../../../store/roots';
import { InventoryAction } from '../../../actions/inventory/inventory.actions';
import { Observable, ReplaySubject } from 'rxjs';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ASIDE_PANE_CONFIG } from '../../../app.constant';

@Component({
    selector: 'inventory-header',
    styles: [`
  `],
    template: `
    <ng-template #asideCustomStockTemplate>
        <aside-custom-stock [menuState]="true" (closeAsideEvent)="asideCustomStockDialogRef.close()"
            (onShortcutPress)="toggleCustomUnitAsidePane()"></aside-custom-stock>
    </ng-template>
    <ng-template #asideInventoryStockGroupTemplate>
        <aside-inventory-stock-group [autoFocus]="false" (closeAsideEvent)="asideInventoryStockGroupDialogRef.close()"
            (onShortcutPress)="toggleGroupStockAsidePane()"></aside-inventory-stock-group>
    </ng-template>
  `
})
export class InventoryHearderComponent implements OnDestroy, OnInit {
    public activeGroupName$: Observable<string>;
    /** Reference to aside custom stock template */
    @ViewChild('asideCustomStockTemplate', { static: true }) public asideCustomStockTemplate: TemplateRef<any>;
    /** Reference to aside custom stock dialog */
    public asideCustomStockDialogRef: MatDialogRef<any>;
    /** Reference to aside inventory stock group template */
    @ViewChild('asideInventoryStockGroupTemplate', { static: true }) public asideInventoryStockGroupTemplate: TemplateRef<any>;
    /** Reference to aside inventory stock group dialog */
    public asideInventoryStockGroupDialogRef: MatDialogRef<any>;
    public openGroupStockAsidePane$: Observable<boolean>;
    public openCustomUnitAsidePane$: Observable<boolean>;
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

    constructor(private router: Router,
        private store: Store<AppState>,
        private inventoryAction: InventoryAction,
        private dialog: MatDialog) {

        this.openGroupStockAsidePane$ = this.store.pipe(select(s => s.inventory.showNewGroupAsidePane), takeUntil(this.destroyed$));
        this.openCustomUnitAsidePane$ = this.store.pipe(select(s => s.inventory.showNewCustomUnitAsidePane), takeUntil(this.destroyed$));
    }

    public ngOnInit() {
        // get activeGroup
        this.activeGroupName$ = this.store.pipe(select(s => s.inventory.activeGroupUniqueName), takeUntil(this.destroyed$));

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

    /**
     * Opens the custom stock aside pane dialog
     *
     * @memberof InventoryHearderComponent
     */
    public openAccountAsideMenuDialog() {
        this.asideCustomStockDialogRef = this.dialog.open(this.asideCustomStockTemplate, ASIDE_PANE_CONFIG);
    }

    /**
     * Opens the custom unit aside pane dialog
     *
     * @memberof InventoryHearderComponent
     */
    public openCustomUnitAsideDialog() {
        this.asideInventoryStockGroupDialogRef = this.dialog.open(this.asideInventoryStockGroupTemplate, ASIDE_PANE_CONFIG);
    }

    public goToAddGroup() {
        this.router.navigate(['/pages', 'inventory', 'add-group']);
    }

    public goToAddStock() {
        this.store.dispatch(this.inventoryAction.resetActiveStock());
        let groupName = null;
        this.activeGroupName$.pipe(take(1)).subscribe(s => groupName = s);
        this.router.navigate(['/pages', 'inventory', 'add-group', groupName, 'add-stock']);
    }

    /**
     * Toggles the custom unit aside pane
     *
     * @memberof InventoryHearderComponent
     */
    public toggleCustomUnitAsidePane(): void {
        this.openAccountAsideMenuDialog();
    }

    /**
     * Toggles the group stock aside pane
     *
     * @memberof InventoryHearderComponent
     */
    public toggleGroupStockAsidePane(): void {
        this.openCustomUnitAsideDialog();
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
