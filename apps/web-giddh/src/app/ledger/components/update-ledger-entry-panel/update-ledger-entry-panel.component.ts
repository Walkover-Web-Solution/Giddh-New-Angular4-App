import { animate, state, style, transition, trigger } from '@angular/animations';
import {
    AfterViewInit,
    ChangeDetectorRef,
    Component, ElementRef,
    EventEmitter,
    Input,
    OnChanges,
    OnDestroy,
    OnInit,
    Output,
    SimpleChanges,
    TemplateRef,
    ViewChild
} from '@angular/core';
import { select, Store } from '@ngrx/store';
import { ResizedEvent } from 'angular-resize-event';
import { Configuration, SubVoucher, RATE_FIELD_PRECISION, SearchResultText, RESTRICTED_VOUCHERS_FOR_DOWNLOAD, AdjustedVoucherType } from 'apps/web-giddh/src/app/app.constant';
import { GIDDH_DATE_FORMAT } from 'apps/web-giddh/src/app/shared/helpers/defaultDateFormat';
import { saveAs } from 'file-saver';
import * as dayjs from 'dayjs';
import { BsDatepickerDirective } from "ngx-bootstrap/datepicker";
import { ModalDirective } from 'ngx-bootstrap/modal';
import { UploaderOptions, UploadInput, UploadOutput } from 'ngx-uploader';
import { combineLatest as observableCombineLatest, Observable, of as observableOf, ReplaySubject, Subject } from 'rxjs';
import { debounceTime, take, takeUntil } from 'rxjs/operators';
import { LedgerActions } from '../../../actions/ledger/ledger.actions';
import { ConfirmationModalConfiguration } from '../../../theme/confirmation-modal/confirmation-modal.interface';
import { LoaderService } from '../../../loader/loader.service';
import { cloneDeep, filter, last, orderBy, uniqBy } from '../../../lodash-optimized';
import { AccountResponse } from '../../../models/api-models/Account';
import { AdjustAdvancePaymentModal, VoucherAdjustments } from '../../../models/api-models/AdvanceReceiptsAdjust';
import { ICurrencyResponse, TaxResponse } from '../../../models/api-models/Company';
import { DownloadLedgerRequest, LedgerResponse } from '../../../models/api-models/Ledger';
import { IForceClear, SalesOtherTaxesCalculationMethodEnum, SalesOtherTaxesModal, VoucherTypeEnum } from '../../../models/api-models/Sales';
import { TagRequest } from '../../../models/api-models/settingsTags';
import { ILedgerTransactionItem } from '../../../models/interfaces/ledger.interface';
import { AccountService } from '../../../services/account.service';
import { LEDGER_API } from '../../../services/apiurls/ledger.api';
import { GeneralService } from '../../../services/general.service';
import { LedgerService } from '../../../services/ledger.service';
import { ToasterService } from '../../../services/toaster.service';
import { SettingsUtilityService } from '../../../settings/services/settings-utility.service';
import { giddhRoundOff } from '../../../shared/helpers/helperFunctions';
import { AppState } from '../../../store';
import { CurrentCompanyState } from '../../../store/company/company.reducer';
import { IOption } from '../../../theme/ng-virtual-select/sh-options.interface';
import { ShSelectComponent } from '../../../theme/ng-virtual-select/sh-select.component';
import { TaxControlComponent } from '../../../theme/tax-control/tax-control.component';
import { AVAILABLE_ITC_LIST } from '../../ledger.vm';
import { UpdateLedgerDiscountComponent } from '../update-ledger-discount/update-ledger-discount.component';
import { UpdateLedgerVm } from './update-ledger.vm';
import { SearchService } from '../../../services/search.service';
import { WarehouseActions } from '../../../settings/warehouse/action/warehouse.action';
import { OrganizationType } from '../../../models/user-login-state';
import { SettingsBranchActions } from '../../../actions/settings/branch/settings.branch.action';
import { NewConfirmationModalComponent } from '../../../theme/new-confirmation-modal/confirmation-modal.component';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmModalComponent } from '../../../theme/new-confirm-modal/confirm-modal.component';
import { SettingsTagService } from '../../../services/settings.tag.service';
import { MatAccordion } from '@angular/material/expansion';
import { CommonService } from '../../../services/common.service';
import { AdjustmentUtilityService } from '../../../shared/advance-receipt-adjustment/services/adjustment-utility.service';
import { LedgerUtilityService } from '../../services/ledger-utility.service';
import { InvoiceActions } from '../../../actions/invoice/invoice.actions';

/** Info message to be displayed during adjustment if the voucher is not generated */
const ADJUSTMENT_INFO_MESSAGE = 'Voucher should be generated in order to make adjustments';

@Component({
    selector: 'update-ledger-entry-panel',
    templateUrl: './update-ledger-entry-panel.component.html',
    styleUrls: ['./update-ledger-entry-panel.component.scss'],
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
    /** Instance of mat accordion */
    @ViewChild(MatAccordion) public accordion: MatAccordion;
    /** Instance of RCM checkbox */
    @ViewChild("rcmCheckbox") public rcmCheckbox: ElementRef;
    public vm: UpdateLedgerVm;
    /* This will hold local JSON data */
    public localeData: any = {};
    /* This will hold common JSON data */
    public commonLocaleData: any = {};
    @Output() public closeUpdateLedgerModal: EventEmitter<boolean> = new EventEmitter();
    @Output() public showQuickAccountModalFromUpdateLedger: EventEmitter<boolean> = new EventEmitter();
    @Output() public toggleOtherTaxesAsideMenu: EventEmitter<UpdateLedgerVm> = new EventEmitter();
    /** Emits when more detail is opened */
    @Output() public moreDetailOpen: EventEmitter<any> = new EventEmitter();
    @Input() public isPettyCash: boolean = false;
    @Input() public pettyCashEntry: any;
    @Input() public pettyCashBaseAccountTypeString: string;
    @Input() public pettyCashBaseAccountUniqueName: string;
    /** Stores the active company details */
    @Input() public activeCompany: any;
    @Input() public searchResultsPaginationPage: any;
    @Input() public searchResultsPaginationTotalPages: any;
    /** Holds side of entry (dr/cr) */
    @Input() public entrySide: string;
    /** fileinput element ref for clear value after remove attachment **/
    @ViewChild('fileInputUpdate', { static: false }) public fileInputElement: ElementRef;
    @ViewChild('discount', { static: false }) public discountComponent: UpdateLedgerDiscountComponent;
    @ViewChild('tax', { static: false }) public taxControll: TaxControlComponent;
    @ViewChild('updateBaseAccount', { static: true }) public updateBaseAccount: ModalDirective;
    @ViewChild(BsDatepickerDirective, { static: true }) public datepickers: BsDatepickerDirective;
    /** Adjustment modal */
    @ViewChild('adjustPaymentModal', { static: true }) public adjustPaymentModal: TemplateRef<any>;
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
    public tags: TagRequest[] = [];
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
    public selectedLedgerStream$: Observable<LedgerResponse>;
    public companyProfile$: Observable<any>;
    public activeAccount$: Observable<AccountResponse>;
    public activeAccount: AccountResponse;
    /** Emits the active ledger account data */
    public activeAccountSubject: Subject<any> = new Subject();
    /** Observable for total amount changes */
    public totalAmountChanged$: Subject<any> = new Subject();
    public destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
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
    public multiCurrencyAccDetails: any = null;
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
    /* This will hold the account unique name which is going to be in edit mode to get compared once updated */
    public entryAccountUniqueName: any = '';
    /** Stores the current organization type */
    public currentOrganizationType: string;
    /** Observable to store the branches of current company */
    public currentCompanyBranches$: Observable<any>;
    /** Stores the current branches */
    public branches: Array<any>;
    /** Stores the adjustments as a backup that are present on the current opened entry */
    public originalVoucherAdjustments: VoucherAdjustments;
    public Shown: boolean = true;
    public isHide: boolean = false;
    public condition: boolean = true;
    public condition2: boolean = false;
    /** Stores the multi-lingual label of current voucher */
    public currentVoucherLabel: string;
    public asideMenuStateForOtherTaxes: string = 'out';
    public companyTaxesList: TaxResponse[] = [];
    public otherTaxDialogRef: any;
    public adjustmentDialogRef: any;
    public advanceReceiptRemoveDialogRef: any;
    /** True if more details is open */
    public isMoreDetailOpen: boolean;
    /** Stores the voucher API version of current company */
    public voucherApiVersion: 1 | 2;
    /** True if user itself checked the generate voucher  */
    public manualGenerateVoucherChecked: boolean = false;
    /** Holds input to get invoice list request params */
    public invoiceListRequestParams: any = {};
    /** Current page for reference vouchers */
    private referenceVouchersCurrentPage: number = 1;
    /** Reference voucher search field */
    private searchReferenceVoucher: any = "";
    /** Invoice list observable */
    public invoiceList$: Observable<any[]>;
    /** Holds restricted voucher types for download */
    public restrictedVouchersForDownload: any[] = RESTRICTED_VOUCHERS_FOR_DOWNLOAD;

    constructor(
        private accountService: AccountService,
        private ledgerService: LedgerService,
        private generalService: GeneralService,
        private ledgerAction: LedgerActions,
        private loaderService: LoaderService,
        private settingsTagService: SettingsTagService,
        private settingsBranchAction: SettingsBranchActions,
        private settingsUtilityService: SettingsUtilityService,
        private store: Store<AppState>,
        private searchService: SearchService,
        private toaster: ToasterService,
        private warehouseActions: WarehouseActions,
        private changeDetectorRef: ChangeDetectorRef,
        public dialog: MatDialog,
        private commonService: CommonService,
        private adjustmentUtilityService: AdjustmentUtilityService,
        private ledgerUtilityService: LedgerUtilityService,
        private invoiceAction: InvoiceActions
    ) {

        this.vm = new UpdateLedgerVm(this.generalService, this.ledgerUtilityService);

        this.entryUniqueName$ = this.store.pipe(select(p => p.ledger.selectedTxnForEditUniqueName), takeUntil(this.destroyed$));
        this.editAccUniqueName$ = this.store.pipe(select(p => p.ledger.selectedAccForEditUniqueName), takeUntil(this.destroyed$));
        this.selectedLedgerStream$ = this.store.pipe(select(p => p.ledger.transactionDetails), takeUntil(this.destroyed$));
        this.companyProfile$ = this.store.pipe(select(p => p.settings.profile), takeUntil(this.destroyed$));
        this.vm.companyTaxesList$ = this.store.pipe(select(p => p.company && p.company.taxes), takeUntil(this.destroyed$));
        this.sessionKey$ = this.store.pipe(select(p => p.session.user.session.id), takeUntil(this.destroyed$));
        this.companyName$ = this.store.pipe(select(p => p.session.companyUniqueName), takeUntil(this.destroyed$));
        this.isDeleteTrxEntrySuccess$ = this.store.pipe(select(p => p.ledger.isDeleteTrxEntrySuccessfull), takeUntil(this.destroyed$));
        this.isTxnUpdateInProcess$ = this.store.pipe(select(p => p.ledger.isTxnUpdateInProcess), takeUntil(this.destroyed$));
        this.isTxnUpdateSuccess$ = this.store.pipe(select(p => p.ledger.isTxnUpdateSuccess), takeUntil(this.destroyed$));
        this.closeUpdateLedgerModal.pipe(takeUntil(this.destroyed$));
        this.vm.currencyList$ = this.store.pipe(select(s => s.session.currencies), takeUntil(this.destroyed$));
    }

    public ngOnInit() {
        if (this.isPettyCash) {
            document.querySelector('body').classList.add('ledger-body');
        }
        if (this.searchResultsPaginationPage) {
            this.searchResultsPaginationData.page = this.searchResultsPaginationPage;
        }
        if (this.searchResultsPaginationTotalPages) {
            this.searchResultsPaginationData.totalPages = this.searchResultsPaginationTotalPages;
        }

        if (this.generalService.voucherApiVersion === 2) {
            this.allowParentGroup.push("loanandoverdraft");
        }

        this.store.dispatch(this.invoiceAction.getInvoiceSetting());
        this.getPurchaseSettings();

        this.settingsTagService.GetAllTags().pipe(takeUntil(this.destroyed$)).subscribe(response => {
            if (response?.status === "success" && response?.body?.length > 0) {
                _.map(response?.body, (tag) => {
                    tag.label = tag.name;
                    tag.value = tag.name;
                });
                this.tags = _.orderBy(response?.body, 'name');
            }
        });

        this.currentOrganizationType = this.generalService.currentOrganizationType;
        this.currentCompanyBranches$ = this.store.pipe(select(appStore => appStore.settings.branches), takeUntil(this.destroyed$));
        this.currentCompanyBranches$.subscribe(response => {
            if (response) {
                this.branches = response;
            } else {
                this.store.dispatch(this.settingsBranchAction.GetALLBranches({ from: '', to: '' }));
            }
        });
        this.store.pipe(select(appState => appState.ledger.refreshLedger), takeUntil(this.destroyed$)).subscribe(response => {
            if (response === true) {
                this.store.dispatch(this.ledgerAction.refreshLedger(false));
                this.entryAccountUniqueName = "";
                this.closeUpdateLedgerModal.emit();
            }
        });

        this.store.pipe(select(appState => appState.company), takeUntil(this.destroyed$)).subscribe((companyData: CurrentCompanyState) => {
            if (companyData) {
                this.isTcsTdsApplicable = companyData.isTcsTdsApplicable;
            }
        });
        this.vm.selectedLedger = new LedgerResponse();
        this.vm.selectedLedger.voucher = { name: '', shortCode: '' };
        this.vm.selectedLedger.otherTaxModal = new SalesOtherTaxesModal();

        if (this.isPettyCash) {
            if (this.pettyCashEntry) {
                this.entryUniqueName = this.pettyCashEntry.uniqueName;
                this.accountUniqueName = this.pettyCashEntry.particular?.uniqueName;
                this.selectedLedgerStream$ = observableOf(this.pettyCashEntry as LedgerResponse);
            }
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
        observableCombineLatest([this.entryUniqueName$, this.editAccUniqueName$]).pipe(takeUntil(this.destroyed$)).subscribe((resp: any[]) => {
            if (resp[0] && resp[1]) {
                this.entryUniqueName = resp[0];
                this.accountUniqueName = resp[1];
                this.store.dispatch(this.ledgerAction.getLedgerTrxDetails(this.accountUniqueName, this.entryUniqueName));
            }
        });

        // emit upload event
        this.uploadInput = new EventEmitter<UploadInput>();
        // set file upload options
        this.fileUploadOptions = { concurrency: 0 };

        observableCombineLatest([this.activeAccountSubject]).pipe(takeUntil(this.destroyed$)).subscribe((response) => {
            if (response[0]) {
                // set account details for multi currency account
                this.prepareMultiCurrencyObject(this.vm.selectedLedger);
            }
        });

        this.totalAmountChanged$.pipe(debounceTime(500), takeUntil(this.destroyed$)).subscribe((response) => {
            if (response) {
                this.vm.inventoryTotalChanged();
            }
        });

        // check if delete entry is success
        this.isDeleteTrxEntrySuccess$.subscribe(del => {
            if (del) {
                this.store.dispatch(this.ledgerAction.resetDeleteTrxEntryModal());
                this.closeUpdateLedgerModal.emit(true);
                this.baseAccountChanged = false;
            }
        });

        // check if update entry is success
        this.isTxnUpdateSuccess$.subscribe(upd => {
            if (upd) {
                this.store.dispatch(this.ledgerAction.ResetUpdateLedger());
                this.resetPreviousSearchResults();
                this.baseAccountChanged = false;
                setTimeout(() => {
                    this.store.dispatch(this.ledgerAction.getLedgerTrxDetails(this.accountUniqueName, this.entryUniqueName));
                }, 50);
            }
        });
        if (this.vm) {
            this.vm.compundTotalObserver.pipe(takeUntil(this.destroyed$))
                .subscribe(res => {
                    if (res || res === 0) {
                        this.checkAdvanceReceiptOrInvoiceAdjusted();
                    }
                });
        }
        this.voucherApiVersion = this.generalService.voucherApiVersion;
        document.querySelector('body')?.classList?.add('update-ledger-entry-panel-popup');
    }

    public toggleShow(): void {
        this.condition = !this.condition;
        this.condition2 = !this.condition;
        this.Shown = !this.Shown;
        this.isHide = !this.isHide;
    }

    /** Track by function for items */
    public trackByFunction(index: number, item: ILedgerTransactionItem): any {
        return item?.particular?.uniqueName;
    }

    private prepareMultiCurrencyObject(accountDetails: any) {
        if (this.isPettyCash) {
            // In case of petty cash account unique name will be received
            this.multiCurrencyAccDetails = {
                currency: String(accountDetails?.currency || '')
            };
        } else {
            // In other cases account will be received
            this.multiCurrencyAccDetails = {
                currency: String(accountDetails?.particular?.currency?.code || '')
            };
        };

        this.vm.isMultiCurrencyAvailable = this.multiCurrencyAccDetails ?
            !!(this.multiCurrencyAccDetails.currency && this.multiCurrencyAccDetails.currency !== this.profileObj?.baseCurrency)
            : false;

        this.vm.foreignCurrencyDetails = { code: this.profileObj?.baseCurrency, symbol: this.profileObj.baseCurrencySymbol };

        if (this.vm.isMultiCurrencyAvailable) {
            let currencies: ICurrencyResponse[] = [];
            let multiCurrencyAccCurrency: ICurrencyResponse;

            this.vm.currencyList$.pipe(take(1)).subscribe(res => currencies = res);
            multiCurrencyAccCurrency = currencies.find(f => f?.code === this.multiCurrencyAccDetails?.currency);
            this.vm.baseCurrencyDetails = { code: multiCurrencyAccCurrency?.code, symbol: multiCurrencyAccCurrency?.symbol };
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
            if (txn?.particular?.uniqueName && lastTxn?.particular?.uniqueName) {
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
                url: Configuration.ApiUrl + LEDGER_API.UPLOAD_FILE?.replace(':companyUniqueName', companyUniqueName),
                method: 'POST',
                fieldName: 'file',
                data: { company: companyUniqueName },
                headers: { 'Session-Id': sessionKey },
            };
            this.uploadInput.emit(event);
        } else if (output.type === 'start') {
            this.isFileUploading = true;
            this.loaderService.show();
        } else if (output.type === 'done') {
            this.loaderService.hide();
            if (output.file.response?.status === 'success') {
                this.isFileUploading = false;
                this.vm.selectedLedger.attachedFile = output.file.response.body?.uniqueName;
                this.vm.selectedLedger.attachedFileName = output.file.response.body?.name;
                this.toaster.showSnackBar("success", this.localeData?.file_uploaded);
            } else {
                this.isFileUploading = false;
                this.vm.selectedLedger.attachedFile = '';
                this.vm.selectedLedger.attachedFileName = '';
                this.toaster.showSnackBar("error", output.file.response.message);
            }
        }
    }

    public selectAccount(e: IOption, txn: ILedgerTransactionItem, selectCmp: ShSelectComponent, clearAccount?: boolean) {
        if (!e.value || clearAccount) {
            // if there's no selected account set selectedAccount to null
            txn.selectedAccount = null;
            txn.inventory = null;
            txn.particular.name = undefined;
            txn.particular.uniqueName = undefined;
            txn.amount = 0;
            txn.particular.parentGroups = undefined;
            txn.particular.category = undefined;

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
                    if (d.particular === txn.selectedAccount?.uniqueName) {
                        d.amount = 0;
                    }
                });
            }
            if (e.label) {
                txn.particular.name = e.label;
            }
            // if ther's stock entry
            if (e.additional.stock) {
                // check if we aleready have stock entry
                if (this.vm.isThereStockEntry(e?.value)) {
                    selectCmp.clear();
                    txn.particular.uniqueName = null;
                    txn.particular.name = null;
                    txn.selectedAccount = null;
                    this.toaster.showSnackBar("warning", this.localeData?.multiple_stock_entry_error);
                    return;
                } else {
                    // add unitArrys in txn for stock entry
                    let requestObject;
                    if (e.additional.stock) {
                        requestObject = {
                            stockUniqueName: e.additional.stock?.uniqueName
                        };
                    }
                    const currentLedgerCategory = this.activeAccount ? this.generalService.getAccountCategory(this.activeAccount, this.activeAccount?.uniqueName) : '';
                    // If current ledger is of income or expense category then send current ledger unique name else send particular account unique name
                    const accountUniqueName = e.additional.stock && (currentLedgerCategory === 'income' || currentLedgerCategory === 'expenses') ?
                        this.activeAccount ? this.activeAccount?.uniqueName : '' :
                        e.additional?.uniqueName;
                    this.searchService.loadDetails(accountUniqueName, requestObject).pipe(takeUntil(this.destroyed$)).subscribe(data => {
                        // directly assign additional property
                        if (data && data.body) {
                            // Take taxes of parent group and stock's own taxes
                            const taxes = this.generalService.fetchTaxesOnPriority(
                                data.body.stock?.taxes ?? [],
                                data.body.stock?.groupTaxes ?? [],
                                data.body.taxes ?? [],
                                data.body.groupTaxes ?? []);
                            txn.selectedAccount = {
                                ...e.additional,
                                label: e.label,
                                value: e?.value,
                                isHilighted: true,
                                applicableTaxes: taxes,
                                currency: data.body.currency,
                                currencySymbol: data.body.currencySymbol,
                                email: data.body.emails,
                                isFixed: data.body.isFixed,
                                mergedAccounts: data.body.mergedAccounts,
                                mobileNo: data.body.mobileNo,
                                nameStr: e.additional && e.additional.parentGroups ? e.additional.parentGroups.map(parent => parent?.name).join(', ') : '',
                                stock: data.body.stock,
                                uNameStr: e.additional && e.additional.parentGroups ? e.additional.parentGroups.map(parent => parent?.uniqueName).join(', ') : '',
                            };
                            if (txn.selectedAccount && txn.selectedAccount.stock) {
                                txn.selectedAccount.stock.rate = Number((txn.selectedAccount.stock.rate / this.vm.selectedLedger?.exchangeRate).toFixed(RATE_FIELD_PRECISION));
                            }
                            let rate = 0;
                            let unitCode = '';
                            let stockName = '';
                            let stockUniqueName = '';
                            let stockUnitUniqueName = '';
                            if (txn.selectedAccount && txn.selectedAccount.stock) {
                                let defaultUnit = {
                                    stockUnitCode: txn.selectedAccount.stock.stockUnitCode,
                                    code: txn.selectedAccount.stock.stockUnitCode,
                                    rate: txn.selectedAccount.stock.rate,
                                    name: txn.selectedAccount.stock.name
                                };
                                txn.unitRate = txn.selectedAccount.stock.unitRates.map(unitRate => ({ ...unitRate, code: unitRate.stockUnitCode }));
                                stockName = defaultUnit.name;
                                rate = defaultUnit.rate;
                                stockUniqueName = txn.selectedAccount.stock?.uniqueName;
                                unitCode = defaultUnit.code;
                                stockUnitUniqueName = txn.selectedAccount.stock.stockUnitUniqueName;
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
                                        rate: rate,
                                        stockUnitUniqueName: stockUnitUniqueName
                                    },
                                    amount: 0,
                                    rate
                                };
                                // Stock item, show the warehouse drop down
                                if (!this.shouldShowWarehouse) {
                                    this.shouldShowWarehouse = true;
                                }
                            }
                            if (rate > 0) {
                                txn.amount = rate;
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
                            this.vm.onTxnAmountChange(txn);
                        }
                    });
                }
            } else {
                this.searchService.loadDetails(e?.value).pipe(takeUntil(this.destroyed$)).subscribe(data => {
                    // directly assign additional property
                    if (data && data.body) {
                        // Take taxes of parent group
                        const taxes = this.generalService.fetchTaxesOnPriority(
                            data.body.stock?.taxes ?? [],
                            data.body.stock?.groupTaxes ?? [],
                            data.body.taxes ?? [],
                            data.body.groupTaxes ?? []);

                        txn.selectedAccount = {
                            ...e.additional,
                            label: e.label,
                            value: e?.value,
                            isHilighted: true,
                            applicableTaxes: taxes,
                            currency: data.body.currency,
                            currencySymbol: data.body.currencySymbol,
                            email: data.body.emails,
                            isFixed: data.body.isFixed,
                            mergedAccounts: data.body.mergedAccounts,
                            mobileNo: data.body.mobileNo,
                            nameStr: e.additional && e.additional.parentGroups ? e.additional.parentGroups.map(parent => parent?.name).join(', ') : '',
                            stocks: [],
                            uNameStr: e.additional && e.additional.parentGroups ? e.additional.parentGroups.map(parent => parent?.uniqueName).join(', ') : ''
                        };
                        delete txn.inventory;
                        // Non stock item got selected, search if there is any stock item along with non-stock item
                        const isStockItemPresent = this.isStockItemPresent();
                        if (!isStockItemPresent) {
                            // None of the item were stock item, hide the warehouse section which is applicable only for stocks
                            this.shouldShowWarehouse = false;
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
                        this.vm.onTxnAmountChange(txn);
                    }
                });
            }
        }
    }

    public onTxnAmountChange(txn: ILedgerTransactionItem) {
        if (txn) {
            txn.convertedAmount = this.vm.calculateConversionRate(txn.amount);
            txn.isUpdated = true;
            this.vm.onTxnAmountChange(txn);
        }
    }

    public showDeleteAttachedFileModal() {
        let dialogRef = this.dialog.open(ConfirmModalComponent, {
            width: '630px',
            data: {
                title: this.commonLocaleData?.app_delete,
                body: this.localeData?.confirm_delete_file,
                ok: this.commonLocaleData?.app_yes,
                cancel: this.commonLocaleData?.app_no,
                permanentlyDeleteMessage: this.localeData?.delete_entries_content
            }
        });

        dialogRef.afterClosed().pipe(take(1)).subscribe(response => {
            if (response) {
                this.deleteAttachedFile();
            }
        });
    }

    public showDeleteEntryModal() {
        let dialogRef = this.dialog.open(ConfirmModalComponent, {
            width: '630px',
            data: {
                title: this.commonLocaleData?.app_delete,
                body: this.localeData?.confirm_delete_entry,
                ok: this.commonLocaleData?.app_yes,
                cancel: this.commonLocaleData?.app_no,
                permanentlyDeleteMessage: this.localeData?.delete_entries_content
            }
        });

        dialogRef.afterClosed().pipe(take(1)).subscribe(response => {
            if (response) {
                this.deleteTrxEntry();
            }
        });
    }

    public deleteTrxEntry() {
        let uniqueName = (this.vm.selectedLedger && this.vm.selectedLedger.particular) ? this.vm.selectedLedger.particular.uniqueName : undefined;
        if (uniqueName) {
            this.store.dispatch(this.ledgerAction.deleteTrxEntry(uniqueName, this.entryUniqueName));
        }
    }

    public deleteAttachedFile() {
        this.ledgerService.removeAttachment(this.vm.selectedLedger?.attachedFile).subscribe((response) => {
            if (response?.status === 'success') {
                this.vm.selectedLedger.attachedFile = '';
                this.vm.selectedLedger.attachedFileName = '';
                if (this.fileInputElement && this.fileInputElement.nativeElement) {
                    this.fileInputElement.nativeElement.value = '';
                }
                this.toaster.showSnackBar("success", this.localeData?.remove_file);
            } else {
                this.toaster.showSnackBar("error", response?.message)
            }
        });
    }

    public saveLedgerTransaction() {
        // due to date picker of Tx entry date format need to change
        if (this.vm.selectedLedger.entryDate) {
            let entryDate = (typeof this.vm.selectedLedger.entryDate === "object") ? dayjs(this.vm.selectedLedger.entryDate) : dayjs(this.vm.selectedLedger.entryDate, GIDDH_DATE_FORMAT);
            if (!entryDate.isValid()) {
                this.toaster.showSnackBar("error", this.localeData?.invalid_date);
                this.loaderService.hide();
                return;
            } else {
                this.vm.selectedLedger.entryDate = (typeof this.vm.selectedLedger.entryDate === "object") ? dayjs(this.vm.selectedLedger.entryDate).format(GIDDH_DATE_FORMAT) : dayjs(this.vm.selectedLedger.entryDate, GIDDH_DATE_FORMAT).format(GIDDH_DATE_FORMAT);
            }
        }

        // due to date picker of Tx chequeClearance date format need to change
        if (this.vm.selectedLedger.chequeClearanceDate) {
            let chequeClearanceDate = (typeof this.vm.selectedLedger.chequeClearanceDate === "object") ? dayjs(this.vm.selectedLedger.chequeClearanceDate) : dayjs(this.vm.selectedLedger.chequeClearanceDate, GIDDH_DATE_FORMAT);
            if (!chequeClearanceDate.isValid()) {
                this.toaster.showSnackBar("error", this.localeData?.invalid_cheque_clearance_date);
                this.loaderService.hide();
                return;
            } else {
                this.vm.selectedLedger.chequeClearanceDate = (typeof this.vm.selectedLedger.chequeClearanceDate === "object") ? dayjs(this.vm.selectedLedger.chequeClearanceDate).format(GIDDH_DATE_FORMAT) : dayjs(this.vm.selectedLedger.chequeClearanceDate, GIDDH_DATE_FORMAT).format(GIDDH_DATE_FORMAT);
            }
        }
        let requestObj: LedgerResponse = this.vm.prepare4Submit();

        // special case for is petty cash mode
        // remove dummy others account from transaction.particular.uniqueName
        // added because we want to handle others account case in petty cash entry
        if (this.isPettyCash) {
            let isThereOthersDummyAcc = this.vm.otherAccountList.some(d => d?.uniqueName === 'others' && d?.isDummy);
            if (isThereOthersDummyAcc) {
                let isThereDummyOtherTrx = requestObj.transactions.some(s => s.particular?.uniqueName === 'others');
                if (isThereDummyOtherTrx) {
                    this.toaster.showSnackBar("error", this.localeData?.invalid_account_transaction_error);
                    return;
                }
            }
        }
        if (this.isRcmEntry && (!requestObj.taxes || requestObj.taxes?.length === 0)) {
            if (this.taxControll?.taxInputElement?.nativeElement) {
                // Taxes are mandatory for RCM and Advance Receipt entries
                this.taxControll.taxInputElement.nativeElement?.classList?.add('error-box');
                return;
            }
        }
        if (requestObj) {
            requestObj.valuesInAccountCurrency = this.vm.selectedCurrency === 0;
            requestObj.exchangeRate = (this.vm.selectedCurrencyForDisplay !== this.vm.selectedCurrency) ? (1 / this.vm.selectedLedger?.exchangeRate) : this.vm.selectedLedger?.exchangeRate;
            requestObj.subVoucher = (this.isRcmEntry) ? SubVoucher.ReverseCharge : (this.isAdvanceReceipt) ? SubVoucher.AdvanceReceipt : '';
            requestObj.transactions = requestObj.transactions?.filter(f => !f.isDiscount);
        }
        if (!this.taxOnlyTransactions && requestObj.voucherType !== "jr") {
            requestObj.transactions = requestObj.transactions?.filter(tx => !tx.isTax);
        }
        if (this.voucherApiVersion === 2 && (requestObj.voucherGenerated || requestObj.generateInvoice) && requestObj.voucherType !== "jr") {
            requestObj.transactions = requestObj.transactions?.filter(tx => tx.particular?.uniqueName !== "roundoff");
        }
        requestObj.transactions.map((transaction: any) => {
            if (transaction?.inventory && this.shouldShowWarehouse) {
                // Update the warehouse details in update ledger flow
                if (transaction?.inventory.warehouse) {
                    transaction.inventory.warehouse.uniqueName = this.selectedWarehouse;
                } else {
                    transaction.inventory.warehouse = { name: '', uniqueName: '' };
                    transaction.inventory.warehouse.uniqueName = this.selectedWarehouse;
                }
            }
        });
        if (requestObj?.voucherAdjustments?.adjustments?.length > 0) {
            requestObj.voucherAdjustments.adjustments.forEach((adjustment: any) => {
                delete adjustment.balanceDue;
            });
        }
        delete requestObj['tdsTaxes'];
        delete requestObj['tcsTaxes'];

        if (requestObj.voucherType !== VoucherTypeEnum.creditNote && requestObj.voucherType !== VoucherTypeEnum.debitNote) {
            if (this.voucherApiVersion === 2) {
                requestObj.referenceVoucher = null;
            } else {
                requestObj.invoiceLinkingRequest = null;
            }
        }
        if ((this.isAdvanceReceipt && !this.isAdjustAdvanceReceiptSelected) || (this.vm.selectedLedger?.voucher?.shortCode === 'rcpt' && !this.isAdjustReceiptSelected) || !this.isAdjustVoucherSelected) {
            // Clear the voucher adjustments if the adjust advance receipt or adjust receipt is not selected
            this.vm.selectedLedger.voucherAdjustments = undefined;
            requestObj.voucherAdjustments = undefined;
        }
        if (this.isAdvanceReceipt) {
            requestObj.voucherType = 'rcpt';
        }

        if (this.voucherApiVersion === 2) {
            requestObj = this.adjustmentUtilityService.getAdjustmentObject(requestObj);
        }

        if (requestObj.referenceVoucher) {
            delete requestObj.referenceVoucher.number;
            delete requestObj.referenceVoucher.date;
            delete requestObj.referenceVoucher.voucherType;
        }

        // if no petty cash mode then do normal update ledger request
        if (!this.isPettyCash) {
            requestObj['handleNetworkDisconnection'] = true;
            requestObj['refreshLedger'] = false;

            if (this.entryAccountUniqueName && this.entryAccountUniqueName !== this.changedAccountUniq) {
                requestObj['refreshLedger'] = true;
            }

            if (this.baseAccountChanged) {
                this.store.dispatch(this.ledgerAction.updateTxnEntry(requestObj, this.firstBaseAccountSelected, this.entryUniqueName + '?newAccountUniqueName=' + this.changedAccountUniq));
            } else {
                this.store.dispatch(this.ledgerAction.updateTxnEntry(requestObj, this.firstBaseAccountSelected, this.entryUniqueName));
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
        if (this.isPettyCash) {
            document.querySelector('body').classList.remove('ledger-body');
        }
        this.vm.resetVM();
        this.destroyed$.next(true);
        this.destroyed$.complete();
        // Remove the transaction details for ledger once the component is destroyed
        this.store.dispatch(this.ledgerAction.resetLedgerTrxDetails());
        document.querySelector('body')?.classList?.remove('update-ledger-entry-panel-popup');
    }

    public downloadAttachedFile(fileName: string, e: Event) {
        e.stopPropagation();
        this.ledgerService.DownloadAttachement(fileName).pipe(takeUntil(this.destroyed$)).subscribe(d => {
            if (d?.status === 'success') {
                let blob = this.generalService.base64ToBlob(d.body.uploadedFile, `image/${d.body.fileType}`, 512);
                return saveAs(blob, d.body.name);
            } else {
                this.toaster.showSnackBar("error", d.message);
            }
        });
    }

    public downloadInvoice(transaction: any, e: Event) {
        e.stopPropagation();
        let downloadRequest = new DownloadLedgerRequest();
        if (this.voucherApiVersion === 2) {
            downloadRequest.uniqueName = transaction?.voucherUniqueName;
        } else {
            downloadRequest.invoiceNumber = [transaction?.voucherNumber];
        }
        downloadRequest.voucherType = (transaction?.voucherGeneratedType) ? transaction?.voucherGeneratedType : transaction?.voucher?.name;

        this.ledgerService.DownloadInvoice(downloadRequest, this.activeAccount?.uniqueName).pipe(takeUntil(this.destroyed$)).subscribe(d => {
            if (d?.status === 'success') {
                let blob = this.generalService.base64ToBlob(d.body, 'application/pdf', 512);
                return saveAs(blob, `${this.activeAccount.name} - ${transaction?.voucherNumber}.pdf`);
            } else {
                this.toaster.showSnackBar("error", d.message);
            }
        });
    }

    public showQuickAccountModal() {
        this.showQuickAccountModalFromUpdateLedger.emit(true);
    }

    public changeBaseAccount(acc) {
        this.openDropDown = false;
        if (!acc) {
            this.toaster.showSnackBar("error", this.localeData?.account_unchanged);
            this.hideBaseAccountModal();
            return;
        }
        if (acc === this.baseAcc) {
            this.toaster.showSnackBar("error", this.localeData?.account_unchanged);
            this.hideBaseAccountModal();
            return;
        }

        this.changedAccountUniq = acc?.value;
        this.baseAccountChanged = true;
        this.accountUniqueName = acc?.value;

        if (this.voucherApiVersion === 2) {
            // get flatten_accounts list && get transactions list && get ledger account list
            observableCombineLatest([this.selectedLedgerStream$, this.accountService.GetAccountDetailsV2(this.accountUniqueName), this.companyProfile$])
                .pipe(takeUntil(this.destroyed$))
                .subscribe((resp: any[]) => {
                    if (resp[0] && resp[1] && resp[2]) {
                        this.initEntry(resp, true);
                    }
                });
        } else {
            this.saveLedgerTransaction();
        }

        this.hideBaseAccountModal();
    }

    public openBaseAccountModal() {
        if (this.voucherApiVersion !== 2 && this.vm.selectedLedger.voucherGenerated) {
            this.toaster.showSnackBar("error", this.localeData?.base_account_change_error);
            return;
        }
        if (this.updateBaseAccount) {
            this.updateBaseAccount.show();
        }
    }

    public hideBaseAccountModal() {
        if (this.updateBaseAccount) {
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
        if (this.voucherApiVersion === 2) {
            this.resetInvoiceList();
        }
        if (event?.value === VoucherTypeEnum.creditNote || event?.value === VoucherTypeEnum.debitNote) {
            this.getInvoiceListsForCreditNote();
        }
        this.isAdvanceReceipt = (event?.value === 'advance-receipt');
        this.currentVoucherLabel = this.generalService.getCurrentVoucherLabel(this.vm.selectedLedger?.voucher?.shortCode, this.commonLocaleData);
        this.handleAdvanceReceiptChange();
    }

    /**
     * Advance Receipt adjustment handler
     *
     * @param {boolean} isUpdateMode True if adjustments are updated
     * @memberof UpdateLedgerEntryPanelComponent
     */
    public handleVoucherAdjustment(isUpdateMode?: boolean): void {
        if (!this.vm.selectedLedger?.voucherGenerated && this.vm.selectedLedger?.voucher?.shortCode !== 'pur') {
            // Voucher must be generated for all vouchers except purchase order
            this.toaster.showSnackBar("info", ADJUSTMENT_INFO_MESSAGE, this.localeData?.app_giddh);
            if (this.isAdjustAdvanceReceiptSelected) {
                this.isAdjustAdvanceReceiptSelected = false;
            } else if (this.isAdjustReceiptSelected) {
                this.isAdjustReceiptSelected = false;
            } else if (this.isAdjustVoucherSelected) {
                this.isAdjustVoucherSelected = false;
            }
            return;
        }
        if (this.vm.selectedLedger?.voucherAdjustments && !this.vm.selectedLedger?.voucherAdjustments?.adjustments) {
            this.vm.selectedLedger.voucherAdjustments.adjustments = [];
        }
        if ((this.isAdjustAdvanceReceiptSelected || this.isAdjustReceiptSelected || this.isAdjustVoucherSelected) && (!this.vm.selectedLedger?.voucherAdjustments?.adjustments?.length || isUpdateMode)) {
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
        if (event && this.vm.selectedLedger?.voucher?.shortCode !== 'pur' && !this.vm.selectedLedger?.voucherGenerated) {
            // Adjustment is not allowed until the voucher is generated
            this.toaster.showSnackBar("info", ADJUSTMENT_INFO_MESSAGE, this.localeData?.app_giddh);
            event.preventDefault();
        }
    }

    /**
     * Get Invoice list for credit note
     *
     * @memberof UpdateLedgerEntryPanelComponent
     */
    public getInvoiceListsForCreditNote(): void {
        let request;

        if (this.voucherApiVersion === 2) {
            let particularAccount = (this.vm.selectedLedger?.transactions[0]?.particular?.uniqueName === this.activeAccount?.uniqueName) ? this.vm.selectedLedger?.particular : this.vm.selectedLedger?.transactions[0]?.particular;

            request = this.adjustmentUtilityService.getInvoiceListRequest({ particularAccount: particularAccount, voucherType: this.vm.selectedLedger?.voucher?.shortCode, ledgerAccount: this.activeAccount });
        } else {
            request = {
                accountUniqueNames: [this.vm.selectedLedger?.particular?.uniqueName, this.vm.selectedLedger?.transactions[0]?.particular?.uniqueName],
                voucherType: this.vm.selectedLedger?.voucher?.shortCode
            };
        }

        if (!request) {
            return;
        }

        request.number = this.searchReferenceVoucher;

        if (request.number) {
            this.resetInvoiceList();
        }

        request.page = this.referenceVouchersCurrentPage;
        this.referenceVouchersCurrentPage++;

        let date;
        if (typeof this.vm.selectedLedger.entryDate === 'string') {
            date = this.vm.selectedLedger.entryDate;
        } else {
            date = dayjs(this.vm.selectedLedger.entryDate).format(GIDDH_DATE_FORMAT);
        }

        if (this.voucherApiVersion !== 2) {
            this.invoiceList = [];
        }

        this.ledgerService.getInvoiceListsForCreditNote(request, date).pipe(takeUntil(this.destroyed$)).subscribe((response: any) => {
            if (response && response.body) {
                if (response.body.results || response.body.items) {
                    let items = [];
                    if (response.body.results) {
                        items = response.body.results;
                    } else if (response.body.items) {
                        items = response.body.items;
                    }

                    items?.forEach(invoice => {
                        invoice.voucherNumber = this.generalService.getVoucherNumberLabel(invoice?.voucherType, invoice?.voucherNumber, this.commonLocaleData);

                        this.invoiceList.push({ label: invoice?.voucherNumber ? invoice.voucherNumber : '-', value: invoice?.uniqueName, additional: invoice })
                    });
                } else {
                    this.forceClear$ = observableOf({ status: true });
                }
                let invoiceSelected;
                let selectedInvoice;
                if (this.voucherApiVersion === 2) {
                    selectedInvoice = this.vm.selectedLedger?.referenceVoucher ? this.vm.selectedLedger?.referenceVoucher : false;
                } else {
                    selectedInvoice = this.vm.selectedLedger?.invoiceLinkingRequest?.linkedInvoices ? this.vm.selectedLedger.invoiceLinkingRequest.linkedInvoices[0] : false;
                }

                if (selectedInvoice) {
                    if (this.voucherApiVersion === 2) {
                        selectedInvoice.number = this.generalService.getVoucherNumberLabel(selectedInvoice?.voucherType, selectedInvoice?.number, this.commonLocaleData);

                        invoiceSelected = {
                            label: selectedInvoice.number ? selectedInvoice.number : '-',
                            value: selectedInvoice.uniqueName,
                            additional: selectedInvoice
                        };

                        const linkedInvoice = this.invoiceList.find(invoice => invoice?.value === invoiceSelected?.value);
                        if (!linkedInvoice) {
                            this.invoiceList.push(invoiceSelected);
                        }

                    } else {
                        selectedInvoice['voucherDate'] = selectedInvoice['invoiceDate'];
                        invoiceSelected = {
                            label: selectedInvoice.invoiceNumber ? selectedInvoice.invoiceNumber : '-',
                            value: selectedInvoice.invoiceUniqueName,
                            additional: selectedInvoice
                        };

                        const linkedInvoice = this.invoiceList.find(invoice => invoice?.value === invoiceSelected?.value);
                        if (!linkedInvoice) {
                            this.invoiceList.push(invoiceSelected);
                        }
                    }
                }
                this.invoiceList = _.uniqBy(this.invoiceList, 'value');
                this.invoiceList$ = observableOf(this.invoiceList);
                this.selectedInvoice = (invoiceSelected) ? invoiceSelected.value : '';
            } else if (request.number) {
                this.resetInvoiceList();
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

        if (!this.vm.selectedLedger?.voucherAdjustments?.adjustments?.length) {
            this.vm.selectedLedger.generateInvoice = this.manualGenerateVoucherChecked;
        }
    }

    public getInvoiceLists() {
        if (this.vm.selectedLedger?.voucher?.shortCode === 'rcpt') {
            if (this.isPettyCash && !this.accountUniqueName) {
                let message = this.localeData?.account_entry_error;
                message = message?.replace("[ACCOUNT]", this.pettyCashBaseAccountTypeString);
                this.toaster.showSnackBar("error", message);
                return;
            }

            this.invoiceList = [];
        }
    }

    public selectInvoice(invoiceNo, ev) {
        invoiceNo.isSelected = ev.target?.checked;
        if (ev.target?.checked) {
            this.vm.selectedLedger.invoicesToBePaid.push(invoiceNo.label);
        } else {
            let indx = this.vm.selectedLedger.invoicesToBePaid?.indexOf(invoiceNo.label);
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
            if (this.vm.selectedLedger) {
                if (this.voucherApiVersion === 2) {
                    this.vm.selectedLedger.referenceVoucher = {
                        uniqueName: event.value
                    }
                } else {
                    this.vm.selectedLedger.invoiceLinkingRequest = {
                        linkedInvoices: [
                            {
                                invoiceUniqueName: event.value,
                                voucherType: event.additional.voucherType
                            }
                        ]
                    }
                }
            }
        } else {
            if (this.vm.selectedLedger) {
                if (this.voucherApiVersion === 2) {
                    this.vm.selectedLedger.referenceVoucher = null;
                } else {
                    this.vm.selectedLedger.invoiceLinkingRequest = null;
                }
            }
        }
    }

    public openHeaderDropDown() {
        if (this.generalService.currentOrganizationType === OrganizationType.Branch || (this.branches && this.branches.length === 1)) {
            this.entryAccountUniqueName = "";

            if (this.voucherApiVersion === 2 || !this.vm.selectedLedger.voucherGenerated || this.vm.selectedLedger.voucherGeneratedType === VoucherTypeEnum.sales) {
                this.entryAccountUniqueName = this.vm.selectedLedger.particular?.uniqueName;
                this.openDropDown = true;
            } else {
                this.openDropDown = false;
                this.toaster.showSnackBar("error", this.localeData?.base_account_change_error);
                return;
            }
        }
    }

    public keydownPressed(e) {
        if (e?.code === 'ArrowDown') {
            this.keydownClassAdded = true;
        } else if (e?.code === 'Enter' && this.keydownClassAdded) {
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
        if (Number(this.vm.selectedLedger?.exchangeRate)) {
            rate = 1 / this.vm.selectedLedger?.exchangeRate;
        }
        if (this.vm.selectedLedger) {
            this.vm.selectedLedger = { ...this.vm.selectedLedger, exchangeRate: rate };
        }
    }

    public exchangeRateChanged() {
        if (this.vm.selectedLedger) {
            this.vm.selectedLedger.exchangeRate = Number(this.vm.selectedLedger?.exchangeRate) || 0;
        }
        if (this.vm.stockTrxEntry && this.vm.stockTrxEntry.inventory && this.vm.stockTrxEntry.inventory.unit && this.vm.selectedLedger && this.vm.selectedLedger.unitRates) {
            const stock = this.vm.stockTrxEntry.unitRate.find(rate => {
                return rate.stockUnitCode === this.vm.stockTrxEntry.inventory.unit.code;
            });
            const stockRate = stock ? stock.rate : 0;
            this.vm.stockTrxEntry.inventory.rate = Number((stockRate / this.vm.selectedLedger?.exchangeRate).toFixed(this.ratePrecision));
            this.vm.inventoryPriceChanged(this.vm.stockTrxEntry.inventory.rate);
        } else {
            this.vm.inventoryAmountChanged();
        }
    }

    /**
     * This will reset the state of checkbox and ngModel to make sure we update it based on user confirmation later
     *
     * @param {*} event
     * @memberof UpdateLedgerEntryPanelComponent
     */
    public changeRcmCheckboxState(event: any): void {
        if (!this.isPettyCash && this.currentOrganizationType === 'COMPANY' && (this.branches && this.branches.length > 1)) {
            return;
        }
        this.isRcmEntry = !this.isRcmEntry;
        this.toggleRcmCheckbox(event, 'checkbox');
    }

    /**
     * Toggle the RCM checkbox based on user confirmation
     *
     * @param {*} event Click event
     * @memberof UpdateLedgerEntryPanelComponent
     */
    public toggleRcmCheckbox(event: any, element: string): void {
        if (!this.isPettyCash && this.currentOrganizationType === 'COMPANY' && (this.branches && this.branches.length > 1)) {
            return;
        }
        let isChecked;

        if (element === "checkbox") {
            isChecked = event?.checked;
            this.rcmCheckbox['checked'] = !isChecked;
        } else {
            isChecked = !event?._checked;
        }

        this.rcmConfiguration = this.generalService.getRcmConfiguration(isChecked, this.commonLocaleData);

        let dialogRef = this.dialog.open(NewConfirmationModalComponent, {
            width: '630px',
            data: {
                configuration: this.rcmConfiguration
            }
        });

        dialogRef.afterClosed().pipe(take(1)).subscribe(response => {
            this.handleRcmChange(response);
        });
    }

    /**
     * RCM change handler, triggerreed when the user performs any
     * action with the RCM popup
     *
     * @param {string} action Action performed by user
     * @memberof UpdateLedgerEntryPanelComponent
     */
    public handleRcmChange(action: string): void {
        if (action === this.commonLocaleData?.app_yes) {
            // Toggle the state of RCM as user accepted the terms of RCM modal
            this.isRcmEntry = !this.isRcmEntry;
            this.vm.isRcmEntry = this.isRcmEntry;
            this.rcmCheckbox['checked'] = this.isRcmEntry;
            this.vm.generateGrandTotal();
            this.changeDetectorRef.detectChanges();
        }
    }

    /**
     * Handles the advance receipt change
     *
     * @memberof UpdateLedgerEntryPanelComponent
     */
    public handleAdvanceReceiptChange(restrictPopup: boolean = false): void {
        this.shouldShowAdvanceReceiptMandatoryFields = this.isAdvanceReceipt;
        this.vm.isAdvanceReceipt = this.isAdvanceReceipt;
        this.vm.isAdvanceReceiptWithTds = cloneDeep(this.isAdvanceReceipt);
        if (this.shouldShowAdvanceReceiptMandatoryFields) {
            this.vm.generatePanelAmount();
        }
        if (!this.isAdvanceReceipt && !restrictPopup) {
            if (this.isAdjustedInvoicesWithAdvanceReceipt && this.vm.selectedLedger && this.vm.selectedLedger.voucherGeneratedType === VoucherTypeEnum.receipt) {
                this.advanceReceiptRemoveDialogRef = this.dialog.open(ConfirmModalComponent, {
                    width: '630px',
                    data: {
                        title: this.commonLocaleData?.app_confirmation,
                        body: this.localeData?.confirm_proceed,
                        permanentlyDeleteMessage: this.localeData?.remove_advance_receipt,
                        ok: this.commonLocaleData?.app_yes,
                        cancel: this.commonLocaleData?.app_no
                    }
                });

                this.advanceReceiptRemoveDialogRef.afterClosed().pipe(take(1)).subscribe(response => {
                    this.onAdvanceReceiptRemoveCloseConfirmationModal(response);
                });
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
        this.vm.isPrefixAppliedForCurrency = this.vm.isPrefixAppliedForCurrency = !(['AED'].includes(this.vm.selectedCurrency === 0 ? this.vm.baseCurrencyDetails?.code : this.vm.foreignCurrencyDetails?.code));
        this.vm.selectedPrefixForCurrency = this.vm.isPrefixAppliedForCurrency ?
            this.vm.selectedCurrency === 0 ?
                (this.vm.baseCurrencyDetails) ? this.vm.baseCurrencyDetails.symbol : (this.vm.foreignCurrencyDetails) ? this.vm.foreignCurrencyDetails.symbol : '' :
                '' : '';
        this.vm.selectedSuffixForCurrency = this.vm.isPrefixAppliedForCurrency ?
            '' : this.vm.selectedCurrency === 0 ? (this.vm.baseCurrencyDetails) ? this.vm.baseCurrencyDetails.symbol :
                (this.vm.foreignCurrencyDetails) ? this.vm.foreignCurrencyDetails.symbol : '' :
                '';
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
                                value: result.stock ? `${result?.uniqueName}#${result?.stock?.uniqueName}` : result?.uniqueName,
                                label: result.stock ? `${result?.name} (${result?.stock?.name})` : result?.name,
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
            const currentLedgerCategory = this.activeAccount ? this.generalService.getAccountCategory(this.activeAccount, this.activeAccount?.uniqueName) : '';
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
            this.searchService.searchAccount(requestObject).pipe(takeUntil(this.destroyed$)).subscribe(data => {
                if (data && data.body && data.body.results) {
                    const searchResults = data.body.results.map(result => {
                        return {
                            value: result.stock ? `${result?.uniqueName}#${result?.stock?.uniqueName}` : result?.uniqueName,
                            label: result.stock ? `${result?.name} (${result?.stock?.name})` : result?.name,
                            additional: result
                        }
                    }) || [];
                    this.noResultsFoundLabel = SearchResultText.NotFound;
                    if (page === 1) {
                        this.searchResults = uniqBy(searchResults, 'value');
                    } else {
                        const uniqueResults = uniqBy([...this.searchResults,
                        ...searchResults], 'value');
                        this.searchResults = uniqueResults;
                    }
                    this.searchResultsPaginationData.page = data.body.page;
                    this.searchResultsPaginationData.totalPages = data.body.totalPages;
                    if (successCallback) {
                        successCallback(data.body.results);
                    } else {
                        this.defaultResultsPaginationData.page = this.searchResultsPaginationData.page;
                        this.defaultResultsPaginationData.totalPages = this.searchResultsPaginationData.totalPages;
                    }
                    this.changeDetectorRef.detectChanges();
                }
            });
        } else {
            this.searchResults = [...this.defaultSuggestions];
            this.changeDetectorRef.detectChanges();
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
        if (this.vm.selectedLedger.transactions) {
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
                    uniqueName: transactions[index].particular?.uniqueName || '',
                    parentGroups: transactions[index].particular ? transactions[index].particular?.parentGroups : []
                }
                const activeAccountDetails = {
                    uniqueName: this.baseAccountDetails.particular ? this.baseAccountDetails.particular?.uniqueName : '',
                    parentGroups: (this.baseAccountDetails && this.baseAccountDetails.parentGroups) ? this.baseAccountDetails.parentGroups : []
                }
                const isRcmEntry = this.generalService.shouldShowRcmSection(activeAccountDetails, selectedAccountDetails, this.activeCompany);
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
        if (baseAccountDetails?.touristSchemeApplicable) {
            return true;
        } else if (baseAccountDetails?.voucher && (baseAccountDetails?.voucher?.name === 'sales' || baseAccountDetails?.voucher?.name === 'cash') && selectedAccountDetails && selectedAccountDetails.body && selectedAccountDetails.body.parentGroups && selectedAccountDetails.body.parentGroups.length > 1 && selectedAccountDetails.body?.parentGroups[1]?.uniqueName && this.allowParentGroup.includes(selectedAccountDetails.body.parentGroups[1]?.uniqueName) && companyProfile && companyProfile.countryV2 && companyProfile.countryV2.alpha2CountryCode && companyProfile.countryV2.alpha2CountryCode === 'AE') {
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
        this.vm.selectedLedger.touristSchemeApplicable = event?.value;
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
        if (this.vm.selectedLedger?.voucherAdjustments?.adjustments) {
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
        if (this.vm.selectedLedger?.voucherAdjustments?.adjustments) {
            this.vm.selectedLedger.voucherAdjustments.adjustments.map(item => {
                item.calculatedTaxAmount = this.generalService.calculateInclusiveOrExclusiveTaxes(true, item.adjustmentAmount.amountForAccount, item.taxRate, 0);
            });
        }
    }

    /**
    * To calculate total amount of adjusted receipts.
    *
    * @memberof UpdateLedgerEntryPanelComponent
    */
    public adjustedReceiptsAmountChange(): void {
        if (this.vm.selectedLedger?.voucherAdjustments?.adjustments) {
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
        if (this.vm.selectedLedger?.voucherAdjustments?.adjustments) {
            this.vm.selectedLedger.voucherAdjustments.adjustments.map(item => {
                item.calculatedTaxAmount = this.generalService.calculateInclusiveOrExclusiveTaxes(true, item.adjustmentAmount.amountForAccount, item.taxRate, 0);
                totalAmount = Number(totalAmount) + Number(item.adjustmentAmount.amountForAccount);
            });
        }
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
        this.isAdvanceReceipt = !userResponse;
        this.handleAdvanceReceiptChange(true);
        if (this.isAdvanceReceipt) {
            this.vm.selectedLedger.voucher.shortCode = "advance-receipt";
        } else {
            this.vm.selectedLedger.voucher.shortCode = "rcpt";
        }
        this.advanceReceiptRemoveDialogRef.close();
    }

    /**
     * Payment adjustment handler
     *
     * @param {{ adjustVoucherData: VoucherAdjustments, adjustPaymentData: AdjustAdvancePaymentModal}} event Adjustment handler
     * @memberof UpdateLedgerEntryPanelComponent
     */
    public getAdjustedPaymentData(event: { adjustVoucherData: VoucherAdjustments, adjustPaymentData: AdjustAdvancePaymentModal }): void {
        if (event && event.adjustPaymentData && event.adjustVoucherData) {
            const adjustments = cloneDeep(event.adjustVoucherData.adjustments);
            if (adjustments) {
                adjustments.forEach(adjustment => {
                    adjustment.voucherNumber = this.generalService.getVoucherNumberLabel(adjustment?.voucherType, adjustment?.voucherNumber, this.commonLocaleData);
                });

                this.vm.selectedLedger.voucherAdjustments = {
                    adjustments,
                    totalAdjustmentAmount: event.adjustPaymentData.totalAdjustedAmount,
                    tdsTaxUniqueName: null,
                    tdsAmount: null,
                    description: null
                };
                if (!adjustments || !adjustments?.length) {
                    // No adjustments done clear the adjustment checkbox
                    this.isAdjustReceiptSelected = false;
                    this.isAdjustVoucherSelected = false;
                    this.isAdjustAdvanceReceiptSelected = false;
                    this.isAdjustVoucherSelected = false;

                    if (!this.selectInvoice) {
                        this.vm.selectedLedger.generateInvoice = this.manualGenerateVoucherChecked;
                    }
                } else {
                    this.vm.selectedLedger.generateInvoice = true;
                }
            }
        }
        this.makeAdjustmentCalculation();
        this.adjustmentDialogRef.close();
    }

    /**
     * Close voucher adjustment modal handler
     *
     * @param {{ adjustVoucherData: VoucherAdjustments, adjustPaymentData: AdjustAdvancePaymentModal}} event Close event
     * @memberof UpdateLedgerEntryPanelComponent
     */
    public closeAdjustmentModal(event: { adjustVoucherData: VoucherAdjustments, adjustPaymentData: AdjustAdvancePaymentModal }): void {
        if (this.vm.selectedLedger?.voucherAdjustments?.adjustments && !this.vm.selectedLedger?.voucherAdjustments?.adjustments?.length) {
            // No adjustments done clear the adjustment checkbox
            this.isAdjustReceiptSelected = false;
            this.isAdjustVoucherSelected = false;
            this.isAdjustAdvanceReceiptSelected = false;

            if (!this.vm.isInvoiceGeneratedAlready) {
                this.vm.selectedLedger.voucherGenerated = this.manualGenerateVoucherChecked;
            }
        }
        this.adjustmentDialogRef.close();
        this.changeDetectorRef.detectChanges();
    }

    /**
     * Prepares the voucher adjustment configuration
     *
     * @private
     * @memberof UpdateLedgerEntryPanelComponent
     */
    private prepareAdjustVoucherConfiguration(): void {
        let customerUniqueName = [];
        this.vm.selectedLedger.transactions?.forEach(transaction => {
            if (transaction?.particular && transaction?.particular?.uniqueName) {
                const uniqueName = transaction?.particular?.uniqueName.split('#')[0];
                customerUniqueName.push(uniqueName);
            }
        });
        if (!this.vm.selectedLedger?.voucherAdjustments?.adjustments?.length && this.originalVoucherAdjustments?.adjustments?.length) {
            // If length of voucher adjustment is 0 i.e., user has changed its original adjustments but has not performed update operation
            // and voucher already has original adjustments to it then show the
            // original adjustments in adjustment popup
            this.vm.selectedLedger.voucherAdjustments = cloneDeep(this.originalVoucherAdjustments);
        }
        if (this.vm.selectedLedger?.voucherAdjustments?.adjustments) {
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

        let tcsTotal = (this.vm.selectedLedger.otherTaxType === "tcs") ? this.vm.selectedLedger.otherTaxesSum : 0;
        let tdsTotal = (this.vm.selectedLedger.otherTaxType === "tds") ? this.vm.selectedLedger.otherTaxesSum : 0;

        this.adjustVoucherConfiguration = {
            voucherDetails: {
                voucherDate: this.vm.selectedLedger.entryDate,
                tcsTotal: tcsTotal,
                tdsTotal: tdsTotal,
                balanceDue: this.vm.selectedLedger.total.amount,
                grandTotal: this.vm.selectedLedger?.entryVoucherTotals?.amountForAccount,
                customerName: this.vm.selectedLedger && this.vm.selectedLedger.particular ? this.vm.selectedLedger.particular.name : '',
                customerUniquename: customerUniqueName,
                totalTaxableValue: this.vm.selectedLedger.actualAmount,
                subTotal: this.vm.selectedLedger.total.amount,
                exchangeRate: this.vm.selectedLedger?.exchangeRate ?? 1,
                gainLoss: this.vm.selectedLedger.gainLoss,
                voucherUniqueName: this.vm.selectedLedger.voucherUniqueName
            },
            accountDetails: {
                currencySymbol: enableVoucherAdjustmentMultiCurrency ? this.vm.selectedLedger?.particular?.currency?.symbol ?? this.profileObj?.baseCurrencySymbol ?? '' : this.profileObj?.baseCurrencySymbol ?? '',
                currencyCode: enableVoucherAdjustmentMultiCurrency ? this.vm.selectedLedger?.particular?.currency?.code ?? this.profileObj?.baseCurrency ?? '' : this.profileObj?.baseCurrency ?? ''
            },
            activeAccountUniqueName: this.activeAccount?.uniqueName,
            type: this.entrySide
        };
    }

    /**
     * To open advance receipts adjustment pop up
     *
     * @private
     * @memberof UpdateLedgerEntryPanelComponent
     */
    private openAdjustPaymentModal(): void {
        if (this.voucherApiVersion === 2) {
            let particularAccount;

            const mainTransaction = this.vm.selectedLedger?.transactions?.filter(transaction => !transaction?.isDiscount && !transaction?.isTax && transaction?.particular?.uniqueName && transaction?.particular?.uniqueName !== 'roundoff');

            particularAccount = (this.vm.selectedLedger?.particular?.uniqueName === this.activeAccount?.uniqueName) ? mainTransaction[0]?.particular : this.vm.selectedLedger?.particular;

            this.invoiceListRequestParams = { particularAccount: particularAccount, voucherType: this.vm.selectedLedger?.voucher?.name, ledgerAccount: this.activeAccount };
        }
        this.adjustmentDialogRef = this.dialog.open(this.adjustPaymentModal, {
            width: '980px',
            panelClass: 'container-modal-class'
        });
    }

    /**
     * Initializes the variables based on adjustments made to show/hide sections on UI
     *
     * @private
     * @memberof UpdateLedgerEntryPanelComponent
     */
    private makeAdjustmentCalculation(): void {
        if (this.vm.selectedLedger?.voucherAdjustments?.adjustments?.length) {
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
            } else if (this.vm.selectedLedger?.voucher?.shortCode === 'rcpt') {
                this.isAdjustReceiptSelected = true;
            }
        }
    }

    /**
     * Loads the default search suggestion when petty cash is opened
     *
     * @public
     * @memberof UpdateLedgerEntryPanelComponent
     */
    public loadDefaultSearchSuggestions(): void {
        this.onSearchQueryChanged('', 1, false, (response) => {
            this.defaultSuggestions = response.map(result => {
                return {
                    value: result.stock ? `${result?.uniqueName}#${result?.stock?.uniqueName}` : result?.uniqueName,
                    label: result.stock ? `${result?.name} (${result?.stock?.name})` : result?.name,
                    additional: result
                }
            }) || [];
            this.defaultResultsPaginationData.page = this.searchResultsPaginationData.page;
            this.defaultResultsPaginationData.totalPages = this.searchResultsPaginationData.totalPages;
            this.searchResults = [...this.defaultSuggestions];
            this.noResultsFoundLabel = SearchResultText.NotFound;
        });
    }

    /**
     * Formats the adjustments to add '-' to voucher number if it is not found
     *
     * @private
     * @memberof UpdateLedgerEntryPanelComponent
     */
    private formatAdjustments(): void {
        if (this.vm.selectedLedger?.voucherAdjustments?.adjustments?.length) {
            this.vm.selectedLedger.voucherAdjustments.adjustments.forEach(adjustment => {
                adjustment.voucherNumber = this.generalService.getVoucherNumberLabel(adjustment.voucherType, adjustment.voucherNumber, this.commonLocaleData);
                adjustment.accountCurrency = adjustment.accountCurrency ?? adjustment.currency ?? { symbol: this.activeCompany?.baseCurrencySymbol, code: this.activeCompany?.baseCurrency };
            });
        }
    }

    /**
     * Check for other account existence
     *
     * @private
     * @memberof UpdateLedgerEntryPanelComponent
     */
    private checkForOtherAccount(): void {
        // check we already have others account in flatten account, then don't do anything
        this.searchService.searchAccountV2({ q: 'others' }).subscribe(response => {
            const isThereOthersAcc = !!response?.body?.results?.length;
            if (!isThereOthersAcc) {
                // add new dummy account in flatten account array
                this.vm.otherAccountList.push({
                    name: 'Others', uniqueName: 'others', applicableTaxes: [],
                    parentGroups: [], isFixed: false, isDummy: true, mergedAccounts: ''
                });
            }
        });
    }

    /**
     * Callback for translation response complete
     *
     * @param {boolean} event
     * @memberof UpdateLedgerEntryPanelComponent
     */
    public translationComplete(event: boolean): void {
        if (event) {
            this.vm.voucherTypeList = [{
                label: this.commonLocaleData?.app_voucher_types?.sales,
                value: 'sal'
            }, {
                label: this.commonLocaleData?.app_voucher_types?.purchases,
                value: 'pur'
            }, {
                label: this.commonLocaleData?.app_voucher_types?.receipt,
                value: 'rcpt'
            }, {
                label: this.commonLocaleData?.app_voucher_types?.payment,
                value: 'pay'
            }, {
                label: this.commonLocaleData?.app_voucher_types?.journal,
                value: 'jr'
            }, {
                label: this.commonLocaleData?.app_voucher_types?.contra,
                value: 'cntr'
            }, {
                label: this.commonLocaleData?.app_voucher_types?.debit_note,
                value: 'debit note'
            }, {
                label: this.commonLocaleData?.app_voucher_types?.credit_note,
                value: 'credit note'
            }, {
                label: this.commonLocaleData?.app_voucher_types?.advance_receipt,
                value: 'advance-receipt',
                subVoucher: SubVoucher.AdvanceReceipt
            }];

            this.availableItcList[0].label = this.localeData?.import_goods;
            this.availableItcList[1].label = this.localeData?.import_services;
            this.availableItcList[2].label = this.localeData?.others;

            // get flatten_accounts list && get transactions list && get ledger account list
            observableCombineLatest([this.selectedLedgerStream$, this.accountService.GetAccountDetailsV2(this.accountUniqueName), this.companyProfile$])
                .pipe(takeUntil(this.destroyed$))
                .subscribe((resp: any[]) => {
                    if (resp[0] && resp[1] && resp[2]) {
                        this.initEntry(resp);
                    }
                });
        }
    }

    /**
     * This will set the entry data in edit mode
     *
     * @private
     * @param {any[]} resp
     * @param {boolean} [updateBaseAccountParticular]
     * @returns {void}
     * @memberof UpdateLedgerEntryPanelComponent
     */
    private initEntry(resp: any[], updateBaseAccountParticular?: boolean): void {
        // insure we have account details, if we are normal ledger mode and not petty cash mode ( special case for others entry in petty cash )
        if (this.isPettyCash && this.accountUniqueName && resp[1]?.status !== 'success') {
            return;
        }

        if (this.voucherApiVersion === 2) {
            resp[0] = this.adjustmentUtilityService.getVoucherAdjustmentObject(resp[0], this.vm.selectedLedger.voucherGeneratedType);
        }

        if (updateBaseAccountParticular) {
            resp[0].particular = {
                category: resp[1].body?.category,
                name: resp[1].body?.name,
                currency: {
                    code: resp[1].body?.currency,
                    symbol: resp[1].body?.currencySymbol
                },
                parentGroups: resp[1].body?.parentGroups,
                uniqueName: resp[1].body?.uniqueName
            };

            resp[0].particularType = resp[1].body?.accountType;

            if (resp[1].body?.currency !== resp[2]?.baseCurrency) {
                let date = dayjs().format(GIDDH_DATE_FORMAT);
                this.ledgerService.GetCurrencyRateNewApi(resp[1].body?.currency, resp[2]?.baseCurrency, date).pipe(takeUntil(this.destroyed$)).subscribe(response => {
                    if (this.vm.selectedLedger) {
                        this.vm.selectedLedger.exchangeRate = response.body;
                    }
                });
            }
        }

        this.baseAccountDetails = resp[0];
        this.activeAccount = cloneDeep(resp[1].body);
        this.vm.activeAccount = this.activeAccount;
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
            if (resp[0].othersCategory) {
                this.checkForOtherAccount();
            }
            this.prepareMultiCurrencyObject(this.activeAccount);
        }

        if (this.activeAccount) {
            if (this.activeAccount.currency && this.vm.isMultiCurrencyAvailable) {
                this.baseCurrency = this.activeAccount.currency;
            }
        }

        this.vm.getUnderstandingText(resp[0].particularType, resp[0].particular.name, this.localeData);

        //#region transaction assignment process
        this.vm.selectedLedger = resp[0];
        this.originalVoucherAdjustments = cloneDeep(this.vm.selectedLedger?.voucherAdjustments);
        this.formatAdjustments();
        const voucherGeneratedType = this.vm.selectedLedger.voucherGeneratedType || this.vm.selectedLedger.voucher?.shortCode;
        if (this.vm.selectedLedger && !this.invoiceList?.length && (voucherGeneratedType === VoucherTypeEnum.creditNote ||
            voucherGeneratedType === VoucherTypeEnum.debitNote)) {
            this.getInvoiceListsForCreditNote();
        }

        // Check the RCM checkbox if API returns subvoucher as Reverse charge
        this.isRcmEntry = (this.vm.selectedLedger.subVoucher === SubVoucher.ReverseCharge);
        this.isAdvanceReceipt = (this.vm.selectedLedger.subVoucher === SubVoucher.AdvanceReceipt);
        this.vm.isRcmEntry = this.isRcmEntry;
        this.vm.isAdvanceReceipt = this.isAdvanceReceipt;
        this.vm.isAdvanceReceiptWithTds = cloneDeep(this.isAdvanceReceipt);
        this.shouldShowAdvanceReceiptMandatoryFields = this.isAdvanceReceipt;

        if (this.vm.selectedLedger.voucher && this.vm.selectedLedger.voucher?.shortCode === 'rcpt' && this.isAdvanceReceipt) {
            this.vm.selectedLedger.voucher.shortCode = 'advance-receipt';
        }
        this.currentVoucherLabel = this.generalService.getCurrentVoucherLabel(this.vm.selectedLedger?.voucher?.shortCode, this.commonLocaleData);
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
                if (!f.particular?.uniqueName) {
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

        // divide actual amount with exchangeRate because currently we are getting actualAmount in company currency
        //this.vm.selectedLedger.actualAmount = giddhRoundOff(this.vm.selectedLedger.actualAmount / this.vm.selectedLedger.exchangeRate, this.vm.giddhBalanceDecimalPlaces);

        // other taxes assigning process
        let companyTaxes: TaxResponse[] = [];
        this.vm.companyTaxesList$.pipe(take(1)).subscribe(taxes => companyTaxes = taxes);

        let otherTaxesModal = new SalesOtherTaxesModal();
        otherTaxesModal.itemLabel = resp[0].particular.name;

        let tax: TaxResponse;
        if (resp[0].tcsTaxes && resp[0].tcsTaxes.length) {
            tax = companyTaxes.find(f => f?.uniqueName === resp[0].tcsTaxes[0]);
            this.vm.selectedLedger.otherTaxType = 'tcs';
        } else if (resp[0].tdsTaxes && resp[0].tdsTaxes.length) {
            tax = companyTaxes.find(f => f?.uniqueName === resp[0].tdsTaxes[0]);
            this.vm.selectedLedger.otherTaxType = 'tds';
        }

        if (tax) {
            otherTaxesModal.appliedOtherTax = { name: tax.name, uniqueName: tax.uniqueName };
        }

        otherTaxesModal.tcsCalculationMethod = resp[0].tcsCalculationMethod || SalesOtherTaxesCalculationMethodEnum.OnTaxableAmount;

        this.vm.selectedLedger.isOtherTaxesApplicable = !!(tax);
        this.vm.selectedLedger.otherTaxModal = otherTaxesModal;

        this.baseAccount$ = observableOf(resp[0].particular);
        this.baseAccountName$ = resp[0].particular?.uniqueName;
        this.baseAcc = resp[0].particular?.uniqueName;
        this.firstBaseAccountSelected = resp[0].particular?.uniqueName;

        const initialAccounts: Array<IOption> = [];
        this.vm.selectedLedger.transactions?.map((t, index) => {
            t.amount = giddhRoundOff(t.amount, this.vm.giddhBalanceDecimalPlaces);

            if (this.vm.selectedLedger.discounts && this.vm.selectedLedger.discounts.length > 0 && !t?.isTax && t?.particular?.uniqueName !== 'roundoff') {
                let category = this.vm.getAccountCategory(t.particular, t.particular?.uniqueName);
                if (this.vm.isValidCategory(category)) {
                    /**
                     * replace transaction amount with the actualAmount key that we got in response of get-ledger
                     * because of ui and api follow different calculation pattern,
                     * so transaction amount of income/ expenses account differ from both the side
                     * so overcome this issue api provides the actual amount which was added by user while creating entry
                     */
                    if (index === 0) {
                        t.amount = this.vm.selectedLedger.actualAmount;
                    }
                    // if transaction is stock transaction then also update inventory amount and recalculate inventory rate
                    if (t.inventory) {
                        t.inventory.amount = this.vm.selectedLedger.actualAmount;
                        t.inventory.rate = this.vm.selectedLedger.actualRate;
                    }
                }
            }
            if (t.inventory) {
                const unitRates = cloneDeep(this.vm.selectedLedger.unitRates);
                if (unitRates && unitRates.length) {
                    unitRates.forEach(rate => rate.code = rate?.stockUnitCode);
                    t.unitRate = unitRates;
                } else {
                    t.unitRate = [{
                        code: t.inventory.unit?.code,
                        rate: t.inventory.rate,
                        stockUnitCode: t.inventory.unit?.code,
                        stockUnitUniqueName: t.inventory.unit?.stockUnitUniqueName
                    }];
                }
                initialAccounts.push({
                    label: `${t.particular?.name} (${t.inventory.stock?.name})`,
                    value: `${t.particular?.uniqueName}#${t.inventory.stock?.uniqueName}`,
                    additional: {
                        stock: {
                            name: t.inventory.stock?.name,
                            uniqueName: t.inventory.stock?.uniqueName
                        },
                        uniqueName: t.particular?.uniqueName
                    }
                });
                t.particular.uniqueName = `${t.particular?.uniqueName}#${t.inventory.stock?.uniqueName}`;
                // Show warehouse dropdown only for stock items
                const warehouseDetails = t.inventory.warehouse;
                if (warehouseDetails) {
                    this.selectedWarehouse = warehouseDetails?.uniqueName;
                } else {
                    // If warehouse details are not received show default warehouse
                    this.selectedWarehouse = String(this.defaultWarehouse);
                }
                this.shouldShowWarehouse = true;
            } else {
                initialAccounts.push({
                    label: t.particular?.name,
                    value: t.particular?.uniqueName,
                    additional: {
                        ...t,
                        uniqueName: t.particular?.uniqueName
                    }
                });
            }
        });
        initialAccounts.push(...this.defaultSuggestions);
        this.searchResults = orderBy(uniqBy(initialAccounts, 'value'), 'label');
        this.vm.isInvoiceGeneratedAlready = this.vm.selectedLedger.voucherGenerated;

        this.store.pipe(select(appState => appState.warehouse.warehouses), takeUntil(this.destroyed$)).subscribe((warehouses: any) => {
            if (warehouses) {
                let warehouseResults = cloneDeep(warehouses.results);
                if (this.selectedWarehouse) {
                    warehouseResults = warehouseResults?.filter(warehouse => this.selectedWarehouse === warehouse?.uniqueName || !warehouse.isArchived);
                }
                const warehouseData = this.settingsUtilityService.getFormattedWarehouseData(warehouseResults);
                this.warehouses = warehouseData.formattedWarehouses;
                this.defaultWarehouse = (warehouseData.defaultWareßhouse) ? warehouseData.defaultWarehouse.uniqueName : '';
            } else {
                this.store.dispatch(this.warehouseActions.fetchAllWarehouses({ page: 1, count: 0 }));
            }
        });

        if (this.voucherApiVersion === 2) {
            this.vm.calculateOtherTaxes(this.vm.selectedLedger.otherTaxModal);
        }

        // check if entry allows to show discount and taxes box
        // first check with opened lager
        if (this.vm.checkDiscountTaxesAllowedOnOpenedLedger(this.activeAccount)) {
            this.vm.showNewEntryPanel = true;
        } else {
            // now check if we transactions array have any income/expense/fixed assets entry
            let incomeExpenseEntryLength = this.vm.isThereIncomeOrExpenseEntry();
            this.vm.showNewEntryPanel = incomeExpenseEntryLength > 0;
        }

        this.vm.reInitilizeDiscount(resp[0]);
        if (!updateBaseAccountParticular && (this.isPettyCash || this.generalService.currentOrganizationType === OrganizationType.Branch || (this.branches && this.branches.length === 1))) {
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
        if (this.isAdvanceReceipt) {
            setTimeout(() => {
                this.handleAdvanceReceiptChange();
            }, 100);
        }
        this.activeAccountSubject.next(this.activeAccount);
        this.changeDetectorRef.detectChanges();
    }

    /**
     * Download files (voucher/attachment)
     *
     * @param {string} downloadOption
     * @param {*} event
     * @memberof UpdateLedgerEntryPanelComponent
     */
    public downloadFiles(downloadOption: string, event: any): void {
        if (this.voucherApiVersion === 2) {
            let dataToSend = {
                voucherType: this.vm.selectedLedger.voucherGeneratedType,
                entryUniqueName: (this.vm.selectedLedger.voucherUniqueName) ? undefined : this.vm.selectedLedger?.uniqueName,
                uniqueName: (this.vm.selectedLedger.voucherUniqueName) ? this.vm.selectedLedger.voucherUniqueName : undefined
            };

            let fileName = (downloadOption === "VOUCHER") ? this.vm.selectedLedger.voucherNumber + '.pdf' : this.vm.selectedLedger.attachedFile;

            this.commonService.downloadFile(dataToSend, downloadOption, 'pdf').pipe(takeUntil(this.destroyed$)).subscribe(response => {
                if (response?.status !== "error") {
                    saveAs(response, fileName);
                } else {
                    this.toaster.errorToast(this.commonLocaleData?.app_something_went_wrong);
                }
            }, (error => {
                this.toaster.errorToast(this.commonLocaleData?.app_something_went_wrong);
            }));
        } else {
            if (downloadOption === "VOUCHER") {
                this.downloadInvoice(this.vm.selectedLedger, event);
            } else {
                this.downloadAttachedFile(this.vm.selectedLedger.attachedFile, event);
            }
        }
    }

    /**
     * Shows the attachments popup
     *
     * @param {TemplateRef<any>} templateRef
     * @memberof UpdateLedgerEntryPanelComponent
     */
    public openAttachmentsDialog(templateRef: TemplateRef<any>): void {
        document.querySelector(".cdk-global-overlay-wrapper")?.classList?.add("double-popup-zindex");

        let dialogRef = this.dialog.open(templateRef, {
            width: '70%',
            height: '650px'
        });

        dialogRef.afterClosed().pipe(take(1)).subscribe(response => {
            document.querySelector(".cdk-global-overlay-wrapper")?.classList?.remove("double-popup-zindex");
            if (response) {
                this.store.dispatch(this.ledgerAction.getLedgerTrxDetails(this.accountUniqueName, this.entryUniqueName));
            }
        });
    }

    /**
     * Resets invoice list and current page
     *
     * @memberof UpdateLedgerEntryPanelComponent
     */
    public resetInvoiceList(): void {
        this.invoiceList = [];
        this.invoiceList$ = observableOf([]);
        this.referenceVouchersCurrentPage = 1;
    }

    /**
     * Other tax updated callback
     *
     * @memberof UpdateLedgerEntryPanelComponent
     */
    public calculateTax(): void {
        this.vm.generateGrandTotal();
    }

    /**
     * This function is used to get purchase settings from store
     *
     * @memberof UpdateLedgerEntryPanelComponent
     */
    public getPurchaseSettings(): void {
        this.store.pipe(select(state => state.invoice.settings), takeUntil(this.destroyed$)).subscribe(response => {
            if (response?.purchaseBillSettings && !response?.purchaseBillSettings?.enableVoucherDownload) {
                this.restrictedVouchersForDownload.push(AdjustedVoucherType.PurchaseInvoice);
            } else {
                this.restrictedVouchersForDownload = this.restrictedVouchersForDownload?.filter(voucherType => voucherType !== AdjustedVoucherType.PurchaseInvoice);
            }
        });
    }
}
