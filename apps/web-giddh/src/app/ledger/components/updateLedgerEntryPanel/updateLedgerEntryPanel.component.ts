import { animate, state, style, transition, trigger } from '@angular/animations';
import {
    AfterViewInit,
    Component, ElementRef,
    EventEmitter,
    Input,
    OnChanges,
    OnDestroy,
    OnInit,
    Output,
    SimpleChanges,
    ViewChild
} from '@angular/core';
import { select, Store } from '@ngrx/store';
import { ResizedEvent } from 'angular-resize-event';
import { Configuration, SubVoucher, RATE_FIELD_PRECISION, SearchResultText } from 'apps/web-giddh/src/app/app.constant';
import { GIDDH_DATE_FORMAT } from 'apps/web-giddh/src/app/shared/helpers/defaultDateFormat';
import { saveAs } from 'file-saver';
import * as moment from 'moment/moment';
import { BsDatepickerDirective } from "ngx-bootstrap/datepicker";
import { ModalDirective } from 'ngx-bootstrap/modal';
import { PopoverDirective } from "ngx-bootstrap/popover";
import { UploaderOptions, UploadInput, UploadOutput } from 'ngx-uploader';
import { createSelector } from 'reselect';
import { combineLatest as observableCombineLatest, Observable, of as observableOf, ReplaySubject, Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';
import { LedgerActions } from '../../../actions/ledger/ledger.actions';
import { SettingsTagActions } from '../../../actions/settings/tag/settings.tag.actions';
import { ConfirmationModalConfiguration, CONFIRMATION_ACTIONS } from '../../../common/confirmation-modal/confirmation-modal.interface';
import { LoaderService } from '../../../loader/loader.service';
import { cloneDeep, filter, last, orderBy } from '../../../lodash-optimized';
import { AccountResponse } from '../../../models/api-models/Account';
import { AdjustAdvancePaymentModal, VoucherAdjustments } from '../../../models/api-models/AdvanceReceiptsAdjust';
import { ICurrencyResponse, TaxResponse } from '../../../models/api-models/Company';
import { PettyCashResonse } from '../../../models/api-models/Expences';
import { DownloadLedgerRequest, LedgerResponse } from '../../../models/api-models/Ledger';
import { IForceClear, SalesOtherTaxesCalculationMethodEnum, SalesOtherTaxesModal, VoucherTypeEnum } from '../../../models/api-models/Sales';
import { TagRequest } from '../../../models/api-models/settingsTags';
import { IFlattenAccountsResultItem } from '../../../models/interfaces/flattenAccountsResultItem.interface';
import { ILedgerTransactionItem } from '../../../models/interfaces/ledger.interface';
import { AccountService } from '../../../services/account.service';
import { LEDGER_API } from '../../../services/apiurls/ledger.api';
import { GeneralService } from '../../../services/general.service';
import { LedgerService } from '../../../services/ledger.service';
import { ToasterService } from '../../../services/toaster.service';
import { SettingsUtilityService } from '../../../settings/services/settings-utility.service';
import { base64ToBlob, giddhRoundOff } from '../../../shared/helpers/helperFunctions';
import { AppState } from '../../../store';
import { CurrentCompanyState } from '../../../store/Company/company.reducer';
import { IOption } from '../../../theme/ng-virtual-select/sh-options.interface';
import { ShSelectComponent } from '../../../theme/ng-virtual-select/sh-select.component';
import { TaxControlComponent } from '../../../theme/tax-control/tax-control.component';
import { AVAILABLE_ITC_LIST } from '../../ledger.vm';
import { UpdateLedgerDiscountComponent } from '../updateLedgerDiscount/updateLedgerDiscount.component';
import { UpdateLedgerVm } from './updateLedger.vm';
import { SearchService } from '../../../services/search.service';
import { WarehouseActions } from '../../../settings/warehouse/action/warehouse.action';
import { OrganizationType } from '../../../models/user-login-state';
import { SettingsBranchActions } from '../../../actions/settings/branch/settings.branch.action';

/** Info message to be displayed during adjustment if the voucher is not generated */
const ADJUSTMENT_INFO_MESSAGE = 'Voucher should be generated in order to make adjustments';

@Component({
    selector: 'update-ledger-entry-panel',
    templateUrl: './updateLedgerEntryPanel.component.html',
    styleUrls: ['./updateLedgerEntryPanel.component.scss'],
    animations: [
        trigger('slideInOut', [
            state('in', style({
                transform: 'translate3d(0, 0, 0)'
            })),
            state('out', style({
                transform: 'translate3d(100%, 0, 0)'
            })),
            transition('in => out', animate('400ms ease-in-out')),
            transition('out => in', animate('400ms ease-in-out'))
        ]),
    ]
})
export class UpdateLedgerEntryPanelComponent implements OnInit, AfterViewInit, OnDestroy, OnChanges {
    public vm: UpdateLedgerVm;
    @Output() public closeUpdateLedgerModal: EventEmitter<boolean> = new EventEmitter();
    @Output() public showQuickAccountModalFromUpdateLedger: EventEmitter<boolean> = new EventEmitter();
    @Output() public toggleOtherTaxesAsideMenu: EventEmitter<UpdateLedgerVm> = new EventEmitter();
    /** Emits when more detail is opened */
    @Output() public moreDetailOpen: EventEmitter<any> = new EventEmitter();

    @Input() isPettyCash: boolean = false;
    @Input() pettyCashEntry: any;
    @Input() pettyCashBaseAccountTypeString: string;
    @Input() pettyCashBaseAccountUniqueName: string;

    @ViewChild('deleteAttachedFileModal', {static: true}) public deleteAttachedFileModal: ModalDirective;
    /** fileinput element ref for clear value after remove attachment **/
    @ViewChild('fileInputUpdate', {static: true}) public fileInputElement: ElementRef<any>;
    @ViewChild('deleteEntryModal', {static: true}) public deleteEntryModal: ModalDirective;
    @ViewChild('discount', {static: false}) public discountComponent: UpdateLedgerDiscountComponent;
    @ViewChild('tax', {static: false}) public taxControll: TaxControlComponent;
    @ViewChild('updateBaseAccount', {static: true}) public updateBaseAccount: ModalDirective;
    @ViewChild(BsDatepickerDirective, {static: true}) public datepickers: BsDatepickerDirective;
    /** Advance receipt remove confirmation modal reference */
    @ViewChild('advanceReceiptRemoveConfirmationModal', {static: true}) public advanceReceiptRemoveConfirmationModal: ModalDirective;
    /** Adjustment modal */
    @ViewChild('adjustPaymentModal', {static: true}) public adjustPaymentModal: ModalDirective;

    /** RCM popup instance */
    @ViewChild('rcmPopup', {static: false}) public rcmPopup: PopoverDirective;

    /** Warehouse data for warehouse drop down */
    public warehouses: Array<any>;
    /** Currently selected warehouse */
    public selectedWarehouse: string;
    /** Default warehouse of a company */
    private defaultWarehouse: string;
    /** True, if warehouse drop down should be displayed */
    public shouldShowWarehouse: boolean;
    /** True, if subvoucher is RCM */
    public isRcmEntry: boolean = false;
    /** RCM modal configuration */
    public rcmConfiguration: ConfirmationModalConfiguration;
    /** True, if RCM should be displayed */
    public shouldShowRcmEntry: boolean;
    /** True, if advance receipt is enabled */
    public isAdvanceReceipt: boolean = false;
    /** True, if advance receipt checkbox is checked, will show the mandatory fields for Advance Receipt */
    public shouldShowAdvanceReceiptMandatoryFields: boolean = false;
    /** List of available ITC */
    public availableItcList: Array<any> = AVAILABLE_ITC_LIST;
    /** True, if RCM taxable amount needs to be displayed in create new ledger component as per criteria */
    public shouldShowRcmTaxableAmount: boolean = false;
    /** True, if ITC section needs to be displayed in create new ledger component as per criteria  */
    public shouldShowItcSection: boolean = false;
    /** Allowed taxes list contains the unique name of all
     * tax types within a company and count upto which they are allowed
     */
    public allowedSelectionOfAType: any = { type: [], count: 1 };
    public tags$: Observable<TagRequest[]>;
    public sessionKey$: Observable<string>;
    public companyName$: Observable<string>;
    public isFileUploading: boolean = false;
    public accountUniqueName: string;
    public entryUniqueName$: Observable<string>;
    public editAccUniqueName$: Observable<string>;
    public entryUniqueName: string;
    public uploadInput: EventEmitter<UploadInput>;
    public fileUploadOptions: UploaderOptions;
    public isDeleteTrxEntrySuccess$: Observable<boolean>;
    public isTxnUpdateInProcess$: Observable<boolean>;
    public isTxnUpdateSuccess$: Observable<boolean>;
    public flattenAccountListStream$: Observable<IFlattenAccountsResultItem[]>;
    public selectedLedgerStream$: Observable<LedgerResponse>;
    public companyProfile$: Observable<any>;
    public activeAccount$: Observable<AccountResponse>;
    public activeAccount: AccountResponse;
    /** Emits the active ledger account data */
    public activeAccountSubject: Subject<any> = new Subject();
    public destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
    public showAdvanced: boolean;
    // public currentAccountApplicableTaxes: string[] = [];

    public baseCurrency: string = null;
    public isChangeAcc: boolean = false;
    public firstBaseAccountSelected: string;
    public existingTaxTxn: any[] = [];
    public baseAccount$: Observable<any> = observableOf(null);
    /** Stores the base account details */
    public baseAccountDetails: any;
    public baseAcc: string;
    public baseAccountChanged: boolean = false;
    public changedAccountUniq: any = null;
    public invoiceList: any[] = [];
    public openDropDown: boolean = false;
    public totalAmount: any;
    public baseAccountName$: Observable<string> = observableOf(null);
    public giddhDateFormat: string = GIDDH_DATE_FORMAT;
    public profileObj: any;
    public keydownClassAdded: boolean = false;
    public tcsOrTds: 'tcs' | 'tds' = 'tcs';
    public totalTdElementWidth: number = 0;
    public multiCurrencyAccDetails: any = null;
    public selectedPettycashEntry$: Observable<PettyCashResonse>;
    /** Amount of invoice select for credit note */
    public selectedInvoiceAmount: number = 0;
    /** Selected invoice for credit note */
    public selectedInvoice: any = null;
    public accountPettyCashStream: any;
    /**To check tourist scheme applicable or not */
    public isTouristSchemeApplicable: boolean = false;
    public allowParentGroup = ['sales', 'cash', 'sundrydebtors', 'bankaccounts'];
    /** To check advance receipts adjusted invoice is there for trasaction */
    public isAdjustedInvoicesWithAdvanceReceipt: boolean = false;
    /** To check advance receipts adjustment is there for trasaction */
    public isAdjustedWithAdvanceReceipt: boolean = false;
    /** To check is advance receipt adjustment invoice list need to show  */
    public selectedAdvanceReceiptAdjustInvoiceEditMode: boolean = false;
    /** To check advance receipt/invoice amount is exceed by compound total */
    public isAdjustedAmountExcess: boolean = false;
    /** To check advance receipt/invoice amount is exceed by compound total */
    public adjustedExcessAmount: number = 0;
    /** To check advance receipt/invoice amount is exceed by compound total */
    public totalAdjustedAmount: number = 0;
    /** True, if company country supports other tax (TCS/TDS) */
    public isTcsTdsApplicable: boolean;
    /** Rate should have precision up to 4 digits for better calculation */
    public ratePrecision = RATE_FIELD_PRECISION;
    /** Clear selected invoice */
    public forceClear$: Observable<IForceClear> = observableOf({ status: false });
    /** True when user checks the adjust advance receipt */
    public isAdjustAdvanceReceiptSelected: boolean;
    /** True when user checks the adjust receipt checkbox */
    public isAdjustReceiptSelected: boolean;
    /** True when user checks any voucher for adjustment (sales, purchase, payment, receipt & advance-receipt) checkbox */
    public isAdjustVoucherSelected: boolean;
    /** Stores the details for adjustment component */
    public adjustVoucherConfiguration: any;
    /** Stores the search results */
    public searchResults: Array<IOption> = [];
    /** Default search suggestion list to be shown for search */
    public defaultSuggestions: Array<IOption> = [];
    /** Stores the search results pagination details */
    public searchResultsPaginationData = {
        page: 0,
        totalPages: 0,
        query: ''
    };
    /** Stores the default search results pagination details (required only for passing
     * default search pagination details to Update ledger component) */
    public defaultResultsPaginationData = {
        page: 0,
        totalPages: 0,
        query: ''
    };

    /** No results found label for dynamic search */
    public noResultsFoundLabel = SearchResultText.NewSearch;

    /** True, if all the transactions are of type 'Tax' or 'Reverse Charge' */
    private taxOnlyTransactions: boolean;
    /** Remove Advance receipt confirmation flag */
    public confirmationFlag: string = 'text-paragraph';
    /** Remove Advance receipt confirmation message */
    public removeAdvanceReceiptConfirmationMessage: string = 'If you change the type of this receipt, all the related advance receipt adjustments in invoices will be removed. & Are you sure you want to proceed?';// & symbol is not part of message it to split sentance by '&'
    /* This will hold the account unique name which is going to be in edit mode to get compared once updated */
    public entryAccountUniqueName: any = '';
    /** Stores the current organization type */
    public currentOrganizationType: string;
    /** Observable to store the branches of current company */
    public currentCompanyBranches$: Observable<any>;
    /** Stores the current branches */
    public branches: Array<any>;

    constructor(
        private _accountService: AccountService,
        private ledgerService: LedgerService,
        private generalService: GeneralService,
        private _ledgerAction: LedgerActions,
        private _loaderService: LoaderService,
        private _settingsTagActions: SettingsTagActions,
        private settingsBranchAction: SettingsBranchActions,
        private settingsUtilityService: SettingsUtilityService,
        private store: Store<AppState>,
        private searchService: SearchService,
        private _toasty: ToasterService,
        private warehouseActions: WarehouseActions
    ) {

        this.vm = new UpdateLedgerVm();

        this.entryUniqueName$ = this.store.pipe(select(p => p.ledger.selectedTxnForEditUniqueName), takeUntil(this.destroyed$));
        this.editAccUniqueName$ = this.store.pipe(select(p => p.ledger.selectedAccForEditUniqueName), takeUntil(this.destroyed$));
        this.selectedLedgerStream$ = this.store.pipe(select(p => p.ledger.transactionDetails), takeUntil(this.destroyed$));
        this.companyProfile$ = this.store.pipe(select(p => p.settings.profile), takeUntil(this.destroyed$));
        this.flattenAccountListStream$ = this.store.pipe(select(p => p.general.flattenAccounts), takeUntil(this.destroyed$));
        this.vm.companyTaxesList$ = this.store.pipe(select(p => p.company && p.company.taxes), takeUntil(this.destroyed$));
        this.sessionKey$ = this.store.pipe(select(p => p.session.user.session.id), takeUntil(this.destroyed$));
        this.companyName$ = this.store.pipe(select(p => p.session.companyUniqueName), takeUntil(this.destroyed$));
        this.isDeleteTrxEntrySuccess$ = this.store.pipe(select(p => p.ledger.isDeleteTrxEntrySuccessfull), takeUntil(this.destroyed$));
        this.isTxnUpdateInProcess$ = this.store.pipe(select(p => p.ledger.isTxnUpdateInProcess), takeUntil(this.destroyed$));
        this.isTxnUpdateSuccess$ = this.store.pipe(select(p => p.ledger.isTxnUpdateSuccess), takeUntil(this.destroyed$));
        this.closeUpdateLedgerModal.pipe(takeUntil(this.destroyed$));
        this.vm.currencyList$ = this.store.pipe(select(s => s.session.currencies), takeUntil(this.destroyed$));
        this.store.dispatch(this._settingsTagActions.GetALLTags());
        this.selectedPettycashEntry$ = this.store.pipe(select(p => p.expense.pettycashEntry), takeUntil(this.destroyed$));
    }

    Shown: boolean = true;
    isHide: boolean = false;
    condition: boolean = true;
    condition2: boolean = false;

    toggleShow() {
        this.condition = !this.condition;
        this.condition2 = !this.condition;
        this.Shown = !this.Shown;
        this.isHide = !this.isHide;
    }

    public ngOnInit() {
        this.currentOrganizationType = this.generalService.currentOrganizationType;
        this.currentCompanyBranches$ = this.store.pipe(select(appStore => appStore.settings.branches), takeUntil(this.destroyed$));
        this.currentCompanyBranches$.subscribe(response => {
            if (response) {
                this.branches = response;
            } else {
                this.store.dispatch(this.settingsBranchAction.GetALLBranches({from: '', to: ''}));
            }
        });
        this.store.pipe(select(state => state.ledger.refreshLedger), takeUntil(this.destroyed$)).subscribe(response => {
            if (response === true) {
                this.store.dispatch(this._ledgerAction.refreshLedger(false));
                this.entryAccountUniqueName = "";
                this.closeUpdateLedgerModal.emit();
            }
        });

        this.store.pipe(select(appState => appState.warehouse.warehouses), takeUntil(this.destroyed$)).subscribe((warehouses: any) => {
            if (warehouses) {
                const warehouseData = this.settingsUtilityService.getFormattedWarehouseData(warehouses.results);
                this.warehouses = warehouseData.formattedWarehouses;
                this.defaultWarehouse = (warehouseData.defaultWareßhouse) ? warehouseData.defaultWarehouse.uniqueName : '';
            } else {
                this.store.dispatch(this.warehouseActions.fetchAllWarehouses({ page: 1, count: 0 }));
            }
        });
        this.store.pipe(select(appState => appState.company), takeUntil(this.destroyed$)).subscribe((companyData: CurrentCompanyState) => {
            if (companyData) {
                this.isTcsTdsApplicable = companyData.isTcsTdsApplicable;
            }
        });
        this.showAdvanced = false;
        this.vm.selectedLedger = new LedgerResponse();
        this.vm.selectedLedger.otherTaxModal = new SalesOtherTaxesModal();
        // this.totalAmount = this.vm.totalAmount;
        this.tags$ = this.store.pipe(select(createSelector([(st: AppState) => st.settings.tags], (tags) => {
            if (tags && tags.length) {
                _.map(tags, (tag) => {
                    tag.label = tag.name;
                    tag.value = tag.name;
                });
                return _.orderBy(tags, 'name');
            }
        })), takeUntil(this.destroyed$));

        if (this.isPettyCash) {
            this.selectedPettycashEntry$.pipe(takeUntil(this.destroyed$)).subscribe(res => {
                if (res) {
                    // this.accountPettyCashStream = res;
                    // this.editAccUniqueName$ = observableOf(this.accountPettyCashStream.baseAccount.uniqueName);
                    this.entryUniqueName = res.uniqueName;
                    this.accountUniqueName = res.particular.uniqueName;
                    this.selectedLedgerStream$ = observableOf(res as LedgerResponse);
                }
            });
        }
        this.vm.companyTaxesList$.pipe(take(1)).subscribe(taxes => {
            if (taxes) {
                taxes.forEach((tax) => {
                    if (!this.allowedSelectionOfAType.type.includes(tax.taxType)) {
                        this.allowedSelectionOfAType.type.push(tax.taxType);
                    }
                });
            } else {
                this.allowedSelectionOfAType.type = [];
            }
        });

        // get entry name and ledger account uniqueName
        observableCombineLatest(this.entryUniqueName$, this.editAccUniqueName$).subscribe((resp: any[]) => {
            if (resp[0] && resp[1]) {
                this.entryUniqueName = resp[0];
                this.accountUniqueName = resp[1];
                this.store.dispatch(this._ledgerAction.getLedgerTrxDetails(this.accountUniqueName, this.entryUniqueName));
                // this.firstBaseAccountSelected = this.accountUniqueName;
            }
        });

        // emit upload event
        this.uploadInput = new EventEmitter<UploadInput>();
        // set file upload options
        this.fileUploadOptions = { concurrency: 0 };

        // get flatten_accounts list && get transactions list && get ledger account list
        observableCombineLatest([this.selectedLedgerStream$, this._accountService.GetAccountDetailsV2(this.accountUniqueName), this.companyProfile$])
            .subscribe((resp: any[]) => {
                if (resp[0] && resp[1] && resp[2]) {
                    // insure we have account details, if we are normal ledger mode and not petty cash mode ( special case for others entry in petty cash )
                    if (this.isPettyCash && this.accountUniqueName && resp[1].status !== 'success') {
                        return;
                    }

                    //#region flatten group list assign process
                    // TODO: Prateek
                    // this.vm.flatternAccountList = resp[0];
                    this.baseAccountDetails = resp[0];
                    this.activeAccount = cloneDeep(resp[1].body);
                    // Decides whether to show the RCM entry
                    this.shouldShowRcmEntry = this.isRcmEntryPresent(resp[0].transactions);
                    this.isTouristSchemeApplicable = this.checkTouristSchemeApplicable(resp[0], resp[1], resp[2]);
                    this.shouldShowRcmTaxableAmount = resp[0].reverseChargeTaxableAmount !== undefined && resp[0].reverseChargeTaxableAmount !== null;
                    if (this.shouldShowRcmTaxableAmount) {
                        // Received taxable amount is a truthy value
                        resp[0].reverseChargeTaxableAmount = this.generalService.convertExponentialToNumber(resp[0].reverseChargeTaxableAmount);
                    }
                    // Show the ITC section if value of ITC is received (itcAvailable) or it's an old transaction that is eligible for ITC (isItcEligible)
                    this.shouldShowItcSection = !!resp[0].itcAvailable || resp[0].isItcEligible;
                    this.taxOnlyTransactions = resp[0].taxOnlyTransactions;
                    this.profileObj = resp[2];
                    this.vm.giddhBalanceDecimalPlaces = resp[2].balanceDecimalPlaces;
                    this.vm.inputMaskFormat = this.profileObj.balanceDisplayFormat ? this.profileObj.balanceDisplayFormat.toLowerCase() : '';

                    // special check if we have petty cash mode and we receive an entry whose uniquename is null
                    // so it means it's other account entry of petty cash
                    // so for that we have to add a dummy account in flatten account array
                    if (this.isPettyCash) {
                        // this.loadDefaultSearchSuggestions();
                        if (resp[0].othersCategory) {
                            // check we already have others account in flatten account, then don't do anything
                            const isThereOthersAcc = this.vm.flatternAccountList.some(d => d.uniqueName === 'others');
                            if (!isThereOthersAcc) {
                                // add new dummy account in flatten account array
                                this.vm.flatternAccountList.push({
                                    name: 'Others', uniqueName: 'others', applicableTaxes: [],
                                    parentGroups: [], isFixed: false, isDummy: true, mergedAccounts: ''
                                });
                            }
                        }
                    }

                    // TODO: Prateek start
                    // let stockListFormFlattenAccount: IFlattenAccountsResultItem;
                    // if (this.vm.flatternAccountList && this.vm.flatternAccountList.length && this.activeAccount) {
                    //     stockListFormFlattenAccount = resp[0].find((acc) => acc.uniqueName === this.activeAccount.uniqueName);
                    // }
                    // TODO: Prateek end

                    let isStockableAccount: boolean = false;

                    if (this.activeAccount) {
                        if (this.activeAccount.currency && this.vm.isMultiCurrencyAvailable) {
                            this.baseCurrency = this.activeAccount.currency;
                        }

                        // check if current account category is type 'income' or 'expenses'
                        let parentAcc = this.activeAccount.parentGroups[0].uniqueName;
                        let incomeAccArray = ['revenuefromoperations', 'otherincome'];
                        let expensesAccArray = ['operatingcost', 'indirectexpenses'];
                        let incomeAndExpensesAccArray = [...incomeAccArray, ...expensesAccArray];

                        // if (incomeAndExpensesAccArray.indexOf(parentAcc) > -1) {
                        //     let appTaxes = [];
                        //     this.activeAccount.applicableTaxes.forEach(app => appTaxes.push(app.uniqueName));
                        //     this.currentAccountApplicableTaxes = appTaxes;
                        // }

                        // check if account is stockable
                        isStockableAccount = this.activeAccount.uniqueName !== 'roundoff' ? incomeAndExpensesAccArray.includes(parentAcc) : false;
                    }

                    this.vm.getUnderstandingText(resp[0].particularType, resp[0].particular.name);
                    // TODO: Prateek start
                    // let accountsArray: IOption[] = [];
                    // let accountsForBaseAccountArray: IOption[] = [];
                    // if (isStockableAccount) {
                    //     // stocks from ledger account
                    //     this.vm.flatternAccountList.map(acc => {
                    //         // normal entry
                    //         accountsArray.push({ value: acc.uniqueName, label: acc.name, additional: acc });

                    //         // normal merge account entry
                    //         if (acc.mergedAccounts && acc.mergedAccounts !== '') {
                    //             let mergeAccs = acc.mergedAccounts.split(',');
                    //             mergeAccs.map(m => m.trim()).forEach(ma => {
                    //                 accountsArray.push({
                    //                     value: ma,
                    //                     label: ma,
                    //                     additional: acc
                    //                 });
                    //             });
                    //         }

                    //         // check if taxable or round off account then don't assign stocks
                    //         let notRoundOff = acc.uniqueName === 'roundoff';
                    //         let isTaxAccount = acc.uNameStr.indexOf('dutiestaxes') > -1;
                    //         if (!isTaxAccount && !notRoundOff && stockListFormFlattenAccount && stockListFormFlattenAccount.stocks) {
                    //             stockListFormFlattenAccount.stocks.map(as => {
                    //                 // stock entry
                    //                 accountsArray.push({
                    //                     value: `${acc.uniqueName}#${as.uniqueName}`,
                    //                     label: acc.name + '(' + as.uniqueName + ')',
                    //                     additional: Object.assign({}, acc, { stock: as })
                    //                 });
                    //                 // normal merge account entry
                    //                 if (acc.mergedAccounts && acc.mergedAccounts !== '') {
                    //                     let mergeAccs = acc.mergedAccounts.split(',');
                    //                     mergeAccs.map(m => m.trim()).forEach(ma => {
                    //                         accountsArray.push({
                    //                             value: `${ma}#${as.uniqueName}`,
                    //                             label: ma + '(' + as.uniqueName + ')',
                    //                             additional: Object.assign({}, acc, { stock: as })
                    //                         });
                    //                     });
                    //                 }
                    //             });
                    //         }

                    //         // add current account entry in base account array
                    //         accountsForBaseAccountArray.push({ value: acc.uniqueName, label: acc.name, additional: acc });
                    //     });

                    // } else {
                    //     this.vm.flatternAccountList.map(acc => {
                    //         if (acc.stocks) {
                    //             acc.stocks.map(as => {
                    //                 accountsArray.push({
                    //                     value: `${acc.uniqueName}#${as.uniqueName}`,
                    //                     label: `${acc.name} (${as.uniqueName})`,
                    //                     additional: Object.assign({}, acc, { stock: as })
                    //                 });
                    //             });
                    //             accountsArray.push({ value: acc.uniqueName, label: acc.name, additional: acc });
                    //         } else {
                    //             accountsArray.push({ value: acc.uniqueName, label: acc.name, additional: acc });

                    //             // add current account entry in base account array
                    //             accountsForBaseAccountArray.push({ value: acc.uniqueName, label: acc.name, additional: acc });
                    //         }
                    //         // normal merge account entry
                    //         if (acc.mergedAccounts && acc.mergedAccounts !== '') {
                    //             let mergeAccs = acc.mergedAccounts.split(',');
                    //             mergeAccs.map(m => m.trim()).forEach(ma => {
                    //                 accountsArray.push({
                    //                     value: ma,
                    //                     label: ma,
                    //                     additional: acc
                    //                 });
                    //             });
                    //         }
                    //     });
                    // }

                    // this.vm.flatternAccountList4Select = observableOf(orderBy(accountsArray, 'label'));
                    // this.vm.flatternAccountList4BaseAccount = orderBy(accountsForBaseAccountArray, 'label');
                    // TODO: Prateek end

                    //#region transaction assignment process
                    this.vm.selectedLedger = resp[0];
                    if (this.vm.selectedLedger && (this.vm.selectedLedger.voucherGeneratedType === VoucherTypeEnum.creditNote ||
                        this.vm.selectedLedger.voucherGeneratedType === VoucherTypeEnum.debitNote)) {
                        this.getInvoiceListsForCreditNote();
                    }

                    /** To check advance receipts adjustment for Tx (Using list of invoice is there or not)*/
                    // if (this.vm && this.vm.selectedLedger && this.vm.selectedLedger.invoiceAdvanceReceiptAdjustment && this.vm.selectedLedger.invoiceAdvanceReceiptAdjustment.adjustedInvoices && this.vm.selectedLedger.invoiceAdvanceReceiptAdjustment.adjustedInvoices.length) {
                    //     this.isAdjustedInvoicesWithAdvanceReceipt = true;
                    //     this.calculateInclusiveTaxesForAdvanceReceiptsInvoices();
                    // } else {
                    //     this.isAdjustedInvoicesWithAdvanceReceipt = false;
                    // }

                    // Check the RCM checkbox if API returns subvoucher as Reverse charge
                    this.isRcmEntry = (this.vm.selectedLedger.subVoucher === SubVoucher.ReverseCharge);
                    this.isAdvanceReceipt = (this.vm.selectedLedger.subVoucher === SubVoucher.AdvanceReceipt);
                    this.vm.isRcmEntry = this.isRcmEntry;
                    this.vm.isAdvanceReceipt = this.isAdvanceReceipt;
                    this.shouldShowAdvanceReceiptMandatoryFields = this.isAdvanceReceipt;

                    if (this.vm.selectedLedger.voucher && this.vm.selectedLedger.voucher.shortCode === 'rcpt' && this.isAdvanceReceipt) {
                        this.vm.selectedLedger.voucher.shortCode = 'advance-receipt';
                    }

                    this.makeAdjustmentCalculation();

                    if (this.isPettyCash) {
                        this.vm.selectedLedger.transactions.forEach(item => {
                            item.type = (item.type === 'cr' || item.type === 'CREDIT') ? 'CREDIT' : 'DEBIT';
                        });
                        // create missing property for petty cash
                        this.vm.selectedLedger.transactions.forEach(item => {
                            item.type = (item.type === 'cr' || item.type === 'CREDIT') ? 'CREDIT' : 'DEBIT';
                        });
                        this.vm.selectedLedger.transactions.forEach(f => {
                            f.isDiscount = false;
                            f.isTax = false;

                            // special case in petty cash mode
                            // others account entry
                            // need to assign dummy particular, when we found particular uniquename as null
                            if (!f.particular.uniqueName) {
                                f.particular.uniqueName = 'others';
                                f.particular.name = 'others';
                            }

                        });
                        this.vm.selectedLedger.taxes = [];
                        this.vm.selectedLedger.discounts = [];
                        this.vm.selectedLedger.attachedFile = '';
                        this.vm.selectedLedger.voucher = { name: '', shortCode: '' };
                        this.vm.selectedLedger.invoicesToBePaid = [];
                    }

                    this.vm.selectedLedger.exchangeRateForDisplay = giddhRoundOff(this.vm.selectedLedger.exchangeRate, this.vm.giddhBalanceDecimalPlaces);
                    // this.vm.selectedLedger.exchangeRate = giddhRoundOff(this.vm.selectedLedger.exchangeRate, 4);

                    // divide actual amount with exchangeRate because currently we are getting actualAmount in company currency
                    this.vm.selectedLedger.actualAmount = giddhRoundOff(this.vm.selectedLedger.actualAmount / this.vm.selectedLedger.exchangeRate, this.vm.giddhBalanceDecimalPlaces);

                    // other taxes assigning process
                    let companyTaxes: TaxResponse[] = [];
                    this.vm.companyTaxesList$.pipe(take(1)).subscribe(taxes => companyTaxes = taxes);

                    let otherTaxesModal = new SalesOtherTaxesModal();
                    otherTaxesModal.itemLabel = resp[0].particular.name;

                    let tax: TaxResponse;
                    if (resp[0].tcsTaxes && resp[0].tcsTaxes.length) {
                        tax = companyTaxes.find(f => f.uniqueName === resp[0].tcsTaxes[0]);
                        this.vm.selectedLedger.otherTaxType = 'tcs';
                    } else if (resp[0].tdsTaxes && resp[0].tdsTaxes.length) {
                        tax = companyTaxes.find(f => f.uniqueName === resp[0].tdsTaxes[0]);
                        this.vm.selectedLedger.otherTaxType = 'tds';
                    }

                    if (tax) {
                        otherTaxesModal.appliedOtherTax = { name: tax.name, uniqueName: tax.uniqueName };
                    }

                    // otherTaxesModal.appliedOtherTax = (resp[1].tcsTaxes.length ? resp[1].tcsTaxes : resp[1].tdsTaxes) || [];
                    otherTaxesModal.tcsCalculationMethod = resp[0].tcsCalculationMethod || SalesOtherTaxesCalculationMethodEnum.OnTaxableAmount;

                    this.vm.selectedLedger.isOtherTaxesApplicable = !!(tax);
                    this.vm.selectedLedger.otherTaxModal = otherTaxesModal;

                    this.baseAccount$ = observableOf(resp[0].particular);
                    this.baseAccountName$ = resp[0].particular.uniqueName;
                    this.baseAcc = resp[0].particular.uniqueName;
                    this.firstBaseAccountSelected = resp[0].particular.uniqueName;

                    const initialAccounts: Array<IOption> = [];
                    this.vm.selectedLedger.transactions.map(t => {
                        if (this.vm.selectedLedger.discounts && this.vm.selectedLedger.discounts.length > 0 && !t.isTax && t.particular.uniqueName !== 'roundoff') {
                            let category = this.vm.accountCatgoryGetterFunc(t.particular, t.particular.uniqueName);
                            if (this.vm.isValidCategory(category)) {
                                /**
                                 * replace transaction amount with the actualAmount key that we got in response of get-ledger
                                 * because of ui and api follow different calculation pattern,
                                 * so transaction amount of income/ expenses account differ from both the side
                                 * so overcome this issue api provides the actual amount which was added by user while creating entry
                                 */
                                t.amount = this.vm.selectedLedger.actualAmount;
                                // if transaction is stock transaction then also update inventory amount and recalculate inventory rate
                                if (t.inventory) {
                                    t.inventory.amount = this.vm.selectedLedger.actualAmount;
                                    t.inventory.rate = this.vm.selectedLedger.actualRate;
                                }
                            }
                        }
                        if (t.inventory) {
                            // TODO: Prateek start
                            // let findStocks = accountsArray.find(f => f.value === t.particular.uniqueName + '#' + t.inventory.stock.uniqueName);
                            // if (findStocks) {
                            //     let findUnitRates = findStocks.additional.stock;
                            //     if (findUnitRates && findUnitRates.accountStockDetails && findUnitRates.accountStockDetails.unitRates.length) {
                            //         let tempUnitRates = findUnitRates.accountStockDetails.unitRates;
                            //         tempUnitRates.map(tmp => tmp.code = tmp.stockUnitCode);
                            //         t.unitRate = tempUnitRates;
                            //     } else {
                            //         t.unitRate = [{
                            //             code: t.inventory.unit.code,
                            //             rate: t.inventory.rate,
                            //             stockUnitCode: t.inventory.unit.code
                            //         }];
                            //     }
                            // } else {
                            //     t.unitRate = [{
                            //         code: t.inventory.unit.code,
                            //         rate: t.inventory.rate,
                            //         stockUnitCode: t.inventory.unit.code
                            //     }];
                            // }
                            // TODO: Prateek end
                            const unitRates = cloneDeep(this.vm.selectedLedger.unitRates);
                            if (unitRates && unitRates.length) {
                                unitRates.forEach(rate => rate.code = rate.stockUnitCode);
                                t.unitRate = unitRates;
                            } else {
                                t.unitRate = [{
                                    code: t.inventory.unit.code,
                                    rate: t.inventory.rate,
                                    stockUnitCode: t.inventory.unit.code
                                }];
                            }
                            initialAccounts.push({
                                label: `${t.particular.name}(${t.inventory.stock.uniqueName})`,
                                value: `${t.particular.uniqueName}#${t.inventory.stock.uniqueName}`,
                                additional: {
                                    stock: {
                                        name: t.inventory.stock.name,
                                    },
                                    uniqueName: t.inventory.stock.uniqueName
                                }
                            });
                            t.particular.uniqueName = `${t.particular.uniqueName}#${t.inventory.stock.uniqueName}`;
                            // Show warehouse dropdown only for stock items
                            const warehouseDetails = t.inventory.warehouse;
                            if (warehouseDetails) {
                                this.selectedWarehouse = warehouseDetails.uniqueName;
                            } else {
                                // If warehouse details are not received show default warehouse
                                this.selectedWarehouse = String(this.defaultWarehouse);
                            }
                            this.shouldShowWarehouse = true;
                        } else {
                            initialAccounts.push({
                                label: t.particular.name,
                                value: t.particular.uniqueName,
                                additional: {
                                ...t,
                                uniqueName: t.particular.uniqueName
                            }});
                        }
                    });
                    // this.vm.flatternAccountList4Select = observableOf(orderBy(initialAccounts, 'label'));
                    initialAccounts.push(...this.defaultSuggestions);
                    this.searchResults = orderBy(initialAccounts, 'label');
                    this.vm.isInvoiceGeneratedAlready = this.vm.selectedLedger.voucherGenerated;

                    // check if entry allows to show discount and taxes box
                    // first check with opened lager
                    if (this.vm.checkDiscountTaxesAllowedOnOpenedLedger(this.activeAccount)) {
                        this.vm.showNewEntryPanel = true;
                    } else {
                        // now check if we transactions array have any income/expense/fixed assets entry
                        let incomeExpenseEntryLength = this.vm.isThereIncomeOrExpenseEntry();
                        this.vm.showNewEntryPanel = incomeExpenseEntryLength === 1;
                    }

                    this.vm.reInitilizeDiscount(resp[0]);
                    if (this.generalService.currentOrganizationType === OrganizationType.Branch || (this.branches && this.branches.length === 1)) {
                        this.vm.selectedLedger.transactions.push(this.vm.blankTransactionItem('CREDIT'));
                        this.vm.selectedLedger.transactions.push(this.vm.blankTransactionItem('DEBIT'));
                    }

                    if (this.vm.stockTrxEntry) {
                        this.vm.inventoryPriceChanged(this.vm.stockTrxEntry.inventory.rate);
                    }
                    this.existingTaxTxn = _.filter(this.vm.selectedLedger.transactions, (o) => o.isTax);
                    //#endregion
                    if (!this.vm.showNewEntryPanel || this.isAdvanceReceipt) {
                        // Calculate entry total for credit and debit transactions when UI panel at the bottom to update
                        // transaction is not visible or current transaction is advance receipt as discount field is not displayed
                        // for advance receipt. Update Ledger calculates entry total only when discount value is set or changes therefore
                        // additional condition is required to check for advance receipt to calculate entry total
                        this.vm.getEntryTotal();
                        this.vm.generateCompoundTotal();
                    }
                    this.vm.generatePanelAmount();
                    this.activeAccountSubject.next(this.activeAccount);
                }
            });

        observableCombineLatest(this.activeAccountSubject, this.flattenAccountListStream$).pipe(takeUntil(this.destroyed$)).subscribe((response) => {
            if (response[0] && response[1]) {
                this.vm.flatternAccountList = response[1];
                // let stockListFormFlattenAccount: IFlattenAccountsResultItem;
                // if (this.vm.flatternAccountList && this.vm.flatternAccountList.length && this.activeAccount) {
                //     stockListFormFlattenAccount = response[1].find((acc) => acc.uniqueName === this.activeAccount.uniqueName);
                // }
                let accountsArray: IOption[] = [];
                let accountsForBaseAccountArray: IOption[] = [];
                let isStockableAccount: boolean = false;
                // check if current account category is type 'income' or 'expenses'
                let parentAcc = (this.activeAccount && this.activeAccount.parentGroups && this.activeAccount.parentGroups.length > 0) ? this.activeAccount.parentGroups[0].uniqueName : "";
                let incomeAccArray = ['revenuefromoperations', 'otherincome'];
                let expensesAccArray = ['operatingcost', 'indirectexpenses'];
                let incomeAndExpensesAccArray = [...incomeAccArray, ...expensesAccArray];
                isStockableAccount = this.activeAccount.uniqueName !== 'roundoff' ? incomeAndExpensesAccArray.includes(parentAcc) : false;
                // set account details for multi currency account
                this.prepareMultiCurrencyObject(this.vm.selectedLedger);
                // end multi currency assign
                // if (isStockableAccount) {
                //     // stocks from ledger account
                //     this.vm.flatternAccountList.map(acc => {
                //         // normal entry
                //         accountsArray.push({ value: acc.uniqueName, label: acc.name, additional: acc });

                //         // normal merge account entry
                //         if (acc.mergedAccounts && acc.mergedAccounts !== '') {
                //             let mergeAccs = acc.mergedAccounts.split(',');
                //             mergeAccs.map(m => m.trim()).forEach(ma => {
                //                 accountsArray.push({
                //                     value: ma,
                //                     label: ma,
                //                     additional: acc
                //                 });
                //             });
                //         }

                //         // check if taxable or round off account then don't assign stocks
                //         let notRoundOff = acc.uniqueName === 'roundoff';
                //         let isTaxAccount = acc.uNameStr.indexOf('dutiestaxes') > -1;
                //         if (!isTaxAccount && !notRoundOff && stockListFormFlattenAccount && stockListFormFlattenAccount.stocks) {
                //             stockListFormFlattenAccount.stocks.map(as => {
                //                 // stock entry
                //                 accountsArray.push({
                //                     value: `${acc.uniqueName}#${as.uniqueName}`,
                //                     label: acc.name + '(' + as.uniqueName + ')',
                //                     additional: Object.assign({}, acc, { stock: as })
                //                 });
                //                 // normal merge account entry
                //                 if (acc.mergedAccounts && acc.mergedAccounts !== '') {
                //                     let mergeAccs = acc.mergedAccounts.split(',');
                //                     mergeAccs.map(m => m.trim()).forEach(ma => {
                //                         accountsArray.push({
                //                             value: `${ma}#${as.uniqueName}`,
                //                             label: ma + '(' + as.uniqueName + ')',
                //                             additional: Object.assign({}, acc, { stock: as })
                //                         });
                //                     });
                //                 }
                //             });
                //         }

                //         // add current account entry in base account array
                //         accountsForBaseAccountArray.push({ value: acc.uniqueName, label: acc.name, additional: acc });
                //     });

                // } else {
                //     this.vm.flatternAccountList.map(acc => {
                //         if (acc.stocks) {
                //             acc.stocks.map(as => {
                //                 accountsArray.push({
                //                     value: `${acc.uniqueName}#${as.uniqueName}`,
                //                     label: `${acc.name} (${as.uniqueName})`,
                //                     additional: Object.assign({}, acc, { stock: as })
                //                 });
                //             });
                //             accountsArray.push({ value: acc.uniqueName, label: acc.name, additional: acc });
                //         } else {
                //             accountsArray.push({ value: acc.uniqueName, label: acc.name, additional: acc });

                //             // add current account entry in base account array
                //             accountsForBaseAccountArray.push({ value: acc.uniqueName, label: acc.name, additional: acc });
                //         }
                //         // normal merge account entry
                //         if (acc.mergedAccounts && acc.mergedAccounts !== '') {
                //             let mergeAccs = acc.mergedAccounts.split(',');
                //             mergeAccs.map(m => m.trim()).forEach(ma => {
                //                 accountsArray.push({
                //                     value: ma,
                //                     label: ma,
                //                     additional: acc
                //                 });
                //             });
                //         }
                //     });
                // }
                // this.vm.selectedLedger.transactions.map(t => {
                //     if (this.vm.selectedLedger.discounts.length > 0 && !t.isTax && t.particular.uniqueName !== 'roundoff') {
                //         let category = this.vm.getCategoryNameFromAccount(t.particular.uniqueName);
                //         if (this.vm.isValidCategory(category)) {
                //             /**
                //              * replace transaction amount with the actualAmount key that we got in response of get-ledger
                //              * because of ui and api follow different calculation pattern,
                //              * so transaction amount of income/ expenses account differ from both the side
                //              * so overcome this issue api provides the actual amount which was added by user while creating entry
                //              */
                //             t.amount = this.vm.selectedLedger.actualAmount;
                //             // if transaction is stock transaction then also update inventory amount and recalculate inventory rate
                //             if (t.inventory) {
                //                 t.inventory.amount = this.vm.selectedLedger.actualAmount;
                //                 t.inventory.rate = this.vm.selectedLedger.actualRate;
                //             }
                //         }
                //     }

                //     // if (t.inventory) {
                //     //     // TODO: Prateek start
                //     //     let findStocks = accountsArray.find(f => f.value === t.particular.uniqueName + '#' + t.inventory.stock.uniqueName);
                //     //     if (findStocks) {
                //     //         let findUnitRates = findStocks.additional.stock;
                //     //         if (findUnitRates && findUnitRates.accountStockDetails && findUnitRates.accountStockDetails.unitRates.length) {
                //     //             let tempUnitRates = findUnitRates.accountStockDetails.unitRates;
                //     //             tempUnitRates.map(tmp => tmp.code = tmp.stockUnitCode);
                //     //             t.unitRate = tempUnitRates;
                //     //         } else {
                //     //             t.unitRate = [{
                //     //                 code: t.inventory.unit.code,
                //     //                 rate: t.inventory.rate,
                //     //                 stockUnitCode: t.inventory.unit.code
                //     //             }];
                //     //         }
                //     //     } else {
                //     //         t.unitRate = [{
                //     //             code: t.inventory.unit.code,
                //     //             rate: t.inventory.rate,
                //     //             stockUnitCode: t.inventory.unit.code
                //     //         }];
                //     //     }
                //     //     // TODO: Prateek end
                //     //     t.particular.uniqueName = `${t.particular.uniqueName}#${t.inventory.stock.uniqueName}`;
                //     // }
                // });
                //this.vm.flatternAccountList4Select = observableOf(orderBy(accountsArray, 'label'));
                // this.vm.flatternAccountList4BaseAccount = orderBy(accountsForBaseAccountArray, 'label');
            }
        });

        // check if delete entry is success
        this.isDeleteTrxEntrySuccess$.subscribe(del => {
            if (del) {
                this.store.dispatch(this._ledgerAction.resetDeleteTrxEntryModal());
                this.closeUpdateLedgerModal.emit(true);
                this.baseAccountChanged = false;
            }
        });

        // check if update entry is success
        this.isTxnUpdateSuccess$.subscribe(upd => {
            if (upd) {
                this.store.dispatch(this._ledgerAction.ResetUpdateLedger());
                this.resetPreviousSearchResults();
                this.baseAccountChanged = false;
                // this.closeUpdateLedgerModal.emit(true);
            }
        });
        if (this.vm) {
            this.vm.compoundTotalObserver.pipe(takeUntil(this.destroyed$))
                .subscribe(res => {
                    if (res || res === 0) {
                        this.checkAdvanceReceiptOrInvoiceAdjusted();
                    }
                });
        }
    }

    private prepareMultiCurrencyObject(accountDetails: any) {
        if (this.isPettyCash) {
            // In case of petty cash account unique name will be received
            this.multiCurrencyAccDetails = cloneDeep(this.vm.flatternAccountList.find(f => f.uniqueName === accountDetails.uniqueName));
        } else {
            // In other cases account will be received
            this.multiCurrencyAccDetails = {
                currency: String(accountDetails.particular.currency.code)
            };
        };

        this.vm.isMultiCurrencyAvailable = this.multiCurrencyAccDetails ?
            !!(this.multiCurrencyAccDetails.currency && this.multiCurrencyAccDetails.currency !== this.profileObj.baseCurrency)
            : false;

        this.vm.foreignCurrencyDetails = { code: this.profileObj.baseCurrency, symbol: this.profileObj.baseCurrencySymbol };

        if (this.vm.isMultiCurrencyAvailable) {
            let currencies: ICurrencyResponse[] = [];
            let multiCurrencyAccCurrency: ICurrencyResponse;

            this.vm.currencyList$.pipe(take(1)).subscribe(res => currencies = res);
            multiCurrencyAccCurrency = currencies.find(f => f.code === this.multiCurrencyAccDetails.currency);
            this.vm.baseCurrencyDetails = { code: multiCurrencyAccCurrency.code, symbol: multiCurrencyAccCurrency.symbol };
        } else {
            this.vm.baseCurrencyDetails = this.vm.foreignCurrencyDetails;
        }
        this.vm.selectedCurrency = 0;
        this.vm.selectedCurrencyForDisplay = this.vm.selectedCurrency;
        this.assignPrefixAndSuffixForCurrency();
    }

    public ngAfterViewInit() {
        this.vm.discountComponent = this.discountComponent;
    }

    public ngOnChanges(changes: SimpleChanges): void {
        if (changes['isPettyCash']) {
            this.isPettyCash = changes['isPettyCash'].currentValue;
        }
        if (changes['pettyCashEntry'] && changes['pettyCashEntry'].currentValue !== changes['pettyCashEntry'].previousValue) {
            this.accountPettyCashStream = changes['pettyCashEntry'].currentValue.body;
        }

        // skip pettyCashBaseAccountUniqueName changes if its first time
        // because we have already done this in get transaction response observable
        // so no need to do this
        // we will just check for account change in petty cash entry details screen
        if (changes['pettyCashBaseAccountUniqueName']
            && !changes['pettyCashBaseAccountUniqueName'].firstChange
            && changes['pettyCashBaseAccountUniqueName'].currentValue
            !== changes['pettyCashBaseAccountUniqueName'].previousValue) {
            if (this.isPettyCash) {
                this.accountUniqueName = changes['pettyCashBaseAccountUniqueName'].currentValue;

                if (this.accountUniqueName) {
                    this.pettyCashAccountChanged();
                }
            }
        }
    }

    public addBlankTrx(type: string = 'DEBIT', txn: ILedgerTransactionItem, event: Event) {
        if (this.generalService.currentOrganizationType === OrganizationType.Branch || (this.branches && this.branches.length === 1)) {
            if (Number(txn.amount) === 0) {
                txn.amount = undefined;
            }
            let lastTxn = last(filter(this.vm.selectedLedger.transactions, p => p.type === type));
            if (txn.particular.uniqueName && lastTxn.particular.uniqueName) {
                let blankTrxnRow = this.vm.blankTransactionItem(type);
                this.vm.selectedLedger.transactions.push(blankTrxnRow);
            }
        } else {
            event.preventDefault();
            event.stopPropagation();
        }
    }

    public onUploadOutputUpdate(output: UploadOutput): void {
        if (output.type === 'allAddedToQueue') {
            let sessionKey = null;
            let companyUniqueName = null;
            this.sessionKey$.pipe(take(1)).subscribe(a => sessionKey = a);
            this.companyName$.pipe(take(1)).subscribe(a => companyUniqueName = a);
            const event: UploadInput = {
                type: 'uploadAll',
                url: Configuration.ApiUrl + LEDGER_API.UPLOAD_FILE.replace(':companyUniqueName', companyUniqueName),
                method: 'POST',
                fieldName: 'file',
                data: { company: companyUniqueName },
                headers: { 'Session-Id': sessionKey },
            };
            this.uploadInput.emit(event);
        } else if (output.type === 'start') {
            this.isFileUploading = true;
            this._loaderService.show();
        } else if (output.type === 'done') {
            this._loaderService.hide();
            if (output.file.response.status === 'success') {
                this.isFileUploading = false;
                this.vm.selectedLedger.attachedFile = output.file.response.body.uniqueName;
                this.vm.selectedLedger.attachedFileName = output.file.response.body.name;
                this._toasty.successToast('file uploaded successfully');
            } else {
                this.isFileUploading = false;
                this.vm.selectedLedger.attachedFile = '';
                this.vm.selectedLedger.attachedFileName = '';
                this._toasty.errorToast(output.file.response.message);
            }
        }
    }

    public onResized(event: ResizedEvent) {
        this.totalTdElementWidth = event.newWidth + 10;
    }

    public selectAccount(e: IOption, txn: ILedgerTransactionItem, selectCmp: ShSelectComponent) {
        if (!e.value) {
            // if there's no selected account set selectedAccount to null
            txn.selectedAccount = null;
            txn.inventory = null;
            txn.particular.name = undefined;

            // check if need to showEntryPanel
            // first check with opened ledger
            if (this.vm.checkDiscountTaxesAllowedOnOpenedLedger(this.activeAccount)) {
                this.vm.showNewEntryPanel = true;
            } else {
                // now check if we transactions array have any income/expense/fixed assets entry
                let incomeExpenseEntryLength = this.vm.isThereIncomeOrExpenseEntry();
                this.vm.showNewEntryPanel = incomeExpenseEntryLength === 1;
            }

            return;
        } else {
            if (!txn.isUpdated) {
                if (this.vm.selectedLedger.taxes && this.vm.selectedLedger.taxes.length && !txn.isTax) {
                    txn.isUpdated = true;
                }
            }
            // check if txn.selectedAccount is aleready set so it means account name is changed without firing deselect event
            if (txn.selectedAccount) {
                // check if discount is added and update component as needed
                this.vm.discountArray.map(d => {
                    if (d.particular === txn.selectedAccount.uniqueName) {
                        d.amount = 0;
                    }
                });
            }
            // if ther's stock entry
            if (e.additional.stock) {
                // check if we aleready have stock entry
                if (this.vm.isThereStockEntry(e.value)) {
                    selectCmp.clear();
                    txn.particular.uniqueName = null;
                    txn.particular.name = null;
                    txn.selectedAccount = null;
                    this._toasty.warningToast('you can\'t add multiple stock entry');
                    return;
                } else {
                    // add unitArrys in txn for stock entry
                    let requestObject;
                    if (e.additional.stock) {
                        requestObject = {
                            stockUniqueName: e.additional.stock.uniqueName
                        };
                    }
                    const currentLedgerCategory = this.activeAccount ? this.generalService.getAccountCategory(this.activeAccount, this.activeAccount.uniqueName) : '';
                    // If current ledger is of income or expense category then send current ledger unique name else send particular account unique name
                    const accountUniqueName = e.additional.stock && (currentLedgerCategory === 'income' || currentLedgerCategory === 'expenses') ?
                        this.activeAccount ? this.activeAccount.uniqueName : '' :
                        e.additional.uniqueName;
                    this.searchService.loadDetails(accountUniqueName, requestObject).subscribe(data => {
                        // directly assign additional property
                        if (data && data.body) {
                            // Take taxes of parent group and stock's own taxes
                            const taxes = data.body.taxes || [];
                            if (data.body.stock) {
                                taxes.push(...data.body.stock.taxes);
                            }
                            txn.selectedAccount = {
                                ...e.additional,
                                label: e.label,
                                value: e.value,
                                isHilighted: true,
                                applicableTaxes: taxes,
                                currency: data.body.currency,
                                currencySymbol: data.body.currencySymbol,
                                email: data.body.emails,
                                isFixed: data.body.isFixed,
                                mergedAccounts: data.body.mergedAccounts,
                                mobileNo: data.body.mobileNo,
                                nameStr: e.additional && e.additional.parentGroups ? e.additional.parentGroups.map(parent => parent.name).join(', ') : '',
                                stock: data.body.stock,
                                uNameStr: e.additional && e.additional.parentGroups ? e.additional.parentGroups.map(parent => parent.uniqueName).join(', ') : '',
                            };
                            let rate = 0;
                            let unitCode = '';
                            let unitName = '';
                            let stockName = '';
                            let stockUniqueName = '';
                            if (txn.selectedAccount && txn.selectedAccount.stock) {
                                let defaultUnit = {
                                    stockUnitCode: txn.selectedAccount.stock.stockUnitCode,
                                    code: txn.selectedAccount.stock.stockUnitCode,
                                    rate: txn.selectedAccount.stock.rate,
                                    name: txn.selectedAccount.stock.name
                                };
                                txn.unitRate = txn.selectedAccount.stock.unitRates.map(unitRate => ({...unitRate, code: unitRate.stockUnitCode}));
                                stockName = defaultUnit.name;
                                rate = defaultUnit.rate;
                                stockUniqueName = txn.selectedAccount.stock.uniqueName;
                                unitName = defaultUnit.name;
                                unitCode = defaultUnit.code;
                            }

                            if (stockName && stockUniqueName) {
                                txn.inventory = {
                                    stock: {
                                        name: stockName,
                                        uniqueName: stockUniqueName,
                                    },
                                    quantity: 1,
                                    unit: {
                                        stockUnitCode: unitCode,
                                        code: unitCode,
                                        rate
                                    },
                                    amount: 0,
                                    rate
                                };
                                // Stock item, show the warehouse drop down
                                if (!this.shouldShowWarehouse) {
                                    this.shouldShowWarehouse = true;
                                }
                            }
                            if (rate > 0 && txn.amount === 0) {
                                txn.amount = rate;
                            }
                        }
                    });
                }
            } else {
                this.searchService.loadDetails(e.value).subscribe(data => {
                    // directly assign additional property
                    if (data && data.body) {
                        // Take taxes of parent group
                        const taxes = data.body.taxes || [];
                        txn.selectedAccount = {
                            ...e.additional,
                            label: e.label,
                            value: e.value,
                            isHilighted: true,

                            applicableTaxes: taxes,
                            currency: data.body.currency,
                            currencySymbol: data.body.currencySymbol,
                            email: data.body.emails,
                            isFixed: data.body.isFixed,
                            mergedAccounts: data.body.mergedAccounts,
                            mobileNo: data.body.mobileNo,
                            nameStr: e.additional && e.additional.parentGroups ? e.additional.parentGroups.map(parent => parent.name).join(', ') : '',
                            stocks: [],
                            uNameStr: e.additional && e.additional.parentGroups ? e.additional.parentGroups.map(parent => parent.uniqueName).join(', ') : '',
                        };
                    }
                });
                delete txn.inventory;
                // Non stock item got selected, search if there is any stock item along with non-stock item
                const isStockItemPresent = this.isStockItemPresent();
                if (!isStockItemPresent) {
                    // None of the item were stock item, hide the warehouse section which is applicable only for stocks
                    this.shouldShowWarehouse = false;
                }
            }

            // check if need to showEntryPanel
            // first check with opened lager
            if (this.vm.checkDiscountTaxesAllowedOnOpenedLedger(this.activeAccount)) {
                this.vm.showNewEntryPanel = true;
            } else {
                // now check if we transactions array have any income/expense/fixed assets entry
                let incomeExpenseEntryLength = this.vm.isThereIncomeOrExpenseEntry();
                this.vm.showNewEntryPanel = incomeExpenseEntryLength === 1;
            }

            // commented for now after discussion with @shubhendra and @aditya soni

            // if multi-currency is not available then check if selected account allows multi-currency
            // if (!this.vm.isMultiCurrencyAvailable) {
            //   this.vm.isMultiCurrencyAvailable = e.additional.currency && e.additional.currency !== this.profileObj.baseCurrency;
            //
            //   this.vm.foreignCurrencyDetails = {code: this.profileObj.baseCurrency, symbol: this.profileObj.baseCurrencySymbol};
            //
            //   if (this.vm.isMultiCurrencyAvailable) {
            //     let currencies: ICurrencyResponse[] = [];
            //     let multiCurrencyAccCurrency: ICurrencyResponse;
            //
            //     this.vm.currencyList$.pipe(take(1)).subscribe(res => currencies = res);
            //     multiCurrencyAccCurrency = currencies.find(f => f.code === e.additional.currency);
            //     this.vm.baseCurrencyDetails = {code: multiCurrencyAccCurrency.code, symbol: multiCurrencyAccCurrency.symbol};
            //
            //     let rate = await this.getCurrencyRate();
            //     this.vm.selectedLedger = {...this.vm.selectedLedger, exchangeRate: rate ? rate.body : 1};
            //
            //   } else {
            //     this.vm.baseCurrencyDetails = this.vm.foreignCurrencyDetails;
            //   }
            //   this.vm.selectedCurrency = 0;
            //   this.vm.selectedCurrencyForDisplay = this.vm.selectedCurrency;
            //   this.assignPrefixAndSuffixForCurrency();
            // }

            this.vm.onTxnAmountChange(txn);
        }
    }

    public onTxnAmountChange(txn: ILedgerTransactionItem) {
        if (txn) {
            txn.convertedAmount = this.vm.calculateConversionRate(txn.amount);
            txn.isUpdated = true;
            this.vm.onTxnAmountChange(txn);
        }

        // TODO: may use later
        // this.checkAdvanceReceiptOrInvoiceAdjusted();
    }

    public showDeleteAttachedFileModal() {
        this.deleteAttachedFileModal.show();
    }

    public hideDeleteAttachedFileModal() {
        this.deleteAttachedFileModal.hide();
    }

    public showDeleteEntryModal() {
        this.deleteEntryModal.show();
    }

    public hideDeleteEntryModal() {
        this.deleteEntryModal.hide();
    }

    public deleteTrxEntry() {
        let uniqueName = this.vm.selectedLedger.particular.uniqueName;
        this.store.dispatch(this._ledgerAction.deleteTrxEntry(uniqueName, this.entryUniqueName));
        this.hideDeleteEntryModal();
    }

    public deleteAttachedFile() {
        this.vm.selectedLedger.attachedFile = '';
        this.vm.selectedLedger.attachedFileName = '';
        if(this.fileInputElement && this.fileInputElement.nativeElement) {
            this.fileInputElement.nativeElement.value = '';
        }
        this.hideDeleteAttachedFileModal();
    }

    public saveLedgerTransaction() {
        // due to date picker of Tx entry date format need to change
        if (this.vm.selectedLedger.entryDate) {
            if (!moment(this.vm.selectedLedger.entryDate, GIDDH_DATE_FORMAT).isValid()) {
                this._toasty.errorToast('Invalid Date Selected.Please Select Valid Date');
                this._loaderService.hide();
                return;
            } else {
                this.vm.selectedLedger.entryDate = moment(this.vm.selectedLedger.entryDate, GIDDH_DATE_FORMAT).format(GIDDH_DATE_FORMAT);
            }
        }

        // due to date picker of Tx chequeClearance date format need to change
        if (this.vm.selectedLedger.chequeClearanceDate) {
            if (!moment(this.vm.selectedLedger.chequeClearanceDate, GIDDH_DATE_FORMAT).isValid()) {
                this._toasty.errorToast('Invalid Date Selected In Cheque Clearance Date.Please Select Valid Date');
                this._loaderService.hide();
                return;
            } else {
                this.vm.selectedLedger.chequeClearanceDate = moment(this.vm.selectedLedger.chequeClearanceDate, GIDDH_DATE_FORMAT).format(GIDDH_DATE_FORMAT);
            }
        }
        let requestObj: LedgerResponse = this.vm.prepare4Submit();

        // special case for is petty cash mode
        // remove dummy others account from transaction.particular.uniqueName
        // added because we want to handle others account case in petty cash entry
        if (this.isPettyCash) {
            let isThereOthersDummyAcc = this.vm.flatternAccountList.some(d => d.uniqueName === 'others' && d.isDummy);
            if (isThereOthersDummyAcc) {
                let isThereDummyOtherTrx = requestObj.transactions.some(s => s.particular.uniqueName === 'others');
                if (isThereDummyOtherTrx) {
                    this._toasty.errorToast('Please select a valid account in transaction');
                    return;
                }
            }
        }
        if (this.isRcmEntry && (!requestObj.taxes || requestObj.taxes.length === 0)) {
            if (this.taxControll && this.taxControll.taxInputElement && this.taxControll.taxInputElement.nativeElement) {
                // Taxes are mandatory for RCM and Advance Receipt entries
                this.taxControll.taxInputElement.nativeElement.classList.add('error-box');
                return;
            }
        }

        requestObj.valuesInAccountCurrency = this.vm.selectedCurrency === 0;
        requestObj.exchangeRate = (this.vm.selectedCurrencyForDisplay !== this.vm.selectedCurrency) ? (1 / this.vm.selectedLedger.exchangeRate) : this.vm.selectedLedger.exchangeRate;
        requestObj.subVoucher = (this.isRcmEntry) ? SubVoucher.ReverseCharge : (this.isAdvanceReceipt) ? SubVoucher.AdvanceReceipt : '';
        requestObj.transactions = requestObj.transactions.filter(f => !f.isDiscount);
        if (!this.isRcmEntry && !this.isAdvanceReceipt && !this.taxOnlyTransactions) {
            requestObj.transactions = requestObj.transactions.filter(tx => !tx.isTax);
        }
        requestObj.transactions.map((transaction: any) => {
            if (transaction.inventory && this.shouldShowWarehouse) {
                // Update the warehouse details in update ledger flow
                if (transaction.inventory.warehouse) {
                    transaction.inventory.warehouse.uniqueName = this.selectedWarehouse;
                } else {
                    transaction.inventory.warehouse = { name: '', uniqueName: '' };
                    transaction.inventory.warehouse.uniqueName = this.selectedWarehouse;
                }
            }
        });
        if (requestObj.voucherAdjustments && requestObj.voucherAdjustments.adjustments && requestObj.voucherAdjustments.adjustments.length > 0) {
            requestObj.voucherAdjustments.adjustments.forEach((adjustment: any) => {
                delete adjustment.balanceDue;
            });
        }
        if (this.tcsOrTds === 'tds') {
            delete requestObj['tcsCalculationMethod'];
        }
        delete requestObj['tdsTaxes'];
        delete requestObj['tcsTaxes'];

        if (requestObj.voucherType !== VoucherTypeEnum.creditNote && requestObj.voucherType !== VoucherTypeEnum.debitNote) {
            requestObj.invoiceLinkingRequest = null;
        }
        if ((this.isAdvanceReceipt && !this.isAdjustAdvanceReceiptSelected) || (this.vm.selectedLedger.voucher.shortCode === 'rcpt' && !this.isAdjustReceiptSelected) || !this.isAdjustVoucherSelected) {
            // Clear the voucher adjustments if the adjust advance receipt or adjust receipt is not selected
            this.vm.selectedLedger.voucherAdjustments = undefined;
            requestObj.voucherAdjustments = undefined;
        }
        if (this.isAdvanceReceipt) {
            requestObj.voucherType = 'rcpt';
        }
        // if no petty cash mode then do normal update ledger request
        if (!this.isPettyCash) {
            requestObj['handleNetworkDisconnection'] = true;
            requestObj['refreshLedger'] = false;

            if (this.entryAccountUniqueName && this.entryAccountUniqueName !== this.changedAccountUniq) {
                requestObj['refreshLedger'] = true;
            }

            if (this.baseAccountChanged) {
                this.store.dispatch(this._ledgerAction.updateTxnEntry(requestObj, this.firstBaseAccountSelected, this.entryUniqueName + '?newAccountUniqueName=' + this.changedAccountUniq));
            } else {
                this.store.dispatch(this._ledgerAction.updateTxnEntry(requestObj, this.firstBaseAccountSelected, this.entryUniqueName));
            }
        } else {
            // for petty cash approve request, just return request object
            return requestObj;
        }
    }

    /**
     * Unsubscribe to all the listeners to avoid memory leaks
     *
     * @memberof UpdateLedgerEntryPanelComponent
     */
    public ngOnDestroy(): void {
        this.vm.resetVM();
        this.destroyed$.next(true);
        this.destroyed$.complete();
        // Remove the transaction details for ledger once the component is destroyed
        this.store.dispatch(this._ledgerAction.resetLedgerTrxDetails());
    }

    public downloadAttachedFile(fileName: string, e: Event) {
        e.stopPropagation();
        this.ledgerService.DownloadAttachement(fileName).subscribe(d => {
            if (d.status === 'success') {
                let blob = base64ToBlob(d.body.uploadedFile, `image/${d.body.fileType}`, 512);
                return saveAs(blob, d.body.name);
            } else {
                this._toasty.errorToast(d.message);
            }
        });
    }

    public downloadInvoice(invoiceName: string, voucherType: string, e: Event) {
        e.stopPropagation();
        let downloadRequest = new DownloadLedgerRequest();
        downloadRequest.invoiceNumber = [invoiceName];
        downloadRequest.voucherType = voucherType;

        this.ledgerService.DownloadInvoice(downloadRequest, this.activeAccount.uniqueName).subscribe(d => {
            if (d.status === 'success') {
                let blob = base64ToBlob(d.body, 'application/pdf', 512);
                return saveAs(blob, `${this.activeAccount.name} - ${invoiceName}.pdf`);
            } else {
                this._toasty.errorToast(d.message);
            }
        });
    }

    public showQuickAccountModal() {
        this.showQuickAccountModalFromUpdateLedger.emit(true);
    }

    public changeBaseAccount(acc) {
        this.openDropDown = false;
        if (!acc) {
            this._toasty.errorToast('Account not changed');
            this.hideBaseAccountModal();
            return;
        }
        if (acc === this.baseAcc) {
            this._toasty.errorToast('Account not changed');
            this.hideBaseAccountModal();
            return;
        }

        this.changedAccountUniq = acc.value;
        this.baseAccountChanged = true;
        this.saveLedgerTransaction();
        this.hideBaseAccountModal();
    }

    public openBaseAccountModal() {
        if (this.vm.selectedLedger.voucherGenerated) {
            this._toasty.errorToast('You are not permitted to change base account. Voucher is already Generated');
            return;
        }
        if(this.updateBaseAccount) {
            this.updateBaseAccount.show();
        }
    }

    public hideBaseAccountModal() {
        if(this.updateBaseAccount) {
            this.updateBaseAccount.hide();
        }
    }

    /**
     * Fetches the invoice list data for a voucher
     *
     * @param {*} event Contains the selected voucher details
     * @memberof UpdateLedgerEntryPanelComponent
     */
    public getInvoiceListsData(event: any): void {
        if (event.value === 'rcpt') {
            if (this.isPettyCash && !this.accountUniqueName) {
                this._toasty.errorToast('Please Select ' + this.pettyCashBaseAccountTypeString + '  for entry..');
                return;
            }
        } else if (event.value === VoucherTypeEnum.creditNote || event.value === VoucherTypeEnum.debitNote) {
            this.getInvoiceListsForCreditNote();
            this.vm.selectedLedger.generateInvoice = true;
        }
        // this.removeAdjustment();
        this.isAdvanceReceipt = (event.value === 'advance-receipt');
        this.handleAdvanceReceiptChange();
    }

    /**
     * Advance Receipt adjustment handler
     *
     * @param {boolean} isUpdateMode True if adjustments are updated
     * @memberof UpdateLedgerEntryPanelComponent
     */
    public handleVoucherAdjustment(isUpdateMode?: boolean): void {
        if (!this.vm.selectedLedger.voucherGenerated && this.vm.selectedLedger.voucher.shortCode !== 'pur') {
            // Voucher must be generated for all vouchers except purchase order
            this._toasty.infoToast(ADJUSTMENT_INFO_MESSAGE, 'Giddh');
            if (this.isAdjustAdvanceReceiptSelected) {
                this.isAdjustAdvanceReceiptSelected = false;
            } else if (this.isAdjustReceiptSelected) {
                this.isAdjustReceiptSelected = false;
            } else if (this.isAdjustVoucherSelected) {
                this.isAdjustVoucherSelected = false;
            }
            return;
        }
        if (this.vm.selectedLedger.voucherAdjustments && !this.vm.selectedLedger.voucherAdjustments.adjustments ) {
            this.vm.selectedLedger.voucherAdjustments.adjustments = [];
        }
        if ((this.isAdjustAdvanceReceiptSelected || this.isAdjustReceiptSelected || this.isAdjustVoucherSelected) && this.vm.selectedLedger.voucherAdjustments && (!this.vm.selectedLedger.voucherAdjustments.adjustments || !this.vm.selectedLedger.voucherAdjustments.adjustments.length || isUpdateMode)) {
            this.prepareAdjustVoucherConfiguration();
            this.openAdjustPaymentModal();
        }
    }

    /**
     * Checks if the voucher is generated which is a required
     * condition for adjustment of voucher
     *
     * @param {*} event Click event
     * @memberof UpdateLedgerEntryPanelComponent
     */
    public checkForGeneratedVoucher(event: any): void {
        if (event && this.vm.selectedLedger.voucher.shortCode !== 'pur' && !this.vm.selectedLedger.voucherGenerated) {
            // Adjustment is not allowed until the voucher is generated
            this._toasty.infoToast(ADJUSTMENT_INFO_MESSAGE, 'Giddh');
            event.preventDefault();
        }
    }

    /**
     * Get Invoice list for credit note
     *
     * @memberof UpdateLedgerEntryPanelComponent
     */
    public getInvoiceListsForCreditNote(): void {
        const request = {
            accountUniqueNames: [this.vm.selectedLedger.particular.uniqueName, this.vm.selectedLedger.transactions[0].particular.uniqueName],
            voucherType: this.vm.selectedLedger.voucher.shortCode
        }
        let date;
        if (typeof this.vm.selectedLedger.entryDate === 'string') {
            date = this.vm.selectedLedger.entryDate;
        } else {
            date = moment(this.vm.selectedLedger.entryDate).format(GIDDH_DATE_FORMAT);
        }
        this.invoiceList = [];
        this.ledgerService.getInvoiceListsForCreditNote(request, date).subscribe((response: any) => {
            if (response && response.body) {
                if (response.body.results) {
                    response.body.results.forEach(invoice => this.invoiceList.push({ label: invoice.voucherNumber ? invoice.voucherNumber : '-', value: invoice.uniqueName, additional: invoice }))
                } else {
                    this.forceClear$ = observableOf({ status: true });
                }
                let invoiceSelected;
                const selectedInvoice = (this.vm.selectedLedger.invoiceLinkingRequest && this.vm.selectedLedger.invoiceLinkingRequest.linkedInvoices) ? this.vm.selectedLedger.invoiceLinkingRequest.linkedInvoices[0] : false;
                if (selectedInvoice) {
                    selectedInvoice['voucherDate'] = selectedInvoice['invoiceDate'];
                    invoiceSelected = {
                        label: selectedInvoice.invoiceNumber ? selectedInvoice.invoiceNumber : '-',
                        value: selectedInvoice.invoiceUniqueName,
                        additional: selectedInvoice
                    };
                    const linkedInvoice = this.invoiceList.find(invoice => invoice.value === invoiceSelected.value);
                    if (!linkedInvoice) {
                        this.invoiceList.push(invoiceSelected);
                    }
                }
                this.invoiceList = _.uniqBy(this.invoiceList, 'value');
                this.selectedInvoice = (invoiceSelected) ? invoiceSelected.value : '';
            }
        });
    }

    /**
     * Removes the selected invoice for credit note
     *
     * @memberof UpdateLedgerEntryPanelComponent
     */
    public removeSelectedInvoice(): void {
        this.forceClear$ = observableOf({ status: true });
        this.selectedInvoice = '';
    }

    public getInvoiveLists() {
        if (this.vm.selectedLedger.voucher.shortCode === 'rcpt') {
            if (this.isPettyCash && !this.accountUniqueName) {
                this._toasty.errorToast('Please Select ' + this.pettyCashBaseAccountTypeString + '  for entry..');
                return;
            }

            this.invoiceList = [];
            // this._ledgerService.GetInvoiceList({ accountUniqueName: this.accountUniqueName, status: 'unpaid' }).subscribe((res: any) => {
            //     _.map(res.body.invoiceList, (o) => {
            //         this.invoiceList.push({ label: o.invoiceNumber, value: o.invoiceNumber, isSelected: false });
            //     });
            // });
        }
    }

    public selectInvoice(invoiceNo, ev) {
        invoiceNo.isSelected = ev.target.checked;
        if (ev.target.checked) {
            this.vm.selectedLedger.invoicesToBePaid.push(invoiceNo.label);
        } else {
            let indx = this.vm.selectedLedger.invoicesToBePaid.indexOf(invoiceNo.label);
            this.vm.selectedLedger.invoicesToBePaid.splice(indx, 1);
        }
    }

    /**
     * Selected invoice for credit note
     *
     * @param {any} event Selected invoice for credit note
     * @memberof UpdateLedgerEntryPanelComponent
     */
    public creditNoteInvoiceSelected(event: any): void {
        if (event && event.value && event.additional) {
            this.vm.selectedLedger.invoiceLinkingRequest = {
                linkedInvoices: [
                    {
                        invoiceUniqueName: event.value,
                        voucherType: event.additional.voucherType
                    }
                ]
            }
        } else {
            this.vm.selectedLedger.invoiceLinkingRequest = null;
        }
    }

    public openHeaderDropDown() {
        if (this.generalService.currentOrganizationType === OrganizationType.Branch || (this.branches && this.branches.length === 1)) {
            this.entryAccountUniqueName = "";

            if (!this.vm.selectedLedger.voucherGenerated || this.vm.selectedLedger.voucherGeneratedType === VoucherTypeEnum.sales) {
                this.entryAccountUniqueName = this.vm.selectedLedger.particular.uniqueName;
                this.openDropDown = true;
            } else {
                this.openDropDown = false;
                this._toasty.errorToast('You are not permitted to change base account. Voucher is already Generated');
                return;
            }
        }
    }

    public keydownPressed(e) {
        if (e.code === 'ArrowDown') {
            this.keydownClassAdded = true;
        } else if (e.code === 'Enter' && this.keydownClassAdded) {
            this.keydownClassAdded = true;
            this.toggleAsidePaneOpen();
        } else {
            this.keydownClassAdded = false;
        }

    }

    public toggleAsidePaneOpen() {
        if (document.getElementById('createNewId')) {
            document.getElementById('createNewId').click();
            this.keydownClassAdded = false;
        }
        if (document.getElementById('createNewId2')) {
            document.getElementById('createNewId2').click();
            this.keydownClassAdded = false;
        }
    }

    public hideDiscountTax(): void {
        if (this.discountComponent) {
            this.discountComponent.discountMenu = false;
        }
        if (this.taxControll) {
            this.taxControll.showTaxPopup = false;
        }
    }

    public hideDiscount(): void {
        if (this.discountComponent) {
            this.discountComponent.change();
            this.discountComponent.discountMenu = false;
        }
    }

    public hideTax(): void {
        if (this.taxControll) {
            this.taxControll.change();
            this.taxControll.showTaxPopup = false;
        }
    }

    public async toggleCurrency() {
        this.vm.selectedCurrencyForDisplay = this.vm.selectedCurrencyForDisplay === 1 ? 0 : 1;
        let rate = 0;
        if (Number(this.vm.selectedLedger.exchangeRateForDisplay)) {
            rate = 1 / this.vm.selectedLedger.exchangeRate;
        }
        this.vm.selectedLedger = { ...this.vm.selectedLedger, exchangeRate: rate, exchangeRateForDisplay: giddhRoundOff(rate, this.vm.giddhBalanceDecimalPlaces) };
    }

    public exchangeRateChanged() {
        this.vm.selectedLedger.exchangeRate = Number(this.vm.selectedLedger.exchangeRateForDisplay) || 0;
        this.vm.inventoryAmountChanged();
    }

    /**
     * Toggle the RCM checkbox based on user confirmation
     *
     * @param {*} event Click event
     * @memberof UpdateLedgerEntryPanelComponent
     */
    public toggleRcmCheckbox(event: any): void {
        event.preventDefault();
        if (this.currentOrganizationType === 'COMPANY' && (this.branches && this.branches.length > 1)) {
            return;
        }
        this.rcmConfiguration = this.generalService.getRcmConfiguration(event.target.checked);
    }

    /**
     * RCM change handler, triggerreed when the user performs any
     * action with the RCM popup
     *
     * @param {string} action Action performed by user
     * @memberof UpdateLedgerEntryPanelComponent
     */
    public handleRcmChange(action: string): void {
        if (action === CONFIRMATION_ACTIONS.YES) {
            // Toggle the state of RCM as user accepted the terms of RCM modal
            this.isRcmEntry = !this.isRcmEntry;
        }
        if (this.rcmPopup) {
            this.rcmPopup.hide();
        }
    }

    /**
     * Handles the advance receipt change
     *
     * @memberof UpdateLedgerEntryPanelComponent
     */
    public handleAdvanceReceiptChange(): void {
        this.shouldShowAdvanceReceiptMandatoryFields = this.isAdvanceReceipt;
        this.vm.isAdvanceReceipt = this.isAdvanceReceipt;
        this.vm.selectedLedger.generateInvoice = this.isAdvanceReceipt;
        if (this.shouldShowAdvanceReceiptMandatoryFields) {
            this.vm.generatePanelAmount();
        }
        if (!this.isAdvanceReceipt) {
            if (this.isAdjustedInvoicesWithAdvanceReceipt && this.vm.selectedLedger && this.vm.selectedLedger.voucherGeneratedType === VoucherTypeEnum.receipt) {
                this.advanceReceiptRemoveConfirmationModal.show();
            }
        }
        this.vm.generateGrandTotal();
        this.vm.generateCompoundTotal();
    }

    // petty cash account changes, change all things related to account uniquename
    // like multi currency account, base account etc...
    private pettyCashAccountChanged() {
        // set account details for multi currency account
        this.prepareMultiCurrencyObject(this.accountUniqueName);
        // end multi currency assign
    }

    private assignPrefixAndSuffixForCurrency() {
        this.vm.isPrefixAppliedForCurrency = this.vm.isPrefixAppliedForCurrency = !(['AED'].includes(this.vm.selectedCurrency === 0 ? this.vm.baseCurrencyDetails.code : this.vm.foreignCurrencyDetails.code));
        this.vm.selectedPrefixForCurrency = this.vm.isPrefixAppliedForCurrency ?
            this.vm.selectedCurrency === 0 ?
                (this.vm.baseCurrencyDetails) ? this.vm.baseCurrencyDetails.symbol : (this.vm.foreignCurrencyDetails) ? this.vm.foreignCurrencyDetails.symbol : '' :
            '' : '';
        this.vm.selectedSuffixForCurrency = this.vm.isPrefixAppliedForCurrency ?
            '' : this.vm.selectedCurrency === 0 ? (this.vm.baseCurrencyDetails) ? this.vm.baseCurrencyDetails.symbol :
            (this.vm.foreignCurrencyDetails) ? this.vm.foreignCurrencyDetails.symbol : '' :
            '';
    }

    private getCurrencyRate() {
        let from = this.vm.selectedCurrency === 0 ? this.vm.baseCurrencyDetails.code : this.vm.foreignCurrencyDetails.code;
        let to = this.vm.selectedCurrency === 0 ? this.vm.foreignCurrencyDetails.code : this.vm.baseCurrencyDetails.code;
        let date = moment().format(GIDDH_DATE_FORMAT);
        return this.ledgerService.GetCurrencyRateNewApi(from, to, date).toPromise();
    }

    /**
     * Quantity change handler
     *
     * @param {string} value Current value
     * @memberof UpdateLedgerEntryPanelComponent
     */
    public handleQuantityChange(value: string): void {
        if (this.vm && this.vm.stockTrxEntry && this.vm.stockTrxEntry.inventory) {
            this.vm.stockTrxEntry.inventory.quantity = Number(this.vm.stockTrxEntry.inventory.quantity);
        }
        this.vm.inventoryQuantityChanged(value);
    }

    /**
     * Scroll end handler
     *
     * @memberof UpdateLedgerEntryPanelComponent
     */
    public handleScrollEnd(): void {
        if (this.searchResultsPaginationData.page < this.searchResultsPaginationData.totalPages) {
            this.onSearchQueryChanged(
                this.searchResultsPaginationData.query,
                this.searchResultsPaginationData.page + 1,
                this.searchResultsPaginationData.query ? true : false,
                (response) => {
                    if (!this.searchResultsPaginationData.query) {
                        const results = response.map(result => {
                            return {
                                value: result.stock ? `${result.uniqueName}#${result.stock.uniqueName}` : result.uniqueName,
                                label: result.stock ? `${result.name} (${result.stock.name})` : result.name,
                                additional: result
                            }
                        }) || [];
                        this.defaultSuggestions = this.defaultSuggestions.concat(...results);
                        this.defaultResultsPaginationData.page = this.searchResultsPaginationData.page;
                        this.defaultResultsPaginationData.totalPages = this.searchResultsPaginationData.totalPages;
                    }
            });
        }
    }

    /**
     * Search query change handler
     *
     * @param {string} query Search query
     * @param {number} [page=1] Page to request
     * @param {boolean} withStocks True, if search should include stocks in results
     * @param {Function} successCallback Callback to carry out further operation
     * @memberof UpdateLedgerEntryPanelComponent
     */
    public onSearchQueryChanged(query: string, page: number = 1, withStocks: boolean = true, successCallback?: Function): void {
        if (query || (this.defaultSuggestions && this.defaultSuggestions.length === 0) || successCallback) {
            this.searchResultsPaginationData.query = query;
            const currentLedgerCategory = this.activeAccount ? this.generalService.getAccountCategory(this.activeAccount, this.activeAccount.uniqueName) : '';
            // If current ledger is of income or expense category then send current ledger as stockAccountUniqueName. Only required for ledger.
            const accountUniqueName = (currentLedgerCategory === 'income' || currentLedgerCategory === 'expenses') ?
                this.activeAccount ? this.activeAccount.uniqueName : '' :
                '';
            const requestObject = {
                q: encodeURIComponent(query),
                page,
                withStocks,
                accountUniqueName: encodeURIComponent(accountUniqueName)
            }
            this.searchService.searchAccount(requestObject).subscribe(data => {
                if (data && data.body && data.body.results) {
                    const searchResults = data.body.results.map(result => {
                        return {
                            value: result.stock ? `${result.uniqueName}#${result.stock.uniqueName}` : result.uniqueName,
                            label: result.stock ? `${result.name} (${result.stock.name})` : result.name,
                            additional: result
                        }
                    }) || [];
                    this.noResultsFoundLabel = SearchResultText.NotFound;
                    if (page === 1) {
                        this.searchResults = searchResults;
                    } else {
                        this.searchResults = [
                            ...this.searchResults,
                            ...searchResults
                        ];
                    }
                    this.searchResultsPaginationData.page = data.body.page;
                    this.searchResultsPaginationData.totalPages = data.body.totalPages;
                    if (successCallback) {
                        successCallback(data.body.results);
                    }
                }
            });
        } else {
            this.searchResults = [...this.defaultSuggestions];
        }
    }

    /**
     * Resets the previous search result
     *
     * @memberof UpdateLedgerEntryPanelComponent
     */
    public resetPreviousSearchResults(): void {
        this.searchResults = [...this.defaultSuggestions];
        this.searchResultsPaginationData = {
            page: 0,
            totalPages: 0,
            query: ''
        };
        this.noResultsFoundLabel = SearchResultText.NewSearch;
    }

    /**
     * Handler when search suggestions get hidden when user focuses the
     * pointer away
     *
     * @memberof UpdateLedgerEntryPanelComponent
     */
    public handleSuggestionHide(): void {
        this.noResultsFoundLabel = SearchResultText.NewSearch;
    }

    /**
     * Returns true, if any of the single item is stock
     *
     * @private
     * @returns {boolean} True, if item array contains stock item
     * @memberof UpdateLedgerEntryPanelComponent
     */
    private isStockItemPresent(): boolean {
        if(this.vm.selectedLedger.transactions) {
            for (let index = 0; index < this.vm.selectedLedger.transactions.length; index++) {
                if (this.vm.selectedLedger.transactions[index].inventory) {
                    return true;
                }
            }
        }
        return false;
    }

    /**
     * Returns true if anyone of the transactions satisfies the RCM checks
     *
     * @private
     * @param {*} transactions Transactions of the current ledger
     * @returns {boolean} True, if anyone of the transactions satisfies the RCM checks
     * @memberof UpdateLedgerEntryPanelComponent
     */
    private isRcmEntryPresent(transactions: any): boolean {
        if (transactions) {
            for (let index = 0; index < transactions.length; index++) {
                const selectedAccountDetails = {
                    uniqueName: transactions[index].particular.uniqueName || '',
                    parentGroups: transactions[index].particular ? transactions[index].particular.parentGroups : []
                }
                const activeAccountDetails = {
                    uniqueName: this.baseAccountDetails.particular ? this.baseAccountDetails.particular.uniqueName : '',
                    parentGroups: (this.baseAccountDetails && this.baseAccountDetails.parentGroups) ? this.baseAccountDetails.parentGroups : []
                }
                const isRcmEntry = this.generalService.shouldShowRcmSection(activeAccountDetails, selectedAccountDetails);
                if (isRcmEntry) {
                    return true;
                }
            }
        }
        return false;
    }


    /**
     *  To check tourist scheme applicable or not
     *
     * @private
     * @param {*} accountDetails Current ledger details
     * @returns {boolean} True if tourist scheme applicable
     * @memberof UpdateLedgerEntryPanelComponent
     */
    private checkTouristSchemeApplicable(baseAccountDetails: any, selectedAccountDetails, companyProfile): boolean {
        if (baseAccountDetails && baseAccountDetails.touristSchemeApplicable) {
            return true;
        } else if (baseAccountDetails && baseAccountDetails.voucher && (baseAccountDetails.voucher.name === 'sales' || baseAccountDetails.voucher.name === 'cash') && selectedAccountDetails && selectedAccountDetails.body && selectedAccountDetails.body.parentGroups && selectedAccountDetails.body.parentGroups.length > 1 && selectedAccountDetails.body.parentGroups[1].uniqueName && this.allowParentGroup.includes(selectedAccountDetails.body.parentGroups[1].uniqueName) && companyProfile && companyProfile.countryV2 && companyProfile.countryV2.alpha2CountryCode && companyProfile.countryV2.alpha2CountryCode === 'AE') {
            return true;
        } else {
            return false;
        }
    }

    /**
     * Toggle Tourist scheme checkbox then reset passport number
     *
     * @memberof UpdateLedgerEntryPanelComponent
     */
    public touristSchemeApplicableToggle(event): void {
        this.vm.selectedLedger.passportNumber = '';
        this.vm.selectedLedger.touristSchemeApplicable = event;
    }

    /**
     * To make value alphanumeric
     *
     * @param {*} event Template ref to get value
     * @memberof UpdateLedgerEntryPanelComponent
     */
    public allowAlphanumericChar(event: any): void {
        if (event && event.value) {
            this.vm.selectedLedger.passportNumber = this.generalService.allowAlphanumericChar(event.value)
        }
    }

    /**
     * To check advance receipt adjusted invoice list's in edit mode
     *
     * @memberof UpdateLedgerEntryPanelComponent
     */
    public openAdjustInvoiceEditMode(): void {
        if (this.generalService.currentOrganizationType === OrganizationType.Branch || (this.branches && this.branches.length === 1)) {
            this.handleVoucherAdjustment(true);
        }
    }

    /**
     * To calculate total amount of adjusted Invoices.
     *
     * @param {*} event Change value of an Invoices
     * @memberof UpdateLedgerEntryPanelComponent
     */
    public adjustedInvoiceAmountChange(): void {
        if (this.vm.selectedLedger && this.vm.selectedLedger.voucherAdjustments && this.vm.selectedLedger.voucherAdjustments.adjustments) {
            let totalAmount: number = 0;
            this.vm.selectedLedger.voucherAdjustments.adjustments.forEach(item => {
                totalAmount = Number(totalAmount) + (item.adjustmentAmount ? Number(item.adjustmentAmount.amountForAccount) : 0);
            });
            this.vm.selectedLedger.voucherAdjustments.totalAdjustmentAmount = totalAmount;
            this.checkAdjustedAmountExceed(Number(totalAmount));
            this.calculateInclusiveTaxesForAdvanceReceiptsInvoices();
        }
    }

    /**
     * To calculate inclusive taxes and assign to advance receipts adjusted invoice's tax object
     *
     * @memberof UpdateLedgerEntryPanelComponent
     */
    public calculateInclusiveTaxesForAdvanceReceiptsInvoices(): void {
        this.vm.selectedLedger.voucherAdjustments.adjustments.map(item => {
            item.calculatedTaxAmount = this.generalService.calculateInclusiveOrExclusiveTaxes(true, item.adjustmentAmount.amountForAccount, item.taxRate, 0);
        });
    }

    /**
    * To calculate total amount of adjusted receipts.
    *
    * @memberof UpdateLedgerEntryPanelComponent
    */
    public adjustedReceiptsAmountChange(): void {
        if (this.vm.selectedLedger && this.vm.selectedLedger.voucherAdjustments && this.vm.selectedLedger.voucherAdjustments.adjustments) {
            let totalAmount: number = 0;
            this.vm.selectedLedger.voucherAdjustments.adjustments.forEach(item => {
                totalAmount = Number(totalAmount) + (item.adjustmentAmount ? Number(item.adjustmentAmount.amountForAccount) : 0);
            });
            this.totalAdjustedAmount = totalAmount;
            this.checkAdjustedAmountExceed(Number(totalAmount));
            this.calculateInclusiveTaxesForAdvanceReceipts();
        }
    }

    /**
     * To calculate inclusive taxes and assign to advance receipts tax object
     *
     * @memberof UpdateLedgerEntryPanelComponent
     */
    public calculateInclusiveTaxesForAdvanceReceipts(): void {
        let totalAmount: number = 0;
        this.vm.selectedLedger.voucherAdjustments.adjustments.map(item => {
            item.calculatedTaxAmount = this.generalService.calculateInclusiveOrExclusiveTaxes(true, item.adjustmentAmount.amountForAccount, item.taxRate, 0);
            totalAmount = Number(totalAmount) + Number(item.adjustmentAmount.amountForAccount);
        });
        this.totalAdjustedAmount = totalAmount;
    }

    /**
     * To check adjusted advance amount is more  than advance receipt/invoice
     *
     * @param {number} totalAmount Total compound amount
     * @memberof UpdateLedgerEntryPanelComponent
     */
    public checkAdjustedAmountExceed(totalAmount: number): void {
        if (Number(this.vm.compoundTotal) < Number(totalAmount)) {
            this.isAdjustedAmountExcess = true;
            this.adjustedExcessAmount = Number(totalAmount) - Number(this.vm.compoundTotal);
        } else {
            this.isAdjustedAmountExcess = false;
            this.adjustedExcessAmount = 0;
        }
        this.selectedAdvanceReceiptAdjustInvoiceEditMode = false;
    }

    /**
     * To check advance Receipt/Invoice amount is exceed to adjusted amount when amount change
     *
     * @memberof UpdateLedgerEntryPanelComponent
     */
    public checkAdvanceReceiptOrInvoiceAdjusted(): void {
        if (this.isAdjustedInvoicesWithAdvanceReceipt && this.vm.selectedLedger && this.vm.selectedLedger.voucherGeneratedType === 'receipt') {
            this.adjustedInvoiceAmountChange();
        } else if (this.isAdjustedWithAdvanceReceipt && this.vm.selectedLedger.voucherGeneratedType === 'sales') {
            this.adjustedReceiptsAmountChange();
        }
    }

    /**
     * Advance receipt adjustment remove model action response
     *
     * @param {*} userResponse  Action message
     * @memberof UpdateLedgerEntryPanelComponent
     */
    public onAdvanceReceiptRemoveCloseConfirmationModal(userResponse: any): void {
        if (userResponse) {
            this.isAdvanceReceipt = !userResponse.response;
            this.handleAdvanceReceiptChange();
            this.advanceReceiptRemoveConfirmationModal.hide();
        }
    }

    /**
     * Payment adjustment handler
     *
     * @param {{ adjustVoucherData: VoucherAdjustments, adjustPaymentData: AdjustAdvancePaymentModal}} event Adjustment handler
     * @memberof UpdateLedgerEntryPanelComponent
     */
    public getAdjustedPaymentData(event: { adjustVoucherData: VoucherAdjustments, adjustPaymentData: AdjustAdvancePaymentModal}): void {
        if (event && event.adjustPaymentData && event.adjustVoucherData) {
            const adjustments = cloneDeep(event.adjustVoucherData.adjustments);
            if (adjustments) {
                adjustments.forEach(adjustment => {
                    adjustment.adjustmentAmount = adjustment.balanceDue;
                    // delete adjustment.balanceDue;
                });

                this.vm.selectedLedger.voucherAdjustments = {
                    adjustments,
                    totalAdjustmentAmount: event.adjustPaymentData.totalAdjustedAmount,
                    tdsTaxUniqueName: null,
                    tdsAmount: null,
                    description: null
                };
                if (!adjustments || !adjustments.length) {
                    // No adjustments done clear the adjustment checkbox
                    this.isAdjustReceiptSelected = false;
                    this.isAdjustVoucherSelected = false;
                    this.isAdjustAdvanceReceiptSelected = false;
                    this.isAdjustVoucherSelected = false;
                }
            }
        }
        this.makeAdjustmentCalculation();
        this.adjustPaymentModal.hide();
    }

    /**
     * Close voucher adjustment modal handler
     *
     * @param {{ adjustVoucherData: VoucherAdjustments, adjustPaymentData: AdjustAdvancePaymentModal}} event Close event
     * @memberof UpdateLedgerEntryPanelComponent
     */
    public closeAdjustmentModal(event: { adjustVoucherData: VoucherAdjustments, adjustPaymentData: AdjustAdvancePaymentModal}): void {
        if (this.vm.selectedLedger.voucherAdjustments && this.vm.selectedLedger.voucherAdjustments.adjustments && !this.vm.selectedLedger.voucherAdjustments.adjustments.length) {
            // No adjustments done clear the adjustment checkbox
            this.isAdjustReceiptSelected = false;
            this.isAdjustVoucherSelected = false;
            this.isAdjustAdvanceReceiptSelected = false;

            if (!this.vm.isInvoiceGeneratedAlready) {
                this.vm.selectedLedger.voucherGenerated = false;
            }
        }
        this.adjustPaymentModal.hide();
    }

    /**
     * Toggles the more detail section
     *
     * @memberof UpdateLedgerEntryPanelComponent
     */
    public toggleMoreDetail(): void {
        this.showAdvanced = !this.showAdvanced;
        this.moreDetailOpen.emit(this.showAdvanced);
    }

    /**
     * Prepares the voucher adjustment configuration
     *
     * @private
     * @memberof UpdateLedgerEntryPanelComponent
     */
    private prepareAdjustVoucherConfiguration(): void {
        let customerUniqueName = [];
        this.vm.selectedLedger.transactions.forEach(transaction => {
            if (transaction.particular && transaction.particular.uniqueName){
                const uniqueName = transaction.particular.uniqueName.split('#')[0];
                customerUniqueName.push(uniqueName);
            }
        });
        if (this.vm.selectedLedger.voucherAdjustments && this.vm.selectedLedger.voucherAdjustments.adjustments) {
            this.vm.selectedLedger.voucherAdjustments.adjustments.forEach(adjustment => {
                if (!adjustment.balanceDue) {
                    adjustment.balanceDue = cloneDeep(adjustment.adjustmentAmount);
                } else if (!adjustment.adjustmentAmount) {
                    adjustment.adjustmentAmount = cloneDeep(adjustment.balanceDue);
                }
            });
        }
        customerUniqueName.push(this.baseAcc);
        customerUniqueName = _.union(customerUniqueName);
        this.adjustVoucherConfiguration = {
            voucherDetails: {
                voucherDate: this.vm.selectedLedger.entryDate,
                tcsTotal: 0,
                tdsTotal: 0,
                balanceDue: this.vm.selectedLedger.total.amount,
                grandTotal: this.vm.selectedLedger.total.amount,
                customerName: this.vm.selectedLedger && this.vm.selectedLedger.particular? this.vm.selectedLedger.particular.name : '',
                customerUniquename: customerUniqueName,
                totalTaxableValue: this.vm.selectedLedger.actualAmount,
                subTotal: this.vm.selectedLedger.total.amount,
            },
            accountDetails: {
                currencySymbol: this.profileObj ? this.profileObj.baseCurrencySymbol : ''
            },
            activeAccountUniqueName: this.activeAccount.uniqueName
        };
    }

    /**
     * To open advance receipts adjustment pop up
     *
     * @private
     * @memberof UpdateLedgerEntryPanelComponent
     */
    private openAdjustPaymentModal(): void {
        this.adjustPaymentModal.show();
    }

    /**
     * Initializes the variables based on adjustments made to show/hide sections on UI
     *
     * @private
     * @memberof UpdateLedgerEntryPanelComponent
     */
    private makeAdjustmentCalculation(): void {
        if (this.vm.selectedLedger && this.vm.selectedLedger.voucherAdjustments && this.vm.selectedLedger.voucherAdjustments.adjustments && this.vm.selectedLedger.voucherAdjustments.adjustments.length) {
            this.isAdjustVoucherSelected = true;
            if (this.vm.selectedLedger.voucherAdjustments.adjustments.every(adjustment => adjustment.voucherType === 'sales')) {
                this.isAdjustedInvoicesWithAdvanceReceipt = true;
                this.calculateInclusiveTaxesForAdvanceReceiptsInvoices();
            } else if (this.vm.selectedLedger.voucherAdjustments.adjustments.every(adjustment => adjustment.voucherType === 'receipt')) {
                this.isAdjustedWithAdvanceReceipt = true;
                this.calculateInclusiveTaxesForAdvanceReceipts();
            } else {
                this.isAdjustedWithAdvanceReceipt = false;
                this.isAdjustedInvoicesWithAdvanceReceipt = false;
            }
            if (this.isAdvanceReceipt) {
                this.isAdjustAdvanceReceiptSelected = true;
            } else if (this.vm.selectedLedger.voucher.shortCode === 'rcpt') {
                this.isAdjustReceiptSelected = true;
            }
        }
    }

    /**
     * Loads the default search suggestion when petty cash is opened
     *
     * @private
     * @memberof UpdateLedgerEntryPanelComponent
     */
    private loadDefaultSearchSuggestions(): void {
        this.onSearchQueryChanged('', 1, false, (response) => {
            this.defaultSuggestions = response.map(result => {
                return {
                    value: result.stock ? `${result.uniqueName}#${result.stock.uniqueName}` : result.uniqueName,
                    label: result.stock ? `${result.name} (${result.stock.name})` : result.name,
                    additional: result
                }
            }) || [];
            this.defaultResultsPaginationData.page = this.searchResultsPaginationData.page;
            this.defaultResultsPaginationData.totalPages = this.searchResultsPaginationData.totalPages;
            this.searchResults = [...this.defaultSuggestions];
            this.noResultsFoundLabel = SearchResultText.NotFound;
        });
    }
}
