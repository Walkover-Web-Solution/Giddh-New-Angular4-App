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
import { select, Store } from '@ngrx/store';
import { ResizedEvent } from 'angular-resize-event';
import { Configuration } from 'apps/web-giddh/src/app/app.constant';
import { AccountResponse } from 'apps/web-giddh/src/app/models/api-models/Account';
import { BsDatepickerDirective, ModalDirective } from 'ngx-bootstrap';
import { UploaderOptions, UploadInput, UploadOutput } from 'ngx-uploader';
import { createSelector } from 'reselect';
import { BehaviorSubject, Observable, of as observableOf, ReplaySubject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';

import { LoaderService } from '../../../loader/loader.service';
import { forEach, sumBy } from '../../../lodash-optimized';
import { BaseResponse } from '../../../models/api-models/BaseResponse';
import { ICurrencyResponse, TaxResponse } from '../../../models/api-models/Company';
import { ReconcileRequest, ReconcileResponse } from '../../../models/api-models/Ledger';
import { SalesOtherTaxesCalculationMethodEnum, SalesOtherTaxesModal } from '../../../models/api-models/Sales';
import { IDiscountList } from '../../../models/api-models/SettingsDiscount';
import { TagRequest } from '../../../models/api-models/settingsTags';
import { AdvanceSearchRequest } from '../../../models/interfaces/AdvanceSearchRequest';
import { ILedgerTransactionItem } from '../../../models/interfaces/ledger.interface';
import { LEDGER_API } from '../../../services/apiurls/ledger.api';
import { LedgerService } from '../../../services/ledger.service';
import { ToasterService } from '../../../services/toaster.service';
import { SettingsUtilityService } from '../../../settings/services/settings-utility.service';
import { GIDDH_DATE_FORMAT } from '../../../shared/helpers/defaultDateFormat';
import { giddhRoundOff } from '../../../shared/helpers/helperFunctions';
import { AppState } from '../../../store';
import { IOption } from '../../../theme/ng-virtual-select/sh-options.interface';
import { ShSelectComponent } from '../../../theme/ng-virtual-select/sh-select.component';
import { TaxControlComponent } from '../../../theme/tax-control/tax-control.component';
import { BlankLedgerVM, TransactionVM } from '../../ledger.vm';
import { LedgerDiscountComponent } from '../ledgerDiscount/ledgerDiscount.component';

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

    public isAmountFirst: boolean = false;
    public isTotalFirts: boolean = false;
    public selectedInvoices: string[] = [];
    @Output() public changeTransactionType: EventEmitter<any> = new EventEmitter();
    @Output() public resetBlankLedger: EventEmitter<boolean> = new EventEmitter();
    @Output() public saveBlankLedger: EventEmitter<boolean> = new EventEmitter();
    @Output() public clickedOutsideEvent: EventEmitter<any> = new EventEmitter();
    @Output() public clickUnpaidInvoiceList: EventEmitter<any> = new EventEmitter();
    @Output() public currencyChangeEvent: EventEmitter<string> = new EventEmitter();
    @ViewChild('entryContent') public entryContent: ElementRef;
    @ViewChild('sh') public sh: ShSelectComponent;
    @ViewChild(BsDatepickerDirective) public datepickers: BsDatepickerDirective;

    @ViewChild('deleteAttachedFileModal') public deleteAttachedFileModal: ModalDirective;
    @ViewChild('discount') public discountControl: LedgerDiscountComponent;
    @ViewChild('tax') public taxControll: TaxControlComponent;

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
    @ViewChild('confirmBankTxnMapModal') public confirmBankTxnMapModal: ModalDirective;
    public matchingEntriesData: ReconcileResponse[] = [];
    public showMatchingEntries: boolean = false;
    public mapBodyContent: string;
    public selectedItemToMap: ReconcileResponse;
    public tags$: Observable<TagRequest[]>;
    public activeAccount$: Observable<AccountResponse>;
    public activeAccount: AccountResponse;
    public currentAccountApplicableTaxes: string[] = [];
    //variable added for storing the selected taxes after the tax component is destroyed for resolution of G0-295 by shehbaz
    public currentAccountSavedApplicableTaxes: string[] = [];
    public isMulticurrency: boolean;
    public accountBaseCurrency: string;
    public companyCurrency: string;
    public totalForTax: number = 0;
    public taxListForStock = []; // New
    public companyIsMultiCurrency: boolean;
    public giddhDateFormat: string = GIDDH_DATE_FORMAT;
    public asideMenuStateForOtherTaxes: string = 'out';
    public tdsTcsTaxTypes: string[] = ['tcsrc', 'tcspay'];
    public companyTaxesList: TaxResponse[] = [];
    public totalTdElementWidth: number = 0;
    /** Default warehouse for a company */
    public defaultWarehouse: string;
    /** List of warehouses for a company */
    public warehouses: Array<any>;
    /** Currently selected warehouse */
    public selectedWarehouse: any;

    // private below
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

    constructor(private store: Store<AppState>,
        private _ledgerService: LedgerService,
        private cdRef: ChangeDetectorRef,
        private _toasty: ToasterService,
        private _loaderService: LoaderService,
        private settingsUtilityService: SettingsUtilityService
    ) {
        this.discountAccountsList$ = this.store.select(p => p.settings.discount.discountList).pipe(takeUntil(this.destroyed$));
        this.companyTaxesList$ = this.store.select(p => p.company.taxes).pipe(takeUntil(this.destroyed$));
        this.sessionKey$ = this.store.select(p => p.session.user.session.id).pipe(takeUntil(this.destroyed$));
        this.companyName$ = this.store.select(p => p.session.companyUniqueName).pipe(takeUntil(this.destroyed$));
        this.activeAccount$ = this.store.select(p => p.ledger.account).pipe(takeUntil(this.destroyed$));
        this.isLedgerCreateInProcess$ = this.store.select(p => p.ledger.ledgerCreateInProcess).pipe(takeUntil(this.destroyed$));
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
        }]);
    }

    public ngOnInit() {
        this.showAdvanced = false;
        this.uploadInput = new EventEmitter<UploadInput>();
        this.fileUploadOptions = { concurrency: 0 };
        this.activeAccount$.subscribe(acc => {
            if (acc) {
                this.activeAccount = acc;
                let parentAcc = acc.parentGroups[0].uniqueName;
                let incomeAccArray = ['revenuefromoperations', 'otherincome'];
                let expensesAccArray = ['operatingcost', 'indirectexpenses'];
                let assetsAccArray = ['assets'];
                let incomeAndExpensesAccArray = [...incomeAccArray, ...expensesAccArray, ...assetsAccArray];
                if (incomeAndExpensesAccArray.indexOf(parentAcc) > -1) {
                    let appTaxes = [];
                    acc.applicableTaxes.forEach(app => appTaxes.push(app.uniqueName));
                    this.currentAccountApplicableTaxes = appTaxes;
                }
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

        this.tags$ = this.store.select(createSelector([(st: AppState) => st.settings.tags], (tags) => {
            if (tags && tags.length) {
                _.map(tags, (tag) => {
                    tag.label = tag.name;
                    tag.value = tag.name;
                });
                return _.orderBy(tags, 'name');
            }
        })).pipe(takeUntil(this.destroyed$));

        // for tcs and tds identification
        if (this.tcsOrTds === 'tcs') {
            this.tdsTcsTaxTypes = ['tcspay', 'tcsrc'];
        } else {
            this.tdsTcsTaxTypes = ['tdspay', 'tdsrc'];
        }

        this.store.pipe(select(s => s.company.taxes), takeUntil(this.destroyed$)).subscribe(res => {
            this.companyTaxesList = res || [];
        });

        // this.baseCurrencyToDisplay = this.selectedCurrency === 0 ? cloneDeep(this.baseCurrencyDetails) : cloneDeep(this.foreignCurrencyDetails);
        // this.foreignCurrencyToDisplay = this.selectedCurrency === 0 ? cloneDeep(this.foreignCurrencyDetails) : cloneDeep(this.baseCurrencyDetails);
    }

    @HostListener('click', ['$event'])
    public clicked(e) {
        if (this.sh && !this.sh.ele.nativeElement.contains(e.path[3])) {
            this.sh.hide();
        }
    }

    public ngOnChanges(changes: SimpleChanges): void {
        if (this.currentTxn && this.currentTxn.selectedAccount) {
            if (this.currentTxn.selectedAccount.stock && this.currentTxn.selectedAccount.stock.stockTaxes && this.currentTxn.selectedAccount.stock.stockTaxes.length) {
                this.taxListForStock = this.currentTxn.selectedAccount.stock.stockTaxes;
            } else if (this.currentTxn.selectedAccount.parentGroups && this.currentTxn.selectedAccount.parentGroups.length) {
                let parentAcc = this.currentTxn.selectedAccount.parentGroups[0].uniqueName;
                let incomeAccArray = ['revenuefromoperations', 'otherincome'];
                let expensesAccArray = ['operatingcost', 'indirectexpenses'];
                let assetsAccArray = ['assets'];
                let incomeAndExpensesAccArray = [...incomeAccArray, ...expensesAccArray, ...assetsAccArray];

                if (incomeAndExpensesAccArray.indexOf(parentAcc) > -1) {
                    let appTaxes = [];
                    if (this.activeAccount && this.activeAccount.applicableTaxes) {
                        this.activeAccount.applicableTaxes.forEach(app => appTaxes.push(app.uniqueName));
                        this.taxListForStock = appTaxes;
                    }
                }
            } else {
                this.taxListForStock = [];
            }

            if (!this.currentTxn.selectedAccount.stock) {
                this.selectedWarehouse = this.defaultWarehouse;
            }

            let companyTaxes: TaxResponse[] = [];
            this.companyTaxesList$.pipe(take(1)).subscribe(taxes => companyTaxes = taxes);
            let appliedTaxes: any[] = [];

            this.taxListForStock.forEach(tl => {
                let tax = companyTaxes.find(f => f.uniqueName === tl);
                if (tax) {
                    switch (tax.taxType) {
                        case 'tcsrc':
                        case 'tcspay':
                        case 'tdsrc':
                        case 'tdspay':
                            this.blankLedger.otherTaxModal.appliedOtherTax = { name: tax.name, uniqueName: tax.uniqueName };
                            break;
                        default:
                            appliedTaxes.push(tax.uniqueName);
                    }
                }
            });

            this.taxListForStock = appliedTaxes;
            if (this.blankLedger.otherTaxModal.appliedOtherTax && this.blankLedger.otherTaxModal.appliedOtherTax.uniqueName) {
                this.blankLedger.isOtherTaxesApplicable = true;
            }
        }

        if ('selectedCurrency' in changes) {
            // this.baseCurrencyToDisplay = this.selectedCurrency === 0 ? cloneDeep(this.baseCurrencyDetails) : cloneDeep(this.foreignCurrencyDetails);
            // this.foreignCurrencyToDisplay = this.selectedCurrency === 0 ? cloneDeep(this.foreignCurrencyDetails) : cloneDeep(this.baseCurrencyDetails);
        }
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
        this.changeTransactionType.emit({
            type,
            warehouse: this.selectedWarehouse
        });
        e.stopPropagation();
    }

    public calculateDiscount(total: number) {
        this.currentTxn.discount = total;
        this.currentTxn.convertedDiscount = this.calculateConversionRate(this.currentTxn.discount);
        this.calculateTax();
    }

    public calculateTax() {
        let totalPercentage: number;
        totalPercentage = this.currentTxn.taxesVm.reduce((pv, cv) => {
            return cv.isChecked ? pv + cv.amount : pv;
        }, 0);
        this.currentTxn.tax = giddhRoundOff(((totalPercentage * (Number(this.currentTxn.amount) - this.currentTxn.discount)) / 100), this.giddhBalanceDecimalPlaces);
        this.currentTxn.convertedTax = this.calculateConversionRate(this.currentTxn.tax);
        this.calculateTotal();
    }

    public calculateTotal() {
        if (this.currentTxn && this.currentTxn.amount) {
            let total = (this.currentTxn.amount - this.currentTxn.discount) || 0;
            this.totalForTax = total;
            this.currentTxn.total = giddhRoundOff((total + this.currentTxn.tax), this.giddhBalanceDecimalPlaces);
            this.currentTxn.convertedTotal = this.calculateConversionRate(this.currentTxn.total);
        }
        this.calculateOtherTaxes(this.blankLedger.otherTaxModal);
        this.calculateCompoundTotal();
    }

    public amountChanged() {
        if (this.currentTxn && this.currentTxn.selectedAccount) {
            if (this.currentTxn.selectedAccount.stock && this.currentTxn.amount > 0) {
                if (this.currentTxn.inventory.quantity) {
                    this.currentTxn.inventory.unit.rate = giddhRoundOff((this.currentTxn.amount / this.currentTxn.inventory.quantity), this.giddhBalanceDecimalPlaces);
                    this.currentTxn.convertedRate = this.calculateConversionRate(this.currentTxn.inventory.unit.rate);
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

        if (this.isAmountFirst || this.isTotalFirts) {
            return;
        } else {
            this.isAmountFirst = true;
            // this.currentTxn.isInclusiveTax = false;
        }
    }

    public changePrice(val: string) {
        this.currentTxn.inventory.unit.rate = giddhRoundOff(Number(val), this.giddhBalanceDecimalPlaces);
        this.currentTxn.convertedRate = this.calculateConversionRate(this.currentTxn.inventory.unit.rate);

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

    public changeQuantity(val: string) {
        this.currentTxn.inventory.quantity = Number(val);
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

    public calculateAmount() {
        //
        // if (!(typeof this.currentTxn.total === 'string')) {
        //   return;
        // }
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
                    return Number(pv) + Number(cv.amount)
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
                this.currentTxn.inventory.unit.rate = giddhRoundOff((this.currentTxn.amount / this.currentTxn.inventory.quantity), this.giddhBalanceDecimalPlaces);
                this.currentTxn.convertedRate = this.calculateConversionRate(this.currentTxn.inventory.unit.rate);
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
        if (this.currentTxn && this.currentTxn.selectedAccount) {
            // this.calculateConversionRate();
        }
    }

    public saveLedger() {
        /* Add warehouse to the stock entry if the user hits 'Save' button without clicking on 'Add to CR/DR' button
            This will add the warehouse to the entered item */
        this.blankLedger.transactions.map((transaction) => {
            if (transaction.inventory && !transaction.inventory.warehouse) {
                transaction.inventory.warehouse = { name: '', uniqueName: this.selectedWarehouse };
            }
        });
        this.saveBlankLedger.emit(true);
    }

    public resetPanel() {
        this.resetBlankLedger.emit(true);
        this.currentTxn = null;
    }

    public onUploadOutput(output: UploadOutput): void {
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
        let unit = this.currentTxn.selectedAccount.stock.accountStockDetails.unitRates.find(p => p.stockUnitCode === stockUnitCode);
        this.currentTxn.inventory.unit = { code: unit.stockUnitCode, rate: unit.rate, stockUnitCode: unit.stockUnitCode };
        if (this.currentTxn.inventory.unit) {
            this.changePrice(this.currentTxn.inventory.unit.rate.toString());
        }
    }

    public deleteAttachedFile() {
        this.blankLedger.attachedFile = '';
        this.blankLedger.attachedFileName = '';
        this.hideDeleteAttachedFileModal();
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
                if (data.body.length) {
                    forEach(data.body, (entry: ReconcileResponse) => {
                        forEach(entry.transactions, (txn: ILedgerTransactionItem) => {
                            if (txn.amount === this.currentTxn.amount) {
                                this.matchingEntriesData.push(entry);
                            }
                        });
                    });
                    if (this.matchingEntriesData.length === 1) {
                        this.confirmBankTransactionMap(this.matchingEntriesData[0]);
                    } else if (this.matchingEntriesData.length > 1) {
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

    public detactChanges() {
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
            let notClose = classList.some((cls: DOMTokenList) => {
                if (!cls) {
                    return;
                }
                return cls.contains('chkclrbsdp') || cls.contains('currencyToggler');
            });

            if (notClose) {
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

    public getInvoiveListsData(e: any) {
        if (e.value === 'rcpt') {
            this.clickUnpaidInvoiceList.emit(true);
        }
    }

    public getInvoiveLists() {
        if (this.blankLedger.voucherType === 'rcpt') {
            this.clickUnpaidInvoiceList.emit(true);
        }
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

            if (modal.tcsCalculationMethod === SalesOtherTaxesCalculationMethodEnum.OnTaxableAmount) {
                taxableValue = Number(transaction.amount) - transaction.discount;
            } else if (modal.tcsCalculationMethod === SalesOtherTaxesCalculationMethodEnum.OnTotalAmount) {
                let rawAmount = Number(transaction.amount) - transaction.discount;
                taxableValue = (rawAmount + ((rawAmount * transaction.tax) / 100));
            }

            let tax = companyTaxes.find(ct => ct.uniqueName === modal.appliedOtherTax.uniqueName);
            this.blankLedger.otherTaxType = ['tcsrc', 'tcspay'].includes(tax.taxType) ? 'tcs' : 'tds';
            if (tax) {
                totalTaxes += tax.taxDetail[0].taxValue;
            }
            this.blankLedger.tdsTcsTaxesSum = giddhRoundOff(((taxableValue * totalTaxes) / 100), this.giddhBalanceDecimalPlaces);
            this.blankLedger.otherTaxModal = modal;
            this.blankLedger.tcsCalculationMethod = modal.tcsCalculationMethod;
            this.blankLedger.otherTaxesSum = giddhRoundOff((this.blankLedger.tdsTcsTaxesSum), this.giddhBalanceDecimalPlaces);
        } else {
            this.blankLedger.otherTaxesSum = 0;
            this.blankLedger.isOtherTaxesApplicable = false;
            this.blankLedger.otherTaxModal = new SalesOtherTaxesModal();
        }
    }

    public currencyChange() {
        this.blankLedger.selectedCurrencyToDisplay = this.blankLedger.selectedCurrencyToDisplay === 0 ? 1 : 0;
        let rate = 0;
        if (Number(this.blankLedger.exchangeRateForDisplay)) {
            rate = 1 / this.blankLedger.exchangeRate;
        }
        this.blankLedger.exchangeRate = rate;
        this.blankLedger.exchangeRateForDisplay = giddhRoundOff(rate, this.giddhBalanceDecimalPlaces);
        this.detactChanges();
    }

    public exchangeRateChanged() {
        this.blankLedger.exchangeRate = Number(this.blankLedger.exchangeRateForDisplay) || 0;
        this.amountChanged();
        this.calculateTotal();
    }

    public calculateConversionRate(baseModel) {
        if (!baseModel || !this.blankLedger.exchangeRate) {
            return 0;
        }
        //multiplying AND DIVIDING with exchange rate for display instead of original exchange rate
        if (this.blankLedger.selectedCurrencyToDisplay === 0) {
            return giddhRoundOff(baseModel * this.blankLedger.exchangeRateForDisplay, this.giddhBalanceDecimalPlaces);
        } else {
            return giddhRoundOff(baseModel / this.blankLedger.exchangeRateForDisplay, this.giddhBalanceDecimalPlaces);
        }
    }
}
