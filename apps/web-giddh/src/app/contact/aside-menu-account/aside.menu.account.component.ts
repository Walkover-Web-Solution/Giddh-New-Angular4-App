import { Observable, ReplaySubject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';
import { Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { AppState } from '../../store';
import { AccountRequestV2, AccountResponseV2 } from '../../models/api-models/Account';
import { AccountsAction } from '../../actions/accounts.actions';
import { IOption } from '../../theme/ng-select/option.interface';
import { GroupResponse } from '../../models/api-models/Group';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { GroupWithAccountsAction } from '../../actions/groupwithaccounts.actions';
import { AccountAddNewDetailsComponent } from '../../shared/header/components';

@Component({
    selector: 'aside-menu-account',
    styleUrls: ['aside.menu.account.component.scss'],
    templateUrl: './aside.menu.account.component.html'
})
export class AsideMenuAccountInContactComponent implements OnInit, OnDestroy {

    @Input() public activeGroupUniqueName: string;
    @Input() public isUpdateAccount: boolean;
    @Input() public activeAccountDetails: any;

    @Output() public closeAsideEvent: EventEmitter<boolean> = new EventEmitter(true);
    @Output() public getUpdateList: EventEmitter<string> = new EventEmitter();
    @ViewChild('deleteAccountModal', {static: true}) public deleteAccountModal: ModalDirective;
    @ViewChild('addAccountNewComponent', {static: true}) public addAccountNewComponent: AccountAddNewDetailsComponent;

    public flatGroupsOptions: IOption[];
    public isGstEnabledAcc: boolean = true; // true only for groups will not under other
    public isHsnSacEnabledAcc: boolean = false; // true only for groups under revenuefromoperations || otherincome || operatingcost || indirectexpenses
    public fetchingAccUniqueName$: Observable<boolean>;
    public isAccountNameAvailable$: Observable<boolean>;
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

    // private below
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

    constructor(
        private store: Store<AppState>,
        private accountsAction: AccountsAction,
        private _groupWithAccountsAction: GroupWithAccountsAction,
    ) {
        // account-add component's property
        this.fetchingAccUniqueName$ = this.store.pipe(select(state => state.groupwithaccounts.fetchingAccUniqueName), takeUntil(this.destroyed$));
        this.isAccountNameAvailable$ = this.store.pipe(select(state => state.groupwithaccounts.isAccountNameAvailable), takeUntil(this.destroyed$));
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
            this.store.dispatch(this._groupWithAccountsAction.getGroupWithAccounts(this.activeAccountDetails.name));
            this.store.dispatch(this.accountsAction.getAccountDetails(this.activeAccountDetails.uniqueName));
        }

        // loop over flatten accounts and check if given account is under sundrycreditors group
        this.store.pipe(select(p => p.general.flattenAccounts), take(1)).subscribe(flattenAccounts => {

            if (flattenAccounts && flattenAccounts.length) {
                // get account from flatten accounts array
                let accountFromFlattenAcc = flattenAccounts.find(fAcc => fAcc.uniqueName === this.accountDetails.uniqueName);
                if (accountFromFlattenAcc) {
                    // if yes set showBankDetail = true for showing adding bank details in account-update form.
                    this.showBankDetail = accountFromFlattenAcc.parentGroups.some(group => group.uniqueName === 'sundrycreditors');
                }
            } else {
                this.showBankDetail = false;
            }
        });

        // this.showBankDetail = this.activeGroupUniqueName === 'sundrycreditors';
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
        this.deleteAccountModal.show();
    }

    public hideDeleteAccountModal() {
        this.deleteAccountModal.hide();
    }

    public deleteAccount() {
        let activeGrpName = this.activeGroupUniqueName;

        this.store.dispatch(this.accountsAction.deleteAccount(this.activeAccountDetails.uniqueName, activeGrpName));
        this.hideDeleteAccountModal();
        // this.getUpdateList.emit(activeGrpName);

    }

    public updateAccount(accRequestObject: { value: { groupUniqueName: string, accountUniqueName: string }, accountRequest: AccountRequestV2 }) {
        this.store.dispatch(this.accountsAction.updateAccountV2(accRequestObject.value, accRequestObject.accountRequest));
        this.hideDeleteAccountModal();
        this.getUpdateList.emit(this.activeGroupUniqueName);
    }

    public makeGroupListFlatwithLessDtl(rawList: any) {
        let obj;
        obj = _.map(rawList, (item: any) => {
            obj = {};
            obj.name = item.name;
            obj.uniqueName = item.uniqueName;
            obj.synonyms = item.synonyms;
            obj.parentGroups = item.parentGroups;
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
                name: listItem.name,
                uniqueName: listItem.uniqueName
            });
            listItem = Object.assign({}, listItem, {parentGroups: []});
            if(listItem) {
                listItem.parentGroups = newParents;
            }
            if (listItem.groups.length > 0) {
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
}
