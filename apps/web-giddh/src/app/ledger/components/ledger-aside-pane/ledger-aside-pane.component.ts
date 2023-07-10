import { takeUntil } from 'rxjs/operators';
import { ChangeDetectorRef, Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { AppState } from '../../../store';
import { Store, select } from '@ngrx/store';
import { SidebarAction } from '../../../actions/inventory/sidebar.actions';
import { Observable, ReplaySubject } from 'rxjs';
import { AccountsAction } from '../../../actions/accounts.actions';
import { GeneralService } from '../../../services/general.service';
import { PageLeaveUtilityService } from '../../../services/page-leave-utility.service';

@Component({
    selector: 'ledger-aside-pane',
    templateUrl: './ledger-aside-pane.component.html',
    styleUrls: ['./ledger-aside-pane.component.scss']
})

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
    public voucherApiVersion: 1 | 2;
    /** This will hold stock type */
    public stockType: string = '';
    /** True if account has unsaved changes */
    private hasUnsavedChanges: boolean = false;

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

    public ngOnInit() {
        document.querySelector('body').classList.add('ledger-aside-pane');
        this.voucherApiVersion = this.generalService.voucherApiVersion;
        this.store.dispatch(this.inventorySidebarAction.GetGroupsWithStocksHierarchyMin());
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

        this.store.pipe(select(state => state.groupwithaccounts.hasUnsavedChanges), takeUntil(this.destroyed$)).subscribe(response => {
            if (this.hasUnsavedChanges && !response) {
                this.pageLeaveUtilityService.removeBrowserConfirmationDialog();
            }

            this.hasUnsavedChanges = response;
            if (this.hasUnsavedChanges) {
                this.pageLeaveUtilityService.addBrowserConfirmationDialog();
            }
        });
    }

    public toggleStockPane(type?: string) {
        this.hideFirstScreen = true;
        this.isAddAccountOpen = false;
        this.stockType = type;
        this.isAddStockOpen = !this.isAddStockOpen;
    }

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
        if (!event) {
            this.closeAsideEvent.emit();
        }
        this.changeDetectionRef.detectChanges();
    }

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
            document.querySelector("ledger-aside-pane")?.classList?.add("page-leave-confirmation-showing");
            if (action) {
                this.store.dispatch(this.accountsAction.hasUnsavedChanges(false));
                callback();
            }
        });
    }
}
