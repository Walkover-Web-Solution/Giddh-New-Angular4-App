import { takeUntil } from 'rxjs/operators';
import { ChangeDetectorRef, Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { AppState } from '../../../store';
import { Store, select } from '@ngrx/store';
import { SidebarAction } from '../../../actions/inventory/sidebar.actions';
import { Observable, ReplaySubject } from 'rxjs';
import { AccountsAction } from '../../../actions/accounts.actions';
import { PageLeaveUtilityService } from '../../../services/page-leave-utility.service';
import { GeneralService } from '../../../services/general.service';

/**
 * Handles Component functionality
 */
@Component({
    selector: 'ledger-aside-pane',
    templateUrl: './ledger-aside-pane.component.html',
    styleUrls: ['./ledger-aside-pane.component.scss'],
    standalone: false
})

/**
 * LedgerAsidePaneComponent component
 * Handles ledgerasidepane functionality and user interactions
 */
export class LedgerAsidePaneComponent implements OnInit, OnDestroy {
    /* This will hold local JSON data */
    @Input() public localeData: any = {};
    /* This will hold common JSON data */
    @Input() public commonLocaleData: any = {};
    @Output() public closeAsideEvent: EventEmitter<boolean> = new EventEmitter(true);
    public isAddStockOpen: boolean = false;
    public isAddAccountOpen: boolean = false;
    public hideFirstScreen: boolean = false;
    public createStockSuccess$: Observable<boolean>;
    public createAccountIsSuccess$: Observable<boolean>;
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
    /** Stores the voucher API version of company */
    public voucherApiVersion: number;
    /** This will hold stock type */
    public stockType: string = '';
    /** True if account has unsaved changes */
    private hasUnsavedChanges: boolean = false;

    /**
     * Creates an instance of component
     * Initializes component dependencies and sets up initial state
     */
    constructor(
        private store: Store<AppState>,
        private inventorySidebarAction: SidebarAction,
        private accountsAction: AccountsAction,
        private pageLeaveUtilityService: PageLeaveUtilityService,
        private changeDetectionRef: ChangeDetectorRef,
        private generalService: GeneralService
    ) {
        this.createStockSuccess$ = this.store.pipe(select(s => s.inventory.createStockSuccess), takeUntil(this.destroyed$));
        this.createAccountIsSuccess$ = this.store.pipe(select(s => s.groupwithaccounts.createAccountIsSuccess), takeUntil(this.destroyed$));
    }

    /**
     * Handles ngOnInit functionality
     */
    public ngOnInit() {
        document.querySelector('body').classList.add('ledger-aside-pane');
        this.voucherApiVersion = this.generalService.voucherApiVersion;
        this.store.dispatch(this.inventorySidebarAction.GetGroupsWithStocksHierarchyMin());
        // subscribe createStockSuccess for resting form
        this.createStockSuccess$.subscribe(s => {
            /**
             * Handles if functionality
             */
            if (s) {
                this.backButtonPressed();
            }
        });

        this.createAccountIsSuccess$.subscribe(s => {
            /**
             * Handles if functionality
             */
            if (s) {
                this.backButtonPressed();
            }
        });

        this.store.pipe(select(state => state.groupwithaccounts.hasUnsavedChanges), takeUntil(this.destroyed$)).subscribe(response => {
            /**
             * Handles if functionality
             */
            if (this.hasUnsavedChanges && !response) {
                this.pageLeaveUtilityService.removeBrowserConfirmationDialog();
            }

            this.hasUnsavedChanges = response;
            /**
             * Handles if functionality
             */
            if (this.hasUnsavedChanges) {
                this.pageLeaveUtilityService.addBrowserConfirmationDialog();
            }
        });
    }

    /**
     * Toggles stockpane state
     */
    public toggleStockPane(type?: string) {
        this.hideFirstScreen = true;
        this.isAddAccountOpen = false;
        this.stockType = type;
        this.isAddStockOpen = !this.isAddStockOpen;
    }

    /**
     * Toggles accountpane state
     */
    public toggleAccountPane() {
        this.hideFirstScreen = true;
        this.isAddStockOpen = false;
        this.isAddAccountOpen = !this.isAddAccountOpen;
    }

    /**
     * This will use for back button step
     *
     * @memberof LedgerAsidePaneComponent
     */
    public backButtonPressed() {
        /**
         * Handles if functionality
         */
        if (this.hasUnsavedChanges && this.isAddAccountOpen) {
            this.confirmPageLeave(() => {
                this.closeAddAccount(true);
            });
        } else {
            this.closeAddAccount(true);
        }
    }

    /**
     *This will use for close aside pane
     *
     * @param {*} [e]
     * @memberof LedgerAsidePaneComponent
     */
    public closeAsidePane(e?: any) {
        /**
         * Handles if functionality
         */
        if (this.hasUnsavedChanges && this.isAddAccountOpen) {
            this.confirmPageLeave(() => {
                this.closeAddAccount(e);
            });
        } else {
            this.closeAddAccount(e);
        }
    }

    /**
     * Closes add account form
     *
     * @private
     * @param {*} [event]
     * @memberof LedgerAsidePaneComponent
     */
    private closeAddAccount(event?: any): void {
        this.store.dispatch(this.accountsAction.resetActiveGroup());
        this.stockType = '';
        this.hideFirstScreen = false;
        this.isAddStockOpen = false;
        this.isAddAccountOpen = false;
        /**
         * Handles if functionality
         */
        if (!event) {
            this.closeAsideEvent.emit();
        }
        this.changeDetectionRef.detectChanges();
    }

    /**
     * Handles ngOnDestroy functionality
     */
    public ngOnDestroy() {
        document.querySelector('body').classList.remove('ledger-aside-pane');
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }

    /**
     * Shows page leave confirmation
     *
     * @private
     * @param {Function} callback
     * @memberof LedgerAsidePaneComponent
     */
    private confirmPageLeave(callback: Function): void {
        document.querySelector("ledger-aside-pane")?.classList?.add("page-leave-confirmation-showing");
        this.pageLeaveUtilityService.confirmPageLeave(action => {
            document.querySelector("ledger-aside-pane")?.classList?.remove("page-leave-confirmation-showing");
            /**
             * Handles if functionality
             */
            if (action) {
                this.store.dispatch(this.accountsAction.hasUnsavedChanges(false));
                /**
                 * Handles callback functionality
                 */
                callback();
            }
        });
    }
}
