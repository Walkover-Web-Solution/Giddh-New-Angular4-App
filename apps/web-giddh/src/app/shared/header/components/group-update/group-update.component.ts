import { take, takeUntil } from 'rxjs/operators';
import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild, Input, ElementRef, TemplateRef } from '@angular/core';
import { FormGroup, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Store, select } from '@ngrx/store';
import { GroupWithAccountsAction } from '../../../../actions/groupwithaccounts.actions';
import { AppState } from '../../../../store';
import { Observable, ReplaySubject, BehaviorSubject, combineLatest, of } from 'rxjs';
import { GroupResponse, GroupsTaxHierarchyResponse, MoveGroupRequest } from '../../../../models/api-models/Group';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { AccountResponseV2 } from '../../../../models/api-models/Account';
import { CompanyActions } from '../../../../actions/company.actions';
import { AccountsAction } from '../../../../actions/accounts.actions';
import { ApplyTaxRequest } from '../../../../models/api-models/ApplyTax';
import { digitsOnly } from '../../../helpers';
import { BlankLedgerVM, TransactionVM } from '../../../../ledger/ledger.vm';
import { cloneDeep, difference, differenceBy, flatten, flattenDeep, map, omit, union, uniq } from '../../../../lodash-optimized';
import { GroupFlattenHelper } from '../../../helpers/group-flatten.helper';
import { LedgerDiscountComponent } from '../../../../ledger/components/ledger-discount/ledger-discount.component';
import { TaxControlComponent } from '../../../../theme/tax-control/tax-control.component';
import { ApplyDiscountRequestV2 } from 'apps/web-giddh/src/app/models/api-models/ApplyDiscount';
import { GroupService } from 'apps/web-giddh/src/app/services/group.service';
import { DROPDOWN_ITEMS_COUNT_LIMIT, IOption, TCS_TDS_TAXES_TYPES } from 'apps/web-giddh/src/app/app.constant';
import { GeneralService } from 'apps/web-giddh/src/app/services/general.service';
/**
 * Handles Component functionality
 */
@Component({
    selector: 'group-update',
    templateUrl: 'group-update.component.html',
    styleUrls: ['group-update.component.scss'],
    standalone: false
})

/**
 * GroupUpdateComponent component
 * Handles groupupdate functionality and user interactions
 */
export class GroupUpdateComponent implements OnInit, OnDestroy, AfterViewInit {
    /* This will hold local JSON data */
    @Input() public localeData: any = {};
    /* This will hold common JSON data */
    @Input() public commonLocaleData: any = {};
    public uniqueName: string = null;
    public totalForTax: number = 0;
    @Input() public blankLedger: BlankLedgerVM;
    @Input() public currentTxn: TransactionVM = null;
    @Input() public needToReCalculate: BehaviorSubject<boolean>;
    /** Stores list of discount */
    @Input() public discountList: any[] = [];
    public isAmountFirst: boolean = false;
    public isTotalFirts: boolean = false;
    @ViewChild('discount', { static: true }) public discountControl: LedgerDiscountComponent;
    @ViewChild('tax', { static: true }) public taxControll: TaxControlComponent;
    @ViewChild('autoFocused', { static: true }) public autoFocus: ElementRef;

    public companyTaxDropDown: Array<IOption>;
    public groupDetailForm: UntypedFormGroup;
    public moveGroupForm: UntypedFormGroup;
    public taxGroupForm: UntypedFormGroup;
    /** Discount form group */
    public discountGroupForm: FormGroup;
    public activeGroup$: Observable<GroupResponse>;
    public activeGroupUniqueName$: Observable<string>;
    public isTaxableGroup$: Observable<boolean>;
    public showEditGroup$: Observable<boolean>;
    public activeGroupSelected$: Observable<string[]>;
    public activeGroupTaxHierarchy$: Observable<GroupsTaxHierarchyResponse>;
    public isUpdateGroupInProcess$: Observable<boolean>;
    public optionsForDropDown: IOption[] = [{ label: 'Vishal', value: 'vishal' }];
    public taxPopOverTemplate: string = '';
    public showEditTaxSection: boolean = false;
    public accountList: any[];
    public showTaxes: boolean = true;
    @ViewChild('deleteGroupModal', { static: true }) public deleteGroupConfirmationDialog: TemplateRef<any>;
    public deleteGroupConfirmationDialogRef: MatDialogRef<any>;
    /** To check is groups belongs to debtor or creditors type  */
    public isDebtorCreditorGroups: boolean = false;
    /** To check discount box show/hide */
    public showDiscount: boolean = false;
    /** To check applied taxes modified  */
    public isTaxesSaveDisable$: Observable<boolean> = of(true);
    /** To check applied discounts modified  */
    public isDiscountSaveDisable$: Observable<boolean> = of(true);
    /** Stores the search results pagination details for group dropdown */
    public groupsSearchResultsPaginationData = {
        page: 0,
        totalPages: 0,
        query: ''
    };
    /** Default search suggestion list to be shown for search for group dropdown */
    public defaultGroupSuggestions: Array<IOption> = [];
    /** True, if API call should be prevented on default scroll caused by scroll in list for group dropdown */
    public preventDefaultGroupScrollApiCall: boolean = false;
    /** Stores the default search results pagination details for group dropdown */
    public defaultGroupPaginationData = {
        page: 0,
        totalPages: 0,
        query: ''
    };
    /** Stores the value of groups */
    public searchedGroups: IOption[];
    /** Stores the list of selected tax labels to display in the UI. */
    public defaultTaxLabel: string[] = [];
    /** Stores the list of selected discount labels to display in the UI. */
    public defaultDiscountLabel: string[] = [];
    /** Stores the current tax to display in the UI. */
    public currentTax: any;
    /** Stores the current discount to display in the UI. */
    public currentDiscount: any;
    /** Stores the voucher api version */
    public voucherApiVersion: number;

    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
    /**
     * Creates an instance of component
     * Initializes component dependencies and sets up initial state
     */
    constructor(
        private _fb: UntypedFormBuilder,
        private store: Store<AppState>,
        private groupWithAccountsAction: GroupWithAccountsAction,
        private companyActions: CompanyActions,
        private accountsAction: AccountsAction,
        private groupService: GroupService,
        private dialog: MatDialog,
        public generalService: GeneralService
    ) {
        this.voucherApiVersion = this.generalService.voucherApiVersion;
        this.activeGroup$ = this.store.pipe(select(state => state.groupwithaccounts.activeGroup), takeUntil(this.destroyed$));
        this.activeGroupUniqueName$ = this.store.pipe(select(state => state.groupwithaccounts.activeGroupUniqueName), takeUntil(this.destroyed$));
        this.showEditGroup$ = this.store.pipe(select(state => state.groupwithaccounts.showEditGroup), takeUntil(this.destroyed$));
        this.activeGroupSelected$ = this.store.pipe(select(state => {
            /**
             * Handles if functionality
             */
            if (state.groupwithaccounts.activeAccount) {
                /**
                 * Handles if functionality
                 */
                if (state.groupwithaccounts.activeAccountTaxHierarchy) {
                    return difference(state.groupwithaccounts.activeAccountTaxHierarchy.applicableTaxes.map(p => p?.uniqueName), state.groupwithaccounts.activeAccountTaxHierarchy.inheritedTaxes.map(p => p?.uniqueName));
                }
            } else {
                /**
                 * Handles if functionality
                 */
                if (state.groupwithaccounts.activeGroupTaxHierarchy) {
                    return difference(state.groupwithaccounts.activeGroupTaxHierarchy.applicableTaxes.map(p => p?.uniqueName), state.groupwithaccounts.activeGroupTaxHierarchy.inheritedTaxes.map(p => p?.uniqueName));
                }
            }

            return [];
        }), takeUntil(this.destroyed$));
        this.activeGroupTaxHierarchy$ = this.store.pipe(select(state => state.groupwithaccounts.activeGroupTaxHierarchy), takeUntil(this.destroyed$));
        this.isUpdateGroupInProcess$ = this.store.pipe(select(state => state.groupwithaccounts.isUpdateGroupInProcess), takeUntil(this.destroyed$));
        this.store.pipe(select(state => state.groupwithaccounts.isUpdateGroupSuccess), takeUntil(this.destroyed$)).subscribe(response => {
            /**
             * Handles if functionality
             */
            if (response) {
                this.store.dispatch(this.accountsAction.hasUnsavedChanges(false));
                this.groupDetailForm?.markAsPristine();
            }
        });
    }

    /**
     * Handles ngOnInit functionality
     */
    public ngOnInit() {
        this.taxPopOverTemplate = '<div><label>' + this.localeData?.tax_inherited + ':</label><ul><li>@inTax.name</li></ul></div>';
        this.groupDetailForm = this._fb.group({
            name: ['', Validators.required],
            uniqueName: ['', Validators.required],
            description: [''],
            closingBalanceTriggerAmount: [0, digitsOnly],
            closingBalanceTriggerAmountType: ['CREDIT']
        });
        this.moveGroupForm = this._fb.group({
            moveto: ['', Validators.required]
        });
        this.taxGroupForm = this._fb.group({
            taxes: ['']
        });

        this.discountGroupForm = this._fb.group({
            discounts: [[]]
        });

        this.groupDetailForm.valueChanges.pipe(takeUntil(this.destroyed$)).subscribe(result => {
            this.store.dispatch(this.accountsAction.hasUnsavedChanges(this.groupDetailForm.dirty));
        });

        this.groupDetailForm.get('closingBalanceTriggerAmount').valueChanges.pipe(takeUntil(this.destroyed$)).subscribe(amount => {
            /**
             * Handles if functionality
             */
            if (!this.groupDetailForm.get('closingBalanceTriggerAmountType')?.value) {
                this.groupDetailForm.get('closingBalanceTriggerAmountType')?.patchValue('CREDIT');
            }
        });

        this.activeGroup$.subscribe((activeGroup) => {
            /**
             * Handles if functionality
             */
            if (activeGroup) {
                this.uniqueName = activeGroup.uniqueName;
                /**
                 * Handles if functionality
                 */
                if (activeGroup.applicableDiscounts && activeGroup.applicableDiscounts.length) {
                    const applicableDiscounts = activeGroup.applicableDiscounts;
                    this.defaultDiscountLabel = applicableDiscounts.map(p => p.name) || [];
                    this.discountGroupForm.get('discounts').patchValue(applicableDiscounts.map(p => p.uniqueName) || []);
                }
                this.groupDetailForm?.patchValue({ name: activeGroup.name, uniqueName: activeGroup.uniqueName, description: activeGroup.description, closingBalanceTriggerAmount: activeGroup.closingBalanceTriggerAmount, closingBalanceTriggerAmountType: activeGroup.closingBalanceTriggerAmountType });
                /**
                 * Handles if functionality
                 */
                if (activeGroup.fixed) {
                    this.groupDetailForm.get('name').disable();
                    this.groupDetailForm.get('uniqueName').disable();
                    this.groupDetailForm.get('description').disable();
                } else {
                    this.groupDetailForm.get('name').enable();
                    this.groupDetailForm.get('uniqueName').enable();
                    this.groupDetailForm.get('description').enable();
                }
                /**
                 * Handles if functionality
                 */
                if (!activeGroup.fixed && activeGroup?.category) {
                    // Again load the group suggestions for Move to group operations when activeGroup has all the details
                    // done to avoid redundant API calls
                    this.loadDefaultGroupsSuggestions();
                }
            }
        });

        /**
         * Sets timeout value
         */
        setTimeout(() => {
            this.autoFocus?.nativeElement.focus();
        }, 50);
        /**
         * Handles combineLatest functionality
         */
        combineLatest([
            this.store.pipe(select((state: AppState) => state.groupwithaccounts.activeGroupTaxHierarchy)),
            this.store.pipe(select((state: AppState) => state.groupwithaccounts.activeGroup)),
            this.store.pipe(select((state: AppState) => state.company && state.company.taxes))
        ]).pipe(takeUntil(this.destroyed$)).subscribe((result) => {
            /**
             * Handles if functionality
             */
            if (result[0] && result[1] && result[2]) {
                const activeGroupTaxHierarchy = result[0];
                const activeGroup = result[1];
                const taxes = result[2];
                let arr: IOption[] = [];
                /**
                 * Handles if functionality
                 */
                if (taxes) {
                    /**
                     * Handles if functionality
                     */
                    if (activeGroup) {
                        let applicableTaxes = activeGroupTaxHierarchy?.applicableTaxes.map(p => p?.uniqueName);
                        /**
                         * Handles if functionality
                         */
                        if (activeGroupTaxHierarchy) {
                            // prepare drop down options
                            this.companyTaxDropDown = differenceBy(taxes.map(p => {
                                return { label: p?.name, value: p?.uniqueName, additional: p };
                            }), flattenDeep(activeGroupTaxHierarchy.inheritedTaxes.map(p => p.applicableTaxes)).map((p: any) => {
                                return { label: p?.name, value: p?.uniqueName, additional: p };
                            }), 'value');

                            /**
                             * Handles if functionality
                             */
                            if (activeGroupTaxHierarchy.inheritedTaxes && activeGroupTaxHierarchy.inheritedTaxes.length) {
                                let inheritedTaxes = flattenDeep(activeGroupTaxHierarchy.inheritedTaxes.map(p => p.applicableTaxes)).map((j: any) => j?.uniqueName);
                                let allTaxes = applicableTaxes?.filter(f => inheritedTaxes?.indexOf(f) === -1);
                                // set value in tax group form
                                /**
                                 * Sets timeout value
                                 */
                                setTimeout(() => {
                                    this.taxGroupForm.setValue({ taxes: allTaxes });
                                }, 200);
                            } else {
                                /**
                                 * Sets timeout value
                                 */
                                setTimeout(() => {
                                    this.taxGroupForm.setValue({ taxes: applicableTaxes });
                                }, 200);
                            }

                        } else {
                            this.companyTaxDropDown = taxes.map(p => {
                                return { label: p?.name, value: p?.uniqueName, additional: p };
                            });
                            // set value in tax group form
                            /**
                             * Sets timeout value
                             */
                            setTimeout(() => {
                                this.taxGroupForm.setValue({ taxes: applicableTaxes });
                            }, 200);

                        }
                    }
                } else {
                    this.companyTaxDropDown = arr;
                }

                /**
                 * Sets timeout value
                 */
                setTimeout(() => {
                    this.filterTaxesForDebtorCreditor();
                }, 200);
            }
        });
    }

    /**
     * Handles ngAfterViewInit functionality
     */
    public ngAfterViewInit() {
        this.isTaxableGroup$ = this.store.pipe(select(state => {
            let result: boolean = false;
            /**
             * Handles if functionality
             */
            if (state.groupwithaccounts.activeGroup) {
                /**
                 * Handles if functionality
                 */
                if (state.groupwithaccounts.activeAccount) {
                    return false;
                }
                result = this.getAccountFromGroup(state.groupwithaccounts.activeGroup, false);
            } else {
                result = false;
            }
            return result;
        }), takeUntil(this.destroyed$));

        this.activeGroupSelected$.subscribe((p) => {
            this.taxGroupForm?.patchValue({ taxes: p });
        });
        this.activeGroupTaxHierarchy$.subscribe((a) => {
            let activeAccount: AccountResponseV2 = null;
            let activeGroup: GroupResponse = null;
            this.store.pipe(take(1)).subscribe(s => {
                /**
                 * Handles if functionality
                 */
                if (s.groupwithaccounts) {
                    activeGroup = s.groupwithaccounts.activeGroup;
                    activeAccount = s.groupwithaccounts.activeAccount;
                }
            });
            /**
             * Handles if functionality
             */
            if (activeGroup && !activeAccount) {
                /**
                 * Handles if functionality
                 */
                if (a) {
                    this.showEditTaxSection = true;
                }
            }
        });
    }

    /**
     * Calculates total value
     */
    public calculateTotal() {
        /**
         * Handles if functionality
         */
        if (this.currentTxn && this.currentTxn.amount) {
            let total = (this.currentTxn.amount - this.currentTxn.discount) || 0;
            this.totalForTax = total;
            this.currentTxn.total = Number((total + ((total * this.currentTxn.tax) / 100)).toFixed(2));
        }
    }

    /**
     * Handles amountChanged functionality
     */
    public amountChanged() {
        /**
         * Handles if functionality
         */
        if (this.discountControl) {
            this.discountControl.change();
        }
        /**
         * Handles if functionality
         */
        if (this.currentTxn && this.currentTxn.selectedAccount) {
            /**
             * Handles if functionality
             */
            if (this.currentTxn.selectedAccount.stock && this.currentTxn.amount > 0) {
                /**
                 * Handles if functionality
                 */
                if (this.currentTxn.inventory.quantity) {
                    this.currentTxn.inventory.unit.rate = Number((this.currentTxn.amount / this.currentTxn.inventory.quantity).toFixed(2));
                }
            }
        }

        /**
         * Handles if functionality
         */
        if (this.isAmountFirst || this.isTotalFirts) {
            return;
        } else {
            this.isAmountFirst = true;
        }
    }

    /**
     * Handles changePrice functionality
     */
    public changePrice(val: string) {
        this.currentTxn.inventory.unit.rate = Number(cloneDeep(val));
        this.currentTxn.amount = Number((this.currentTxn.inventory.unit.rate * this.currentTxn.inventory.quantity).toFixed(2));
        this.calculateTotal();
    }

    /**
     * Handles changeQuantity functionality
     */
    public changeQuantity(val: string) {
        this.currentTxn.inventory.quantity = Number(val);
        this.currentTxn.amount = Number((this.currentTxn.inventory.unit.rate * this.currentTxn.inventory.quantity).toFixed(2));
        this.calculateTotal();
    }

    /**
     * Calculates amount value
     */
    public calculateAmount() {

        /**
         * Handles if functionality
         */
        if (!(typeof this.currentTxn.total === 'string')) {
            return;
        }
        let fixDiscount = 0;
        let percentageDiscount = 0;
        /**
         * Handles if functionality
         */
        if (this.discountControl) {
            percentageDiscount = this.discountControl.discountAccountsDetails?.filter(f => f.isActive)
                .filter(s => s.discountType === 'PERCENTAGE')
                .reduce((pv, cv) => {
                    return Number(cv.discountValue) ? Number(pv) + Number(cv.discountValue) : Number(pv);
                }, 0) || 0;

            fixDiscount = this.discountControl.discountAccountsDetails?.filter(f => f.isActive)
                .filter(s => s.discountType === 'FIX_AMOUNT')
                .reduce((pv, cv) => {
                    return Number(cv.discountValue) ? Number(pv) + Number(cv.discountValue) : Number(pv);
                }, 0) || 0;

        }
        // A = (P+X+ 0.01XT) /(1-0.01Y + 0.01T -0.0001YT)

        this.currentTxn.amount = Number(((Number(this.currentTxn.total) + fixDiscount + 0.01 * fixDiscount * Number(this.currentTxn.tax)) /
            (1 - 0.01 * percentageDiscount + 0.01 * Number(this.currentTxn.tax) - 0.0001 * percentageDiscount * Number(this.currentTxn.tax))).toFixed(2));

        /**
         * Handles if functionality
         */
        if (this.discountControl) {
            this.discountControl.ledgerAmount = this.currentTxn.amount;
            this.discountControl.change();
        }

        /**
         * Handles if functionality
         */
        if (this.currentTxn?.selectedAccount) {
            /**
             * Handles if functionality
             */
            if (this.currentTxn.selectedAccount.stock) {
                this.currentTxn.inventory.unit.rate = Number((this.currentTxn.amount / this.currentTxn.inventory.quantity).toFixed(2));
            }
        }
        /**
         * Handles if functionality
         */
        if (this.isTotalFirts || this.isAmountFirst) {
            return;
        } else {
            this.isTotalFirts = true;
            this.currentTxn.isInclusiveTax = true;
        }
    }


    /**
     * Hides tax element
     */
    public hideTax(): void {
        /**
         * Handles if functionality
         */
        if (this.taxControll) {
            this.taxControll.change();
        }
    }

    /**
     * Open delete group dialog
     * @returns void
     * @memberof GroupUpdateComponent
     */
    public openDeleteGroupDialog(): void {
        this.deleteGroupConfirmationDialogRef = this.dialog.open(this.deleteGroupConfirmationDialog, {
            panelClass: ['mat-dialog-md'],
            disableClose: true
        });
    }

    /**
     * Close delete group dialog
     * @returns void
     * @memberof GroupUpdateComponent
     */
    public closeDeleteGroupDialog(): void {
        this.deleteGroupConfirmationDialogRef?.close();
    }

    /**
     * Handles flattenGroup functionality
     */
    public flattenGroup(rawList: any[], parents: any[] = []): any[] {
        return GroupFlattenHelper.flattenGroup(rawList, parents);
    }

    /**
     * Handles makeGroupListFlatwithLessDtl functionality
     */
    public makeGroupListFlatwithLessDtl(rawList: any) {
        let obj;
        obj = map(rawList, (item: any) => {
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
     * Handles customMoveGroupFilter functionality
     */
    public customMoveGroupFilter(term: string, item: IOption): boolean {
        /**
         * Handles return functionality
         */
        return (item?.label?.toLocaleLowerCase()?.indexOf(term) > -1 || item?.value?.toLocaleLowerCase()?.indexOf(term) > -1);
    }

    /**
     * Handles moveGroup functionality
     */
    public moveGroup() {
        let activeGroupUniqueName: string;
        this.activeGroupUniqueName$.pipe(take(1)).subscribe(a => activeGroupUniqueName = a);

        let grpObject = new MoveGroupRequest();
        grpObject.parentGroupUniqueName = this.moveGroupForm?.value.moveto;
        this.store.dispatch(this.groupWithAccountsAction.moveGroup(grpObject, activeGroupUniqueName));
        this.moveGroupForm.reset();
    }

    /**
     * Deletes group
     */
    public deleteGroup() {
        let activeGroupUniqueName: string;
        this.activeGroupUniqueName$.pipe(take(1)).subscribe(a => activeGroupUniqueName = a);
        this.store.dispatch(this.groupWithAccountsAction.deleteGroup(activeGroupUniqueName));
        this.closeDeleteGroupDialog();
    }

    /**
     * Updates existing group
     */
    public updateGroup() {
        let activeGroupUniqueName: string;
        let uniqueName = this.groupDetailForm.get('uniqueName');
        uniqueName?.patchValue(uniqueName?.value?.replace(/ /g, '')?.toLowerCase());

        this.activeGroupUniqueName$.pipe(take(1)).subscribe(a => activeGroupUniqueName = a);
        this.store.dispatch(this.groupWithAccountsAction.updateGroup(this.groupDetailForm?.value, activeGroupUniqueName));
    }

    /**
     * Handles taxHierarchy functionality
     */
    public async taxHierarchy() {
        this.showTaxes = false;
        let activeAccount: AccountResponseV2 = null;
        let activeGroupUniqueName: string = null;
        this.store.pipe(take(1)).subscribe(s => {
            /**
             * Handles if functionality
             */
            if (s.groupwithaccounts) {
                activeAccount = s.groupwithaccounts.activeAccount;
                activeGroupUniqueName = s.groupwithaccounts.activeGroupUniqueName;
            }
        });
        /**
         * Handles if functionality
         */
        if (activeAccount) {
            this.store.dispatch(this.companyActions.getTax());
            this.store.dispatch(this.accountsAction.getTaxHierarchy(activeAccount.uniqueName));
        } else {
            this.store.dispatch(this.companyActions.getTax());
            this.store.dispatch(this.groupWithAccountsAction.getTaxHierarchy(activeGroupUniqueName));
            this.showEditTaxSection = true;
        }
    }

    /**
     * Handles applyTax functionality
     */
    public applyTax() {
        let activeAccount: AccountResponseV2 = null;
        let activeGroup: GroupResponse = null;
        this.store.pipe(take(1)).subscribe(s => {
            /**
             * Handles if functionality
             */
            if (s.groupwithaccounts) {
                activeAccount = s.groupwithaccounts.activeAccount;
                activeGroup = s.groupwithaccounts.activeGroup;
            }
        });
        let data: ApplyTaxRequest = new ApplyTaxRequest();
        data.isAccount = false;
        data.taxes = [];
        this.activeGroupTaxHierarchy$.pipe(take(1)).subscribe((t) => {
            /**
             * Handles if functionality
             */
            if (t) {
                (Array.isArray(t.inheritedTaxes) ? t.inheritedTaxes : []).forEach(tt => {
                    (Array.isArray(tt.applicableTaxes) ? tt.applicableTaxes : []).forEach(ttt => {
                        data.taxes.push(ttt?.uniqueName);
                    });
                });
            }
        });
        data.taxes.push.apply(data.taxes, this.taxGroupForm?.value.taxes);
        data.uniqueName = activeGroup?.uniqueName;
        this.store.dispatch(this.groupWithAccountsAction.applyGroupTax(data));
        this.showEditTaxSection = false;
    }

    /**
     * Retrieves accountfromgroup data
     */
    public getAccountFromGroup(activeGroup: GroupResponse, result: boolean): boolean {
        this.isDebtorCreditorGroups = Boolean(this.isDebtorCreditorGroup(activeGroup));
        /**
         * Handles if functionality
         */
        if (activeGroup.category === 'income' || activeGroup.category === 'expenses' || this.isDebtorCreditorGroups) {
            result = true;
        }
        return result;
    }

    /**
     * Handles closingBalanceTypeChanged functionality
     */
    public closingBalanceTypeChanged(type: string) {
        /**
         * Handles if functionality
         */
        if (Number(this.groupDetailForm.get('closingBalanceTriggerAmount')?.value) > 0) {
            this.groupDetailForm.get('closingBalanceTriggerAmountType')?.patchValue(type);
        }
    }

    /**
     * Handles ngOnDestroy functionality
     */
    public ngOnDestroy(): void {
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }

    /**
     * To get sub group belongs to mentioned group (currentliabilities , currentassets)
     *
     * @param {GroupResponse} activeGroup Active group data
     * @param {boolean} [returnIndividualStatus] True, if separate status for creditor or debtor is required
     * @return {(boolean | {isCreditor: boolean, isDebtor: boolean})} Status of group
     * @memberof GroupUpdateComponent
     */
    public isDebtorCreditorGroup(activeGroup: GroupResponse, returnIndividualStatus?: boolean): boolean | { isCreditor?: boolean, isDebtor?: boolean } {
        let isTaxableGroup: boolean = false;
        /**
         * Handles if functionality
         */
        if (activeGroup && activeGroup.parentGroups) {
            /**
             * Handles isTaxableGroup functionality
             */
            isTaxableGroup = (activeGroup.uniqueName === 'sundrydebtors' || activeGroup.uniqueName === 'sundrycreditors') || activeGroup.parentGroups?.some(groupName => groupName?.uniqueName === 'sundrydebtors' || groupName?.uniqueName === 'sundrycreditors');
        }
        /**
         * Handles if functionality
         */
        if (returnIndividualStatus) {
            /**
             * Handles if functionality
             */
            if (activeGroup?.uniqueName === 'sundrydebtors' || activeGroup?.parentGroups?.some(groupName => groupName?.uniqueName === 'sundrydebtors')) {
                return { isDebtor: true };
            } else if (activeGroup?.uniqueName === 'sundrycreditors' || activeGroup?.parentGroups?.some(groupName => groupName?.uniqueName === 'sundrycreditors')) {
                return { isCreditor: true };
            }
        }
        return isTaxableGroup;
    }

    /**
     * To apply discount in accounts
     *
     * @memberof GroupUpdateComponent
     */
    public applyDiscounts(): void {
        let activeGroupUniqueName: string;
        this.activeGroup$.pipe(take(1)).subscribe(grp => activeGroupUniqueName = grp?.uniqueName);

        /**
         * Handles if functionality
         */
        if (activeGroupUniqueName) {
            let assignDiscountObject: ApplyDiscountRequestV2 = new ApplyDiscountRequestV2();
            assignDiscountObject.uniqueName = this.uniqueName;
            assignDiscountObject.discounts = this.discountGroupForm.get('discounts')?.value;
            assignDiscountObject.isAccount = false;
            this.store.dispatch(this.accountsAction.applyAccountDiscountV2([assignDiscountObject]));
        }
    }

    /**
     * To check taxes list updated
     *
     * @param {*} event
     * @memberof GroupUpdateComponent
     */
    public taxesSelected(event: any): void {
        /**
         * Handles if functionality
         */
        if (event) {
            this.isTaxesSaveDisable$ = of(false);
            this.taxGroupForm.get('taxes').patchValue(event);
        }
    }

    /**
     * To check discount list updated
     *
     * @param {any} event - event object containing selected discounts
     * @memberof GroupUpdateComponent
     */
    public discountSelected(event: any): void {
        /**
         * Handles if functionality
         */
        if (event) {
            this.discountGroupForm.get('discounts').patchValue(event);
            this.isDiscountSaveDisable$ = of(false);
        } 
    }

    /**
     * Search query change handler for group
     *
     * @param {string} query Search query
     * @param {number} [page=1] Page to request
     * @param {boolean} withStocks True, if search should include stocks in results
     * @param {Function} successCallback Callback to carry out further operation
     * @memberof SearchSidebarComponent
     */
    public onGroupSearchQueryChanged(query: string, page: number = 1, successCallback?: Function): void {
        this.groupsSearchResultsPaginationData.query = query;
        /**
         * Handles if functionality
         */
        if (!this.preventDefaultGroupScrollApiCall &&
            (query || (this.defaultGroupSuggestions && this.defaultGroupSuggestions.length === 0) || successCallback)) {
            // Call the API when either query is provided, default suggestions are not present or success callback is provided
            const requestObject: any = {
                q: encodeURIComponent(query),
                page,
                count: DROPDOWN_ITEMS_COUNT_LIMIT
            };
            this.groupService.searchGroups(requestObject).subscribe(data => {
                /**
                 * Handles if functionality
                 */
                if (data && data.body && data.body.results) {
                    let activeGroupUniqueName: string;
                    this.activeGroupUniqueName$.pipe(take(1)).subscribe(uniqueName => activeGroupUniqueName = uniqueName);
                    data.body.results = data.body.results.filter(group => group?.uniqueName !== activeGroupUniqueName);
                    const searchResults = data.body.results.map(result => {
                        return {
                            value: result?.uniqueName,
                            label: result.name
                        }
                    }) || [];
                    /**
                     * Handles if functionality
                     */
                    if (page === 1) {
                        this.searchedGroups = searchResults;
                    } else {
                        this.searchedGroups = [
                            ...this.searchedGroups,
                            ...searchResults
                        ];
                    }
                    this.groupsSearchResultsPaginationData.page = data.body.page;
                    this.groupsSearchResultsPaginationData.totalPages = data.body.totalPages;
                    /**
                     * Handles if functionality
                     */
                    if (successCallback) {
                        /**
                         * Handles successCallback functionality
                         */
                        successCallback(data.body.results);
                    } else {
                        this.defaultGroupPaginationData.page = this.groupsSearchResultsPaginationData.page;
                        this.defaultGroupPaginationData.totalPages = this.groupsSearchResultsPaginationData.totalPages;
                    }
                }
            });
        } else {
            this.searchedGroups = [...this.defaultGroupSuggestions];
            this.groupsSearchResultsPaginationData.page = this.defaultGroupPaginationData.page;
            this.groupsSearchResultsPaginationData.totalPages = this.defaultGroupPaginationData.totalPages;
            this.preventDefaultGroupScrollApiCall = true;
            /**
             * Sets timeout value
             */
            setTimeout(() => {
                this.preventDefaultGroupScrollApiCall = false;
            }, 500);
        }
    }

    /**
     * Scroll end handler for group dropdown
     *
     * @returns null
     * @memberof SearchSidebarComponent
     */
    public handleGroupScrollEnd(): void {
        /**
         * Handles if functionality
         */
        if (this.groupsSearchResultsPaginationData.page < this.groupsSearchResultsPaginationData.totalPages) {
            this.onGroupSearchQueryChanged(
                this.groupsSearchResultsPaginationData.query,
                this.groupsSearchResultsPaginationData.page + 1,
                (response) => {
                    /**
                     * Handles if functionality
                     */
                    if (!this.groupsSearchResultsPaginationData.query) {
                        const results = response.map(result => {
                            return {
                                value: result?.uniqueName,
                                label: result.name
                            }
                        }) || [];
                        this.defaultGroupSuggestions = this.defaultGroupSuggestions.concat(...results);
                        this.defaultGroupPaginationData.page = this.groupsSearchResultsPaginationData.page;
                        this.defaultGroupPaginationData.totalPages = this.groupsSearchResultsPaginationData.totalPages;
                    }
                });
        }
    }

    /**
     * Loads the default group list for advance search
     *
     * @private
     * @memberof SearchSidebarComponent
     */
    private loadDefaultGroupsSuggestions(): void {
        this.onGroupSearchQueryChanged('', 1, (response) => {
            this.defaultGroupSuggestions = response.map(result => {
                return {
                    value: result?.uniqueName,
                    label: result.name
                }
            }) || [];
            this.defaultGroupPaginationData.page = this.groupsSearchResultsPaginationData.page;
            this.defaultGroupPaginationData.totalPages = this.groupsSearchResultsPaginationData.totalPages;
            this.searchedGroups = [...this.defaultGroupSuggestions];
        });
    }

    /**
     * Filters taxes for Sundry debtors and creditors
     *
     * @private
     * @memberof GroupUpdateComponent
     */
    private filterTaxesForDebtorCreditor(): void {
        let activeGroup;
        this.activeGroup$.pipe(take(1)).subscribe(group => activeGroup = group);
        const { isDebtor, isCreditor }: any = this.isDebtorCreditorGroup(activeGroup, true);
        /**
         * Handles if functionality
         */
        if (isDebtor) {
            // Only allow TDS receivable and TCS payable
            this.companyTaxDropDown = this.companyTaxDropDown?.filter(tax => ['tdsrc', 'tcspay']?.indexOf(tax?.additional?.taxType) > -1);
        } else if (isCreditor) {
            // Only allow TDS payable and TCS receivable
            this.companyTaxDropDown = this.companyTaxDropDown?.filter(tax => ['tdspay', 'tcsrc']?.indexOf(tax?.additional?.taxType) > -1);
        } else {
            // Only normal (non-other) taxes
            this.companyTaxDropDown = this.companyTaxDropDown?.filter(tax => TCS_TDS_TAXES_TYPES?.indexOf(tax?.additional?.taxType) === -1);
        }
        /**
         * Handles if functionality
         */
        if (this.companyTaxDropDown?.length) {
            const selectedTaxes = this.taxGroupForm?.get("taxes")?.value || [];
            this.defaultTaxLabel = selectedTaxes.map((selectTax: any) => {
                return this.companyTaxDropDown.find(tax => tax.value === selectTax)?.label;
            });
        } else {
            this.defaultTaxLabel = [];
        }
    }
}
