import { Observable, of as observableOf, ReplaySubject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, QueryList, SimpleChanges, ViewChild, ViewChildren, ChangeDetectorRef } from '@angular/core';
import { ILedgersInvoiceResult, InvoicePaymentRequest } from '../../../../models/api-models/Invoice';
import * as dayjs from 'dayjs';
import { GIDDH_DATE_FORMAT } from '../../../../shared/helpers/defaultDateFormat';
import { IOption } from '../../../../theme/ng-virtual-select/sh-options.interface';
import { AppState } from '../../../../store';
import { select, Store } from '@ngrx/store';
import { ShSelectComponent } from '../../../../theme/ng-virtual-select/sh-select.component';
import { orderBy } from '../../../../lodash-optimized';
import { LedgerService } from "../../../../services/ledger.service";
import { ReceiptItem } from "../../../../models/api-models/recipt";
import { INameUniqueName } from "../../../../models/api-models/Inventory";
import { SalesService } from 'apps/web-giddh/src/app/services/sales.service';
import { SearchService } from 'apps/web-giddh/src/app/services/search.service';
import { SettingsTagService } from 'apps/web-giddh/src/app/services/settings.tag.service';
import { GeneralService } from 'apps/web-giddh/src/app/services/general.service';

@Component({
    selector: 'invoice-payment-model',
    templateUrl: './invoice.payment.model.component.html'
})

export class InvoicePaymentModelComponent implements OnInit, OnDestroy, OnChanges {

    @Input() public selectedInvoiceForDelete: ILedgersInvoiceResult;
    @Output() public closeModelEvent: EventEmitter<InvoicePaymentRequest> = new EventEmitter();
    @ViewChildren(ShSelectComponent) public allShSelectComponents: QueryList<ShSelectComponent>;
    @ViewChild('amountField', { static: true }) amountField;
    @Input() public selectedInvoiceForPayment: ReceiptItem;
    /* This will hold local JSON data */
    @Input() public localeData: any = {};
    /* This will hold common JSON data */
    @Input() public commonLocaleData: any = {};

    public paymentActionFormObj: InvoicePaymentRequest;
    public dayjs = dayjs;
    public showDatePicker: boolean = false;
    public showClearanceDatePicker: boolean = false;
    public paymentMode: IOption[] = [];
    public isBankSelected: boolean = false;
    public tags: IOption[] = [];
    public dateMask = [/\d/, /\d/, '-', /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/];
    public isActionSuccess$: Observable<boolean> = observableOf(false);

    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
    /** This holds giddh date format */
    public giddhDateFormat: string = GIDDH_DATE_FORMAT;

    //Multicurrency changes
    private originalPaymentMode: IOption[] = [];
    private baseCurrencySymbol: string;
    public showSwitchedCurr: false;
    public originalExchangeRate: number;
    public exchangeRate: number;
    public originalReverseExchangeRate: number;
    public reverseExchangeRate: number;
    public isMulticurrencyAccount = false;
    public companyCurrencyName: string;
    public showCurrencyValue: boolean;
    public accountCurrency: any;
    public autoSaveIcon: boolean;
    public paymentModes$: Observable<IOption[]> = observableOf([]);
    /** Selected payment mode */
    public selectedPaymentMode: any;
    /** Currency symbol related to amount */
    public amountCurrency: string = '';
    /** Input masking based on currency format in company */
    public inputMaskFormat: string = '';

    constructor(
        private changeDetectorRef: ChangeDetectorRef,
        private store: Store<AppState>,
        private settingsTagService: SettingsTagService,
        private _ledgerService: LedgerService,
        private salesService: SalesService,
        private searchService: SearchService,
        private generalService: GeneralService
    ) {
        this.paymentActionFormObj = new InvoicePaymentRequest();
        this.paymentActionFormObj.paymentDate = dayjs().toDate();
        this.isActionSuccess$ = this.store.pipe(select(s => s.invoice.invoiceActionUpdated), takeUntil(this.destroyed$));
        // get user country from his profile
        this.store.pipe(select(s => s.settings.profile), takeUntil(this.destroyed$)).subscribe(profile => {
            if (profile) {
                this.baseCurrencySymbol = profile.baseCurrencySymbol;
                this.companyCurrencyName = profile.baseCurrency;
            }
        });
    }

    public provideStrings = (arr: any[]) => {
        let o = { nameStr: [], uNameStr: [] };
        let b = { nameStr: '', uNameStr: '' };
        try {
            arr.forEach((item: INameUniqueName) => {
                o.nameStr.push(item?.name);
                o.uNameStr.push(item?.uniqueName);
            });
            b.nameStr = o.nameStr.join(', ');
            b.uNameStr = o.uNameStr.join(', ');
        } catch (error) {
            //
        }
        return b;
    };

    public ngOnInit() {
        this.settingsTagService.GetAllTags().pipe(takeUntil(this.destroyed$)).subscribe(response => {
            if (response?.status === "success" && response?.body?.length > 0) {
                let arr: IOption[] = [];
                response?.body.forEach(tag => {
                    arr.push({ value: tag.name, label: tag.name });
                });
                this.tags = orderBy(arr, 'name');
            }
        });

        this.isActionSuccess$.subscribe(a => {
            if (a) {
                this.resetFrom();

                if (this.selectedInvoiceForPayment) {
                    this.assignAmount(this.selectedInvoiceForPayment?.balanceDue?.amountForAccount, this.selectedInvoiceForPayment?.account?.currency?.symbol);
                }
            }
        });

        this.store.pipe(select(state => state.session.activeCompany), takeUntil(this.destroyed$)).subscribe(activeCompany => {
            if (activeCompany) {
                this.inputMaskFormat = activeCompany.balanceDisplayFormat ? activeCompany.balanceDisplayFormat.toLowerCase() : '';
            }
        });

        this.loadPaymentModes();
    }

    public onConfirmation(formObj) {
        formObj.paymentDate = dayjs(formObj.paymentDate).format(GIDDH_DATE_FORMAT);
        formObj.exchangeRate = this.exchangeRate;

        if (this.generalService.voucherApiVersion === 2) {
            formObj.date = formObj.paymentDate;

            if (this.selectedInvoiceForPayment?.account?.currency?.code === this.selectedPaymentMode?.additional?.currency) {
                formObj.amountForAccount = formObj.amount;
            } else {
                formObj.amountForCompany = formObj.amount;
            }

            formObj.tagNames = (formObj.tagUniqueName) ? [formObj.tagUniqueName] : [];

            delete formObj.paymentDate;
            delete formObj.amount;
            delete formObj.tagUniqueName;
        }

        this.closeModelEvent.emit(formObj);
        this.resetFrom();
    }

    public onCancel() {
        this.closeModelEvent.emit();
        this.resetFrom();
    }

    /**
     * setPaymentDate
     */
    public setPaymentDate(date) {
        this.paymentActionFormObj.paymentDate = _.cloneDeep(dayjs(date).format(GIDDH_DATE_FORMAT));
        this.showDatePicker = !this.showDatePicker;
    }

    public setClearanceDate(date) {
        this.showClearanceDatePicker = !this.showClearanceDatePicker;
        this.paymentActionFormObj.chequeClearanceDate = _.cloneDeep(dayjs(date).format(GIDDH_DATE_FORMAT));
    }

    public onSelectPaymentMode(event) {
        if (event && event.value) {
            if (!this.isMulticurrencyAccount || this.selectedInvoiceForPayment?.account?.currency?.code === event?.additional?.currency) {
                this.assignAmount(this.selectedInvoiceForPayment?.balanceDue?.amountForAccount, this.selectedInvoiceForPayment?.account?.currency?.symbol);
            } else {
                this.assignAmount(this.selectedInvoiceForPayment?.balanceDue?.amountForCompany, event?.additional?.currencySymbol);
            }
            this.selectedPaymentMode = event;
            this.searchService.loadDetails(event.value).pipe(takeUntil(this.destroyed$)).subscribe(response => {
                if (response && response.body) {
                    const parentGroups = response.body.parentGroups;
                    if (parentGroups[1] === 'bankaccounts') {
                        this.isBankSelected = true;
                    } else {
                        this.isBankSelected = false;
                        this.paymentActionFormObj.chequeClearanceDate = '';
                        this.paymentActionFormObj.chequeNumber = '';
                    }
                } else {
                    this.paymentActionFormObj.accountUniqueName = '';
                    this.isBankSelected = false;
                    this.paymentActionFormObj.chequeClearanceDate = '';
                    this.paymentActionFormObj.chequeNumber = '';
                }
                this.changeDetectorRef.detectChanges();
            })
            this.paymentActionFormObj.accountUniqueName = event.value;
        } else {
            this.assignAmount(this.selectedInvoiceForPayment?.balanceDue?.amountForAccount, this.selectedInvoiceForPayment?.account?.currency?.symbol);
            this.selectedPaymentMode = null;
            this.paymentActionFormObj.accountUniqueName = '';
            this.isBankSelected = false;
            this.paymentActionFormObj.chequeClearanceDate = '';
            this.paymentActionFormObj.chequeNumber = '';
        }
        this.changeDetectorRef.detectChanges();
    }

    public resetFrom() {
        this.paymentActionFormObj = new InvoicePaymentRequest();
        this.paymentActionFormObj.paymentDate = dayjs().toDate();
        this.paymentActionFormObj.uniqueName = this.selectedInvoiceForPayment?.uniqueName;

        if (this.allShSelectComponents) {
            this.allShSelectComponents.forEach(sh => {
                sh.clear();
            });
        }

        this.isBankSelected = false;
    }

    public ngOnDestroy() {
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }

    public ngOnChanges(c: SimpleChanges) {
        if (this.selectedInvoiceForPayment?.uniqueName) {
            this.paymentActionFormObj.uniqueName = this.selectedInvoiceForPayment?.uniqueName;
        }

        if (c.selectedInvoiceForPayment.currentValue && c.selectedInvoiceForPayment.currentValue !== c.selectedInvoiceForPayment.previousValue) {
            let paymentModeChanges: IOption[] = [];
            this.originalPaymentMode.forEach(payMode => {
                if (!payMode.additional.currencySymbol || payMode.additional.currencySymbol === this.baseCurrencySymbol || payMode.additional.currencySymbol === c.selectedInvoiceForPayment.currentValue.accountCurrencySymbol) {
                    paymentModeChanges.push(payMode);
                }
            });
            this.paymentMode = paymentModeChanges;
            if (this.baseCurrencySymbol !== c.selectedInvoiceForPayment.currentValue.accountCurrencySymbol) {
                this.isMulticurrencyAccount = true;
                this.accountCurrency = this.selectedInvoiceForPayment.account.currency ? this.selectedInvoiceForPayment.account.currency.code : null;
                this.getCurrencyRate(this.accountCurrency, this.companyCurrencyName);
            } else {
                this.isMulticurrencyAccount = false;
                this.exchangeRate = 1;
            }
        }

        if (this.selectedInvoiceForPayment) {
            this.assignAmount(this.selectedInvoiceForPayment?.balanceDue?.amountForAccount, this.selectedInvoiceForPayment?.account?.currency?.symbol);
        }
    }

    public switchCurrencyImg(switchCurr) {
        this.showSwitchedCurr = switchCurr;
        if (switchCurr) {
            this.reverseExchangeRate = 1 / this.exchangeRate;
            this.originalReverseExchangeRate = this.reverseExchangeRate;
        } else {
            this.exchangeRate = 1 / this.reverseExchangeRate;
            this.originalExchangeRate = this.exchangeRate;
        }
    }

    public saveCancelExcRate(toSave) {
        if (toSave) {
            if (this.showSwitchedCurr) {
                this.exchangeRate = 1 / this.reverseExchangeRate;
            } else {
                this.originalExchangeRate = this.exchangeRate;
            }
            this.autoSaveIcon = !this.autoSaveIcon;
            this.showCurrencyValue = !this.showCurrencyValue;
            this.originalReverseExchangeRate = this.reverseExchangeRate;
        } else {
            this.showCurrencyValue = !this.showCurrencyValue;
            this.autoSaveIcon = !this.autoSaveIcon;
            this.exchangeRate = this.originalExchangeRate;
            this.reverseExchangeRate = this.originalReverseExchangeRate;
        }
    }

    public getCurrencyRate(from, to) {
        if (from && to) {
            let date = dayjs().format(GIDDH_DATE_FORMAT);
            this._ledgerService.GetCurrencyRateNewApi(from, to, date).pipe(takeUntil(this.destroyed$)).subscribe(response => {
                let rate = response.body;
                if (rate) {
                    this.originalExchangeRate = rate;
                    this.exchangeRate = rate;
                    this.changeDetectorRef.detectChanges();
                }
            }, (error => {

            }));
        }
    }

    public focusAmountField() {
        setTimeout(() => {
            this.amountField?.nativeElement.focus();
        }, 200);
    }

    public loadPaymentModes() {
        const paymentMode: IOption[] = [];
        this.salesService.getAccountsWithCurrency('cash, bankaccounts').pipe(takeUntil(this.destroyed$)).subscribe(data => {
            if (data && data.body && data.body.results) {
                data.body.results.forEach(account => {
                    paymentMode.push({
                        label: account.name,
                        value: account.uniqueName,
                        additional: { currency: account.currency?.code || this.companyCurrencyName, currencySymbol: account.currency?.symbol || this.baseCurrencySymbol }
                    });
                });
            }
            this.paymentModes$ = observableOf(paymentMode);
            this.paymentMode = paymentMode;
            this.originalPaymentMode = paymentMode;
        });
    }

    /**
     * Assigns the number and currency
     *
     * @param {number} amount
     * @param {string} currencySymbol
     * @memberof InvoicePaymentModelComponent
     */
    public assignAmount(amount: number, currencySymbol: string): void {
        this.paymentActionFormObj.amount = String(amount);
        this.amountCurrency = currencySymbol;
    }
}
