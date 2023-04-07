import { Observable, ReplaySubject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { AppState } from '../../store';
import { AccountRequestV2, AccountResponseV2 } from '../../models/api-models/Account';
import { AccountsAction } from '../../actions/accounts.actions';
import { IOption } from '../../theme/ng-select/option.interface';
import { GroupResponse } from '../../models/api-models/Group';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { AccountAddNewDetailsComponent } from '../header/components';
import { AccountService } from '../../services/account.service';

@Component({
    selector: 'aside-menu-account',
    styleUrls: ['aside.menu.account.component.scss'],
    templateUrl: './aside.menu.account.component.html'
})
export class AsideMenuAccountInContactComponent implements OnInit, OnDestroy {
    /* This will hold common JSON data */
    @Input() public commonLocaleData: any = {};

    @Input() public activeGroupUniqueName: string;
    @Input() public isUpdateAccount: boolean;
    @Input() public activeAccountDetails: any;

    @Output() public closeAsideEvent: EventEmitter<boolean> = new EventEmitter(true);
    @Output() public getUpdateList: EventEmitter<string> = new EventEmitter();
    @ViewChild('deleteAccountModal', { static: true }) public deleteAccountModal: ModalDirective;
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

    constructor(
        private accountService: AccountService,
        private store: Store<AppState>,
        private accountsAction: AccountsAction
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

    public ngOnInit() {
        if (this.isUpdateAccount && this.activeAccountDetails) {
            this.accountDetails = this.activeAccountDetails;
            this.store.dispatch(this.accountsAction.getAccountDetails(this.activeAccountDetails.uniqueName));
        }

        if(this.accountDetails) {
            this.shouldShowBankDetail(this.accountDetails.uniqueName);
        }

        this.activeGroup$.subscribe((a) => {
            if (a) {
                this.virtualAccountEnable$.subscribe(s => {
                    if (s && s.companyCashFreeSettings && s.companyCashFreeSettings.autoCreateVirtualAccountsForDebtors && this.breadcrumbUniquePath[1] === 'sundrydebtors') {
                        this.showVirtualAccount = true;
                    } else {
                        this.showVirtualAccount = false;
                    }
                });
            }
        });

        this.deleteAccountSuccess$.subscribe(res => {
            if (res) {
                this.getUpdateList.emit(this.activeGroupUniqueName);
                this.store.dispatch(this.accountsAction.resetDeleteAccountFlags());
            }
        });
        this.updateAccountIsSuccess$.subscribe((res) => {
            if (res) {
                this.getUpdateList.emit(this.activeGroupUniqueName);
                this.store.dispatch(this.accountsAction.resetUpdateAccountV2());
            }
        });

        this.store.pipe(select(state => state.groupwithaccounts.activeTab), takeUntil(this.destroyed$)).subscribe(activeTab => {
            if(activeTab === 1) {
                this.isMasterOpen = true;
            } else {
                if(this.isMasterOpen) {
                    this.isMasterOpen = false;
                }
            }
        });
    }

    public addNewAcSubmit(accRequestObject: { activeGroupUniqueName: string, accountRequest: AccountRequestV2 }) {
        this.store.dispatch(this.accountsAction.createAccountV2(accRequestObject.activeGroupUniqueName, accRequestObject.accountRequest));
        this.getUpdateList.emit(this.activeGroupUniqueName);
    }

    public isGroupSelected(event) {
        if (event) {
            this.activeGroupUniqueName = event.value;
            // in case of sundrycreditors or sundrydebtors no need to show address tab
            if (event.value === 'sundrycreditors' || event.value === 'sundrydebtors') {
                this.isDebtorCreditor = true;
            }
        }
    }

    public closeAsidePane(event) {
        this.ngOnDestroy();
        this.closeAsideEvent.emit(event);
    }

    public showDeleteAccountModal() {
        this.deleteAccountModal?.show();
    }

    public hideDeleteAccountModal() {
        this.deleteAccountModal.hide();
    }

    public deleteAccount() {
        let activeGrpName = this.activeGroupUniqueName;

        this.store.dispatch(this.accountsAction.deleteAccount(this.activeAccountDetails?.uniqueName, activeGrpName));
        this.hideDeleteAccountModal();
    }

    public updateAccount(accRequestObject: { value: { groupUniqueName: string, accountUniqueName: string }, accountRequest: AccountRequestV2 }) {
        this.store.dispatch(this.accountsAction.updateAccountV2(accRequestObject?.value, accRequestObject.accountRequest));
        this.hideDeleteAccountModal();
    }

    public makeGroupListFlatwithLessDtl(rawList: any) {
        let obj;
        obj = _.map(rawList, (item: any) => {
            obj = {};
            obj.name = item?.name;
            obj.uniqueName = item?.uniqueName;
            obj.synonyms = item?.synonyms;
            obj.parentGroups = item?.parentGroups;
            return obj;
        });
        return obj;
    }

    public flattenGroup(rawList: any[], parents: any[] = []) {
        let listofUN;
        listofUN = _.map(rawList, (listItem) => {
            let newParents;
            let result;
            newParents = _.union([], parents);
            newParents.push({
                name: listItem?.name,
                uniqueName: listItem?.uniqueName
            });
            listItem = Object.assign({}, listItem, { parentGroups: [] });
            if (listItem) {
                listItem.parentGroups = newParents;
            }
            if (listItem?.groups?.length > 0) {
                result = this.flattenGroup(listItem.groups, newParents);
                result.push(_.omit(listItem, 'groups'));
            } else {
                result = _.omit(listItem, 'groups');
            }
            return result;
        });
        return _.flatten(listofUN);
    }

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
            if (response?.body) {
                const accountDetails = response.body;
                this.showBankDetail = accountDetails?.parentGroups.some(parent => parent?.uniqueName === 'sundrycreditors');
            } else {
                this.showBankDetail = false;
            }
        });
    }
}
