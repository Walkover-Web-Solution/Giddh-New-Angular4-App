import { animate, state, style, transition, trigger } from '@angular/animations';
import {
    AfterViewChecked,
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
    ViewChild,
} from '@angular/core';
import { isAndroidCordova, isIOSCordova } from '@giddh-workspaces/utils';
import { FileChooser } from '@ionic-native/file-chooser/ngx';
import { IOSFilePicker } from '@ionic-native/file-picker/ngx';
import { FileTransfer } from '@ionic-native/file-transfer/ngx';
import { select, Store } from '@ngrx/store';
import { ResizedEvent } from 'angular-resize-event';
import {
    Configuration,
    HIGH_RATE_FIELD_PRECISION,
    RATE_FIELD_PRECISION,
    SubVoucher,
} from 'apps/web-giddh/src/app/app.constant';
import { AccountResponse, AccountResponseV2 } from 'apps/web-giddh/src/app/models/api-models/Account';
import { BsDatepickerDirective } from 'ngx-bootstrap/datepicker';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { PopoverDirective } from 'ngx-bootstrap/popover';
import { UploaderOptions, UploadInput, UploadOutput } from 'ngx-uploader';
import { createSelector } from 'reselect';
import { BehaviorSubject, Observable, of as observableOf, ReplaySubject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';

import {
    CONFIRMATION_ACTIONS,
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
import { IDiscountList } from '../../../models/api-models/SettingsDiscount';
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
import { LedgerDiscountComponent } from '../ledgerDiscount/ledgerDiscount.component';

/** New ledger entries */
const NEW_LEDGER_ENTRIES = [
    ['amount', 'convertedAmount'],
    ['discount', 'convertedDiscount'],
    ['tax', 'convertedTax'],
    ['total', 'convertedTotal'],
];

@Component({
    selector: 'new-ledger-entry-panel',
    templateUrl: 'newLedgerEntryPanel.component.html',
    styleUrls: ['./newLedgerEntryPanel.component.scss'],
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
export class NewLedgerEntryPanelComponent implements OnInit, OnDestroy, OnChanges, AfterViewChecked, AfterViewInit {
    @Input() public blankLedger: BlankLedgerVM;
    @Input() public currentTxn: TransactionVM = null;
    @Input() public needToReCalculate: BehaviorSubject<boolean>;
    @Input() public showTaxationDiscountBox: boolean = true;
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
    @ViewChild('webFileInput', {static: true}) public webFileInput: ElementRef;
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
    @ViewChild(BsDatepickerDirective, { static: true }) public datepickers: BsDatepickerDirective;

    @ViewChild('deleteAttachedFileModal', {static: true}) public deleteAttachedFileModal: ModalDirective;
    @ViewChild('discount', {static: false}) public discountControl: LedgerDiscountComponent;
    @ViewChild('tax', {static: false}) public taxControll: TaxControlComponent;

    /** RCM popup instance */
    @ViewChild('rcmPopup', {static: false}) public rcmPopup: PopoverDirective;

    public sourceWarehouse: true;
    public uploadInput: EventEmitter<UploadInput>;
    public fileUploadOptions: UploaderOptions;
    public discountAccountsList$: Observable<IDiscountList[]>;
    public companyTaxesList$: Observable<TaxResponse[]>;
    public sessionKey$: Observable<string>;
    public companyName$: Observable<string>;
    public voucherTypeList: Observable<IOption[]>;
    public showAdvanced: boolean;
    public dateMask = [/\d/, /\d/, '-', /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/];
    public isFileUploading: boolean = false;
    public isLedgerCreateInProcess$: Observable<boolean>;
    // bank map eledger related
    @ViewChild('confirmBankTxnMapModal', {static: true}) public confirmBankTxnMapModal: ModalDirective;
    public matchingEntriesData: ReconcileResponse[] = [];
    public showMatchingEntries: boolean = false;
    public mapBodyContent: string;
    public selectedItemToMap: ReconcileResponse;
    public tags$: Observable<TagRequest[]>;
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
    public totalTdElementWidth: number = 0;
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
    public allowedSelectionOfAType: any = {type: [], count: 1};
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
    @ViewChild('adjustPaymentModal', { static: true }) public adjustPaymentModal: ModalDirective;

    // private below
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
    /** True, if exchange rate is swapped */
    private isExchangeRateSwapped: boolean = false;
    /** True if entry value is calculated inclusively */
    private isInclusiveEntry: boolean = false;

    constructor(private store: Store<AppState>,
        private cdRef: ChangeDetectorRef,
        private generalService: GeneralService,
        private _ledgerService: LedgerService,
        private _loaderService: LoaderService,
        private settingsUtilityService: SettingsUtilityService,
        private _toasty: ToasterService
    ) {
        this.discountAccountsList$ = this.store.pipe(select(p => p.settings.discount.discountList), takeUntil(this.destroyed$));
        this.companyTaxesList$ = this.store.pipe(select(p => p.company && p.company.taxes), takeUntil(this.destroyed$));
        this.sessionKey$ = this.store.pipe(select(p => p.session.user.session.id), takeUntil(this.destroyed$));
        this.companyName$ = this.store.pipe(select(p => p.session.companyUniqueName), takeUntil(this.destroyed$));
        this.activeAccount$ = this.store.pipe(select(p => p.ledger.account), takeUntil(this.destroyed$));
        this.isLedgerCreateInProcess$ = this.store.pipe(select(p => p.ledger.ledgerCreateInProcess), takeUntil(this.destroyed$));
        this.voucherTypeList = observableOf([{
            label: 'Sales',
            value: 'sal'
        }, {
            label: 'Purchases',
            value: 'pur'
        }, {
            label: 'Receipt',
            value: 'rcpt'
        }, {
            label: 'Payment',
            value: 'pay'
        }, {
            label: 'Journal',
            value: 'jr'
        }, {
            label: 'Contra',
            value: 'cntr'
        }, {
            label: 'Debit Note',
            value: 'debit note'
        }, {
            label: 'Credit Note',
            value: 'credit note'
        }, {
            label: 'Advance Receipt',
            value: 'advance-receipt',
            subVoucher: SubVoucher.AdvanceReceipt
        }]);
    }

    public ngOnInit() {
        this.showAdvanced = false;
        this.uploadInput = new EventEmitter<UploadInput>();
        this.fileUploadOptions = {concurrency: 0};
        this.currentTxn.advanceReceiptAmount = this.currentTxn.amount;
        this.activeAccount$.subscribe(acc => {
            if (acc) {
                this.assignUpdateActiveAccount(acc);
            }
        });
        this.store.pipe(select(stateAccount => stateAccount.groupwithaccounts.activeAccount),takeUntil(this.destroyed$)).subscribe(response => {
            if (response) {
                this.assignUpdateActiveAccount(response);
            }
        });

        this.store.pipe(select(appState => appState.warehouse.warehouses), take(1)).subscribe((warehouses: any) => {
            if (warehouses) {
                const warehouseData = this.settingsUtilityService.getFormattedWarehouseData(warehouses.results);
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

        this.tags$ = this.store.pipe(select(createSelector([(st: AppState) => st.settings.tags], (tags) => {
            if (tags && tags.length) {
                _.map(tags, (tag) => {
                    tag.label = tag.name;
                    tag.value = tag.name;
                });
                return _.orderBy(tags, 'name');
            }
        })), takeUntil(this.destroyed$));

        // for tcs and tds identification
        if (this.tcsOrTds === 'tcs') {
            this.tdsTcsTaxTypes = ['tcspay', 'tcsrc'];
        } else {
            this.tdsTcsTaxTypes = ['tdspay', 'tdsrc'];
        }

        this.store.pipe(select(s => s.company && s.company.taxes), takeUntil(this.destroyed$)).subscribe(res => {
            this.companyTaxesList = res || [];
            if(this.companyTaxesList && this.companyTaxesList.length > 0) {
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
        this.isRcmEntry = (this.currentTxn) ? this.currentTxn['subVoucher'] === SubVoucher.ReverseCharge : false;
        this.shouldShowAdvanceReceiptMandatoryFields = this.isAdvanceReceipt;
        // this.baseCurrencyToDisplay = this.selectedCurrency === 0 ? cloneDeep(this.baseCurrencyDetails) : cloneDeep(this.foreignCurrencyDetails);
        // this.foreignCurrencyToDisplay = this.selectedCurrency === 0 ? cloneDeep(this.foreignCurrencyDetails) : cloneDeep(this.baseCurrencyDetails);
    }

    @HostListener('click', ['$event'])
    public clicked(e) {
        if (this.sh && e.path && !this.sh.ele.nativeElement.contains(e.path[3])) {
            this.sh.hide();
        }
    }

    public ngOnChanges(changes: SimpleChanges): void {
        if (this.currentTxn && this.currentTxn.selectedAccount) {
            this.currentTxn.advanceReceiptAmount = giddhRoundOff(this.currentTxn.amount, this.giddhBalanceDecimalPlaces);
            if (!this.currentTxn.selectedAccount.stock) {
                this.selectedWarehouse = String(this.defaultWarehouse);
            }
            this.calculatePreAppliedTax();
            this.preparePreAppliedDiscounts();

            if (this.blankLedger.otherTaxModal.appliedOtherTax && this.blankLedger.otherTaxModal.appliedOtherTax.uniqueName) {
                this.blankLedger.isOtherTaxesApplicable = true;
            }
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
            activeAccountTaxes = this.activeAccount.applicableTaxes.map((tax) => tax.uniqueName);
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

        if(!this.blankLedger.otherTaxModal) {
            this.blankLedger.otherTaxModal = new SalesOtherTaxesModal();
        }

        if(this.taxListForStock && this.taxListForStock.length > 0) {
            this.taxListForStock.forEach(tl => {
                let tax = companyTaxes.find(f => f.uniqueName === tl);
                if (tax) {
                    switch (tax.taxType) {
                        case 'tcsrc':
                        case 'tcspay':
                        case 'tdsrc':
                        case 'tdspay':
                            this.blankLedger.otherTaxModal.appliedOtherTax = {
                                name: tax.name,
                                uniqueName: tax.uniqueName
                            };
                            this.blankLedger.isOtherTaxesApplicable = true;
                            break;
                        default:
                            appliedTaxes.push(tax.uniqueName);
                    }
                }
            });
        }
        this.taxListForStock = appliedTaxes;
    }

    public ngAfterViewInit(): void {
        this.needToReCalculate.subscribe(a => {
            if (a) {
                this.amountChanged();
                this.calculateTotal();
            }
        });
        this.cdRef.markForCheck();
    }

    public onResized(event: ResizedEvent) {
        this.totalTdElementWidth = event.newWidth + 10;
    }

    public ngAfterViewChecked() {
        // this.cdRef.markForCheck();
    }

    public addToDrOrCr(type: string, e: Event) {
        e.stopPropagation();
        if (this.isRcmEntry && !this.validateTaxes()) {
            if (this.taxControll && this.taxControll.taxInputElement && this.taxControll.taxInputElement.nativeElement) {
                // Taxes are mandatory for RCM and Advance Receipt entries
                this.taxControll.taxInputElement.nativeElement.classList.add('error-box');
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
        if(this.accountOtherApplicableDiscount && this.accountOtherApplicableDiscount.length > 0) {
            this.accountOtherApplicableDiscount.forEach(item => {
                if (item && event.discount && item.uniqueName === event.discount.discountUniqueName) {
                    item.isActive = event.isActive.target.checked;
                }
            });
        }
        if (this.currentTxn && this.currentTxn.selectedAccount && this.currentTxn.selectedAccount.accountApplicableDiscounts) {
            this.currentTxn.selectedAccount.accountApplicableDiscounts.forEach(item => {
                if (item && event.discount && item.uniqueName === event.discount.discountUniqueName) {
                    item.isActive = event.isActive.target.checked;
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
        this.currentTxn.tax = giddhRoundOff(
            this.generalService.calculateInclusiveOrExclusiveTaxes(this.isAdvanceReceipt, this.currentTxn.amount, totalPercentage, this.currentTxn.discount),
            this.giddhBalanceDecimalPlaces);
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
                        let discountItem = this.accountOtherApplicableDiscount.find(element => element.uniqueName === item.discountUniqueName);
                        if (discountItem && discountItem.uniqueName) {
                            item.isActive = discountItem.isActive;
                        }
                    });
                }

                if (this.isAdvanceReceipt) {
                    this.currentTxn.advanceReceiptAmount = giddhRoundOff((this.currentTxn.amount - this.currentTxn.tax), this.giddhBalanceDecimalPlaces);
                    this.currentTxn.total = giddhRoundOff((this.currentTxn.advanceReceiptAmount + this.currentTxn.tax), this.giddhBalanceDecimalPlaces);
                    this.totalForTax = this.currentTxn.total;
                } else {
                    let total = (this.currentTxn.amount - this.currentTxn.discount) || 0;
                    this.totalForTax = total;
                    this.currentTxn.total = giddhRoundOff((total + this.currentTxn.tax), this.giddhBalanceDecimalPlaces);
                }
                this.currentTxn.convertedTotal = this.calculateConversionRate(this.currentTxn.total);
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
        this.calculateOtherTaxes(this.blankLedger.otherTaxModal);
        this.calculateCompoundTotal();
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
            this.currentTxn.convertedAmount = this.calculateConversionRate(this.currentTxn.amount);
        }

        if (this.shouldShowRcmTaxableAmount) {
            this.currentTxn.reverseChargeTaxableAmount = this.generalService.convertExponentialToNumber(this.currentTxn.amount * 20);;
        }

        if (this.isAmountFirst || this.isTotalFirts) {
            return;
        } else {
            this.isAmountFirst = true;
            // this.currentTxn.isInclusiveTax = false;
        }
    }

    public changePrice(val: string) {
        if (!this.isExchangeRateSwapped && !this.isInclusiveEntry) {
            this.currentTxn.inventory.unit.rate = giddhRoundOff(Number(val), this.ratePrecision);
            this.currentTxn.inventory.unit.highPrecisionRate = this.currentTxn.inventory.unit.rate;
            this.currentTxn.convertedRate = this.calculateConversionRate(this.currentTxn.inventory.unit.rate, this.ratePrecision);

            this.currentTxn.amount = giddhRoundOff((this.currentTxn.inventory.unit.rate * this.currentTxn.inventory.quantity), this.giddhBalanceDecimalPlaces);
            this.currentTxn.convertedAmount = this.calculateConversionRate(this.currentTxn.amount);

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
        this.currentTxn.convertedAmount = this.calculateConversionRate(this.currentTxn.amount);

        // calculate discount on change of price
        if (this.discountControl) {
            this.discountControl.ledgerAmount = this.currentTxn.amount;
            this.discountControl.change();
        }

        this.calculateTotal();
        this.calculateCompoundTotal();
    }

    public calculateAmount() {
        //
        // if (!(typeof this.currentTxn.total === 'string')) {
        //   return;
        // }
        this.isInclusiveEntry = true;
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
        let taxTotal = 0;
        if (this.taxControll) {
            taxTotal = this.taxControll.taxRenderData.filter(f => f.isChecked)
                .reduce((pv, cv) => {
                    return Number(pv) + Number(cv.amount);
                }, 0) || 0;
        }
        // A = (P+X+ 0.01XT) /(1-0.01Y + 0.01T -0.0001YT)
        // p = total
        // a = amount
        // x= fixed discount
        // y = percentage discount
        // t = percentage taz
        //   P = A - D + (A- D )*T/100;
        // D = X + A*Y/100;
        // Y = A*Y/100
        // P = A  - (X + A*Y/100) +  (A - (X + A*Y/100))* T/100
        //
        // P = A  - (X + A*Y/100) + T;
        // A - X - A*Y/100 + T  = P
        // A - AY/100 = P +X -T
        // A*(100- Y)/100 = P + X - T
        // A  = (P + X - T)*100/ (100- Y)
        // this.currentTxn.amount = giddhRoundOff((Number(this.currentTxn.total)+ fixDiscount - Number(this.currentTxn.tax)) * 100 / (100 - percentageDiscount),2)

        this.currentTxn.amount = giddhRoundOff(((Number(this.currentTxn.total) + fixDiscount + 0.01 * fixDiscount * Number(taxTotal)) /
            (1 - 0.01 * percentageDiscount + 0.01 * Number(taxTotal) - 0.0001 * percentageDiscount * Number(taxTotal))), this.giddhBalanceDecimalPlaces);
        this.currentTxn.convertedAmount = this.calculateConversionRate(this.currentTxn.amount);

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
        // let debitTotal = Number(sumBy(this.blankLedger.transactions.filter(t => t.type === 'DEBIT'), 'total')) || 0;
        let debitTotal = Number(sumBy(this.blankLedger.transactions.filter(t => t.type === 'DEBIT'), (trxn) => Number(trxn.total))) || 0;
        // let creditTotal = Number(sumBy(this.blankLedger.transactions.filter(t => t.type === 'CREDIT'), 'total')) || 0;
        let creditTotal = Number(sumBy(this.blankLedger.transactions.filter(t => t.type === 'CREDIT'), (trxn) => Number(trxn.total))) || 0;

        if (debitTotal > creditTotal) {
            this.blankLedger.compoundTotal = giddhRoundOff((debitTotal - creditTotal), this.giddhBalanceDecimalPlaces);
        } else {
            this.blankLedger.compoundTotal = giddhRoundOff((creditTotal - debitTotal), this.giddhBalanceDecimalPlaces);
        }
        this.blankLedger.convertedCompoundTotal = this.calculateConversionRate(this.blankLedger.compoundTotal);
    }

    public saveLedger() {
        if ((this.isRcmEntry) && !this.validateTaxes()) {
            if (this.taxControll && this.taxControll.taxInputElement && this.taxControll.taxInputElement.nativeElement) {
                // Taxes are mandatory for RCM and Advance Receipt entries
                this.taxControll.taxInputElement.nativeElement.classList.add('error-box');
                return;
            }
        }
        /* Add warehouse to the stock entry if the user hits 'Save' button without clicking on 'Add to CR/DR' button
            This will add the warehouse to the entered item */
        this.blankLedger.transactions.map((transaction) => {
            if (transaction.inventory && !transaction.inventory.warehouse) {
                transaction.inventory.warehouse = { name: '', uniqueName: this.selectedWarehouse };
            }
            if (transaction.voucherAdjustments && transaction.voucherAdjustments.adjustments && transaction.voucherAdjustments.adjustments.length > 0) {
                transaction.voucherAdjustments.adjustments.forEach((adjustment: any) => {
                    if (adjustment.balanceDue !== undefined) {
                        adjustment.adjustmentAmount = adjustment.balanceDue;
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
        if (isAndroidCordova()) {
            const fc = new FileChooser();
            fc.open()
                .then(uri => {
                    this.uploadFile(uri);
                })
                .catch(e => {
                    if (e !== 'User canceled.') {
                        this._toasty.errorToast('Something Went Wrong');
                    }
                    this.isFileUploading = false;
                });
        } else if (isIOSCordova()) {
            const filePicker = new IOSFilePicker();
            filePicker.pickFile()
                .then(uri => {
                    this.uploadFile(uri);
                })
                .catch(err => {
                    if (err !== 'canceled') {
                        this._toasty.errorToast('Something Went Wrong');
                    }
                    this.isFileUploading = false;
                });
        } else {
            // web
            this.webFileInput.nativeElement.click();
        }
    }

    private uploadFile(uri) {
        let sessionKey = null;
        let companyUniqueName = null;
        this.sessionKey$.pipe(take(1)).subscribe(a => sessionKey = a);
        const transfer = new FileTransfer();
        const fileTransfer = transfer.create();
        const options = {
            fileKey: 'file',
            headers: {
                'Session-Id': sessionKey
            }
        };
        const httpUrl = Configuration.ApiUrl + LEDGER_API.UPLOAD_FILE.replace(':companyUniqueName', companyUniqueName);
        fileTransfer.upload(uri, httpUrl, options)
            .then((data) => {
                if (data && data.response) {
                    const result = JSON.parse(data.response);
                    this.isFileUploading = false;
                    this.blankLedger.attachedFile = result.body.uniqueName;
                    this.blankLedger.attachedFileName = result.body.uniqueName;
                    this._toasty.successToast('file uploaded successfully');
                }
            }, (err) => {
                // show toaster
                this.isFileUploading = false;
                this.blankLedger.attachedFile = '';
                this.blankLedger.attachedFileName = '';
                this._toasty.errorToast(err.body.message);
            });
    }

    public onWebUpload(output: UploadOutput) {
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
                this.blankLedger.attachedFile = output.file.response.body.uniqueName;
                this.blankLedger.attachedFileName = output.file.response.body.name;
                this._toasty.successToast('file uploaded successfully');
            } else {
                this.isFileUploading = false;
                this.blankLedger.attachedFile = '';
                this.blankLedger.attachedFileName = '';
                this._toasty.errorToast(output.file.response.message);
            }
        }
    }

    public showDeleteAttachedFileModal() {
        this.deleteAttachedFileModal.show();
    }

    public hideDeleteAttachedFileModal() {
        this.deleteAttachedFileModal.hide();
    }

    public unitChanged(stockUnitCode: string) {
        let unit = this.currentTxn.selectedAccount.stock.unitRates.find(p => p.stockUnitCode === stockUnitCode);
        this.currentTxn.inventory.unit = { code: unit.stockUnitCode, rate: unit.rate, stockUnitCode: unit.stockUnitCode };
        if (this.currentTxn.inventory.unit) {
            this.changePrice(this.currentTxn.inventory.unit.rate.toString());
        }
    }

    public deleteAttachedFile() {
        this.blankLedger.attachedFile = '';
        this.blankLedger.attachedFileName = '';
        this.hideDeleteAttachedFileModal();
        if (this.webFileInput && this.webFileInput.nativeElement) {
            this.webFileInput.nativeElement.value = '';
        }
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
        o.from = this.trxRequest.from;
        o.to = this.trxRequest.to;
        this._ledgerService.GetReconcile(o.accountUniqueName, o.from, o.to, o.chequeNumber).subscribe((res) => {
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
                this._toasty.errorToast(data.message, data.code);
            }
        });
    }

    public showErrMsgOnUI() {
        this._toasty.warningToast('no entry with matching amount found, please create a new entry with same amount as this transaction.');
    }

    public confirmBankTransactionMap(item: ReconcileResponse) {
        this.selectedItemToMap = item;
        this.mapBodyContent = `Selected bank transaction will be mapped with cheque number ${item.chequeNumber} Click yes to accept.`;
        this.confirmBankTxnMapModal.show();
    }

    public hideConfirmBankTxnMapModal() {
        this.confirmBankTxnMapModal.hide();
    }

    public mapBankTransaction() {

        if (this.blankLedger.transactionId && this.selectedItemToMap.uniqueName) {
            let model = {
                uniqueName: this.selectedItemToMap.uniqueName
            };
            let unqObj = {
                accountUniqueName: this.trxRequest.accountUniqueName,
                transactionId: this.blankLedger.transactionId
            };
            this._ledgerService.MapBankTransactions(model, unqObj).subscribe((res) => {
                if (res.status === 'success') {
                    if (typeof (res.body) === 'string') {
                        this._toasty.successToast(res.body);
                    } else {
                        this._toasty.successToast('Entry Mapped Successfully!');
                    }
                    this.hideConfirmBankTxnMapModal();
                    this.clickedOutsideEvent.emit(false);
                } else {
                    this._toasty.errorToast(res.message, res.code);
                }
            });
        } else {
            // err
        }
    }

    public hideDiscountTax(): void {
        if (this.currentTxn && Number(this.currentTxn.amount) === 0) {
            this.currentTxn.amount = undefined;
        }
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

    @HostListener('window:click', ['$event'])
    public clickedOutsideOfComponent(e) {
        let classList = e.path.map(m => {
            return m.classList;
        });

        if (classList && classList instanceof Array) {
            const shouldNotClose = classList.some((className: DOMTokenList) => {
                if (!className) {
                    return;
                }
                return className.contains('chkclrbsdp') || className.contains('currencyToggler') || className.contains('bs-datepicker');
            });

            if (shouldNotClose) {
                return;
            }
        }
        if (!e.relatedTarget || !this.entryContent.nativeElement.contains(e.relatedTarget)) {
            this.clickedOutsideEvent.emit(e);
        }
    }

    public selectInvoice(invoiceNo, ev) {
        invoiceNo.isSelected = ev.target.checked;
        if (ev.target.checked) {
            this.blankLedger.invoicesToBePaid.push(invoiceNo.label);
        } else {
            let indx = this.blankLedger.invoicesToBePaid.indexOf(invoiceNo.label);
            this.blankLedger.invoicesToBePaid.splice(indx, 1);
        }
        // this.selectedInvoice.emit(this.selectedInvoices);
    }

    /**
     * Selected invoice for credit note
     *
     * @param {any} event Selected invoice for credit note
     * @memberof NewLedgerEntryPanelComponent
     */
    public creditNoteInvoiceSelected(event: any): void {
        if (event && event.value && event.additional) {
            this.currentTxn.invoiceLinkingRequest = {
                linkedInvoices: [
                    {
                        invoiceUniqueName: event.value,
                        voucherType: event.additional.voucherType
                    }
                ]
            }
            this.selectedInvoiceAmount = event.additional.balanceDue.amountForAccount;
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
        this.currentTxn.invoiceLinkingRequest = null;
        this.selectedInvoiceForCreditNote = null;
        this.blankLedger.generateInvoice = false;
    }

    /**
     * Fetches the invoice list data for a voucher
     *
     * @param {*} event Contains the selected voucher details
     * @memberof NewLedgerEntryPanelComponent
     */
    public getInvoiceListsData(event: any): void {
        this.removeAdjustment();
        if (event.value === 'advance-receipt') {
            this.shouldShowAdvanceReceipt = true;
            this.isAdvanceReceipt = true;
        } else if (event.value === VoucherTypeEnum.creditNote || event.value === VoucherTypeEnum.debitNote) {
            this.shouldShowAdvanceReceipt = false;
            this.removeSelectedInvoice();
            this.getInvoiceListsForCreditNote.emit(event.value);
            this.blankLedger.generateInvoice = true;
        } else {
            this.shouldShowAdvanceReceipt = false;
            this.isAdvanceReceipt = false;
        }
        this.handleAdvanceReceiptChange();
    }

    public toggleBodyClass() {
        if (this.asideMenuStateForOtherTaxes === 'in') {
            document.querySelector('body').classList.add('fixed');
        } else {
            document.querySelector('body').classList.remove('fixed');
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

        this.companyTaxesList$.pipe(take(1)).subscribe(taxes => companyTaxes = taxes);
        if (!transaction) {
            return;
        }

        if (modal.appliedOtherTax && modal.appliedOtherTax.uniqueName) {
            const amount = (this.isAdvanceReceipt) ? transaction.advanceReceiptAmount : transaction.amount;
            if (modal.tcsCalculationMethod === SalesOtherTaxesCalculationMethodEnum.OnTaxableAmount) {
                taxableValue = Number(amount) - transaction.discount;
            } else if (modal.tcsCalculationMethod === SalesOtherTaxesCalculationMethodEnum.OnTotalAmount) {
                let rawAmount = Number(amount) - transaction.discount;
                taxableValue = (rawAmount + transaction.tax);
            }

            let tax = companyTaxes.find(ct => ct.uniqueName === modal.appliedOtherTax.uniqueName);
            if(tax) {
                this.blankLedger.otherTaxType = ['tcsrc', 'tcspay'].includes(tax.taxType) ? 'tcs' : 'tds';
            }
            if (tax) {
                totalTaxes += tax.taxDetail[0].taxValue;
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
        if (Number(this.blankLedger.exchangeRateForDisplay)) {
            rate = 1 / this.blankLedger.exchangeRate;
        }
        this.blankLedger.exchangeRate = rate;
        this.blankLedger.exchangeRateForDisplay = giddhRoundOff(rate, this.giddhBalanceDecimalPlaces);
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
        this.blankLedger.exchangeRate = Number(this.blankLedger.exchangeRateForDisplay) || 0;
        this.amountChanged();
        this.calculateTotal();
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
        if (!baseModel || !this.blankLedger.exchangeRate) {
            return 0;
        }
        return giddhRoundOff(baseModel * Number(this.blankLedger.exchangeRate), (customDecimalPlaces) ? customDecimalPlaces : this.giddhBalanceDecimalPlaces);
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
        if(entryKeys && entryKeys.length > 0) {
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
     * Toggle the RCM checkbox based on user confirmation
     *
     * @param {*} event Click event
     * @memberof NewLedgerEntryPanelComponent
     */
    public toggleRcmCheckbox(event: any): void {
        event.preventDefault();
        this.rcmConfiguration = this.generalService.getRcmConfiguration(event.target.checked);
    }

    /**
     * RCM change handler, triggerreed when the user performs any
     * action with the RCM popup
     *
     * @param {string} action Action performed by user
     * @memberof NewLedgerEntryPanelComponent
     */
    public handleRcmChange(action: string): void {
        if (action === CONFIRMATION_ACTIONS.YES) {
            // Toggle the state of RCM as user accepted the terms of RCM modal
            this.isRcmEntry = !this.isRcmEntry;
        }
        this.currentTxn['subVoucher'] = this.isRcmEntry ? SubVoucher.ReverseCharge : '';
        if (this.rcmPopup) {
            this.rcmPopup.hide();
        }
    }

    /**
     * Handles the advance receipt change by appending the advance receipt
     * in subvoucher of current transaction
     *
     * @memberof NewLedgerEntryPanelComponent
     */
    public handleAdvanceReceiptChange(): void {
        this.currentTxn['subVoucher'] = this.isAdvanceReceipt ? SubVoucher.AdvanceReceipt : '';
        this.blankLedger.generateInvoice = this.isAdvanceReceipt;
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
    public getAdjustedPaymentData(event: { adjustVoucherData: VoucherAdjustments, adjustPaymentData: AdjustAdvancePaymentModal}): void {
        if (event && event.adjustPaymentData && event.adjustVoucherData) {
            const adjustments = cloneDeep(event.adjustVoucherData.adjustments);
            if(adjustments && adjustments.length > 0) {
                adjustments.forEach(adjustment => {
                    adjustment.adjustmentAmount = adjustment.balanceDue;
                    // delete adjustment.balanceDue;
                });
            }
            this.currentTxn.voucherAdjustments = {
                adjustments,
                totalAdjustmentAmount: event.adjustPaymentData.totalAdjustedAmount,
                tdsTaxUniqueName: null,
                tdsAmount: null,
                description: null
            };
            if (!adjustments || !adjustments.length)  {
                // No adjustments done clear the adjustment checkbox
                if (this.currentTxn['subVoucher'] === SubVoucher.AdvanceReceipt) {
                    this.isAdjustAdvanceReceiptSelected = false;
                } else {
                    this.isAdjustReceiptSelected = false;
                }
                this.isAdjustVoucherSelected = false;
                this.blankLedger.generateInvoice = false;
            }
        }

        this.adjustPaymentModal.hide();
    }

    /**
     * Close voucher adjustment modal handler
     *
     * @param {{ adjustVoucherData: VoucherAdjustments, adjustPaymentData: AdjustAdvancePaymentModal}} event Close event
     * @memberof NewLedgerEntryPanelComponent
     */
    public closeAdjustmentModal(event: { adjustVoucherData: VoucherAdjustments, adjustPaymentData: AdjustAdvancePaymentModal}): void {
        if (!this.currentTxn.voucherAdjustments || (this.currentTxn.voucherAdjustments && this.currentTxn.voucherAdjustments.adjustments && !this.currentTxn.voucherAdjustments.adjustments.length)) {
            if (this.currentTxn['subVoucher'] === SubVoucher.AdvanceReceipt) {
                this.isAdjustAdvanceReceiptSelected = false;
            } else {
                this.isAdjustReceiptSelected = false;
            }
            this.isAdjustVoucherSelected = false;
            this.blankLedger.generateInvoice = false;
        }
        this.adjustPaymentModal.hide();
    }

    /**
     * Toggles the more detail section
     *
     * @memberof NewLedgerEntryPanelComponent
     */
    public toggleMoreDetail(): void {
        this.showAdvanced = !this.showAdvanced;
        this.moreDetailOpen.emit(this.showAdvanced);
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
    }

    /**
     * Assigns the prefix and suffix based on currency toggle button present in this
     * component
     *
     * @private
     * @memberof NewLedgerEntryPanelComponent
     */
    private assignPrefixAndSuffixForCurrency(): void {
        const isPrefixAppliedForCurrency = !(['AED'].includes(this.selectedCurrency === 0 ? this.baseCurrencyDetails.code : this.foreignCurrencyDetails.code));
        this.selectedPrefixForCurrency = isPrefixAppliedForCurrency ? this.selectedCurrency === 0 ? this.baseCurrencyDetails.symbol : this.foreignCurrencyDetails.symbol : '';
        this.selectedSuffixForCurrency = isPrefixAppliedForCurrency ? '' : this.selectedCurrency === 0 ? this.baseCurrencyDetails.symbol : this.foreignCurrencyDetails.symbol;
    }

    /**
     * Validates the taxes
     *
     * @private
     * @returns {boolean} True, if taxes are applied
     * @memberof NewLedgerEntryPanelComponent
     */
    private validateTaxes(): boolean {
        const taxes = [...this.currentTxn.taxesVm.filter(p => p.isChecked).map(p => p.uniqueName)];
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
                balanceDue: this.currentTxn.total,
                grandTotal: this.currentTxn.total,
                customerName: this.currentTxn.selectedAccount ? this.currentTxn.selectedAccount.name : '',
                customerUniquename: this.currentTxn.selectedAccount ? this.currentTxn.selectedAccount.uniqueName : '',
                totalTaxableValue: this.currentTxn.total,
                subTotal: this.currentTxn.total,
            },
            accountDetails: {
                currencySymbol: this.currentTxn.selectedAccount ? this.currentTxn.selectedAccount.currencySymbol : this.blankLedger.baseCurrencyToDisplay.symbol
            },
            activeAccountUniqueName: this.activeAccount.uniqueName
        };
    }

    /**
     * To open advance receipts adjustment pop up
     *
     * @private
     * @memberof NewLedgerEntryPanelComponent
     */
    private openAdjustPaymentModal(): void {
        this.adjustPaymentModal.show();
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
        let parentAcc = (accountDetails && accountDetails.parentGroups && accountDetails.parentGroups.length > 0) ? accountDetails.parentGroups[0].uniqueName : "";
        let incomeAccArray = ['revenuefromoperations', 'otherincome'];
        let expensesAccArray = ['operatingcost', 'indirectexpenses'];
        let assetsAccArray = ['assets'];
        let incomeAndExpensesAccArray = [...incomeAccArray, ...expensesAccArray, ...assetsAccArray];
        if (incomeAndExpensesAccArray.indexOf(parentAcc) > -1) {
            let appTaxes = [];
            if(accountDetails && accountDetails.applicableTaxes && accountDetails.applicableTaxes.length > 0) {
                accountDetails.applicableTaxes.forEach(app => appTaxes.push(app.uniqueName));
            }
            this.currentAccountApplicableTaxes = appTaxes;
        }
        if (accountDetails.country && accountDetails.country.countryName) {
            this.activeAccountCountryName = accountDetails.country.countryName;
        }
        if (accountDetails.applicableDiscounts && accountDetails.applicableDiscounts.length) {
            this.accountOtherApplicableDiscount = accountDetails.applicableDiscounts;
        } else if (accountDetails.inheritedDiscounts && accountDetails.inheritedDiscounts.length && !this.accountOtherApplicableDiscount.length) {
            accountDetails.inheritedDiscounts.forEach(element => {
                this.accountOtherApplicableDiscount.push(...element.applicableDiscounts);
            });
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
            this.currentTxn.selectedAccount.accountApplicableDiscounts.forEach(element => {
                this.currentTxn.discounts.map(item => {
                    if (element.uniqueName === item.discountUniqueName) {
                        item.isActive = true;
                    }
                    return item;
                });
            });
        } else if (this.accountOtherApplicableDiscount && this.accountOtherApplicableDiscount.length) {
            this.currentTxn.discounts.map(item => { item.isActive = false });
            this.accountOtherApplicableDiscount.forEach(element => {
                this.currentTxn.discounts.map(item => {
                    if (element.uniqueName === item.discountUniqueName) {
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
}
