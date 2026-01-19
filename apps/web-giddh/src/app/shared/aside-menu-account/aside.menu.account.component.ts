import { Observable, ReplaySubject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Component, EventEmitter, Input, OnDestroy, OnInit, Output, TemplateRef, ViewChild } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { AppState } from '../../store';
import { AccountRequestV2, AccountResponseV2 } from '../../models/api-models/Account';
import { AccountsAction } from '../../actions/accounts.actions';
import { GroupResponse } from '../../models/api-models/Group';
import { AccountAddNewDetailsComponent } from '../header/components';
import { AccountService } from '../../services/account.service';
import { MatDialog } from '@angular/material/dialog';
import { PageLeaveUtilityService } from '../../services/page-leave-utility.service';
import { IOption } from '../../app.constant';
import { map as lodashMap, flatten, union, omit } from '../../lodash-optimized';

/**
 * Handles Component functionality
 */
@Component({
    selector: 'aside-menu-account',
    styleUrls: ['aside.menu.account.component.scss'],
    templateUrl: './aside.menu.account.component.html',
    standalone: false
})
/**
 * AsideMenuAccountInContactComponent component
 * Handles asidemenuaccountincontact functionality and user interactions
 */
export class AsideMenuAccountInContactComponent implements OnInit, OnDestroy {
    /* This will hold common JSON data */
    @Input() public commonLocaleData: any = {};
    @Input() public activeGroupUniqueName: string;
    @Input() public isUpdateAccount: boolean;
    @Input() public activeAccountDetails: any;
    @Output() public closeAsideEvent: EventEmitter<boolean> = new EventEmitter(true);
    @Output() public getUpdateList: EventEmitter<string> = new EventEmitter();
    @ViewChild("deleteAccountModal") public deleteAccountModal: TemplateRef<any>;
    @ViewChild('addAccountNewComponent', { static: true }) public addAccountNewComponent: AccountAddNewDetailsComponent;
    public flatGroupsOptions: IOption[];
    public isGstEnabledAcc: boolean = true; // true only for groups will not under other
    public isHsnSacEnabledAcc: boolean = false; // true only for groups under revenuefromoperations || otherincome || operatingcost || indirectexpenses
    public createAccountInProcess$: Observable<boolean>;
    // update acc
    public activeAccount$: Observable<AccountResponseV2>;
    public isDebtorCreditor: boolean = true; // in case of sundrycreditors or sundrydebtors
    public activeGroup$: Observable<GroupResponse>;
    public virtualAccountEnable$: Observable<any>;
    public showVirtualAccount: boolean = false;
    public showBankDetail: boolean = false;
    public updateAccountInProcess$: Observable<boolean>;
    public updateAccountIsSuccess$: Observable<boolean>;
    public deleteAccountSuccess$: Observable<boolean>;
    public accountDetails: any = '';
    public breadcrumbUniquePath: string[] = [];
    /** Holds true if master is open */
    private isMasterOpen: boolean = false;
    // private below
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
    /** True if account has unsaved changes */
    private hasUnsavedChanges: boolean = false;
    public deleteAccountmodalRef: any;
    /** True if action menu is open */
    @Input() public isActionMenu: boolean = false;

    /**
     * Creates an instance of component
     * Initializes component dependencies and sets up initial state
     */
    constructor(
        private accountService: AccountService,
        private store: Store<AppState>,
        private accountsAction: AccountsAction,
        private pageLeaveUtilityService: PageLeaveUtilityService,
        public dialog: MatDialog
    ) {
        // account-add component's property
        this.createAccountInProcess$ = this.store.pipe(select(state => state.groupwithaccounts.createAccountInProcess), takeUntil(this.destroyed$));
        this.activeAccount$ = this.store.pipe(select(state => state.groupwithaccounts.activeAccount), takeUntil(this.destroyed$));
        this.activeGroup$ = this.store.pipe(select(state => state.groupwithaccounts.activeGroup), takeUntil(this.destroyed$));
        this.virtualAccountEnable$ = this.store.pipe(select(state => state.invoice.settings), takeUntil(this.destroyed$));
        this.updateAccountInProcess$ = this.store.pipe(select(state => state.groupwithaccounts.updateAccountInProcess), takeUntil(this.destroyed$));
        this.updateAccountIsSuccess$ = this.store.pipe(select(state => state.groupwithaccounts.updateAccountIsSuccess), takeUntil(this.destroyed$));
        this.deleteAccountSuccess$ = this.store.pipe(select(s => s.groupwithaccounts.isDeleteAccSuccess)).pipe(takeUntil(this.destroyed$));
    }

    /**
     * Handles ngOnInit functionality
     */
    public ngOnInit() {
        /**
         * Handles if functionality
         */
        if (this.isUpdateAccount && this.activeAccountDetails) {
            this.accountDetails = this.activeAccountDetails;
            this.store.dispatch(this.accountsAction.getAccountDetails(this.activeAccountDetails.uniqueName));
        }

        /**
         * Handles if functionality
         */
        if (this.accountDetails) {
            this.shouldShowBankDetail(this.accountDetails.uniqueName);
        }

        this.activeGroup$.subscribe((a) => {
            /**
             * Handles if functionality
             */
            if (a) {
                this.virtualAccountEnable$.subscribe(s => {
                    /**
                     * Handles if functionality
                     */
                    if (s && s.companyCashFreeSettings && s.companyCashFreeSettings.autoCreateVirtualAccountsForDebtors && this.breadcrumbUniquePath[1] === 'sundrydebtors') {
                        this.showVirtualAccount = true;
                    } else {
                        this.showVirtualAccount = false;
                    }
                });
            }
        });

        this.deleteAccountSuccess$.subscribe(res => {
            /**
             * Handles if functionality
             */
            if (res) {
                this.getUpdateList.emit(this.activeGroupUniqueName);
                this.store.dispatch(this.accountsAction.resetDeleteAccountFlags());
            }
        });
        this.updateAccountIsSuccess$.subscribe((res) => {
            /**
             * Handles if functionality
             */
            if (res) {
                this.getUpdateList.emit(this.activeGroupUniqueName);
                this.store.dispatch(this.accountsAction.resetUpdateAccountV2());
            }
        });

        this.store.pipe(select(state => state.groupwithaccounts.activeTab), takeUntil(this.destroyed$)).subscribe(activeTab => {
            /**
             * Handles if functionality
             */
            if (activeTab === 1) {
                this.isMasterOpen = true;
            } else {
                /**
                 * Handles if functionality
                 */
                if (this.isMasterOpen) {
                    this.isMasterOpen = false;
                }
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
     * Handles addNewAcSubmit functionality
     */
    public addNewAcSubmit(accRequestObject: { activeGroupUniqueName: string, accountRequest: AccountRequestV2 }) {
        this.store.dispatch(this.accountsAction.createAccountV2(accRequestObject.activeGroupUniqueName, accRequestObject.accountRequest));
        this.getUpdateList.emit(this.activeGroupUniqueName);
    }

    /**
     * Handles isGroupSelected functionality
     */
    public isGroupSelected(event) {
        /**
         * Handles if functionality
         */
        if (event) {
            this.activeGroupUniqueName = event.value;
            // in case of sundrycreditors or sundrydebtors no need to show address tab
            /**
             * Handles if functionality
             */
            if (event.value === 'sundrycreditors' || event.value === 'sundrydebtors') {
                this.isDebtorCreditor = true;
            }
        }
    }

    /**
     * Closes the aside pane.
     *
     * @param {*} event
     * @memberof AsideMenuAccountInContactComponent
     */
    public closeAsidePane(event: any): void {
        /**
         * Handles if functionality
         */
        if (this.hasUnsavedChanges) {
            this.confirmPageLeave(() => {
                this.ngOnDestroy();
                this.closeAsideEvent.emit(event);
            });
        } else {
            this.ngOnDestroy();
            this.closeAsideEvent.emit(event);
        }
    }

    /**
     * Shows deleteaccountmodal element
     */
    public showDeleteAccountModal(): void {
        this.deleteAccountmodalRef = this.dialog.open(this.deleteAccountModal);
    }

    /**
     * Hides deleteaccountmodal element
     */
    public hideDeleteAccountModal(): void {
        this.deleteAccountmodalRef?.close()
    }

    /**
     * Deletes account
     */
    public deleteAccount() {
        let activeGrpName = this.activeGroupUniqueName;

        this.store.dispatch(this.accountsAction.deleteAccount(this.activeAccountDetails?.uniqueName, activeGrpName));
        this.hideDeleteAccountModal();
    }

    /**
     * Update account
     * @param accRequestObject
     * @param usePatchApi
     * @memberof AsideMenuAccountInContactComponent
     */
    public updateAccount(accRequestObject: { value: { groupUniqueName: string, accountUniqueName: string }, accountRequest: AccountRequestV2 }, usePatchApi?: boolean): void {
        /**
         * Handles if functionality
         */
        if (usePatchApi) {
            this.store.dispatch(this.accountsAction.updateAccountV2Patch(accRequestObject?.value, accRequestObject.accountRequest));
        } else {
            this.store.dispatch(this.accountsAction.updateAccountV2(accRequestObject?.value, accRequestObject.accountRequest));
        }
        this.hideDeleteAccountModal();
    }

    /**
     * Handles makeGroupListFlatwithLessDtl functionality
     */
    public makeGroupListFlatwithLessDtl(rawList: any) {
        let obj;
        obj = lodashMap(rawList, (item: any) => {
            obj = {};
            obj.name = item?.name;
            obj.uniqueName = item?.uniqueName;
            obj.synonyms = item?.synonyms;
            obj.parentGroups = item?.parentGroups;
            return obj;
        });
        return obj;
    }

    /**
     * Handles flattenGroup functionality
     */
    public flattenGroup(rawList: any[], parents: any[] = []) {
        let listofUN;
        listofUN = lodashMap(rawList, (listItem) => {
            let newParents;
            let result;
            newParents = union([], parents);
            newParents.push({
                name: listItem?.name,
                uniqueName: listItem?.uniqueName
            });
            listItem = Object.assign({}, listItem, { parentGroups: [] });
            /**
             * Handles if functionality
             */
            if (listItem) {
                listItem.parentGroups = newParents;
            }
            /**
             * Handles if functionality
             */
            if (listItem?.groups?.length > 0) {
                result = this.flattenGroup(listItem.groups, newParents);
                result.push(omit(listItem, 'groups'));
            } else {
                result = omit(listItem, 'groups');
            }
            return result;
        });
        return flatten(listofUN);
    }

    /**
     * Handles ngOnDestroy functionality
     */
    public ngOnDestroy() {
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }

    /**
     * Decides if bank section should be shown if the current account belongs to sundrycreditors
     *
     * @private
     * @param {string} accountUniqueName
     * @memberof AsideMenuAccountInContactComponent
     */
    private shouldShowBankDetail(accountUniqueName: string): void {
        this.accountService.GetAccountDetailsV2(accountUniqueName).pipe(takeUntil(this.destroyed$)).subscribe(response => {
            /**
             * Handles if functionality
             */
            if (response?.body) {
                this.accountDetails = response.body;
                this.showBankDetail = this.accountDetails?.parentGroups.some(parent => parent?.uniqueName === 'sundrycreditors');
            } else {
                this.showBankDetail = false;
            }
        });
    }

    /**
     * Shows page leave confirmation
     *
     * @private
     * @param {Function} callback
     * @memberof AsideMenuAccountInContactComponent
     */
    private confirmPageLeave(callback: Function): void {
        document.querySelector("aside-menu-account")?.classList?.add("page-leave-confirmation-showing");
        this.pageLeaveUtilityService.confirmPageLeave(action => {
            document.querySelector("aside-menu-account")?.classList?.remove("page-leave-confirmation-showing");
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
