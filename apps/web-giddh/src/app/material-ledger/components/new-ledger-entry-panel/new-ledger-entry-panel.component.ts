import { animate, state, style, transition, trigger } from '@angular/animations';
import {
    AfterViewInit,
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    ElementRef,
    EventEmitter,
    HostListener,
    Input,
    OnChanges,
    OnDestroy,
    OnInit,
    Output,
    SimpleChanges,
    TemplateRef,
    ViewChild,
} from '@angular/core';
import { select, Store } from '@ngrx/store';
import {
    Configuration,
    HIGH_RATE_FIELD_PRECISION,
    RATE_FIELD_PRECISION,
    SubVoucher,
} from 'apps/web-giddh/src/app/app.constant';
import { AccountResponse, AccountResponseV2 } from 'apps/web-giddh/src/app/models/api-models/Account';
import { UploaderOptions, UploadInput, UploadOutput } from 'ngx-uploader';
import { BehaviorSubject, Observable, of as observableOf, ReplaySubject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';
import * as dayjs from 'dayjs';
import {
    ConfirmationModalConfiguration,
} from '../../../common/confirmation-modal/confirmation-modal.interface';
import { LoaderService } from '../../../loader/loader.service';
import { cloneDeep, forEach, sumBy } from '../../../lodash-optimized';
import { AdjustAdvancePaymentModal, VoucherAdjustments } from '../../../models/api-models/AdvanceReceiptsAdjust';
import { BaseResponse } from '../../../models/api-models/BaseResponse';
import { ICurrencyResponse, TaxResponse } from '../../../models/api-models/Company';
import { ReconcileRequest, ReconcileResponse } from '../../../models/api-models/Ledger';
import {
    IForceClear,
    SalesOtherTaxesCalculationMethodEnum,
    SalesOtherTaxesModal,
    VoucherTypeEnum,
} from '../../../models/api-models/Sales';
import { TagRequest } from '../../../models/api-models/settingsTags';
import { AdvanceSearchRequest } from '../../../models/interfaces/AdvanceSearchRequest';
import { ILedgerTransactionItem } from '../../../models/interfaces/ledger.interface';
import { LEDGER_API } from '../../../services/apiurls/ledger.api';
import { GeneralService } from '../../../services/general.service';
import { LedgerService } from '../../../services/ledger.service';
import { ToasterService } from '../../../services/toaster.service';
import { SettingsUtilityService } from '../../../settings/services/settings-utility.service';
import { GIDDH_DATE_FORMAT } from '../../../shared/helpers/defaultDateFormat';
import { giddhRoundOff } from '../../../shared/helpers/helperFunctions';
import { AppState } from '../../../store';
import { CurrentCompanyState } from '../../../store/Company/company.reducer';
import { IOption } from '../../../theme/ng-virtual-select/sh-options.interface';
import { ShSelectComponent } from '../../../theme/ng-virtual-select/sh-select.component';
import { TaxControlComponent } from '../../../theme/tax-control/tax-control.component';
import { AVAILABLE_ITC_LIST, BlankLedgerVM, TransactionVM } from '../../ledger.vm';
import { LedgerDiscountComponent } from '../ledger-discount/ledger-discount.component';
import { SettingsTagService } from '../../../services/settings.tag.service';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmModalComponent } from '../../../theme/new-confirm-modal/confirm-modal.component';
import { NewConfirmationModalComponent } from '../../../theme/new-confirmation-modal/confirmation-modal.component';
import { MatAccordion } from '@angular/material/expansion';
import { AdjustmentUtilityService } from '../../../shared/advance-receipt-adjustment/services/adjustment-utility.service';
import { SettingsDiscountService } from '../../../services/settings.discount.service';
import { LedgerUtilityService } from '../../services/ledger-utility.service';

/** New ledger entries */
const NEW_LEDGER_ENTRIES = [
    ['amount', 'convertedAmount'],
    ['discount', 'convertedDiscount'],
    ['tax', 'convertedTax'],
    ['total', 'convertedTotal'],
];

@Component({
    selector: 'new-ledger-entry-panel',
    templateUrl: 'new-ledger-entry-panel.component.html',
    styleUrls: ['./new-ledger-entry-panel.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
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

export class NewLedgerEntryPanelComponent implements OnInit, OnDestroy, OnChanges, AfterViewInit {
    /** Instance of mat accordion */
    @ViewChild(MatAccordion) accordion: MatAccordion;
    /** Instance of RCM checkbox */
    @ViewChild("rcmCheckbox") public rcmCheckbox: ElementRef;
    /* This will hold local JSON data */
    @Input() public localeData: any = {};
    /* This will hold common JSON data */
    @Input() public commonLocaleData: any = {};
    @Input() public blankLedger: BlankLedgerVM;
    @Input() public currentTxn: TransactionVM = null;
    @Input() public needToReCalculate: BehaviorSubject<boolean>;
    @Input() public showTaxationDiscountBox: boolean = true;
    @Input() public showOtherTax: boolean = true;
    @Input() public isBankTransaction: boolean = false;
    @Input() public trxRequest: AdvanceSearchRequest;
    @Input() public invoiceList: any[];
    @Input() public tcsOrTds: 'tcs' | 'tds' = 'tcs';
    @Input() public isLedgerAccountAllowsMultiCurrency: boolean;
    @Input() public baseCurrencyDetails: ICurrencyResponse;
    @Input() public foreignCurrencyDetails: ICurrencyResponse;
    @Input() public selectedCurrency: 0 | 1;
    @Input() public selectedPrefixForCurrency: string;
    @Input() public selectedSuffixForCurrency: string;
    @Input() public inputMaskFormat: string = '';
    @Input() public giddhBalanceDecimalPlaces: number = 2;
    @ViewChild('webFileInput', { static: true }) public webFileInput: ElementRef;
    /** True, if RCM taxable amount needs to be displayed in create new ledger component as per criteria */
    @Input() public shouldShowRcmTaxableAmount: boolean = false;
    /** True, if ITC section needs to be displayed in create new ledger component as per criteria  */
    @Input() public shouldShowItcSection: boolean = false;
    /** To check Tourist scheme applicable in ledger */
    @Input() public isTouristSchemeApplicable: boolean = false;
    /** True, if new form should be opened in READ only mode */
    @Input() public isReadOnly: boolean = false;

    public isAmountFirst: boolean = false;
    public isTotalFirts: boolean = false;
    public selectedInvoices: string[] = [];
    @Output() public changeTransactionType: EventEmitter<any> = new EventEmitter();
    @Output() public resetBlankLedger: EventEmitter<boolean> = new EventEmitter();
    @Output() public saveBlankLedger: EventEmitter<boolean> = new EventEmitter();
    @Output() public clickedOutsideEvent: EventEmitter<any> = new EventEmitter();
    @Output() public clickUnpaidInvoiceList: EventEmitter<any> = new EventEmitter();
    /** Emit event for getting invoice list for credit note linking */
    @Output() public getInvoiceListsForCreditNote: EventEmitter<any> = new EventEmitter();
    /** Emits when more detail is opened */
    @Output() public moreDetailOpen: EventEmitter<any> = new EventEmitter();
    /** Emits when other taxes are saved */
    @Output() public saveOtherTax: EventEmitter<any> = new EventEmitter();
    @ViewChild('entryContent', { static: true }) public entryContent: ElementRef;
    @ViewChild('sh', { static: true }) public sh: ShSelectComponent;
    @ViewChild('discount', { static: false }) public discountControl: LedgerDiscountComponent;
    @ViewChild('tax', { static: false }) public taxControll: TaxControlComponent;

    public sourceWarehouse: true;
    public uploadInput: EventEmitter<UploadInput>;
    public fileUploadOptions: UploaderOptions;
    public companyTaxesList$: Observable<TaxResponse[]>;
    public sessionKey$: Observable<string>;
    public companyName$: Observable<string>;
    public voucherTypeList: Observable<IOption[]>;
    public dateMask = [/\d/, /\d/, '-', /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/];
    public isFileUploading: boolean = false;
    public isLedgerCreateInProcess$: Observable<boolean>;
    public matchingEntriesData: ReconcileResponse[] = [];
    public showMatchingEntries: boolean = false;
    public mapBodyContent: string;
    public selectedItemToMap: ReconcileResponse;
    public tags: TagRequest[] = [];
    public activeAccount$: Observable<AccountResponse | AccountResponseV2>;
    public activeAccount: AccountResponse | AccountResponseV2;
    public currentAccountApplicableTaxes: string[] = [];
    public totalForTax: number = 0;
    public taxListForStock = []; // New
    public companyIsMultiCurrency: boolean;
    public giddhDateFormat: string = GIDDH_DATE_FORMAT;
    public asideMenuStateForOtherTaxes: string = 'out';
    public tdsTcsTaxTypes: string[] = ['tcsrc', 'tcspay'];
    public companyTaxesList: TaxResponse[] = [];
    /** Amount of invoice select for credit note */
    public selectedInvoiceAmount: number = 0;
    /** Selected invoice for credit note */
    public selectedInvoiceForCreditNote: any = null;
    /** Clear selected invoice */
    public forceClear$: Observable<IForceClear> = observableOf({ status: false });
    /** Default warehouse for a company */
    public defaultWarehouse: string;
    /** List of warehouses for a company */
    public warehouses: Array<any>;
    /** Currently selected warehouse */
    public selectedWarehouse: any;
    /** True, if subvoucher is RCM */
    public isRcmEntry: boolean = false;
    /** RCM modal configuration */
    public rcmConfiguration: ConfirmationModalConfiguration;
    /** True, if the selected voucher type is 'Receipt' */
    public shouldShowAdvanceReceipt: boolean = false;
    /** True, if advance receipt is enabled */
    public isAdvanceReceipt: boolean = false;
    /** True, if advance receipt checkbox is checked, will show the mandatory fields for Advance Receipt */
    public shouldShowAdvanceReceiptMandatoryFields: boolean = false;
    /** List of available ITC */
    public availableItcList: Array<any> = AVAILABLE_ITC_LIST;
    /** Allowed taxes list contains the unique name of all
     * tax types within a company and count upto which they are allowed
     */
    public allowedSelectionOfAType: any = { type: [], count: 1 };
    /** country name of active account */
    public activeAccountCountryName: string = '';
    /** True, if company country supports other tax (TCS/TDS) */
    public isTcsTdsApplicable: boolean;
    /** Rate should have precision up to 4 digits for better calculation */
    public ratePrecision = RATE_FIELD_PRECISION;
    /** Rate precision value that will be sent to API */
    public highPrecisionRate = HIGH_RATE_FIELD_PRECISION;
    /** True when user checks the adjust receipt checkbox */
    public isAdjustReceiptSelected: boolean;
    /** True when user checks the adjust advance receipt */
    public isAdjustAdvanceReceiptSelected: boolean;
    /** True when user checks any voucher for adjustment (sales, purchase, payment, receipt & advance-receipt) checkbox */
    public isAdjustVoucherSelected: boolean;
    /** Stores the details for adjustment component */
    public adjustVoucherConfiguration: any;
    /** account other applicable discount list which contains account's discount else immediate group's discount(inherited) */
    public accountOtherApplicableDiscount: any[] = [];
    /** Adjustment modal */
    @ViewChild('adjustPaymentModal', { static: true }) public adjustPaymentModal: TemplateRef<any>;
    /** Stores the multi-lingual label of current voucher */
    public currentVoucherLabel: string;
    // private below
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
    /** True, if exchange rate is swapped */
    private isExchangeRateSwapped: boolean = false;
    /** True if entry value is calculated inclusively */
    private isInclusiveEntry: boolean = false;
    /** Dialog reference for adjustment modal */
    public adjustmentDialogRef: any;
    /** True if datepicker is open */
    public isDatepickerOpen: boolean = false;
    /** True if more details is open */
    public isMoreDetailsOpen: boolean;
    /** Stores the voucher API version of current company */
    public voucherApiVersion: 1 | 2;
    /** True if user itself checked the generate voucher  */
    public manualGenerateVoucherChecked: boolean = false;
    /** Holds input to get invoice list request params */
    public invoiceListRequestParams: any = {};
    /** Round off amount */
    public calculatedRoundOff: number = 0;
    /** Current page for reference vouchers */
    private referenceVouchersCurrentPage: number = 2;
    /** Reference voucher search field */
    private searchReferenceVoucher: any = "";
    /** Invoice list observable */
    public invoiceList$: Observable<any[]>;
    /** List of discounts */
    public discountsList: any[] = [];
    /** Is advance receipt with tds/tcs */
    public isAdvanceReceiptWithTds: boolean = false;

    constructor(private store: Store<AppState>,
        private cdRef: ChangeDetectorRef,
        private generalService: GeneralService,
        private ledgerService: LedgerService,
        private loaderService: LoaderService,
        private settingsUtilityService: SettingsUtilityService,
        private toaster: ToasterService,
        public dialog: MatDialog,
        private settingsTagService: SettingsTagService,
        private adjustmentUtilityService: AdjustmentUtilityService,
        private settingsDiscountService: SettingsDiscountService,
        private ledgerUtilityService: LedgerUtilityService
    ) {
        this.companyTaxesList$ = this.store.pipe(select(p => p.company && p.company.taxes), takeUntil(this.destroyed$));
        this.sessionKey$ = this.store.pipe(select(p => p.session.user.session.id), takeUntil(this.destroyed$));
        this.companyName$ = this.store.pipe(select(p => p.session.companyUniqueName), takeUntil(this.destroyed$));
        this.activeAccount$ = this.store.pipe(select(p => p.ledger.account), takeUntil(this.destroyed$));
        this.isLedgerCreateInProcess$ = this.store.pipe(select(p => p.ledger.ledgerCreateInProcess), takeUntil(this.destroyed$));
    }

    public ngOnInit() {
        this.voucherTypeList = observableOf([{
            label: this.commonLocaleData?.app_voucher_types.sales,
            value: 'sal'
        }, {
            label: this.commonLocaleData?.app_voucher_types.purchase,
            value: 'pur'
        }, {
            label: this.commonLocaleData?.app_voucher_types.receipt,
            value: 'rcpt'
        }, {
            label: this.commonLocaleData?.app_voucher_types.payment,
            value: 'pay'
        }, {
            label: this.commonLocaleData?.app_voucher_types.journal,
            value: 'jr'
        }, {
            label: this.commonLocaleData?.app_voucher_types.contra,
            value: 'cntr'
        }, {
            label: this.commonLocaleData?.app_voucher_types.debit_note,
            value: 'debit note'
        }, {
            label: this.commonLocaleData?.app_voucher_types.credit_note,
            value: 'credit note'
        }, {
            label: this.commonLocaleData?.app_voucher_types.advance_receipt,
            value: 'advance-receipt',
            subVoucher: SubVoucher.AdvanceReceipt
        }]);

        this.uploadInput = new EventEmitter<UploadInput>();
        this.fileUploadOptions = { concurrency: 0 };
        this.currentTxn.advanceReceiptAmount = this.currentTxn.amount;
        this.activeAccount$.subscribe(acc => {
            if (acc) {
                this.assignUpdateActiveAccount(acc);
            }
        });

        this.store.pipe(select(appState => appState.warehouse.warehouses), take(1)).subscribe((warehouses: any) => {
            if (warehouses?.results) {
                let warehouseResults = cloneDeep(warehouses.results);
                warehouseResults = warehouseResults?.filter(warehouse => !warehouse.isArchived);
                const warehouseData = this.settingsUtilityService.getFormattedWarehouseData(warehouseResults);
                this.warehouses = warehouseData.formattedWarehouses;
                this.defaultWarehouse = (warehouseData.defaultWarehouse) ? warehouseData.defaultWarehouse.uniqueName : '';
                this.selectedWarehouse = String(this.defaultWarehouse);
            }
        });

        this.store.pipe(select(appState => appState.company), takeUntil(this.destroyed$)).subscribe((companyData: CurrentCompanyState) => {
            if (companyData) {
                this.isTcsTdsApplicable = companyData.isTcsTdsApplicable;
            }
        });

        this.settingsTagService.GetAllTags().pipe(takeUntil(this.destroyed$)).subscribe(response => {
            if (response?.status === "success" && response?.body?.length > 0) {
                _.map(response?.body, (tag) => {
                    tag.label = tag.name;
                    tag.value = tag.name;
                });
                this.tags = _.orderBy(response?.body, 'name');
            }
        });

        // for tcs and tds identification
        if (this.tcsOrTds === 'tcs') {
            this.tdsTcsTaxTypes = ['tcspay', 'tcsrc'];
        } else {
            this.tdsTcsTaxTypes = ['tdspay', 'tdsrc'];
        }

        this.store.pipe(select(s => s.company && s.company.taxes), takeUntil(this.destroyed$)).subscribe(res => {
            this.companyTaxesList = res || [];
            if (this.companyTaxesList && this.companyTaxesList.length > 0) {
                this.companyTaxesList.forEach((tax) => {
                    if (!this.allowedSelectionOfAType.type.includes(tax.taxType)) {
                        this.allowedSelectionOfAType.type.push(tax.taxType);
                    }
                });
            }
            if (!res) {
                this.allowedSelectionOfAType.type = [];
            }
        });

        this.shouldShowAdvanceReceipt = (this.blankLedger) ? this.blankLedger.voucherType === 'rcpt' : false;
        this.isAdvanceReceipt = (this.currentTxn) ? this.currentTxn['subVoucher'] === SubVoucher.AdvanceReceipt : false;
        this.isAdvanceReceiptWithTds = cloneDeep(this.isAdvanceReceipt);
        this.isRcmEntry = (this.currentTxn) ? this.currentTxn['subVoucher'] === SubVoucher.ReverseCharge : false;
        this.shouldShowAdvanceReceiptMandatoryFields = this.isAdvanceReceipt;
        this.currentVoucherLabel = this.generalService.getCurrentVoucherLabel(this.blankLedger?.voucherType, this.commonLocaleData);
        if (this.localeData) {
            this.availableItcList[0].label = this.localeData?.import_goods;
            this.availableItcList[1].label = this.localeData?.import_services;
            this.availableItcList[2].label = this.localeData?.others;
        }
        this.voucherApiVersion = this.generalService.voucherApiVersion;

        this.settingsDiscountService.GetDiscounts().pipe(takeUntil(this.destroyed$)).subscribe(response => {
            if (response?.status === "success" && response?.body?.length > 0) {
                this.discountsList = response?.body;
            }
        });
    }

    @HostListener('click', ['$event'])
    public clicked(e) {
        if (this.sh && e.path && !this.sh.ele?.nativeElement.contains(e.path[3])) {
            this.sh.hide();
        }
    }

    public ngOnChanges(changes: SimpleChanges): void {
        if (changes?.currentTxn?.currentValue?.selectedAccount) {
            this.currentTxn.advanceReceiptAmount = giddhRoundOff(this.currentTxn.amount, this.giddhBalanceDecimalPlaces);
            if (!this.currentTxn.selectedAccount.stock) {
                this.selectedWarehouse = String(this.defaultWarehouse);
            }
            this.calculatePreAppliedTax();
            this.preparePreAppliedDiscounts();
            if (this.blankLedger?.otherTaxModal?.appliedOtherTax && this.blankLedger?.otherTaxModal?.appliedOtherTax?.uniqueName) {
                this.blankLedger.isOtherTaxesApplicable = true;
            }
        }
        if (this.voucherApiVersion === 2 && changes?.invoiceList?.currentValue) {
            this.invoiceList$ = observableOf(this.invoiceList);
            this.referenceVouchersCurrentPage = 2;
        }
    }

    /**
     * Calculates the taxes to be checked by default based on values obtained
     *
     * @memberof NewLedgerEntryPanelComponent
     */
    public calculatePreAppliedTax(): void {
        let activeAccountTaxes = [];
        if (this.activeAccount && this.activeAccount.applicableTaxes) {
            activeAccountTaxes = this.activeAccount.applicableTaxes.map((tax) => tax?.uniqueName);
            if (this.activeAccount.otherApplicableTaxes?.length && activeAccountTaxes?.length) {
                if (this.activeAccount.otherApplicableTaxes[0]?.uniqueName !== activeAccountTaxes[0] && activeAccountTaxes.includes(this.activeAccount.otherApplicableTaxes[0]?.uniqueName)) {
                    activeAccountTaxes = activeAccountTaxes.reverse();
                }
            }
        }
        if (this.currentTxn && this.currentTxn.selectedAccount && this.currentTxn.selectedAccount.stock && this.currentTxn.selectedAccount.stock.stockTaxes && this.currentTxn.selectedAccount.stock.stockTaxes.length) {
            this.taxListForStock = this.mergeInvolvedAccountsTaxes(this.currentTxn.selectedAccount.stock.stockTaxes, activeAccountTaxes);
        } else if (this.currentTxn.selectedAccount && this.currentTxn.selectedAccount.parentGroups && this.currentTxn.selectedAccount.parentGroups.length) {
            this.taxListForStock = this.mergeInvolvedAccountsTaxes(this.currentTxn.selectedAccount.applicableTaxes, activeAccountTaxes);
        } else {
            this.taxListForStock = [];
        }
        let companyTaxes: TaxResponse[] = [];
        this.companyTaxesList$.pipe(take(1)).subscribe(taxes => companyTaxes = taxes);
        let appliedTaxes: any[] = [];

        if (!this.blankLedger.otherTaxModal) {
            this.blankLedger.otherTaxModal = new SalesOtherTaxesModal();
        }

        if (this.taxListForStock && this.taxListForStock.length > 0) {
            this.taxListForStock.forEach(tl => {
                let tax = (companyTaxes && companyTaxes.length > 0) ? companyTaxes.find(f => f?.uniqueName === tl) : undefined;
                if (tax) {
                    switch (tax.taxType) {
                        case 'tcsrc':
                        case 'tcspay':
                        case 'tdsrc':
                        case 'tdspay':
                            this.blankLedger.otherTaxModal.appliedOtherTax = {
                                name: tax?.name,
                                uniqueName: tax?.uniqueName
                            };
                            this.blankLedger.isOtherTaxesApplicable = true;
                            break;
                        default:
                            appliedTaxes.push(tax?.uniqueName);
                    }
                }
            });
        }
        this.taxListForStock = appliedTaxes;
    }

    public ngAfterViewInit(): void {
        this.needToReCalculate.pipe(takeUntil(this.destroyed$)).subscribe(a => {
            if (a) {
                this.amountChanged();
                this.calculateTotal();
                this.calculateTax();
            }
        });
        this.cdRef.markForCheck();
    }

    public addToDrOrCr(type: string, e: Event) {
        e.stopPropagation();
        if (this.isRcmEntry && !this.validateTaxes()) {
            if (this.taxControll && this.taxControll.taxInputElement && this.taxControll.taxInputElement.nativeElement) {
                // Taxes are mandatory for RCM and Advance Receipt entries
                this.taxControll.taxInputElement?.nativeElement.classList.add('error-box');
                return;
            }
        }

        this.changeTransactionType.emit({
            type,
            warehouse: this.selectedWarehouse
        });
        this.blankLedger.voucherType = '';
        this.blankLedger.generateInvoice = false;
    }

    /**
     * To calculate discount
     *
     * @param {*} event
     * @memberof NewLedgerEntryPanelComponent
     */
    public calculateDiscount(event: any): void {
        this.currentTxn.discount = event.discountTotal;
        if (this.accountOtherApplicableDiscount && this.accountOtherApplicableDiscount.length > 0) {
            this.accountOtherApplicableDiscount.forEach(item => {
                if (item && event.discount && item?.uniqueName === event.discount.discountUniqueName) {
                    item.isActive = event.isActive.target?.checked;
                }
            });
        }
        if (this.currentTxn && this.currentTxn.selectedAccount && this.currentTxn.selectedAccount.accountApplicableDiscounts) {
            this.currentTxn.selectedAccount.accountApplicableDiscounts.forEach(item => {
                if (item && event.discount && item?.uniqueName === event.discount.discountUniqueName) {
                    item.isActive = event.isActive.target?.checked;
                }
            });
        }
        this.currentTxn.convertedDiscount = this.calculateConversionRate(this.currentTxn.discount);
        this.calculateTax();
    }

    public calculateTax() {
        let totalPercentage: number;
        totalPercentage = this.currentTxn.taxesVm.reduce((pv, cv) => {
            return cv.isChecked ? pv + cv.amount : pv;
        }, 0);
        if (this.generalService.isReceiptPaymentEntry(this.activeAccount, this.currentTxn.selectedAccount, this.blankLedger.voucherType) && !this.isAdvanceReceiptWithTds) {
            this.currentTxn.tax = giddhRoundOff(this.generalService.calculateInclusiveOrExclusiveTaxes(false, this.currentTxn.advanceReceiptAmount, totalPercentage, this.currentTxn.discount), this.giddhBalanceDecimalPlaces);
        } else {
            this.currentTxn.tax = giddhRoundOff(this.generalService.calculateInclusiveOrExclusiveTaxes(this.isAdvanceReceipt, this.currentTxn.amount, totalPercentage, this.currentTxn.discount), this.giddhBalanceDecimalPlaces);
        }
        this.currentTxn.convertedTax = this.calculateConversionRate(this.currentTxn.tax);
        this.calculateTotal();
    }

    /**
     * Calculates the total amount
     *
     * @memberof NewLedgerEntryPanelComponent
     */
    public calculateTotal(): void {
        if (this.currentTxn) {
            if (this.currentTxn.amount) {
                /** apply account's discount (default) */
                if (this.currentTxn.discounts && this.currentTxn.discounts.length && this.accountOtherApplicableDiscount && this.accountOtherApplicableDiscount.length) {
                    this.currentTxn.discounts.map(item => {
                        let discountItem = this.accountOtherApplicableDiscount.find(element => element?.uniqueName === item?.discountUniqueName);
                        if (discountItem && discountItem.uniqueName) {
                            item.isActive = discountItem.isActive;
                        }
                    });
                }

                const isExportValid = this.checkIfExportIsValid();

                if (this.isAdvanceReceipt) {
                    this.currentTxn.advanceReceiptAmount = giddhRoundOff((this.currentTxn.amount - this.currentTxn.tax), this.giddhBalanceDecimalPlaces);
                    this.currentTxn.total = giddhRoundOff((this.currentTxn.advanceReceiptAmount + (!isExportValid ? this.currentTxn.tax : 0)), this.giddhBalanceDecimalPlaces);
                    this.totalForTax = this.currentTxn.total;
                    this.currentTxn.convertedTotal = giddhRoundOff((this.currentTxn.convertedAmount - (!isExportValid ? this.currentTxn.convertedTax : 0)), this.giddhBalanceDecimalPlaces);
                } else {
                    let total = (this.currentTxn.amount - this.currentTxn.discount) || 0;
                    const convertedTotal = (this.currentTxn.convertedAmount - this.currentTxn.convertedDiscount) || 0;
                    this.totalForTax = total;
                    const taxApplied = (this.isRcmEntry || isExportValid) ? 0 : this.currentTxn.tax;
                    const convertedTaxApplied = (this.isRcmEntry || isExportValid) ? 0 : this.currentTxn.convertedTax;
                    this.currentTxn.total = giddhRoundOff((total + taxApplied), this.giddhBalanceDecimalPlaces);
                    this.currentTxn.convertedTotal = giddhRoundOff((convertedTotal + convertedTaxApplied), this.giddhBalanceDecimalPlaces);
                }
            } else {
                // Amount is zero, set other parameters to zero
                if (this.isAdvanceReceipt) {
                    this.currentTxn.advanceReceiptAmount = 0;
                }
                this.totalForTax = 0;
                this.currentTxn.total = 0;
                this.currentTxn.convertedTotal = this.calculateConversionRate(this.currentTxn.total);
            }
        }
        this.calculateCompoundTotal();
        this.calculateOtherTaxes(this.blankLedger.otherTaxModal);
    }

    public amountChanged() {
        this.isInclusiveEntry = false;
        if (this.currentTxn && this.currentTxn.selectedAccount) {
            if (this.currentTxn.selectedAccount.stock && this.currentTxn.amount > 0) {
                if (this.currentTxn.inventory.quantity) {
                    this.currentTxn.inventory.unit.rate = giddhRoundOff((this.currentTxn.amount / this.currentTxn.inventory.quantity), this.ratePrecision);
                    this.currentTxn.inventory.unit.highPrecisionRate = Number((this.currentTxn.amount / this.currentTxn.inventory.quantity).toFixed(this.highPrecisionRate));
                    this.currentTxn.convertedRate = this.calculateConversionRate(this.currentTxn.inventory.unit.highPrecisionRate, this.ratePrecision);
                }
            }
            if (this.discountControl) {
                this.discountControl.change();
            }

            if (this.taxControll) {
                this.taxControll.change();
            }
            if (this.currentTxn.inventory) {
                this.currentTxn.convertedAmount = this.currentTxn.inventory.quantity * this.currentTxn.convertedRate;
            } else {
                this.currentTxn.convertedAmount = this.calculateConversionRate(this.currentTxn.amount);
            }
        }

        if (this.shouldShowRcmTaxableAmount) {
            this.currentTxn.reverseChargeTaxableAmount = this.generalService.convertExponentialToNumber(this.currentTxn.amount * 20);;
        }

        if (this.isAmountFirst || this.isTotalFirts) {
            return;
        } else {
            this.isAmountFirst = true;
        }
    }

    public changePrice(val: string) {
        if (!this.isExchangeRateSwapped && !this.isInclusiveEntry) {
            this.currentTxn.inventory.unit.rate = giddhRoundOff(Number(val), this.ratePrecision);
            this.currentTxn.inventory.unit.highPrecisionRate = this.currentTxn.inventory.unit.rate;
            this.currentTxn.convertedRate = this.calculateConversionRate(this.currentTxn.inventory.unit.rate, this.ratePrecision);

            this.currentTxn.amount = giddhRoundOff((this.currentTxn.inventory.unit.rate * this.currentTxn.inventory.quantity), this.giddhBalanceDecimalPlaces);
            if (this.currentTxn.inventory) {
                this.currentTxn.convertedAmount = this.currentTxn.inventory.quantity * this.currentTxn.convertedRate;
            } else {
                this.currentTxn.convertedAmount = this.calculateConversionRate(this.currentTxn.amount);
            }

            // calculate discount on change of price
            if (this.discountControl) {
                this.discountControl.ledgerAmount = this.currentTxn.amount;
                this.discountControl.change();
            }

            this.calculateTotal();
            this.calculateCompoundTotal();
        }
    }

    public changeQuantity(val: string) {
        this.currentTxn.inventory.quantity = Number(val);
        this.currentTxn.amount = Number((this.currentTxn.inventory.unit.highPrecisionRate * this.currentTxn.inventory.quantity).toFixed(this.giddhBalanceDecimalPlaces));
        if (this.currentTxn.inventory) {
            this.currentTxn.convertedAmount = this.currentTxn.inventory.quantity * this.currentTxn.convertedRate;
        } else {
            this.currentTxn.convertedAmount = this.calculateConversionRate(this.currentTxn.amount);
        }

        // calculate discount on change of price
        if (this.discountControl) {
            this.discountControl.ledgerAmount = this.currentTxn.amount;
            this.discountControl.change();
        }

        this.calculateTotal();
        this.calculateCompoundTotal();
    }

    public calculateAmount() {
        this.isInclusiveEntry = true;
        let fixDiscount = 0;
        let percentageDiscount = 0;
        if (this.discountControl) {
            percentageDiscount = this.discountControl.discountAccountsDetails?.filter(f => f.isActive)
                ?.filter(s => s.discountType === 'PERCENTAGE')
                .reduce((pv, cv) => {
                    return Number(cv.discountValue) ? Number(pv) + Number(cv.discountValue) : Number(pv);
                }, 0) || 0;

            fixDiscount = this.discountControl.discountAccountsDetails?.filter(f => f.isActive)
                ?.filter(s => s.discountType === 'FIX_AMOUNT')
                .reduce((pv, cv) => {
                    return Number(cv.discountValue) ? Number(pv) + Number(cv.discountValue) : Number(pv);
                }, 0) || 0;
        }
        let taxTotal = 0;
        if (this.taxControll) {
            taxTotal = this.taxControll.taxRenderData?.filter(f => f.isChecked)
                .reduce((pv, cv) => {
                    return Number(pv) + Number(cv.amount);
                }, 0) || 0;
        }

        this.currentTxn.amount = giddhRoundOff(((Number(this.currentTxn.total) + fixDiscount + 0.01 * fixDiscount * Number(taxTotal)) /
            (1 - 0.01 * percentageDiscount + 0.01 * Number(taxTotal) - 0.0001 * percentageDiscount * Number(taxTotal))), this.giddhBalanceDecimalPlaces);
        if (this.currentTxn.inventory) {
            this.currentTxn.convertedAmount = this.currentTxn.inventory.quantity * this.currentTxn.convertedRate;
        } else {
            this.currentTxn.convertedAmount = this.calculateConversionRate(this.currentTxn.amount);
        }

        if (this.discountControl) {
            this.discountControl.ledgerAmount = this.currentTxn.amount;
            this.discountControl.change();
        }

        if (this.taxControll) {
            this.taxControll.taxTotalAmount = this.currentTxn.amount;
            this.taxControll.change();
        }

        if (this.currentTxn.selectedAccount) {
            if (this.currentTxn.selectedAccount.stock) {
                this.currentTxn.inventory.unit.rate = giddhRoundOff((this.currentTxn.amount / this.currentTxn.inventory.quantity), this.ratePrecision);
                this.currentTxn.inventory.unit.highPrecisionRate = Number((this.currentTxn.amount / this.currentTxn.inventory.quantity).toFixed(this.highPrecisionRate));
                this.currentTxn.convertedRate = this.calculateConversionRate(this.currentTxn.inventory.unit.highPrecisionRate, this.ratePrecision);
            }
        }
        this.calculateCompoundTotal();
        if (this.isTotalFirts || this.isAmountFirst) {
            return;
        } else {
            this.isTotalFirts = true;
            this.currentTxn.isInclusiveTax = true;
        }
    }

    public calculateCompoundTotal() {
        let debitTotal = Number(sumBy(this.blankLedger.transactions?.filter(t => t.type === 'DEBIT'), (trxn) => Number(trxn.total))) || 0;
        let creditTotal = Number(sumBy(this.blankLedger.transactions?.filter(t => t.type === 'CREDIT'), (trxn) => Number(trxn.total))) || 0;

        if (debitTotal > creditTotal) {
            this.blankLedger.compoundTotal = giddhRoundOff((debitTotal - creditTotal), this.giddhBalanceDecimalPlaces);
        } else {
            this.blankLedger.compoundTotal = giddhRoundOff((creditTotal - debitTotal), this.giddhBalanceDecimalPlaces);
        }

        if (this.voucherApiVersion === 2 && (this.blankLedger.voucherType === "sal" || this.blankLedger.voucherType === "pur" || this.blankLedger.voucherType === "credit note" || this.blankLedger.voucherType === "debit note")) {
            this.calculatedRoundOff = Number(Math.round(this.blankLedger.compoundTotal) - this.blankLedger.compoundTotal);
            this.blankLedger.compoundTotal = Number(((this.blankLedger.compoundTotal) + this.calculatedRoundOff).toFixed(2));
        } else {
            this.calculatedRoundOff = 0;
        }

        this.blankLedger.convertedCompoundTotal = this.calculateConversionRate(this.blankLedger.compoundTotal);
    }

    public saveLedger() {
        if ((this.isRcmEntry) && !this.validateTaxes()) {
            if (this.taxControll && this.taxControll.taxInputElement && this.taxControll.taxInputElement.nativeElement) {
                // Taxes are mandatory for RCM and Advance Receipt entries
                this.taxControll.taxInputElement?.nativeElement.classList.add('error-box');
                return;
            }
        }
        // Taxes checkbox will be false in case of receipt and payment voucher
        if (this.voucherApiVersion === 2 && (this.blankLedger.voucherType === 'rcpt' || this.blankLedger.voucherType === 'pay') && !this.isAdvanceReceipt) {
            this.currentTxn?.taxesVm?.map(tax => {
                tax.isChecked = false;
            });
        }
        /* Add warehouse to the stock entry if the user hits 'Save' button without clicking on 'Add to CR/DR' button
            This will add the warehouse to the entered item */
        this.blankLedger.transactions.map((transaction) => {
            if (transaction.inventory && !transaction.inventory.warehouse) {
                transaction.inventory.warehouse = { name: '', uniqueName: this.selectedWarehouse };
            }
            if (transaction?.voucherAdjustments?.adjustments?.length > 0) {
                transaction.voucherAdjustments.adjustments.forEach((adjustment: any) => {
                    if (adjustment.balanceDue !== undefined) {
                        delete adjustment.balanceDue;
                    }
                });
            }
        });
        this.saveBlankLedger.emit(true);
    }

    public resetPanel() {
        this.resetBlankLedger.emit(true);
        this.currentTxn = null;
    }

    public onUploadOutput(): void {
        this.webFileInput?.nativeElement.click();
    }

    public onWebUpload(output: UploadOutput) {
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
            if (output.file.response.status === 'success') {
                this.isFileUploading = false;
                this.blankLedger.attachedFile = output.file.response.body?.uniqueName;
                this.blankLedger.attachedFileName = output.file.response.body?.name;
                this.toaster.showSnackBar("success", this.localeData?.file_uploaded);
            } else {
                this.isFileUploading = false;
                this.blankLedger.attachedFile = '';
                this.blankLedger.attachedFileName = '';
                this.toaster.showSnackBar("error", output.file.response.message);
            }
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

    public unitChanged(stockUnitCode: string) {
        let unit = this.currentTxn.selectedAccount.stock.unitRates.find(p => p.stockUnitCode === stockUnitCode);
        this.currentTxn.inventory.unit = { code: unit.stockUnitCode, rate: unit.rate, stockUnitCode: unit.stockUnitCode };
        if (this.currentTxn.inventory.unit) {
            this.changePrice(this.currentTxn.inventory.unit.rate.toString());
        }
    }

    public deleteAttachedFile() {
        this.ledgerService.removeAttachment(this.blankLedger?.attachedFile).subscribe((response) => {
            if (response?.status === 'success') {
                this.blankLedger.attachedFile = '';
                this.blankLedger.attachedFileName = '';
                if (this.webFileInput && this.webFileInput.nativeElement) {
                    this.webFileInput.nativeElement.value = '';
                }
                this.detectChanges();
                this.toaster.showSnackBar("success", this.localeData?.remove_file);
            } else {
                this.toaster.showSnackBar("error", response?.message)
            }
        });
    }

    public ngOnDestroy(): void {
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }

    public getReconciledEntries() {
        this.matchingEntriesData = [];
        let o: ReconcileRequest = {};
        o.chequeNumber = (this.blankLedger.chequeNumber) ? this.blankLedger.chequeNumber : '';
        o.accountUniqueName = this.trxRequest.accountUniqueName;
        o.from = (this.trxRequest.from) ? dayjs(this.trxRequest.from).format(GIDDH_DATE_FORMAT) : "";
        o.to = (this.trxRequest.to) ? dayjs(this.trxRequest.to).format(GIDDH_DATE_FORMAT) : "";
        this.ledgerService.GetReconcile(o.accountUniqueName, o.from, o.to, o.chequeNumber).pipe(takeUntil(this.destroyed$)).subscribe((res) => {
            let data: BaseResponse<ReconcileResponse[], string> = res;
            if (data.status === 'success') {
                if (data.body && data.body.length) {
                    forEach(data.body, (entry: ReconcileResponse) => {
                        forEach(entry.transactions, (txn: ILedgerTransactionItem) => {
                            if (txn.amount === this.currentTxn.amount) {
                                this.matchingEntriesData.push(entry);
                            }
                        });
                    });
                    if (this.matchingEntriesData && this.matchingEntriesData.length === 1) {
                        this.confirmBankTransactionMap(this.matchingEntriesData[0]);
                    } else if (this.matchingEntriesData && this.matchingEntriesData.length > 1) {
                        this.showMatchingEntries = true;
                    } else {
                        this.showErrMsgOnUI();
                    }
                } else {
                    this.showErrMsgOnUI();
                }
            } else {
                this.toaster.showSnackBar("error", data.message, data.code);
            }
        });
    }

    public showErrMsgOnUI() {
        this.toaster.showSnackBar("warning", this.localeData?.no_matching_entry_found);
    }

    public confirmBankTransactionMap(item: ReconcileResponse) {
        this.selectedItemToMap = item;
        this.mapBodyContent = this.localeData?.map_cheque_bank_transaction;
        this.mapBodyContent = this.mapBodyContent?.replace("[CHEQUE_NUMBER]", item.chequeNumber);

        let dialogRef = this.dialog.open(ConfirmModalComponent, {
            width: '630px',
            data: {
                title: this.commonLocaleData?.map_bank_entry,
                body: this.mapBodyContent,
                ok: this.commonLocaleData?.app_yes,
                cancel: this.commonLocaleData?.app_no
            }
        });

        dialogRef.afterClosed().pipe(take(1)).subscribe(response => {
            if (response) {
                this.mapBankTransaction();
            }
        });
    }

    public mapBankTransaction() {

        if (this.blankLedger.transactionId && this.selectedItemToMap?.uniqueName) {
            let model = {
                uniqueName: this.selectedItemToMap?.uniqueName
            };
            let unqObj = {
                accountUniqueName: this.trxRequest.accountUniqueName,
                transactionId: this.blankLedger.transactionId
            };
            this.ledgerService.MapBankTransactions(model, unqObj).pipe(takeUntil(this.destroyed$)).subscribe((res) => {
                if (res.status === 'success') {
                    if (typeof (res.body) === 'string') {
                        this.toaster.showSnackBar("success", res.body);
                    } else {
                        this.toaster.showSnackBar("success", this.localeData?.entry_mapped);
                    }
                    this.clickedOutsideEvent.emit(false);
                } else {
                    this.toaster.showSnackBar("error", res.message, res.code);
                }
            });
        }
    }

    public hideDiscountTax(): void {
        if (this.discountControl) {
            this.discountControl.discountMenu = false;
        }
        if (this.taxControll) {
            this.taxControll.showTaxPopup = false;
        }
    }

    public hideDiscount(): void {
        if (this.discountControl) {
            this.discountControl.change();
            this.discountControl.discountMenu = false;
        }
    }

    public hideTax(): void {
        if (this.taxControll) {
            this.taxControll.change();
            this.taxControll.showTaxPopup = false;
        }
    }

    public detectChanges() {
        if (!this.cdRef['destroyed']) {
            this.cdRef.detectChanges();
        }
    }

    public saveCtrlEnter(event) {
        if (event.ctrlKey && event.keyCode === 13) {
            this.saveLedger();
        } else {
            return;
        }
    }

    /**
     * This maintains state of datepicker (open/closed)
     *
     * @param {*} event
     * @memberof NewLedgerEntryPanelComponent
     */
    public datepickerState(event: any): void {
        this.isDatepickerOpen = event;
    }

    @HostListener('window:click', ['$event'])
    public clickedOutsideOfComponent(event) {
        this.clickedOutside(event);
    }

    public clickedOutside(event: any): void {
        if (this.isDatepickerOpen) {
            return;
        }

        let classList = event?.path?.map(m => {
            return m?.classList;
        });

        if (classList && classList instanceof Array) {
            const shouldNotClose = classList.some((className: DOMTokenList) => {
                if (!className) {
                    return;
                }
                return className.contains('currency-toggler') || className.contains("cdk-overlay-container") || className.contains('mat-calendar');
            });

            if (shouldNotClose) {
                return;
            }
        }

        if (!event.relatedTarget || !this.entryContent?.nativeElement.contains(event.relatedTarget)) {
            this.clickedOutsideEvent.emit(event);
        }
    }

    public selectInvoice(invoiceNo, ev) {
        invoiceNo.isSelected = ev?.target?.checked;
        if (ev?.target?.checked) {
            this.blankLedger.invoicesToBePaid.push(invoiceNo.label);
        } else {
            let indx = this.blankLedger.invoicesToBePaid.indexOf(invoiceNo.label);
            this.blankLedger.invoicesToBePaid.splice(indx, 1);
        }
    }

    /**
     * Selected invoice for credit note
     *
     * @param {any} event Selected invoice for credit note
     * @memberof NewLedgerEntryPanelComponent
     */
    public creditNoteInvoiceSelected(event: any): void {
        if (event && event.value && event.additional) {
            if (this.currentTxn) {
                if (this.voucherApiVersion === 2) {
                    this.currentTxn.referenceVoucher = {
                        uniqueName: event.value
                    }
                    this.selectedInvoiceAmount = event.additional.unadjustedAmount.amountForAccount;
                } else {
                    this.currentTxn.invoiceLinkingRequest = {
                        linkedInvoices: [
                            {
                                invoiceUniqueName: event.value,
                                voucherType: event.additional.voucherType
                            }
                        ]
                    }
                    this.selectedInvoiceAmount = event.additional.balanceDue.amountForAccount;
                }
            }
            this.blankLedger.generateInvoice = true;
        }
    }

    /**
     * Removes the selected invoice for credit note
     *
     * @memberof NewLedgerEntryPanelComponent
     */
    public removeSelectedInvoice(): void {
        this.forceClear$ = observableOf({ status: true });
        if (this.currentTxn) {
            this.currentTxn.invoiceLinkingRequest = null;
            this.currentTxn.referenceVoucher = null;
        }
        this.selectedInvoiceForCreditNote = null;

        if (!this.currentTxn?.voucherAdjustments?.adjustments?.length) {
            this.blankLedger.generateInvoice = this.manualGenerateVoucherChecked;
        }
    }

    /**
     * Fetches the invoice list data for a voucher
     *
     * @param {*} event Contains the selected voucher details
     * @memberof NewLedgerEntryPanelComponent
     */
    public getInvoiceListsData(event: any): void {
        this.removeAdjustment();
        if (this.voucherApiVersion === 2) {
            this.resetInvoiceList();
        }
        if (event.value === 'advance-receipt') {
            this.shouldShowAdvanceReceipt = true;
            this.isAdvanceReceipt = true;
        } else if (event.value === VoucherTypeEnum.creditNote || event.value === VoucherTypeEnum.debitNote) {
            this.shouldShowAdvanceReceipt = false;
            this.removeSelectedInvoice();
            this.getInvoiceListsForCreditNote.emit([this.currentTxn, event.value]);
            this.isAdvanceReceipt = false;
        } else {
            this.shouldShowAdvanceReceipt = false;
            this.isAdvanceReceipt = false;
        }

        this.isAdvanceReceiptWithTds = cloneDeep(this.isAdvanceReceipt);

        if (this.voucherApiVersion === 2 && this.isAdvanceReceipt) {
            this.blankLedger.generateInvoice = true;
        }

        this.handleAdvanceReceiptChange();
        this.currentVoucherLabel = this.generalService.getCurrentVoucherLabel(this.blankLedger?.voucherType, this.commonLocaleData);
        this.calculateTotal();
    }

    public toggleBodyClass() {
        if (this.asideMenuStateForOtherTaxes === 'in') {

            document.querySelector('body')?.classList?.add('fixed');
        } else {
            document.querySelector('body')?.classList?.remove('fixed');
        }
    }

    /**
     *Closes the other taxes side menu panel on click of overlay
     *
     * @memberof NewLedgerEntryPanelComponent
     */
    public closeAsideMenuStateForOtherTax(): void {
        if (this.asideMenuStateForOtherTaxes === 'in') {
            this.blankLedger.otherTaxModal = new SalesOtherTaxesModal();
            if (this.blankLedger.otherTaxesSum > 0) {
                this.blankLedger.isOtherTaxesApplicable = true;
            } else {
                this.blankLedger.isOtherTaxesApplicable = false;
            }
            this.toggleOtherTaxesAsidePane(true);
        }
    }

    public toggleOtherTaxesAsidePane(modalBool: boolean) {
        if (!modalBool) {
            this.blankLedger.otherTaxModal = new SalesOtherTaxesModal();
            this.blankLedger.otherTaxesSum = 0;
            this.blankLedger.tdsTcsTaxesSum = 0;
            this.blankLedger.otherTaxModal.itemLabel = '';
            return;
        }
        if (!this.blankLedger?.otherTaxModal) {
            this.blankLedger.otherTaxModal = new SalesOtherTaxesModal();
        }
        this.blankLedger.otherTaxModal.itemLabel = this.currentTxn && this.currentTxn.selectedAccount ?
            this.currentTxn.selectedAccount.stock ? `${this.currentTxn.selectedAccount.name}(${this.currentTxn.selectedAccount.stock.name})` :
                this.currentTxn.selectedAccount.name : '';
        this.asideMenuStateForOtherTaxes = this.asideMenuStateForOtherTaxes === 'out' ? 'in' : 'out';
        this.toggleBodyClass();
    }

    public calculateOtherTaxes(modal: SalesOtherTaxesModal, index: number = null) {
        let transaction: TransactionVM = this.blankLedger.transactions[index];
        if (index !== null) {
            transaction = this.blankLedger.transactions[index];
        } else {
            transaction = this.currentTxn;
        }
        let taxableValue = 0;
        let companyTaxes: TaxResponse[] = [];
        let totalTaxes = 0;

        this.isAdvanceReceiptWithTds = this.isAdvanceReceipt;

        this.companyTaxesList$.pipe(take(1)).subscribe(taxes => companyTaxes = taxes);
        if (!transaction) {
            return;
        }

        if (modal?.appliedOtherTax && modal?.appliedOtherTax?.uniqueName) {
            const amount = (this.isAdvanceReceipt) ? transaction.advanceReceiptAmount : transaction.amount;
            let tax = companyTaxes.find(ct => ct?.uniqueName === modal?.appliedOtherTax?.uniqueName);
            if (tax) {
                this.blankLedger.otherTaxType = ['tcsrc', 'tcspay'].includes(tax.taxType) ? 'tcs' : 'tds';
                totalTaxes += tax.taxDetail[0].taxValue;
            }

            if (this.generalService.isReceiptPaymentEntry(this.activeAccount, this.currentTxn.selectedAccount, this.blankLedger.voucherType)) {
                let mainTaxPercentage = this.currentTxn.taxesVm?.filter(p => p.isChecked)?.reduce((sum, current) => sum + current.amount, 0);
                let tdsTaxPercentage = null;
                let tcsTaxPercentage = null;
                let totalAmount = Number(this.blankLedger.compoundTotal);

                if (this.blankLedger.otherTaxType === "tcs") {
                    tcsTaxPercentage = totalTaxes;
                    this.isAdvanceReceiptWithTds = false;
                } else if (this.blankLedger.otherTaxType === "tds") {
                    tdsTaxPercentage = totalTaxes;
                    this.isAdvanceReceiptWithTds = false;
                }

                taxableValue = this.generalService.getReceiptPaymentOtherTaxAmount(modal.tcsCalculationMethod, totalAmount, mainTaxPercentage, tdsTaxPercentage, tcsTaxPercentage);
                this.currentTxn.advanceReceiptAmount = taxableValue;
                this.totalForTax = taxableValue;
                if (modal.tcsCalculationMethod === SalesOtherTaxesCalculationMethodEnum.OnTotalAmount) {
                    taxableValue = (taxableValue + transaction.tax);
                }
            } else {
                if (modal.tcsCalculationMethod === SalesOtherTaxesCalculationMethodEnum.OnTaxableAmount) {
                    taxableValue = Number(amount) - transaction.discount;
                } else if (modal.tcsCalculationMethod === SalesOtherTaxesCalculationMethodEnum.OnTotalAmount) {
                    let rawAmount = Number(amount) - transaction.discount;
                    taxableValue = (rawAmount + transaction.tax);
                }
            }
            this.blankLedger.tdsTcsTaxesSum = giddhRoundOff(((taxableValue * totalTaxes) / 100), this.giddhBalanceDecimalPlaces);
            this.blankLedger.otherTaxModal = modal;
            this.blankLedger.tcsCalculationMethod = modal.tcsCalculationMethod;
            this.blankLedger.otherTaxesSum = giddhRoundOff((this.blankLedger.tdsTcsTaxesSum), this.giddhBalanceDecimalPlaces);
        } else {
            this.blankLedger.otherTaxesSum = 0;
            this.blankLedger.tdsTcsTaxesSum = 0;
            this.blankLedger.isOtherTaxesApplicable = false;
            this.blankLedger.otherTaxModal = new SalesOtherTaxesModal();
        }
    }

    public currencyChange() {
        let rate = 0;
        if (Number(this.blankLedger?.exchangeRate)) {
            rate = 1 / this.blankLedger?.exchangeRate;
        }
        if (this.blankLedger) {
            this.blankLedger.exchangeRate = rate;
        }
        if (this.blankLedger.selectedCurrencyToDisplay === 0) {
            // Currency changed to account currency (currency different from base currency of company)
            this.blankLedger.selectedCurrencyToDisplay = 1;
            this.blankLedger.valuesInAccountCurrency = false;
        } else {
            // Currency changed to company currency
            this.blankLedger.selectedCurrencyToDisplay = 0;
            this.blankLedger.valuesInAccountCurrency = true;
        }
        this.selectedCurrency = this.blankLedger.selectedCurrencyToDisplay;
        this.swapEntries(NEW_LEDGER_ENTRIES);

        setTimeout(() => {
            this.assignPrefixAndSuffixForCurrency();
            this.detectChanges();
        }, 100);
    }

    public exchangeRateChanged() {
        if (this.blankLedger) {
            this.blankLedger.exchangeRate = Number(this.blankLedger?.exchangeRate) || 0;
        }
        if (this.currentTxn.inventory && this.currentTxn.inventory.unit && this.currentTxn.unitRate) {
            const stock = this.currentTxn.unitRate.find(rate => {
                return rate.stockUnitCode === this.currentTxn.inventory.unit.code;
            });
            const stockRate = stock ? stock.rate : 0;
            this.currentTxn.inventory.rate = Number((stockRate / this.blankLedger?.exchangeRate).toFixed(this.ratePrecision));
            this.changePrice(this.currentTxn.inventory.rate);
        } else {
            this.amountChanged();
            this.calculateTotal();
        }
    }

    /**
     * Calculates conversion rate
     *
     * @param {*} baseModel Value to be converted
     * @param {number} [customDecimalPlaces] Optional custom decimal places (required for Rate as 4 digits are required for rate)
     * @returns Converted rate
     * @memberof NewLedgerEntryPanelComponent
     */
    public calculateConversionRate(baseModel: any, customDecimalPlaces?: number): number {
        if (!baseModel || !this.blankLedger?.exchangeRate) {
            return 0;
        }
        return giddhRoundOff(baseModel * Number(this.blankLedger?.exchangeRate), (customDecimalPlaces) ? customDecimalPlaces : this.giddhBalanceDecimalPlaces);
    }

    /**
     * Swaps provided entries value with their converted values (obtained by multiplying exchange rate with
     * actual value)
     *
     * @param {Array<any>} entryKeys Arrays of keys to be swapped
     * @memberof NewLedgerEntryPanelComponent
     */
    public swapEntries(entryKeys: Array<any>): void {
        this.isExchangeRateSwapped = true;
        if (this.currentTxn.inventory) {
            // Swap the unit rate and converted rate
            let rate = this.currentTxn.inventory.unit.rate;
            this.currentTxn.inventory.unit.rate = this.currentTxn.convertedRate;
            this.currentTxn.convertedRate = rate;
        }

        // Swap the provided key value pairs
        if (entryKeys && entryKeys.length > 0) {
            entryKeys.forEach((entry: any) => {
                let value = this.currentTxn[entry[0]];
                this.currentTxn[entry[0]] = this.currentTxn[entry[1]];
                this.currentTxn[entry[1]] = value;
            });
        }
        if (this.discountControl) {
            this.discountControl.discountTotal = this.currentTxn.discount;
        }
        if (this.taxControll) {
            this.taxControll.taxTotalAmount = this.currentTxn.tax;
        }
        setTimeout(() => {
            // Set it to false after some time, done as (ngModelChange) is triggered twice for amount field
            this.isExchangeRateSwapped = false;
        }, 300);
    }

    /**
     * This will reset the state of checkbox and ngModel to make sure we update it based on user confirmation later
     *
     * @param {*} event
     * @memberof NewLedgerEntryPanelComponent
     */
    public changeRcmCheckboxState(event: any): void {
        this.isRcmEntry = !this.isRcmEntry;
        this.toggleRcmCheckbox(event, 'checkbox');
    }

    /**
     * Toggle the RCM checkbox based on user confirmation
     *
     * @param {*} event Click event
     * @memberof NewLedgerEntryPanelComponent
     */
    public toggleRcmCheckbox(event: any, element: string): void {
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
     * @memberof NewLedgerEntryPanelComponent
     */
    public handleRcmChange(action: string): void {
        if (action === this.commonLocaleData?.app_yes) {
            // Toggle the state of RCM as user accepted the terms of RCM modal
            this.isRcmEntry = !this.isRcmEntry;
            this.rcmCheckbox['checked'] = this.isRcmEntry;
            this.calculateTotal();
        }
        this.currentTxn['subVoucher'] = this.isRcmEntry ? SubVoucher.ReverseCharge : '';
        this.cdRef.detectChanges();
    }

    /**
     * Handles the advance receipt change by appending the advance receipt
     * in subvoucher of current transaction
     *
     * @memberof NewLedgerEntryPanelComponent
     */
    public handleAdvanceReceiptChange(): void {
        this.currentTxn['subVoucher'] = this.isAdvanceReceipt ? SubVoucher.AdvanceReceipt : this.isRcmEntry ? SubVoucher.ReverseCharge : '';
        this.shouldShowAdvanceReceiptMandatoryFields = this.isAdvanceReceipt;
        this.calculateTax();
    }

    /**
     * Receipt adjustment handler
     *
     * @memberof NewLedgerEntryPanelComponent
     */
    public handleVoucherAdjustment(): void {
        if (this.isAdjustReceiptSelected || this.isAdjustAdvanceReceiptSelected ||
            this.isAdjustVoucherSelected) {
            this.prepareAdjustVoucherConfiguration();
            this.openAdjustPaymentModal();
            this.blankLedger.generateInvoice = true;
        } else {
            this.removeAdjustment();
        }
    }

    /**
     * Toggle Tourist scheme checkbox then reset passport number
     *
     * @memberof NewLedgerEntryPanelComponent
     */
    public touristSchemeApplicableToggle(): void {
        this.blankLedger.passportNumber = '';
    }

    /**
     * To make value alphanumeric
     *
     * @param {*} event Template ref to get value
     * @memberof NewLedgerEntryPanelComponent
     */
    public allowAlphanumericChar(event: any): void {
        if (event && event.value) {
            this.blankLedger.passportNumber = this.generalService.allowAlphanumericChar(event.value);
        }
    }

    /**
     * Payment adjustment handler
     *
     * @param {{ adjustVoucherData: VoucherAdjustments, adjustPaymentData: AdjustAdvancePaymentModal}} event Adjustment handler
     * @memberof NewLedgerEntryPanelComponent
     */
    public getAdjustedPaymentData(event: { adjustVoucherData: VoucherAdjustments, adjustPaymentData: AdjustAdvancePaymentModal }): void {
        if (event && event.adjustPaymentData && event.adjustVoucherData) {
            const adjustments = cloneDeep(event.adjustVoucherData.adjustments);
            if (adjustments && adjustments.length > 0) {
                adjustments.forEach(adjustment => {
                    adjustment.voucherNumber = this.generalService.getVoucherNumberLabel(adjustment.voucherType, adjustment.voucherNumber, this.commonLocaleData);
                });
            }
            this.currentTxn.voucherAdjustments = {
                adjustments,
                totalAdjustmentAmount: event.adjustPaymentData.totalAdjustedAmount,
                tdsTaxUniqueName: null,
                tdsAmount: null,
                description: null
            };
            if (!adjustments || !adjustments.length) {
                // No adjustments done clear the adjustment checkbox
                if (this.currentTxn['subVoucher'] === SubVoucher.AdvanceReceipt) {
                    this.isAdjustAdvanceReceiptSelected = false;
                } else {
                    this.isAdjustReceiptSelected = false;
                }
                this.isAdjustVoucherSelected = false;

                if (!this.selectedInvoiceForCreditNote) {
                    this.blankLedger.generateInvoice = this.manualGenerateVoucherChecked;
                }
            } else {
                this.blankLedger.generateInvoice = true;
            }
        }

        this.adjustmentDialogRef.close();
    }

    /**
     * Close voucher adjustment modal handler
     *
     * @param {{ adjustVoucherData: VoucherAdjustments, adjustPaymentData: AdjustAdvancePaymentModal}} event Close event
     * @memberof NewLedgerEntryPanelComponent
     */
    public closeAdjustmentModal(event: { adjustVoucherData: VoucherAdjustments, adjustPaymentData: AdjustAdvancePaymentModal }): void {
        if (!this.currentTxn?.voucherAdjustments || !this.currentTxn?.voucherAdjustments?.adjustments?.length) {
            if (this.currentTxn['subVoucher'] === SubVoucher.AdvanceReceipt) {
                this.isAdjustAdvanceReceiptSelected = false;
            } else {
                this.isAdjustReceiptSelected = false;
            }
            this.isAdjustVoucherSelected = false;

            if (!this.selectedInvoiceForCreditNote) {
                this.blankLedger.generateInvoice = this.manualGenerateVoucherChecked;
            }
        }
        this.adjustmentDialogRef.close();
    }

    /**
     * Removes the adjustment handler
     *
     * @private
     * @memberof NewLedgerEntryPanelComponent
     */
    private removeAdjustment(): void {
        this.currentTxn.voucherAdjustments = null;
        this.isAdjustAdvanceReceiptSelected = false;
        this.isAdjustReceiptSelected = false;
        this.isAdjustVoucherSelected = false;

        if (!this.selectedInvoiceForCreditNote) {
            this.blankLedger.generateInvoice = this.manualGenerateVoucherChecked;
        }
    }

    /**
     * Assigns the prefix and suffix based on currency toggle button present in this
     * component
     *
     * @private
     * @memberof NewLedgerEntryPanelComponent
     */
    private assignPrefixAndSuffixForCurrency(): void {
        const isPrefixAppliedForCurrency = !(['AED'].includes(this.selectedCurrency === 0 ? this.baseCurrencyDetails?.code : this.foreignCurrencyDetails?.code));
        this.selectedPrefixForCurrency = isPrefixAppliedForCurrency ? this.selectedCurrency === 0 ? this.baseCurrencyDetails?.symbol : this.foreignCurrencyDetails?.symbol : '';
        this.selectedSuffixForCurrency = isPrefixAppliedForCurrency ? '' : this.selectedCurrency === 0 ? this.baseCurrencyDetails?.symbol : this.foreignCurrencyDetails?.symbol;
    }

    /**
     * Validates the taxes
     *
     * @private
     * @returns {boolean} True, if taxes are applied
     * @memberof NewLedgerEntryPanelComponent
     */
    private validateTaxes(): boolean {
        const taxes = [...this.currentTxn.taxesVm?.filter(p => p.isChecked).map(p => p?.uniqueName)];
        return taxes && taxes.length > 0;
    }


    /**
    * Merges the involved accounts (current ledger account and particular account) taxes
    *
    * @private
    * @param {Array<string>} firstAccountTaxes Taxes array of first account
    * @param {Array<string>} secondAccountTaxes Taxes array of second account
    * @returns {Array<string>} Merged taxes array of unique taxes from both accounts
    * @memberof NewLedgerEntryPanelComponent
    */
    private mergeInvolvedAccountsTaxes(firstAccountTaxes: Array<string>, secondAccountTaxes: Array<string>): Array<string> {
        const mergedAccountTaxes = (firstAccountTaxes) ? [...firstAccountTaxes] : [];
        if (secondAccountTaxes) {
            secondAccountTaxes.reverse().forEach((tax: string) => {
                if (!mergedAccountTaxes.includes(tax)) {
                    mergedAccountTaxes.push(tax);
                }
            });

        }
        return mergedAccountTaxes;
    }

    /**
     * Prepares the voucher adjustment configuration
     *
     * @private
     * @memberof NewLedgerEntryPanelComponent
     */
    private prepareAdjustVoucherConfiguration(): void {
        this.adjustVoucherConfiguration = {
            voucherDetails: {
                voucherDate: this.blankLedger.entryDate,
                tcsTotal: 0,
                tdsTotal: 0,
                balanceDue: this.blankLedger.compoundTotal,
                grandTotal: this.blankLedger.compoundTotal,
                customerName: this.currentTxn.selectedAccount ? this.currentTxn.selectedAccount.name : '',
                customerUniquename: this.currentTxn.selectedAccount ? this.currentTxn.selectedAccount.uniqueName : '',
                totalTaxableValue: this.blankLedger.compoundTotal,
                subTotal: this.blankLedger.compoundTotal,
                exchangeRate: this.blankLedger?.exchangeRate ?? 1
            },
            accountDetails: {
                currencySymbol: enableVoucherAdjustmentMultiCurrency ? this.baseCurrencyDetails?.symbol ?? this.blankLedger.baseCurrencyToDisplay?.symbol ?? '' : this.blankLedger.baseCurrencyToDisplay?.symbol,
                currencyCode: enableVoucherAdjustmentMultiCurrency ? this.baseCurrencyDetails?.code ?? this.blankLedger.baseCurrencyToDisplay?.code ?? '' : this.blankLedger.baseCurrencyToDisplay?.code
            },
            activeAccountUniqueName: this.activeAccount?.uniqueName
        };
    }

    /**
     * To open advance receipts adjustment pop up
     *
     * @private
     * @memberof NewLedgerEntryPanelComponent
     */
    private openAdjustPaymentModal(): void {
        if (this.voucherApiVersion === 2) {
            this.invoiceListRequestParams = { particularAccount: this.currentTxn?.selectedAccount, voucherType: this.blankLedger.voucherType, ledgerAccount: this.activeAccount };
        }
        this.adjustmentDialogRef = this.dialog.open(this.adjustPaymentModal, {
            width: '980px',
            panelClass: 'container-modal-class'
        });
    }

    /**
     * To assign updated account details
     *
     * @param {(AccountResponse | AccountResponseV2)} accountDetails
     * @memberof NewLedgerEntryPanelComponent
     */
    public assignUpdateActiveAccount(accountDetails: AccountResponse | AccountResponseV2): void {
        this.accountOtherApplicableDiscount = [];
        this.activeAccount = accountDetails;
        let parentAcc = (accountDetails?.parentGroups?.length > 0) ? accountDetails.parentGroups[0].uniqueName : "";
        let incomeAccArray = ['revenuefromoperations', 'otherincome'];
        let expensesAccArray = ['operatingcost', 'indirectexpenses'];
        let assetsAccArray = ['assets'];
        let incomeAndExpensesAccArray = [...incomeAccArray, ...expensesAccArray, ...assetsAccArray];
        if (incomeAndExpensesAccArray.indexOf(parentAcc) > -1) {
            let appTaxes = [];
            if (accountDetails && accountDetails.applicableTaxes && accountDetails.applicableTaxes.length > 0) {
                accountDetails.applicableTaxes.forEach(app => appTaxes.push(app?.uniqueName));
            }
            this.currentAccountApplicableTaxes = appTaxes;
        }
        if (accountDetails.country && accountDetails.country.countryName) {
            this.activeAccountCountryName = accountDetails.country.countryName;
        }
        if (accountDetails.applicableDiscounts && accountDetails.applicableDiscounts.length) {
            this.accountOtherApplicableDiscount = accountDetails.applicableDiscounts;
        } else if (accountDetails.inheritedDiscounts && accountDetails.inheritedDiscounts.length && (!this.accountOtherApplicableDiscount || !this.accountOtherApplicableDiscount.length)) {
            this.accountOtherApplicableDiscount.push(...accountDetails.inheritedDiscounts[0].applicableDiscounts);
        }
        if (accountDetails.otherApplicableTaxes && accountDetails.otherApplicableTaxes.length) {
            accountDetails.applicableTaxes.unshift(accountDetails.otherApplicableTaxes[0]);
        }
        this.accountOtherApplicableDiscount.map(item => item.isActive = true);
    }

    /**
     * To prepare pre applied discount for current transactions
     *
     * @memberof NewLedgerEntryPanelComponent
     */
    public preparePreAppliedDiscounts(): void {
        if (this.currentTxn && this.currentTxn.selectedAccount && this.currentTxn.selectedAccount.accountApplicableDiscounts && this.currentTxn.selectedAccount.accountApplicableDiscounts.length) {
            this.currentTxn.selectedAccount.accountApplicableDiscounts.map(item => item.isActive = true);
            this.currentTxn.discounts.map(item => { item.isActive = false });
            if (this.currentTxn.discounts && this.currentTxn.discounts.length === 1) {
                setTimeout(() => {
                    this.currentTxn.selectedAccount.accountApplicableDiscounts.forEach(element => {
                        this.currentTxn.discounts.map(item => {
                            if (element?.uniqueName === item?.discountUniqueName) {
                                item.isActive = true;
                            }
                            return item;
                        });
                    });
                }, 300);
            } else {
                this.currentTxn.selectedAccount.accountApplicableDiscounts.forEach(element => {
                    this.currentTxn.discounts.map(item => {
                        if (element?.uniqueName === item?.discountUniqueName) {
                            item.isActive = true;
                        }
                        return item;
                    });
                });
            }
        } else if (this.accountOtherApplicableDiscount && this.accountOtherApplicableDiscount.length) {
            this.currentTxn.discounts.map(item => { item.isActive = false });
            this.accountOtherApplicableDiscount.forEach(element => {
                this.currentTxn.discounts.map(item => {
                    if (element?.uniqueName === item?.discountUniqueName) {
                        item.isActive = true;
                    }
                    return item;
                });
            });
        } else {
            this.currentTxn.discounts.map(item => {
                item.isActive = false;
                return item;
            });
            this.currentTxn.discount = 0;
        }
        /** if percent or value type discount applied */
        if (this.currentTxn.discounts && this.currentTxn.discounts[0]) {
            if (this.currentTxn.discounts[0].amount) {
                this.currentTxn.discounts[0].isActive = true;
            } else {
                this.currentTxn.discounts[0].isActive = false;
            }
        }
        if (this.discountControl) {
            if (this.discountControl.discountAccountsDetails) {
                this.discountControl.discountAccountsDetails = this.currentTxn.discounts;
                this.currentTxn.discount = giddhRoundOff(this.discountControl.generateTotal());
                this.discountControl.discountTotal = this.currentTxn.discount;
            }
        }
    }

    /**
     * This will emit the other taxes
     *
     * @memberof NewLedgerEntryPanelComponent
     */
    public emitOtherTaxes(): void {
        this.saveOtherTax.emit(this.blankLedger);
    }

    /**
     * Toggles the more detail section
     *
     * @memberof NewLedgerEntryPanelComponent
     */
    public toggleMoreDetail(): void {
        this.isMoreDetailsOpen = !this.isMoreDetailsOpen;
        this.moreDetailOpen.emit(this.isMoreDetailsOpen);
    }

    /**
     * Get Invoice list for credit note
     *
     * @memberof NewLedgerEntryPanelComponent
     */
    public loadInvoiceListsForCreditNote(): void {
        const voucherType = this.blankLedger.voucherType;
        if (voucherType && this.currentTxn?.selectedAccount?.uniqueName && this.activeAccount?.uniqueName) {
            let request;

            let activeAccount = null;
            this.activeAccount$.pipe(take(1)).subscribe(account => activeAccount = account);

            if (this.voucherApiVersion === 2) {
                request = this.adjustmentUtilityService.getInvoiceListRequest({ particularAccount: this.currentTxn?.selectedAccount, voucherType: voucherType, ledgerAccount: activeAccount });
            } else {
                request = {
                    accountUniqueNames: [this.currentTxn?.selectedAccount?.uniqueName, this.activeAccount?.uniqueName],
                    voucherType
                };
            }

            // don't call api if it's invalid case
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
            if (this.blankLedger && this.blankLedger.entryDate) {
                if (typeof this.blankLedger.entryDate === 'string') {
                    date = this.blankLedger.entryDate;
                } else {
                    date = dayjs(this.blankLedger.entryDate).format(GIDDH_DATE_FORMAT);
                }
            }

            this.ledgerService.getInvoiceListsForCreditNote(request, date).pipe(takeUntil(this.destroyed$)).subscribe((response: any) => {
                if (response && response.body) {
                    let items = [];
                    if (response.body.results) {
                        items = response.body.results;
                    } else if (response.body.items) {
                        items = response.body.items;
                    }

                    items?.forEach(invoice => {
                        invoice.voucherNumber = this.generalService.getVoucherNumberLabel(invoice?.voucherType, invoice?.voucherNumber, this.commonLocaleData);

                        this.invoiceList.push({ label: invoice?.voucherNumber ? invoice?.voucherNumber : '-', value: invoice?.uniqueName, additional: invoice })
                    });

                    this.invoiceList$ = observableOf(this.invoiceList);

                    this.cdRef.detectChanges();

                } else if (request.number) {
                    this.resetInvoiceList();
                }
            });
        }
    }

    /**
     * Resets invoice list and current page
     *
     * @memberof NewLedgerEntryPanelComponent
     */
    public resetInvoiceList(): void {
        this.invoiceList = [];
        this.invoiceList$ = observableOf([]);
        this.referenceVouchersCurrentPage = 2;
    }

    /**
     * Returns boolean if export case is valid/invalid
     *
     * @returns {boolean}
     * @memberof NewLedgerEntryPanelComponent
     */
    public checkIfExportIsValid(): boolean {
        let activeAccount = null;
        this.activeAccount$.pipe(take(1)).subscribe(account => activeAccount = account);

        const data = {
            isMultiCurrency: this.isLedgerAccountAllowsMultiCurrency,
            voucherType: this.blankLedger.voucherType,
            particularAccount: this.currentTxn?.selectedAccount,
            ledgerAccount: activeAccount
        };

        return this.ledgerUtilityService.checkIfExportIsValid(data);
    }
}
