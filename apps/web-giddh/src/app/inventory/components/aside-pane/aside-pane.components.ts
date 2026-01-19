import { takeUntil } from 'rxjs/operators';
import { Component, EventEmitter, OnChanges, OnDestroy, OnInit, Output, Input } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { AppState } from '../../../store';
import { Observable, ReplaySubject } from 'rxjs';
import { InventoryAction } from '../../../actions/inventory/inventory.actions';
import { Router } from '@angular/router';

/**
 * Handles Component functionality
 */
@Component({
    selector: 'aside-pane',
    styleUrls: ['aside-pane.components.scss'],
    templateUrl: './aside-pane.components.html',
    standalone: false
})
/**
 * AsidePaneComponent class
 * Implements AsidePaneComponent functionality
 */
export class AsidePaneComponent implements OnInit, OnChanges, OnDestroy {

    @Input() public autoFocus: boolean = false;
    @Output() public closeAsideEvent: EventEmitter<boolean> = new EventEmitter(true);
    @Output() public animatePaneAside: EventEmitter<any> = new EventEmitter();

    public isAddStockOpen: boolean = false;
    public isAddGroupOpen: boolean = false;
    public isAddUnitOpen: boolean = false;
    public hideFirstScreen: boolean = false;
    public hideFirstStep: boolean = false;
    public asideClose: boolean;
    public openGroupAsidePane$: Observable<boolean>;
    public createGroupSuccess$: Observable<boolean>;
    public manageInProcess$: Observable<any>;
    public addGroup: boolean;
    public addStock: boolean;
    public createStockSuccess$: Observable<boolean>;
    public autoFocusOnChild: boolean = false;
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

    /**
     * Creates an instance of class
     * Initializes component dependencies and sets up initial state
     */
    constructor(
        private store: Store<AppState>,
        private inventoryAction: InventoryAction,
        private _router: Router,
    ) {
        this.createStockSuccess$ = this.store.pipe(select(s => s.inventory.createStockSuccess), takeUntil(this.destroyed$));
        this.createGroupSuccess$ = this.store.pipe(select(states => states.inventory.createGroupSuccess), takeUntil(this.destroyed$));
    }

    /**
     * Handles ngOnInit functionality
     */
    public ngOnInit() {
        this.createStockSuccess$.subscribe(s => {
            /**
             * Handles if functionality
             */
            if (s) {
                this.hideFirstScreen = false;
                this.isAddStockOpen = false;
            }
        });
        this.createGroupSuccess$.subscribe(s => {
            /**
             * Handles if functionality
             */
            if (s) {
                this.hideFirstScreen = false;
                this.isAddGroupOpen = false;
            }
        });

        this.asideClose = false;
    }

    /**
     * Toggles stockpane state
     */
    public toggleStockPane() {
        this.hideFirstScreen = true;
        this.isAddStockOpen = false;
        this.isAddStockOpen = !this.isAddStockOpen;
    }

    /**
     * Toggles grouppane state
     */
    public toggleGroupPane() {
        this.hideFirstScreen = true;
        this.isAddGroupOpen = false;
        this.isAddGroupOpen = !this.isAddGroupOpen;
    }

    /**
     * Toggles unitpane state
     */
    public toggleUnitPane() {
        this.hideFirstScreen = true;
        this.isAddUnitOpen = false;
        this.isAddUnitOpen = !this.isAddUnitOpen;
    }

    /**
     * Handles backButtonPressed functionality
     */
    public backButtonPressed() {
        this.hideFirstScreen = false;
        this.isAddStockOpen = false;
        this.isAddGroupOpen = false;
        this.isAddUnitOpen = false;
    }
    /**
     * Closes asidepane
     */
    public closeAsidePane(e?: any) {
        this.hideFirstStep = false;
        this.isAddStockOpen = false;
        this.isAddGroupOpen = false;
        this.isAddUnitOpen = false;
        this.hideFirstScreen = false;
        this.addGroup = false;
        this.addStock = false;
        this.asideClose = true;
        /**
         * Sets timeout value
         */
        setTimeout(() => {
            this.asideClose = false;
        }, 500);
        /**
         * Handles if functionality
         */
        if (!e) {
            this.store.dispatch(this.inventoryAction.OpenInventoryAsidePane(false));
            this.closeAsideEvent.emit();
            let objToSend = { isOpen: false, isGroup: false, isUpdate: false };
            this.store.dispatch(this.inventoryAction.ManageInventoryAside(objToSend));
        }
    }

    /**
     * Handles animateAside functionality
     */
    public animateAside(e: any) {
        this.animatePaneAside.emit(e);
    }

    /**
     * Handles ngOnChanges functionality
     */
    public ngOnChanges(c) {
        /**
         * Handles if functionality
         */
        if (c.autoFocus && c.autoFocus.currentValue) {
            this.autoFocusOnChild = true;
        } else {
            this.autoFocusOnChild = false;
        }
    }

    /**
     * Handles ngOnDestroy functionality
     */
    public ngOnDestroy() {
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }

}
