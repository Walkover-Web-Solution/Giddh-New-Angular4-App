import { Observable, of, ReplaySubject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { AppState } from '../../store';
import { AddAccountRequest, UpdateAccountRequest } from '../../models/api-models/Account';
import { AccountsAction } from '../../actions/accounts.actions';
import { IOption } from '../../theme/ng-select/option.interface';
import { PageLeaveUtilityService } from '../../services/page-leave-utility.service';

@Component({
    selector: 'generic-aside-menu-account',
    styleUrls: [`./generic.aside.menu.account.component.scss`],
    templateUrl: './generic.aside.menu.account.component.html'
})
export class GenericAsideMenuAccountComponent implements OnInit, OnDestroy, OnChanges {
    @Input() public selectedGrpUniqueName: string;
    /** This will hold group unique name */
    @Input() public selectedGroupUniqueName: string;
    @Input() public selectedAccountUniqueName: string;
    /** True if creating account from cmd+k */
    @Input() public createAccountFromCommandK: boolean;
    @Output() public closeAsideEvent: EventEmitter<boolean> = new EventEmitter(true);
    @Output() public addEvent: EventEmitter<AddAccountRequest> = new EventEmitter();
    @Output() public updateEvent: EventEmitter<UpdateAccountRequest> = new EventEmitter();
    /** Emiting true if account modal needs to be closed */
    @Output() public closeAccountModal: EventEmitter<boolean> = new EventEmitter(false);
    public flatAccountWGroupsList$: Observable<IOption[]>;
    public flatAccountWGroupsList: IOption[];
    public activeGroupUniqueName: string;
    public isGstEnabledAcc: boolean = true;
    public isHsnSacEnabledAcc: boolean = false;
    public createAccountInProcess$: Observable<boolean>;
    public updateAccountInProcess$: Observable<boolean>;
    public showBankDetail: boolean = false;
    /** this will hold if it's debtor/creditor */
    @Input() public isDebtorCreditor: boolean = true;
    /** this will hold if it's bank account */
    @Input() public isBankAccount: boolean = true;
    @Input() public includeSearchedGroup: boolean = false;
    /** True, if new service is created through this component.
     * Used to differentiate between new customer/vendor creation and service creation
     * as they both need the groups to be shown in a particular category,
     * for eg. If a new customer/vendor is created in Sales invoice then all the groups shown in the dropdown
     * should be of category 'sundrydebtors'. Similarly, for PO/PB the group category should be
     * 'sundrycreditors'.
     * If a new service is created, then if the service is created in Invoice then it will have
     * categroy 'revenuefromoperations' and if it is in PO/PB then category will be 'operatingcost'.
     * So if isServiceCreation is true, then directly 'activeGroupUniqueName' will be
     * used to fetch groups
    */
    @Input() public isServiceCreation: boolean;
    /** True, if new customer/vendor account is created through this component.
     * Used to differentiate between new customer/vendor creation and service creation
     * as they both need the groups to be shown in a particular category,
     * for eg. If a new customer/vendor is created in Sales invoice then all the groups shown in the dropdown
     * should be of category 'sundrydebtors'. Similarly, for PO/PB the group category should be
     * 'sundrycreditors'.
     * If a new service is created, then if the service is created in Invoice then it will have
     * categroy 'revenuefromoperations' and if it is in PO/PB then category will be 'operatingcost'.
     * So if isCustomerCreation is true, then directly 'activeGroupUniqueName' will be
     * used to fetch groups
    */
    @Input() public isCustomerCreation: boolean;
    /** True if creating account from cmd+k */
    @Input() public allGroups: boolean;
    // private below
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
    /* This will hold common JSON data */
    public commonLocaleData: any = {};
    /** This will hold account action text */
    public actionAccount: string = "";
    /** Holds true if master is open */
    private isMasterOpen: boolean = false;
    /** True if account has unsaved changes */
    private hasUnsavedChanges: boolean = false;


    constructor(
        private store: Store<AppState>,
        private accountsAction: AccountsAction,
        private pageLeaveUtilityService: PageLeaveUtilityService
    ) {
        // account-add component's property
        this.createAccountInProcess$ = this.store.pipe(select(state => state.sales.createAccountInProcess), takeUntil(this.destroyed$));
        this.updateAccountInProcess$ = this.store.pipe(select(state => state.sales.updateAccountInProcess), takeUntil(this.destroyed$));
    }

    public ngOnInit() {
        if (this.allGroups) {
            this.activeGroupUniqueName = "";
            this.isCustomerCreation = undefined;
        }
        this.showBankDetail = this.activeGroupUniqueName === 'sundrycreditors';

        this.store.pipe(select(state => state.groupwithaccounts.activeTab), takeUntil(this.destroyed$)).subscribe(activeTab => {
            if (activeTab === 1) {
                this.isMasterOpen = true;
            } else {
                if (this.isMasterOpen) {
                    this.isMasterOpen = false;
                }
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

    public addNewAcSubmit(accRequestObject: AddAccountRequest) {
        this.store.dispatch(this.accountsAction.resetActiveGroup());
        this.addEvent.emit(accRequestObject);
    }

    public updateAccount(accRequestObject: UpdateAccountRequest) {
        this.updateEvent.emit(accRequestObject);
    }

    public closeAsidePane(event) {
        if (event) {
            if (this.hasUnsavedChanges) {
                this.confirmPageLeave(() => {
                    this.store.dispatch(this.accountsAction.resetActiveGroup());
                    this.closeAsideEvent.emit(event);
                });
            } else {
                this.store.dispatch(this.accountsAction.resetActiveGroup());
                this.closeAsideEvent.emit(event);
            }
        }
    }

    public isGroupSelected(event) {
        if (event) {
            this.activeGroupUniqueName = event.value;
        }
    }

    public ngOnChanges(s: SimpleChanges) {

        if ('selectedGrpUniqueName' in s && s.selectedGrpUniqueName.currentValue !== s.selectedGrpUniqueName.previousValue) {
            this.isCustomerCreation = true;
            this.activeGroupUniqueName = s.selectedGrpUniqueName.currentValue;
            this.flatAccountWGroupsList$ = of(null);
            this.flatAccountWGroupsList = undefined;
        }

        if ('selectedGroupUniqueName' in s && s.selectedGroupUniqueName.currentValue !== s.selectedGroupUniqueName.previousValue) {
            // get groups list
            this.isServiceCreation = true;
            this.flatAccountWGroupsList$ = of(null);
            this.flatAccountWGroupsList = undefined;
            if (this.selectedGroupUniqueName === 'purchase') {
                this.activeGroupUniqueName = 'operatingcost';
            } else if (this.selectedGroupUniqueName === 'receipt' || this.selectedGroupUniqueName === 'payment') {
                this.activeGroupUniqueName = 'bankaccounts,cash,loanandoverdraft';
            } else {
                this.activeGroupUniqueName = 'revenuefromoperations';
            }
        }

        if ('selectedAccountUniqueName' in s) {
            let value = s.selectedAccountUniqueName;
            if (value.currentValue && value.currentValue !== value.previousValue) {
                this.store.dispatch(this.accountsAction.resetActiveAccount());
                this.store.dispatch(this.accountsAction.getAccountDetails(s.selectedAccountUniqueName.currentValue));
            }
        }
    }

    public ngOnDestroy() {
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }

    /**
     * Callback for translation response complete
     *
     * @param {*} event
     * @memberof GenericAsideMenuAccountComponent
     */
    public translationComplete(event: any): void {
        if (event) {
            this.actionAccount = this.selectedAccountUniqueName ? this.commonLocaleData?.app_update_account : this.commonLocaleData?.app_create_account;
        }
    }

    /**
     * Shows page leave confirmation
     *
     * @private
     * @param {Function} callback
     * @memberof GenericAsideMenuAccountComponent
     */
    private confirmPageLeave(callback: Function): void {
        document.querySelector("generic-aside-menu-account")?.classList?.add("page-leave-confirmation-showing");
        this.pageLeaveUtilityService.confirmPageLeave(action => {
            document.querySelector("generic-aside-menu-account")?.classList?.remove("page-leave-confirmation-showing");
            if (action) {
                this.store.dispatch(this.accountsAction.hasUnsavedChanges(false));
                callback();
            }
        });
    }
}
