import { Observable, of as observableOf, ReplaySubject } from 'rxjs';

import { take, takeUntil } from 'rxjs/operators';
import { ShareGroupModalComponent } from './../share-group-modal/share-group-modal.component';
import { ShareAccountModalComponent } from './../share-account-modal/share-account-modal.component';
import { PermissionDataService } from 'apps/web-giddh/src/app/permissions/permission-data.service';
import { ShareRequestForm } from './../../../../models/api-models/Permission';
import { LedgerActions } from '../../../../actions/ledger/ledger.actions';
import { AccountsAction } from '../../../../actions/accounts.actions';
import { CompanyResponse, TaxResponse } from '../../../../models/api-models/Company';
import { CompanyActions } from '../../../../actions/company.actions';
import { GroupsWithAccountsResponse } from '../../../../models/api-models/GroupsWithAccounts';
import { GroupWithAccountsAction } from '../../../../actions/groupwithaccounts.actions';
import { GroupResponse, GroupsTaxHierarchyResponse } from '../../../../models/api-models/Group';
import { IGroupsWithAccounts } from '../../../../models/interfaces/groupsWithAccounts.interface';
import { AppState } from '../../../../store';
import { Store, select } from '@ngrx/store';
import { AfterViewInit, Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as _ from '../../../../lodash-optimized';
import { ApplyTaxRequest } from '../../../../models/api-models/ApplyTax';
import { AccountMergeRequest, AccountMoveRequest, AccountRequestV2, AccountResponseV2, AccountsTaxHierarchyResponse, AccountUnMergeRequest, ShareAccountRequest } from '../../../../models/api-models/Account';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { GroupAccountSidebarVM } from '../new-group-account-sidebar/VM';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';
import { IAccountsInfo } from '../../../../models/interfaces/accountInfo.interface';
import { ToasterService } from '../../../../services/toaster.service';
import { AccountService } from '../../../../services/account.service';
import { IOption } from '../../../../theme/ng-virtual-select/sh-options.interface';
import { createSelector } from 'reselect';
import { DaybookQueryRequest } from '../../../../models/api-models/DaybookRequest';
import { InvoiceActions } from '../../../../actions/invoice/invoice.actions';
import { ApplyDiscountRequest } from '../../../../models/api-models/ApplyDiscount';
import { SettingsDiscountActions } from '../../../../actions/settings/discount/settings.discount.action';
import { IDiscountList } from '../../../../models/api-models/SettingsDiscount';
import { ShSelectComponent } from '../../../../theme/ng-virtual-select/sh-select.component';
import { DbService } from "../../../../services/db.service";
import { Router } from "@angular/router";

@Component({
    selector: 'account-operations',
    templateUrl: './account-operations.component.html',
    styleUrls: [`./account-operations.component.scss`]
})
export class AccountOperationsComponent implements OnInit, AfterViewInit, OnDestroy, OnChanges {
    public showAddNewAccount$: Observable<boolean>;
    public showAddNewGroup$: Observable<boolean>;
    public showEditAccount$: Observable<boolean>;
    public showEditGroup$: Observable<boolean>;
    @Output() public ShowForm: EventEmitter<boolean> = new EventEmitter(false);
    @Input() public columnsRef: GroupAccountSidebarVM;
    @Input() public height: number;
    public activeAccount$: Observable<AccountResponseV2>;
    public isTaxableAccount$: Observable<boolean>;
    public isDiscountableAccount$: Observable<boolean>;
    public activeAccountSharedWith$: Observable<ShareRequestForm[]>;
    public shareAccountForm: FormGroup;
    public moveAccountForm: FormGroup;
    public activeGroupSelected$: Observable<string[]>;
    public config: PerfectScrollbarConfigInterface = { suppressScrollX: true, suppressScrollY: false };
    @ViewChild('shareGroupModal', {static: true}) public shareGroupModal: ModalDirective;
    @ViewChild('shareAccountModal', {static: true}) public shareAccountModal: ModalDirective;
    @ViewChild('shareAccountModalComp', {static: true}) public shareAccountModalComp: ShareAccountModalComponent;
    @ViewChild('shareGroupModalComp', {static: true}) public shareGroupModalComp: ShareGroupModalComponent;
    @ViewChild('deleteMergedAccountModal', {static: true}) public deleteMergedAccountModal: ModalDirective;
    @ViewChild('moveMergedAccountModal', {static: true}) public moveMergedAccountModal: ModalDirective;
    @ViewChild('deleteAccountModal', {static: true}) public deleteAccountModal: ModalDirective;
    @ViewChild('groupExportLedgerModal', {static: true}) public groupExportLedgerModal: ModalDirective;
    @Input() public breadcrumbPath: string[] = [];
    @Input() public breadcrumbUniquePath: string[] = [];
    public activeGroupTaxHierarchy$: Observable<GroupsTaxHierarchyResponse>;
    public activeAccountTaxHierarchy$: Observable<AccountsTaxHierarchyResponse>;
    public selectedaccountForMerge: any = [];
    public selectedAccountForDelete: string;
    public selectedAccountForMove: string;
    public setAccountForMove: string;
    public deleteMergedAccountModalBody: string;
    public moveMergedAccountModalBody: string;

    // tslint:disable-next-line:no-empty
    public showNewForm$: Observable<boolean>;
    public groupDetailForm: FormGroup;
    public taxGroupForm: FormGroup;
    public discountAccountForm: FormGroup;
    public showGroupForm: boolean = false;
    public activeGroup$: Observable<GroupResponse>;
    public activeGroupUniqueName$: Observable<string>;
    public activeGroupInProgress$: Observable<boolean>;
    public activeGroupSharedWith$: Observable<ShareRequestForm[]>;
    public groupList$: Observable<GroupsWithAccountsResponse[]>;
    public isRootLevelGroup: boolean = false;
    public companyTaxes$: Observable<TaxResponse[]>;
    public companyTaxDropDown: Observable<IOption[]>;
    public companyDiscountDropDown: IOption[] = [];
    public groupsList: IOption[];
    public accounts$: Observable<IOption[]>;
    public groupExportLedgerQueryRequest: DaybookQueryRequest = new DaybookQueryRequest();
    public showTaxDropDown: boolean = false;

    public showAddAccountForm$: Observable<boolean>;
    public fetchingGrpUniqueName$: Observable<boolean>;
    public isGroupNameAvailable$: Observable<boolean>;
    public fetchingAccUniqueName$: Observable<boolean>;
    public isAccountNameAvailable$: Observable<boolean>;
    public createAccountInProcess$: Observable<boolean>;
    public createAccountIsSuccess$: Observable<boolean>;
    public updateAccountInProcess$: Observable<boolean>;
    public updateAccountIsSuccess$: Observable<boolean>;
    public discountList$: Observable<IDiscountList[]>;
    public taxPopOverTemplate: string = `
  <div class="popover-content">
  <label>Tax being inherited from:</label>
    <ul>
    <li>@inTax.name</li>
    </ul>
  </div>
  `;
    public moveAccountSuccess$: Observable<boolean>;
    public showDeleteMove: boolean = false;
    public isGstEnabledAcc: boolean = false;
    public isHsnSacEnabledAcc: boolean = false;
    public showTaxes: boolean = false;
    public showDiscount: boolean = false;
    public isUserSuperAdmin: boolean = false;
    public showGroupLedgerExportButton$: Observable<boolean>;
    public showBankDetail: boolean = false;
    public virtualAccountEnable$: Observable<any>;
    public showVirtualAccount: boolean = false;
    public flatGroupsOptions: IOption[];
    public isDebtorCreditor: boolean = false;
    public accountDetails: any = '';
    @ViewChild('discountShSelect', {static: true}) public discountShSelect: ShSelectComponent;
    public selectedCompany: Observable<CompanyResponse>;
    private groupsListBackUp: IOption[];
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

    dropdownList = [];
    selectedItems = [];
    dropdownSettings = {};
    settings = {};

    constructor(private _fb: FormBuilder, private store: Store<AppState>, private groupWithAccountsAction: GroupWithAccountsAction,
        private companyActions: CompanyActions, private _ledgerActions: LedgerActions, private accountsAction: AccountsAction, private _toaster: ToasterService,
        private accountService: AccountService, _permissionDataService: PermissionDataService, private invoiceActions: InvoiceActions,
        private _settingsDiscountAction: SettingsDiscountActions) {
        this.isUserSuperAdmin = _permissionDataService.isUserSuperAdmin;
        this.showNewForm$ = this.store.pipe(select(state => state.groupwithaccounts.showAddNew), takeUntil(this.destroyed$));
        this.showAddNewAccount$ = this.store.pipe(select(state => state.groupwithaccounts.showAddNewAccount), takeUntil(this.destroyed$));
        this.showAddNewGroup$ = this.store.pipe(select(state => state.groupwithaccounts.showAddNewGroup), takeUntil(this.destroyed$));
        this.showEditAccount$ = this.store.pipe(select(state => state.groupwithaccounts.showEditAccount), takeUntil(this.destroyed$));
        this.showEditGroup$ = this.store.pipe(select(state => state.groupwithaccounts.showEditGroup), takeUntil(this.destroyed$));
        this.moveAccountSuccess$ = this.store.pipe(select(state => state.groupwithaccounts.moveAccountSuccess), takeUntil(this.destroyed$));

        this.activeGroup$ = this.store.pipe(select(state => state.groupwithaccounts.activeGroup), takeUntil(this.destroyed$));
        this.activeGroupUniqueName$ = this.store.pipe(select(state => state.groupwithaccounts.activeGroupUniqueName), takeUntil(this.destroyed$));
        this.activeAccount$ = this.store.pipe(select(state => state.groupwithaccounts.activeAccount), takeUntil(this.destroyed$));
        this.virtualAccountEnable$ = this.store.pipe(select(state => state.invoice.settings), takeUntil(this.destroyed$));
        this.discountList$ = this.store.pipe(select(s => s.settings.discount.discountList), takeUntil(this.destroyed$));

        // prepare drop down for taxes
        this.companyTaxDropDown = this.store.pipe(select(createSelector([
            (state: AppState) => state.groupwithaccounts.activeAccount,
            (state: AppState) => state.groupwithaccounts.activeAccountTaxHierarchy,
            (state: AppState) => state.company && state.company.taxes],
            (activeAccount, activeAccountTaxHierarchy, taxes) => {
                let arr: IOption[] = [];
                if (taxes) {
                    if (activeAccount) {
                        let applicableTaxes = activeAccount.applicableTaxes.map(p => p.uniqueName);

                        // set isGstEnabledAcc or not
                        if (activeAccount.parentGroups[0].uniqueName) {
                            let col = activeAccount.parentGroups[0].uniqueName;
                            this.isHsnSacEnabledAcc = col === 'revenuefromoperations' || col === 'otherincome' || col === 'operatingcost' || col === 'indirectexpenses';
                            this.isGstEnabledAcc = !this.isHsnSacEnabledAcc;
                        }

                        if (activeAccountTaxHierarchy) {

                            if (activeAccountTaxHierarchy.inheritedTaxes) {
                                let inheritedTaxes = _.flattenDeep(activeAccountTaxHierarchy.inheritedTaxes.map(p => p.applicableTaxes)).map((j: any) => j.uniqueName);
                                let allTaxes = applicableTaxes.filter(f => inheritedTaxes.indexOf(f) === -1);
                                // set value in tax group form
                                this.taxGroupForm.setValue({ taxes: allTaxes });
                            } else {
                                this.taxGroupForm.setValue({ taxes: applicableTaxes });
                            }
                            return _.differenceBy(taxes.map(p => {
                                return { label: p.name, value: p.uniqueName };
                            }), _.flattenDeep(activeAccountTaxHierarchy.inheritedTaxes.map(p => p.applicableTaxes)).map((p: any) => {
                                return { label: p.name, value: p.uniqueName };
                            }), 'value');

                        } else {
                            // set value in tax group form
                            this.taxGroupForm.setValue({ taxes: applicableTaxes });

                            return taxes.map(p => {
                                return { label: p.name, value: p.uniqueName };
                            });

                        }
                    }
                }
                return arr;
            })), takeUntil(this.destroyed$));
        this.activeGroupInProgress$ = this.store.pipe(select(state => state.groupwithaccounts.activeGroupInProgress), takeUntil(this.destroyed$));
        this.activeGroupSharedWith$ = this.store.pipe(select(state => state.groupwithaccounts.activeGroupSharedWith), takeUntil(this.destroyed$));
        this.activeAccountSharedWith$ = this.store.pipe(select(state => state.groupwithaccounts.activeAccountSharedWith), takeUntil(this.destroyed$));
        this.groupList$ = this.store.pipe(select(state => state.general.groupswithaccounts), takeUntil(this.destroyed$));
        this.activeGroupTaxHierarchy$ = this.store.pipe(select(state => state.groupwithaccounts.activeGroupTaxHierarchy), takeUntil(this.destroyed$));
        this.activeAccountTaxHierarchy$ = this.store.pipe(select(state => state.groupwithaccounts.activeAccountTaxHierarchy), takeUntil(this.destroyed$));
        this.companyTaxes$ = this.store.pipe(select(state => state.company && state.company.taxes), takeUntil(this.destroyed$));
        this.showAddAccountForm$ = this.store.pipe(select(state => state.groupwithaccounts.addAccountOpen), takeUntil(this.destroyed$));
        this.fetchingGrpUniqueName$ = this.store.pipe(select(state => state.groupwithaccounts.fetchingGrpUniqueName), takeUntil(this.destroyed$));
        this.isGroupNameAvailable$ = this.store.pipe(select(state => state.groupwithaccounts.isGroupNameAvailable), takeUntil(this.destroyed$));

        // account-add component's property
        this.fetchingAccUniqueName$ = this.store.pipe(select(state => state.groupwithaccounts.fetchingAccUniqueName), takeUntil(this.destroyed$));
        this.isAccountNameAvailable$ = this.store.pipe(select(state => state.groupwithaccounts.isAccountNameAvailable), takeUntil(this.destroyed$));
        this.createAccountInProcess$ = this.store.pipe(select(state => state.groupwithaccounts.createAccountInProcess), takeUntil(this.destroyed$));
        this.createAccountIsSuccess$ = this.store.pipe(select(state => state.groupwithaccounts.createAccountIsSuccess), takeUntil(this.destroyed$));
        this.updateAccountInProcess$ = this.store.pipe(select(state => state.groupwithaccounts.updateAccountInProcess), takeUntil(this.destroyed$));
        this.updateAccountIsSuccess$ = this.store.pipe(select(state => state.groupwithaccounts.updateAccountIsSuccess), takeUntil(this.destroyed$));
        this.store.dispatch(this.invoiceActions.getInvoiceSetting());
        this.store.dispatch(this._settingsDiscountAction.GetDiscount());
    }

    public ngOnInit() {
        this.selectedItems = [];
        this.settings = {
            singleSelection: false,
            text: "Select Fields",
            selectAllText: 'Select All',
            unSelectAllText: 'UnSelect All',
            searchPlaceholderText: 'Search Fields',
            enableSearchFilter: true,
            badgeShowLimit: 5,
            groupBy: "category",
            enableCheckAll: false,
            showCheckbox: false,
            enableFilterSelectAll: false
        };

        this.activeAccount$.subscribe(a => {
            if (a && a.parentGroups[0].uniqueName) {
                let col = a.parentGroups[0].uniqueName;
                this.isHsnSacEnabledAcc = col === 'revenuefromoperations' || col === 'otherincome' || col === 'operatingcost' || col === 'indirectexpenses';
                this.isGstEnabledAcc = !this.isHsnSacEnabledAcc;
            }

            if (a && this.breadcrumbUniquePath[1]) {
                this.isDiscountableAccount$ = observableOf(this.breadcrumbUniquePath[1] === 'sundrydebtors');
                this.discountAccountForm.patchValue({ discountUniqueName: a.discounts[0] ? a.discounts[0].uniqueName : undefined });
            }
        });
        this.groupDetailForm = this._fb.group({
            name: ['', Validators.required],
            uniqueName: ['', Validators.required],
            description: ['']
        });

        this.taxGroupForm = this._fb.group({
            taxes: ['']
        });

        this.discountAccountForm = this._fb.group({
            discountUniqueName: ['', Validators.required],
        });

        this.moveAccountForm = this._fb.group({
            moveto: ['', Validators.required]
        });

        this.shareAccountForm = this._fb.group({
            userEmail: ['', [Validators.required, Validators.email]]
        });

        this.groupList$.subscribe((a) => {
            if (a) {
                // this.groupsList = this.makeGroupListFlatwithLessDtl(this.flattenGroup(a, []));
                let grpsList = this.makeGroupListFlatwithLessDtl(this.flattenGroup(a, []));
                let flattenGroupsList: IOption[] = [];

                grpsList.forEach(grp => {
                    flattenGroupsList.push({ label: grp.name, value: grp.uniqueName, additional: grp.parentGroups });
                });
                this.groupsList = flattenGroupsList;
                this.groupsListBackUp = flattenGroupsList;
            }
        });
        // this.flattenGroups$.subscribe(flattenGroups => {
        //     if (flattenGroups) {
        //         let items: IOption[] = flattenGroups.filter(grps => {
        //             return grps.groupUniqueName === this.activeGroupUniqueName || grps.parentGroups.some(s => s.uniqueName === this.activeGroupUniqueName);
        //         }).map(m => {
        //             return {
        //                 value: m.groupUniqueName, label: m.groupName
        //             }
        //         });
        //         this.flatGroupsOptions = items;
        //     }
        // });

        this.showAddNewGroup$.subscribe(s => {
            if (s) {
                if (this.breadcrumbPath.indexOf('Create Group') === -1) {
                    this.breadcrumbPath.push('Create Group');
                }
            }
        });

        this.showAddNewAccount$.subscribe(s => {
            if (s) {
                if (this.breadcrumbPath.indexOf('Create Account') === -1) {
                    this.breadcrumbPath.push('Create Account');
                }
            }
        });

        this.activeGroup$.subscribe((a) => {
            if (a) {
                this.groupsList = _.filter(this.groupsListBackUp, (l => l.value !== a.uniqueName));
                if (a.uniqueName === 'sundrycreditors' || a.uniqueName === 'sundrydebtors') {
                    this.showGroupLedgerExportButton$ = observableOf(true);
                    this.isDebtorCreditor = true;
                } else {
                    this.showGroupLedgerExportButton$ = observableOf(false);
                    // this.isDebtorCreditor = false;
                }
                // this.taxGroupForm.get('taxes').reset();
                // let showAddForm: boolean = null;
                // this.showAddNewGroup$.take(1).subscribe((d) => showAddForm = d);
                // if (!showAddForm) {
                //   this.showGroupForm = true;
                //   this.ShowForm.emit(true);
                //   this.groupDetailForm.patchValue({name: a.name, uniqueName: a.uniqueName, description: a.description});
                //
                //   let taxes = a.applicableTaxes.map(acc => acc.uniqueName);
                //   this.taxGroupForm.get('taxes').setValue(taxes);
                //   this.store.dispatch(this.groupWithAccountsAction.showEditGroupForm());
                // }

                this.virtualAccountEnable$.subscribe(s => {
                    if (s && s.companyCashFreeSettings && s.companyCashFreeSettings.autoCreateVirtualAccountsForDebtors && this.breadcrumbUniquePath[1] === 'sundrydebtors') {
                        this.showVirtualAccount = true;
                    } else {
                        this.showVirtualAccount = false;
                    }
                });

                if (this.breadcrumbUniquePath) {
                    if (this.breadcrumbUniquePath[0]) {
                        let col = this.breadcrumbUniquePath[0];
                        this.isHsnSacEnabledAcc = col === 'revenuefromoperations' || col === 'otherincome' || col === 'operatingcost' || col === 'indirectexpenses';
                        this.isGstEnabledAcc = !this.isHsnSacEnabledAcc;
                    }
                    if (this.breadcrumbUniquePath[1]) {
                        let col = this.breadcrumbUniquePath[1];
                        if (col === 'sundrycreditors') {
                            this.showBankDetail = true;
                        } else {
                            this.showBankDetail = false;
                        }
                    }
                }
            }
        });

        this.activeGroupUniqueName$.subscribe((a) => {
            if (a) {
                this.isRootLevelGroupFunc(a);
            }
        });

        this.showNewForm$.subscribe(s => {

        });

        this.moveAccountSuccess$.subscribe(p => {
            if (p) {
                this.moveAccountForm.reset();
            }
        });

        this.discountList$.subscribe(discount => {
            if (discount) {
                this.companyDiscountDropDown = discount.map(dis => {
                    return { label: dis.name, value: dis.uniqueName };
                });
            } else {
                this.companyDiscountDropDown = [];
            }
        });


        this.accountsAction.mergeAccountResponse$.subscribe(res => {
            this.selectedaccountForMerge = '';
        });
    }

    public ngAfterViewInit() {

        this.isTaxableAccount$ = this.store.pipe(select(createSelector([
            (state: AppState) => state.groupwithaccounts.groupswithaccounts,
            (state: AppState) => state.groupwithaccounts.activeAccount],
            (groupswithaccounts, activeAccount) => {
                let result: boolean = false;
                let activeGroupUniqueName = this.breadcrumbUniquePath[this.breadcrumbUniquePath.length - 2];
                if (groupswithaccounts && activeGroupUniqueName && activeAccount) {
                    result = this.getAccountFromGroup(groupswithaccounts, activeGroupUniqueName, false);
                } else {
                    result = false;
                }
                return result;
            })), takeUntil(this.destroyed$));
    }

    public loadAccountData() {
        let activeAccount: AccountResponseV2 = null;
        this.activeAccount$.pipe(take(1)).subscribe(p => {
            activeAccount = p;
            if (!this.showBankDetail) {
                if (p.parentGroups) {
                    p.parentGroups.forEach(grp => {
                        this.showBankDetail = grp.uniqueName === "sundrycreditors" ? true : false;
                        return;
                    });
                }
            }
        });

        this.accountService.getFlattenAccounts().subscribe(a => {
            let accounts: IOption[] = [];
            if (a.status === 'success') {
                a.body.results.map(acc => {
                    accounts.push({ label: `${acc.name} (${acc.uniqueName})`, value: acc.uniqueName });
                });
                let accountIndex = accounts.findIndex(acc => acc.value === activeAccount.uniqueName);
                if (accountIndex > -1) {
                    accounts.splice(accountIndex, 1);
                }
            }
            this.accounts$ = observableOf(accounts);
        });
    }

    public shareAccount() {
        let activeAcc;
        this.activeAccount$.pipe(take(1)).subscribe(p => activeAcc = p);
        let accObject = new ShareAccountRequest();
        accObject.role = 'view_only';
        accObject.user = this.shareAccountForm.controls['userEmail'].value;
        this.store.dispatch(this._ledgerActions.shareAccount(accObject, activeAcc.uniqueName));
        this.shareAccountForm.reset();
    }

    public moveToAccountSelected(event: any) {
        this.moveAccountForm.patchValue({ moveto: event.item.uniqueName });
    }

    public moveAccount() {
        let activeAcc;
        this.activeAccount$.pipe(take(1)).subscribe(p => activeAcc = p);

        let grpObject = new AccountMoveRequest();
        grpObject.uniqueName = this.moveAccountForm.controls['moveto'].value;

        let activeGrpName = this.breadcrumbUniquePath[this.breadcrumbUniquePath.length - 2];

        this.store.dispatch(this.accountsAction.moveAccount(grpObject, activeAcc.uniqueName, activeGrpName));
        this.moveAccountForm.reset();
    }

    public unShareGroup(val) {
        let activeGrp;
        this.activeGroup$.pipe(take(1)).subscribe(p => activeGrp = p);

        this.store.dispatch(this.groupWithAccountsAction.unShareGroup(val, activeGrp.uniqueName));
    }

    public unShareAccount(val) {
        let activeAcc;
        this.activeAccount$.pipe(take(1)).subscribe(p => activeAcc = p);
        this.store.dispatch(this.accountsAction.unShareAccount(val, activeAcc.uniqueName));
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
            listItem = Object.assign({}, listItem, { parentGroups: [] });
            listItem.parentGroups = newParents;
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

    public isRootLevelGroupFunc(uniqueName: string) {
        this.groupList$.pipe(take(1)).subscribe(list => {
            for (let grp of list) {
                if (grp.uniqueName === uniqueName) {
                    this.isRootLevelGroup = true;
                    return;
                } else {
                    this.isRootLevelGroup = false;
                }
            }
        });
    }

    public flattenAccounts(groups: GroupsWithAccountsResponse[] = [], accounts: IAccountsInfo[]): IAccountsInfo[] {
        _.each(groups, grp => {
            accounts.push(...grp.accounts);
            if (grp.groups) {
                this.flattenAccounts(grp.groups, accounts);
            }
        });
        return accounts;
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

    public ngOnChanges(changes: SimpleChanges): void {
        this.showTaxes = false;
        if ('breadcrumbUniquePath' in changes && changes.breadcrumbUniquePath.currentValue !== changes.breadcrumbUniquePath.previousValue) {
            // debugger;
            this.isDebtorCreditor = changes.breadcrumbUniquePath.currentValue.includes('sundrycreditors') || changes.breadcrumbUniquePath.currentValue.includes('sundrydebtors');
            this.showBankDetail = changes.breadcrumbUniquePath.currentValue.includes('sundrycreditors');
        }
    }

    public taxHierarchy() {
        let activeAccount: AccountResponseV2 = null;
        let activeGroup: GroupResponse = null;
        this.store.pipe(take(1)).subscribe(s => {
            if (s.groupwithaccounts) {
                activeAccount = s.groupwithaccounts.activeAccount;
                activeGroup = s.groupwithaccounts.activeGroup;
            }
        });
        if (activeAccount) {
            //
            this.store.dispatch(this.companyActions.getTax());
            this.store.dispatch(this.accountsAction.getTaxHierarchy(activeAccount.uniqueName));
        } else {
            this.store.dispatch(this.companyActions.getTax());
            this.store.dispatch(this.groupWithAccountsAction.getTaxHierarchy(activeGroup.uniqueName));
        }

    }

    public getAccountFromGroup(groupList: IGroupsWithAccounts[], uniqueName: string, result: boolean): boolean {
        if (result) {
            return result;
        }
        for (const el of groupList) {
            if (el.accounts) {
                if (el.uniqueName === uniqueName && (el.category === 'income' || el.category === 'expenses')) {
                    result = true;
                    break;
                }
            }
            if (el.groups) {
                result = this.getAccountFromGroup(el.groups, uniqueName, result);
                if (result) {
                    break;
                }
            }
        }
        return result;
    }

    public applyTax() {
        let activeAccount: AccountResponseV2 = null;
        let activeGroup: GroupResponse = null;
        this.store.pipe(take(1)).subscribe(s => {
            if (s.groupwithaccounts) {
                activeAccount = s.groupwithaccounts.activeAccount;
                activeGroup = s.groupwithaccounts.activeGroup;
            }
        });
        if (activeAccount) {
            let data: ApplyTaxRequest = new ApplyTaxRequest();
            data.isAccount = true;
            data.taxes = [];
            this.activeAccountTaxHierarchy$.pipe(take(1)).subscribe((t) => {
                if (t) {
                    t.inheritedTaxes.forEach(tt => {
                        tt.applicableTaxes.forEach(ttt => {
                            data.taxes.push(ttt.uniqueName);
                        });
                    });
                }
            });
            let a = [];
            data.taxes.push.apply(data.taxes, this.taxGroupForm.value.taxes);
            data.uniqueName = activeAccount.uniqueName;
            this.store.dispatch(this.accountsAction.applyAccountTax(data));
        }

    }

    // public applyDiscount() {
    //     //
    //     let activeAccount: AccountResponseV2 = null;
    //     this.activeAccount$.pipe(take(1)).subscribe(s => {
    //         if (s) {
    //             activeAccount = s;
    //         }
    //     });
    //     if (activeAccount) {
    //         let data: ApplyDiscountRequest = this.discountAccountForm.value;
    //         data.accountUniqueNames = [activeAccount.uniqueName];
    //         this.store.dispatch(this.accountsAction.applyAccountDiscount(data));
    //     }
    // }

    // public removeDiscount() {
    //     let activeAccount: AccountResponseV2 = null;
    //     this.activeAccount$.pipe(take(1)).subscribe(s => {
    //         if (s) {
    //             activeAccount = s;
    //         }
    //     });
    //     if (activeAccount) {
    //         this.store.dispatch(
    //             this.accountsAction.removeAccountDiscount(activeAccount.discounts[0].uniqueName, activeAccount.uniqueName));
    //     }
    // }

    public showShareGroupModal() {
        this.shareGroupModal.show();
        this.shareGroupModalComp.getGroupSharedWith();
    }

    public hideShareGroupModal() {
        this.shareGroupModal.hide();
    }

    public showShareAccountModal() {
        this.shareAccountModal.show();
        this.shareAccountModalComp.getAccountSharedWith();
    }

    public hideShareAccountModal() {
        this.shareAccountModal.hide();
    }

    public showAddGroupForm() {
        this.store.dispatch(this.groupWithAccountsAction.showAddGroupForm());
        this.groupDetailForm.reset();
    }

    public showAddAccountForm() {
        this.store.dispatch(this.groupWithAccountsAction.showAddAccountForm());
    }

    public showDeleteMergedAccountModal(merge: string) {
        merge = merge.trim();
        this.deleteMergedAccountModalBody = `Are you sure you want to delete ${merge} Account ?`;
        this.selectedAccountForDelete = merge;
        this.deleteMergedAccountModal.show();
    }

    public hideDeleteMergedAccountModal() {
        this.deleteMergedAccountModal.hide();
    }

    public deleteMergedAccount() {
        let activeAccount: AccountResponseV2 = null;
        this.activeAccount$.pipe(take(1)).subscribe(p => activeAccount = p);
        let obj = new AccountUnMergeRequest();
        obj.uniqueNames = [this.selectedAccountForDelete];
        this.store.dispatch(this.accountsAction.unmergeAccount(activeAccount.uniqueName, obj));
        this.showDeleteMove = false;
        this.hideDeleteMergedAccountModal();
    }

    public selectAccount(v: IOption[]) {
        if (v.length) {
            // if (v.value instanceof Array) {
            let accounts = [];
            v.map(a => {
                accounts.push(a.value);
            });
            this.selectedaccountForMerge = accounts;
            // }
        } else {
            this.selectedaccountForMerge = '';
        }
    }

    public setAccountForMoveFunc(v: string) {
        this.setAccountForMove = v;
        this.showDeleteMove = true;
    }

    public mergeAccounts() {
        let activeAccount: AccountResponseV2 = null;
        this.activeAccount$.pipe(take(1)).subscribe(p => activeAccount = p);
        let finalData: AccountMergeRequest[] = [];
        if (this.selectedaccountForMerge.length) {
            this.selectedaccountForMerge.map((acc) => {
                let obj = new AccountMergeRequest();
                obj.uniqueName = acc;
                finalData.push(obj);
            });
            this.store.dispatch(this.accountsAction.mergeAccount(activeAccount.uniqueName, finalData));
            this.showDeleteMove = false;
        } else {
            this._toaster.errorToast('Please Select at least one account');
            return;
        }
    }

    public showMoveMergedAccountModal() {
        this.moveMergedAccountModalBody = `Are you sure you want to move ${this.setAccountForMove} Account to ${this.selectedAccountForMove} ?`;
        this.moveMergedAccountModal.show();
    }

    public hideMoveMergedAccountModal() {
        this.moveMergedAccountModal.hide();
    }

    public moveMergeAccountTo() {
        let activeAccount: AccountResponseV2 = null;
        this.activeAccount$.pipe(take(1)).subscribe(p => activeAccount = p);
        let obj = new AccountUnMergeRequest();
        obj.uniqueNames = [this.setAccountForMove];
        obj.moveTo = this.selectedAccountForMove;
        this.store.dispatch(this.accountsAction.unmergeAccount(activeAccount.uniqueName, obj));
        this.showDeleteMove = false;
        this.hideDeleteMergedAccountModal();
        // this.accountForMoveSelect2.setElementValue('');
        this.hideMoveMergedAccountModal();
    }

    public addNewAccount(accRequestObject: { activeGroupUniqueName: string, accountRequest: AccountRequestV2 }) {
        this.store.dispatch(this.accountsAction.createAccountV2(accRequestObject.activeGroupUniqueName, accRequestObject.accountRequest));
    }

    public updateAccount(accRequestObject: { value: { groupUniqueName: string, accountUniqueName: string }, accountRequest: AccountRequestV2 }) {
        this.store.dispatch(this.accountsAction.updateAccountV2(accRequestObject.value, accRequestObject.accountRequest));
    }

    public showDeleteAccountModal() {
        this.deleteAccountModal.show();
    }

    public hideDeleteAccountModal() {
        this.deleteAccountModal.hide();
    }

    public deleteAccount() {
        let activeAccUniqueName = null;
        this.activeAccount$.pipe(take(1)).subscribe(s => activeAccUniqueName = s.uniqueName);
        let activeGrpName = this.breadcrumbUniquePath[this.breadcrumbUniquePath.length - 2];
        this.store.dispatch(this.accountsAction.deleteAccount(activeAccUniqueName, activeGrpName));

        this.hideDeleteAccountModal();
    }

    public customMoveGroupFilter(term: string, item: IOption): boolean {
        return (item.label.toLocaleLowerCase().indexOf(term) > -1 || item.value.toLocaleLowerCase().indexOf(term) > -1);
    }

    public exportGroupLedger() {
        this.groupExportLedgerModal.show();
    }

    public hideGroupExportModal(response: any) {
        this.groupExportLedgerModal.hide();
        this.activeGroupUniqueName$.pipe(take(1)).subscribe((grpUniqueName: string) => {
            if (response !== 'close') {
                this.groupExportLedgerQueryRequest.type = response.type;
                this.groupExportLedgerQueryRequest.format = response.fileType;
                this.groupExportLedgerQueryRequest.sort = response.order;
                this.groupExportLedgerQueryRequest.from = response.from;
                this.groupExportLedgerQueryRequest.to = response.to;
                this.store.dispatch(this._ledgerActions.GroupExportLedger(grpUniqueName, this.groupExportLedgerQueryRequest));
            }
        });
    }
    public isGroupSelected(event) {
        if (event) {
            this.activeGroupUniqueName$ = observableOf(event);
            // in case of sundrycreditors or sundrydebtors no need to show address tab
            if (event === 'sundrycreditors' || event === 'sundrydebtors') {
                this.isDebtorCreditor = true;
            }
        }
    }
    public ngOnDestroy() {
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }
}
