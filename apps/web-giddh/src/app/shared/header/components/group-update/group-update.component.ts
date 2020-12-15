import { take, takeUntil } from 'rxjs/operators';
import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild, Input, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Store, select } from '@ngrx/store';
import { GroupWithAccountsAction } from '../../../../actions/groupwithaccounts.actions';
import { AppState } from '../../../../store';
import { Observable, ReplaySubject, BehaviorSubject, combineLatest, of } from 'rxjs';
import { GroupResponse, GroupsTaxHierarchyResponse, MoveGroupRequest } from '../../../../models/api-models/Group';
import { ModalDirective } from 'ngx-bootstrap/modal';
import * as _ from '../../../../lodash-optimized';
import { GroupsWithAccountsResponse } from '../../../../models/api-models/GroupsWithAccounts';
import { IGroupsWithAccounts } from '../../../../models/interfaces/groupsWithAccounts.interface';
import { AccountResponseV2 } from '../../../../models/api-models/Account';
import { CompanyActions } from '../../../../actions/company.actions';
import { AccountsAction } from '../../../../actions/accounts.actions';
import { ApplyTaxRequest } from '../../../../models/api-models/ApplyTax';
import { IOption } from '../../../../theme/ng-virtual-select/sh-options.interface';
import { createSelector } from 'reselect';
import { ShSelectComponent } from 'apps/web-giddh/src/app/theme/ng-virtual-select/sh-select.component';
import { GeneralActions } from '../../../../actions/general/general.actions';
import { digitsOnly } from '../../../helpers';
import { BlankLedgerVM, TransactionVM } from '../../../../ledger/ledger.vm';
import { cloneDeep } from '../../../../lodash-optimized';
import { LedgerDiscountComponent } from '../../../../ledger/components/ledgerDiscount/ledgerDiscount.component';
import { TaxControlComponent } from '../../../../theme/tax-control/tax-control.component';
import { LedgerService } from '../../../../services/ledger.service';
import { StylesCompileDependency } from '@angular/compiler';
import { style } from '@angular/animations';
import { SettingsDiscountActions } from 'apps/web-giddh/src/app/actions/settings/discount/settings.discount.action';
import { IDiscountList } from 'apps/web-giddh/src/app/models/api-models/SettingsDiscount';
import { ApplyDiscountRequestV2 } from 'apps/web-giddh/src/app/models/api-models/ApplyDiscount';
@Component({
    selector: 'group-update',
    templateUrl: 'group-update.component.html',
    styleUrls: ['group-update.component.css']
})

export class GroupUpdateComponent implements OnInit, OnDestroy, AfterViewInit {
    public uniqueName: string = null;
    public totalForTax: number = 0;
    @Input() public blankLedger: BlankLedgerVM;
    @Input() public currentTxn: TransactionVM = null;
    @Input() public needToReCalculate: BehaviorSubject<boolean>;
    public isAmountFirst: boolean = false;
    public isTotalFirts: boolean = false;
    @ViewChild('discount', {static: true}) public discountControl: LedgerDiscountComponent;
    @ViewChild('tax', {static: true}) public taxControll: TaxControlComponent;
    @ViewChild('autoFocused', {static: true}) public autoFocus: ElementRef;

    public companyTaxDropDown: Array<IOption>;
    public groupDetailForm: FormGroup;
    public moveGroupForm: FormGroup;
    public taxGroupForm: FormGroup;
    public activeGroup$: Observable<GroupResponse>;
    public activeGroupUniqueName$: Observable<string>;
    public fetchingGrpUniqueName$: Observable<boolean>;
    public isGroupNameAvailable$: Observable<boolean>;
    public isTaxableGroup$: Observable<boolean>;
    public showEditGroup$: Observable<boolean>;
    public groupList$: Observable<GroupsWithAccountsResponse[]>;
    public activeGroupSelected$: Observable<string[]>;
    public activeGroupTaxHierarchy$: Observable<GroupsTaxHierarchyResponse>;
    public isUpdateGroupInProcess$: Observable<boolean>;
    public isUpdateGroupSuccess$: Observable<boolean>;
    public optionsForDropDown: IOption[] = [{ label: 'Vishal', value: 'vishal' }];
    public taxPopOverTemplate: string = `
  <div class="popover-content">
  <label>Tax being inherited from:</label>
    <ul>
    <li>@inTax.name</li>
    </ul>
  </div>
  `;
    public showEditTaxSection: boolean = false;
    public groupsList: IOption[] = [];
    public accountList: any[];
    public showTaxes: boolean = false;
    // list of groups with less details (parent information)
    public groupWithParentLessDetailsList:any[] = [];
    @ViewChild('deleteGroupModal', {static: true}) public deleteGroupModal: ModalDirective;
    @ViewChild('moveToGroupDropDown', {static: true}) public moveToGroupDropDown: ShSelectComponent;
    /** To check is groups belongs to debtor or creditors type  */
    public isDebtorCreditorGroups: boolean = false;
    /** To check discount box show/hide */
    public showDiscount: boolean = false;
    /** Stores list of discount */
    public discountList: any[] = [];
    /** Observable of company discounts list */
    public discountList$: Observable<IDiscountList[]>;
    /** Selected discount list */
    public selectedDiscounts: any[] = [];
    /** To check applied taxes modified  */
    public isTaxesSaveDisable$: Observable<boolean> = of(true);
    /** To check applied discounts modified  */
    public isDiscountSaveDisable$: Observable<boolean> = of(true);



    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

    constructor(private _fb: FormBuilder, private store: Store<AppState>, private groupWithAccountsAction: GroupWithAccountsAction,
        private companyActions: CompanyActions, private accountsAction: AccountsAction, private _generalActions: GeneralActions, private _ledgerService: LedgerService, private settingsDiscountAction: SettingsDiscountActions ) {
        this.groupList$ = this.store.select(state => state.general.groupswithaccounts).pipe(takeUntil(this.destroyed$));
        this.activeGroup$ = this.store.select(state => state.groupwithaccounts.activeGroup).pipe(takeUntil(this.destroyed$));
        this.activeGroupUniqueName$ = this.store.select(state => state.groupwithaccounts.activeGroupUniqueName).pipe(takeUntil(this.destroyed$));
        this.fetchingGrpUniqueName$ = this.store.select(state => state.groupwithaccounts.fetchingGrpUniqueName).pipe(takeUntil(this.destroyed$));
        this.isGroupNameAvailable$ = this.store.select(state => state.groupwithaccounts.isGroupNameAvailable).pipe(takeUntil(this.destroyed$));
        this.showEditGroup$ = this.store.select(state => state.groupwithaccounts.showEditGroup).pipe(takeUntil(this.destroyed$));
        this.activeGroupSelected$ = this.store.select(state => {
            if (state.groupwithaccounts.activeAccount) {
                if (state.groupwithaccounts.activeAccountTaxHierarchy) {
                    return _.difference(state.groupwithaccounts.activeAccountTaxHierarchy.applicableTaxes.map(p => p.uniqueName), state.groupwithaccounts.activeAccountTaxHierarchy.inheritedTaxes.map(p => p.uniqueName));
                }
            } else {
                if (state.groupwithaccounts.activeGroupTaxHierarchy) {
                    return _.difference(state.groupwithaccounts.activeGroupTaxHierarchy.applicableTaxes.map(p => p.uniqueName), state.groupwithaccounts.activeGroupTaxHierarchy.inheritedTaxes.map(p => p.uniqueName));
                }
            }

            return [];
        }).pipe(takeUntil(this.destroyed$));
        this.activeGroupTaxHierarchy$ = this.store.select(state => state.groupwithaccounts.activeGroupTaxHierarchy).pipe(takeUntil(this.destroyed$));
        this.isUpdateGroupInProcess$ = this.store.select(state => state.groupwithaccounts.isUpdateGroupInProcess).pipe(takeUntil(this.destroyed$));
        this.isUpdateGroupSuccess$ = this.store.select(state => state.groupwithaccounts.isUpdateGroupSuccess).pipe(takeUntil(this.destroyed$));
        this.discountList$ = this.store.pipe(select(state => state.settings.discount.discountList),takeUntil(this.destroyed$));

    }

    public ngOnInit() {
        this.store.dispatch(this._generalActions.getGroupWithAccounts());
        this.groupDetailForm = this._fb.group({
            name: ['', Validators.required],
            uniqueName: ['', Validators.required],
            description: [''],
            closingBalanceTriggerAmount: [0, Validators.compose([digitsOnly])],
            closingBalanceTriggerAmountType: ['CREDIT']
        });
        this.moveGroupForm = this._fb.group({
            moveto: ['', Validators.required]
        });
        this.taxGroupForm = this._fb.group({
            taxes: ['']
        });

        this.activeGroup$.subscribe((activeGroup) => {
            if (activeGroup) {
                this.selectedDiscounts = [];
                this.uniqueName = activeGroup.uniqueName;
                if (activeGroup.applicableDiscounts && activeGroup.applicableDiscounts.length) {
                    activeGroup.applicableDiscounts.forEach(element => {
                        this.selectedDiscounts.push(element.uniqueName)
                    });
                }
                this.groupDetailForm.patchValue({ name: activeGroup.name, uniqueName: activeGroup.uniqueName, description: activeGroup.description, closingBalanceTriggerAmount: activeGroup.closingBalanceTriggerAmount, closingBalanceTriggerAmountType: activeGroup.closingBalanceTriggerAmountType });
                if (activeGroup.fixed) {
                    this.groupDetailForm.get('name').disable();
                    this.groupDetailForm.get('uniqueName').disable();
                    this.groupDetailForm.get('description').disable();
                } else {
                    this.groupDetailForm.get('name').enable();
                    this.groupDetailForm.get('uniqueName').enable();
                    this.groupDetailForm.get('description').enable();
                }
            }
        });

        this.groupList$.subscribe((a) => {
            if (a && a.length > 0) {
                let activeGroupUniqueName: string;
                this.activeGroup$.pipe(take(1)).subscribe(grp => activeGroupUniqueName = grp.uniqueName);
                let grpsList = this.makeGroupListFlatwithLessDtl(this.flattenGroup(a, []));
                this.groupWithParentLessDetailsList = _.cloneDeep(grpsList);
                let flattenGroupsList: IOption[] = [];

                grpsList.forEach(grp => {
                    if (grp.uniqueName !== activeGroupUniqueName) {
                        flattenGroupsList.push({ label: grp.name, value: grp.uniqueName });
                    }
                });
                this.groupsList = flattenGroupsList;
            }
        });
        setTimeout(() => {
            this.autoFocus.nativeElement.focus();
        }, 50);
        this.getDiscountList();
        combineLatest([
            this.store.pipe(select((state: AppState) => state.groupwithaccounts.activeGroupTaxHierarchy)),
            this.store.pipe(select((state: AppState) => state.groupwithaccounts.activeGroup)),
            this.store.pipe(select((state: AppState) => state.company.taxes))
        ]).pipe(takeUntil(this.destroyed$)).subscribe((result) => {
            if (result[0] && result[1] && result[2]) {
                const activeGroupTaxHierarchy = result[0];
                const activeGroup = result[1];
                const taxes = result[2];
                let arr: IOption[] = [];
                if (taxes) {
                    if (activeGroup) {
                        let applicableTaxes = activeGroup.applicableTaxes.map(p => p.uniqueName);

                        if (activeGroupTaxHierarchy) {
                            // prepare drop down options
                            this.companyTaxDropDown = _.differenceBy(taxes.map(p => {
                                return { label: p.name, value: p.uniqueName };
                            }), _.flattenDeep(activeGroupTaxHierarchy.inheritedTaxes.map(p => p.applicableTaxes)).map((p: any) => {
                                return { label: p.name, value: p.uniqueName };
                            }), 'value');

                            if (activeGroupTaxHierarchy.inheritedTaxes && activeGroupTaxHierarchy.inheritedTaxes.length) {
                                let inheritedTaxes = _.flattenDeep(activeGroupTaxHierarchy.inheritedTaxes.map(p => p.applicableTaxes)).map((j: any) => j.uniqueName);
                                let allTaxes = applicableTaxes.filter(f => inheritedTaxes.indexOf(f) === -1);
                                // set value in tax group form
                                setTimeout(() => {
                                    this.taxGroupForm.setValue({ taxes: allTaxes });
                                }, 200);
                            } else {
                                setTimeout(() => {
                                    this.taxGroupForm.setValue({ taxes: applicableTaxes });
                                }, 200);
                            }

                        } else {
                            this.companyTaxDropDown = taxes.map(p => {
                                return { label: p.name, value: p.uniqueName };
                            });
                            // set value in tax group form
                            setTimeout(() => {
                                this.taxGroupForm.setValue({ taxes: applicableTaxes});
                            }, 200);

                        }
                    }
                } else {
                    this.companyTaxDropDown = arr;
                }
            }
        });
    }

    public ngAfterViewInit() {
        this.isTaxableGroup$ = this.store.select(state => {
            let result: boolean = false;
            if (state.groupwithaccounts.groupswithaccounts && state.groupwithaccounts.activeGroup) {
                if (state.groupwithaccounts.activeAccount) {
                    return false;
                }
                result = this.getAccountFromGroup(state.groupwithaccounts.groupswithaccounts, state.groupwithaccounts.activeGroup.uniqueName, false);
            } else {
                result = false;
            }
            return result;

            this.needToReCalculate.subscribe(a => {
                if (a) {
                    this.amountChanged();
                    this.calculateTotal();
                    //this.calculateCompoundTotal();
                }
            });






        });

        this.activeGroupSelected$.subscribe((p) => {
            this.taxGroupForm.patchValue({ taxes: p });
        });
        this.activeGroupTaxHierarchy$.subscribe((a) => {
            let activeAccount: AccountResponseV2 = null;
            let activeGroup: GroupResponse = null;
            this.store.pipe(take(1)).subscribe(s => {
                if (s.groupwithaccounts) {
                    activeGroup = s.groupwithaccounts.activeGroup;
                    activeAccount = s.groupwithaccounts.activeAccount;
                }
            });
            if (activeGroup && !activeAccount) {
                if (a) {
                    this.showEditTaxSection = true;
                }
            }
        });
    }
    public calculateTotal() {

        if (this.currentTxn && this.currentTxn.selectedAccount) {
            if (this.currentTxn.selectedAccount.stock && this.currentTxn.amount > 0) {
                if (this.currentTxn.inventory.unit.rate) {
                    // this.currentTxn.inventory.quantity = Number((this.currentTxn.amount / this.currentTxn.inventory.unit.rate).toFixed(2));
                }
            }
        }
        if (this.currentTxn && this.currentTxn.amount) {
            let total = (this.currentTxn.amount - this.currentTxn.discount) || 0;
            this.totalForTax = total;
            this.currentTxn.total = Number((total + ((total * this.currentTxn.tax) / 100)).toFixed(2));
        }
        //this.calculateCompoundTotal();
    }

    public amountChanged() {
        if (this.discountControl) {
            this.discountControl.change();
        }
        if (this.currentTxn && this.currentTxn.selectedAccount) {
            if (this.currentTxn.selectedAccount.stock && this.currentTxn.amount > 0) {
                if (this.currentTxn.inventory.quantity) {
                    this.currentTxn.inventory.unit.rate = Number((this.currentTxn.amount / this.currentTxn.inventory.quantity).toFixed(2));
                }
            }
        }

        if (this.isAmountFirst || this.isTotalFirts) {
            return;
        } else {
            this.isAmountFirst = true;
            // this.currentTxn.isInclusiveTax = false;
        }
    }

    public changePrice(val: string) {
        this.currentTxn.inventory.unit.rate = Number(cloneDeep(val));
        this.currentTxn.amount = Number((this.currentTxn.inventory.unit.rate * this.currentTxn.inventory.quantity).toFixed(2));
        // this.amountChanged();
        this.calculateTotal();
        // this.calculateCompoundTotal();
    }

    public changeQuantity(val: string) {
        this.currentTxn.inventory.quantity = Number(val);
        this.currentTxn.amount = Number((this.currentTxn.inventory.unit.rate * this.currentTxn.inventory.quantity).toFixed(2));
        // this.amountChanged();
        this.calculateTotal();
        //this.calculateCompoundTotal();
    }

    public calculateAmount() {

        if (!(typeof this.currentTxn.total === 'string')) {
            return;
        }
        let fixDiscount = 0;
        let percentageDiscount = 0;
        if (this.discountControl) {
            percentageDiscount = this.discountControl.discountAccountsDetails.filter(f => f.isActive)
                .filter(s => s.discountType === 'PERCENTAGE')
                .reduce((pv, cv) => {
                    return Number(cv.discountValue) ? Number(pv) + Number(cv.discountValue) : Number(pv);
                }, 0) || 0;

            fixDiscount = this.discountControl.discountAccountsDetails.filter(f => f.isActive)
                .filter(s => s.discountType === 'FIX_AMOUNT')
                .reduce((pv, cv) => {
                    return Number(cv.discountValue) ? Number(pv) + Number(cv.discountValue) : Number(pv);
                }, 0) || 0;

        }
        // A = (P+X+ 0.01XT) /(1-0.01Y + 0.01T -0.0001YT)

        this.currentTxn.amount = Number(((Number(this.currentTxn.total) + fixDiscount + 0.01 * fixDiscount * Number(this.currentTxn.tax)) /
            (1 - 0.01 * percentageDiscount + 0.01 * Number(this.currentTxn.tax) - 0.0001 * percentageDiscount * Number(this.currentTxn.tax))).toFixed(2));

        if (this.discountControl) {
            this.discountControl.ledgerAmount = this.currentTxn.amount;
            this.discountControl.change();
        }

        if (this.currentTxn.selectedAccount) {
            if (this.currentTxn.selectedAccount.stock) {
                this.currentTxn.inventory.unit.rate = Number((this.currentTxn.amount / this.currentTxn.inventory.quantity).toFixed(2));
            }
        }
        // this.calculateCompoundTotal();
        if (this.isTotalFirts || this.isAmountFirst) {
            return;
        } else {
            this.isTotalFirts = true;
            this.currentTxn.isInclusiveTax = true;
        }
    }


    public hideTax(): void {
        if (this.taxControll) {
            this.taxControll.change();
            this.taxControll.showTaxPopup = false;
        }
    }


    public showDeleteGroupModal() {
        this.deleteGroupModal.show();
    }

    public hideDeleteGroupModal() {
        this.deleteGroupModal.hide();
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

    public customMoveGroupFilter(term: string, item: IOption): boolean {
        return (item.label.toLocaleLowerCase().indexOf(term) > -1 || item.value.toLocaleLowerCase().indexOf(term) > -1);
    }

    public moveGroup() {
        let activeGroupUniqueName: string;
        this.activeGroupUniqueName$.pipe(take(1)).subscribe(a => activeGroupUniqueName = a);

        let grpObject = new MoveGroupRequest();
        grpObject.parentGroupUniqueName = this.moveGroupForm.value.moveto;
        this.store.dispatch(this.groupWithAccountsAction.moveGroup(grpObject, activeGroupUniqueName));
        this.moveGroupForm.reset();

        if (this.moveToGroupDropDown) {
            this.moveToGroupDropDown.clear();
        }
    }

    public deleteGroup() {
        let activeGroupUniqueName: string;
        this.activeGroupUniqueName$.pipe(take(1)).subscribe(a => activeGroupUniqueName = a);
        this.store.dispatch(this.groupWithAccountsAction.deleteGroup(activeGroupUniqueName));
        this.hideDeleteGroupModal();
    }

    public updateGroup() {
        let activeGroupUniqueName: string;
        let uniqueName = this.groupDetailForm.get('uniqueName');
        uniqueName.patchValue(uniqueName.value.replace(/ /g, '').toLowerCase());

        this.activeGroupUniqueName$.pipe(take(1)).subscribe(a => activeGroupUniqueName = a);
        this.store.dispatch(this.groupWithAccountsAction.updateGroup(this.groupDetailForm.value, activeGroupUniqueName));
    }

    public async taxHierarchy() {
        if (this.showTaxes) {
            let activeAccount: AccountResponseV2 = null;
            let activeGroupUniqueName: string = null;
            this.store.pipe(take(1)).subscribe(s => {
                if (s.groupwithaccounts) {
                    activeAccount = s.groupwithaccounts.activeAccount;
                    activeGroupUniqueName = s.groupwithaccounts.activeGroupUniqueName;
                }
            });
            if (activeAccount) {
                //
                this.store.dispatch(this.companyActions.getTax());
                this.store.dispatch(this.accountsAction.getTaxHierarchy(activeAccount.uniqueName));
            } else {
                this.store.dispatch(this.companyActions.getTax());
                this.store.dispatch(this.groupWithAccountsAction.getTaxHierarchy(activeGroupUniqueName));
                this.showEditTaxSection = true;
            }
        }
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
        let data: ApplyTaxRequest = new ApplyTaxRequest();
        data.isAccount = false;
        data.taxes = [];
        this.activeGroupTaxHierarchy$.pipe(take(1)).subscribe((t) => {
            if (t) {
                t.inheritedTaxes.forEach(tt => {
                    tt.applicableTaxes.forEach(ttt => {
                        data.taxes.push(ttt.uniqueName);
                    });
                });
            }
        });
        data.taxes.push.apply(data.taxes, this.taxGroupForm.value.taxes);
        data.uniqueName = activeGroup.uniqueName;
        this.store.dispatch(this.groupWithAccountsAction.applyGroupTax(data));
        this.showEditTaxSection = false;
    }

    public getAccountFromGroup(groupList: IGroupsWithAccounts[], uniqueName: string, result: boolean): boolean {
        groupList.forEach(element => {
            if (element && element.accounts) {
                if (element.uniqueName === uniqueName) {
                    this.isDebtorCreditorGroups = this.isDebtorCreditorGroup(uniqueName);
                    if (element.category === 'income' || element.category === 'expenses') {
                        result = true;
                        return;
                    }
                }
            }
            if (element && element.groups) {
                result = this.getAccountFromGroup(element.groups, uniqueName, result);
            }
        });
        return result;
    }

    public closingBalanceTypeChanged(type: string) {
        if (Number(this.groupDetailForm.get('closingBalanceTriggerAmount').value) > 0) {
            this.groupDetailForm.get('closingBalanceTriggerAmountType').patchValue(type);
        }
    }

    public ngOnDestroy(): void {
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }

    /**
    * To get sub group belongs to mentioned group (currentliabilities , currentassets)
    *
    * @param {*} item
    * @memberof GroupUpdateComponent
    */
    public isDebtorCreditorGroup(itemUniqueName: any): boolean {
        let isTaxableGroup: boolean = false;
        const item = this.groupWithParentLessDetailsList.find(element => (itemUniqueName === element.uniqueName));
        if (item) {
            isTaxableGroup = item.parentGroups.some(groupName => groupName.uniqueName === 'sundrydebtors' || groupName.uniqueName === 'sundrycreditors');
        }
        // this.groupWithParentLessDetailsList.forEach(element => {
        //     if (itemUniqueName === element.uniqueName) {
        //         isTaxableGroup = element.parentGroups.some(groupName => groupName.uniqueName === 'sundrydebtors' || groupName.uniqueName === 'sundrycreditors');
        //     }
        // });
        return isTaxableGroup;
    }

    /**
     * To apply discount in accounts
     *
     * @memberof GroupUpdateComponent
     */
    public applyDiscounts(): void {
        let activeGroupUniqueName: string;
        this.activeGroup$.pipe(take(1)).subscribe(grp => activeGroupUniqueName = grp.uniqueName);

        if (activeGroupUniqueName) {
            _.uniq(this.selectedDiscounts);
            let assignDiscountObject: ApplyDiscountRequestV2 = new ApplyDiscountRequestV2();
            assignDiscountObject.uniqueName = this.uniqueName;
            assignDiscountObject.discounts = this.selectedDiscounts;
            assignDiscountObject.isAccount = false;
            this.store.dispatch(this.accountsAction.applyAccountDiscountV2([assignDiscountObject]));
        }
    }

    /**
     * To get discount list
     *
     * @memberof GroupUpdateComponent
     */
    public getDiscountList(): void {
        this.discountList$.pipe(takeUntil(this.destroyed$)).subscribe(res => {
            if (res) {
                this.discountList = [];
                Object.keys(res).forEach(key => {
                    this.discountList.push({
                        label: res[key].name,
                        value: res[key].uniqueName,
                        isSelected: false
                    });
                });
            } else {
                this.store.dispatch(this.settingsDiscountAction.GetDiscount());
            }
        });
    }

    /**
     * To check taxes list updated
     *
     * @param {*} event
     * @memberof GroupUpdateComponent
     */
    public taxesSelected(event: any): void {
        if (event) {
            this.isTaxesSaveDisable$ = of(false);
        }
    }

    /**
     * To check discount list updated
     *
     * @memberof GroupUpdateComponent
     */
    public discountSelected(): void {
        this.isDiscountSaveDisable$ = of(false);
    }

}
