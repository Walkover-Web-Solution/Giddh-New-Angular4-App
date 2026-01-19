import { takeUntil } from 'rxjs/operators';
import { Component, EventEmitter, OnChanges, OnDestroy, OnInit, Output, Input } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { AppState } from '../../../store';
import { Observable, ReplaySubject } from 'rxjs';
import { InventoryAction } from '../../../actions/inventory/inventory.actions';

/**
 * Handles Component functionality
 */
@Component({
    selector: 'aside-inventory-stock-group',
    styleUrls: [`./aside-inventory.components.scss`],
    templateUrl: './aside-inventory.components.html',
    standalone: false
})
/**
 * AsideInventoryComponent class
 * Implements AsideInventoryComponent functionality
 */
export class AsideInventoryComponent implements OnInit, OnChanges, OnDestroy {

    @Input() public autoFocus: boolean = false;
    @Output() public closeAsideEvent: EventEmitter<boolean> = new EventEmitter(true);
    @Output() public animatePaneAside: EventEmitter<any> = new EventEmitter();

    public isAddStockOpen: boolean = false;
    public isAddGroupOpen: boolean = false;
    public hideFirstStep: boolean = false;
    public openGroupAsidePane$: Observable<boolean>;
    public createGroupSuccess$: Observable<boolean>;
    public removeGroupSuccess$: Observable<boolean>;
    public removeStockSuccess$: Observable<boolean>;
    public UpdateGroupSuccess$: Observable<boolean>;
    public UpdateStockSuccess$: Observable<boolean>;
    public MoveStockSuccess$: Observable<boolean>;
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
        private inventoryAction: InventoryAction
    ) {
        this.openGroupAsidePane$ = this.store.pipe(select(s => s.inventory.showNewGroupAsidePane), takeUntil(this.destroyed$));
        this.createGroupSuccess$ = this.store.pipe(select(s => s.inventory.createGroupSuccess), takeUntil(this.destroyed$));
        this.manageInProcess$ = this.store.pipe(select(s => s.inventory.inventoryAsideState), takeUntil(this.destroyed$));
        this.createStockSuccess$ = this.store.pipe(select(s => s.inventory.createStockSuccess), takeUntil(this.destroyed$));
        this.removeStockSuccess$ = this.store.pipe(select(s => s.inventory.deleteStockSuccess), takeUntil(this.destroyed$));
        this.removeGroupSuccess$ = this.store.pipe(select(s => s.inventory.deleteGroupSuccess), takeUntil(this.destroyed$));
        this.UpdateStockSuccess$ = this.store.pipe(select(s => s.inventory.UpdateStockSuccess), takeUntil(this.destroyed$));
        this.UpdateGroupSuccess$ = this.store.pipe(select(s => s.inventory.UpdateGroupSuccess), takeUntil(this.destroyed$));
        this.MoveStockSuccess$ = this.store.pipe(select(s => s.inventory.moveStockSuccess), takeUntil(this.destroyed$));

    }

    /**
     * Handles ngOnInit functionality
     */
    public ngOnInit() {

        this.manageInProcess$.subscribe(s => {
            /**
             * Handles if functionality
             */
            if (s.isOpen && s.isGroup) {
                this.isAddGroupOpen = true;
                this.isAddStockOpen = false;
                /**
                 * Handles if functionality
                 */
                if (s.isUpdate) {
                    this.addGroup = false;
                } else {
                    this.addGroup = true;
                }
            } else if (s.isOpen && !s.isGroup) {
                this.isAddGroupOpen = false;
                this.isAddStockOpen = true;
                /**
                 * Handles if functionality
                 */
                if (s.isUpdate) {
                    this.addStock = false;
                } else {
                    this.addStock = true;
                }
            }
        });

        this.createGroupSuccess$.subscribe(d => {
            /**
             * Handles if functionality
             */
            if (d && this.isAddGroupOpen) {
                this.closeAsidePane();
            }
        });

        this.createStockSuccess$.subscribe(d => {
            /**
             * Handles if functionality
             */
            if (d && this.isAddStockOpen) {
                this.closeAsidePane();
            }
        });

        // subscribe createStockSuccess for resting form
        this.removeStockSuccess$.subscribe(s => {
            /**
             * Handles if functionality
             */
            if (s && this.isAddStockOpen) {
                this.closeAsidePane();
            }
        });

        this.removeGroupSuccess$.subscribe(s => {
            /**
             * Handles if functionality
             */
            if (s && this.isAddGroupOpen) {
                this.closeAsidePane();
            }
        });

        this.UpdateStockSuccess$.subscribe(s => {
            /**
             * Handles if functionality
             */
            if (s && this.isAddStockOpen) {
                this.closeAsidePane();
            }
        });

        this.UpdateGroupSuccess$.subscribe(s => {
            /**
             * Handles if functionality
             */
            if (s && this.isAddGroupOpen) {
                this.closeAsidePane();
            }
        });

        this.MoveStockSuccess$.subscribe(s => {
            /**
             * Handles if functionality
             */
            if (s && this.isAddStockOpen) {
                this.closeAsidePane();
            }
        });

    }

    /**
     * Opens grouppane
     */
    public openGroupPane() {
        this.hideFirstStep = true;
        this.isAddStockOpen = false;
    }

    /**
     * Opens stockpane
     */
    public openStockPane() {
        this.hideFirstStep = true;
        this.isAddStockOpen = true;
    }

    /**
     * Closes asidepane
     */
    public closeAsidePane(e?: any) {
        this.hideFirstStep = false;
        this.isAddStockOpen = false;
        this.isAddGroupOpen = false;
        this.addGroup = false;
        this.addStock = false;
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
