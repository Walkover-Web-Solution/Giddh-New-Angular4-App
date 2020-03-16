import { Observable, of as observableOf, ReplaySubject } from 'rxjs';

import { takeUntil } from 'rxjs/operators';
import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, QueryList, SimpleChanges, ViewChild, ViewChildren } from '@angular/core';
import { ILedgersInvoiceResult, InvoicePaymentRequest } from '../../../../models/api-models/Invoice';
import * as moment from 'moment/moment';
import { GIDDH_DATE_FORMAT } from '../../../../shared/helpers/defaultDateFormat';
import { IOption } from '../../../../theme/ng-virtual-select/sh-options.interface';
import { IFlattenAccountsResultItem } from '../../../../models/interfaces/flattenAccountsResultItem.interface';
import { AppState } from '../../../../store';
import { SettingsTagActions } from '../../../../actions/settings/tag/settings.tag.actions';
import { select, Store } from '@ngrx/store';
import { ShSelectComponent } from '../../../../theme/ng-virtual-select/sh-select.component';
import { orderBy } from '../../../../lodash-optimized';
import { LedgerService } from "../../../../services/ledger.service";
import { ReceiptItem } from "../../../../models/api-models/recipt";
import { AccountService } from "../../../../services/account.service";
import { INameUniqueName } from "../../../../models/api-models/Inventory";
import { GeneralService } from "../../../../services/general.service";

@Component({
    selector: 'invoice-payment-model',
    templateUrl: './invoice.payment.model.component.html'
})

export class InvoicePaymentModelComponent implements OnInit, OnDestroy, OnChanges {

    @Input() public selectedInvoiceForDelete: ILedgersInvoiceResult;
    @Output() public closeModelEvent: EventEmitter<InvoicePaymentRequest> = new EventEmitter();
    @ViewChildren(ShSelectComponent) public allShSelectComponents: QueryList<ShSelectComponent>;
    @ViewChild('amountField') amountField;
    @Input() public selectedInvoiceForPayment: ReceiptItem;

    public paymentActionFormObj: InvoicePaymentRequest;
    public moment = moment;
    public showDatePicker: boolean = false;
    public showClearanceDatePicker: boolean = false;
    public paymentMode: IOption[] = [];
    public flattenAccountsStream$: Observable<IFlattenAccountsResultItem[]>;
    public isBankSelected: boolean = false;
    public tags: IOption[] = [];
    public dateMask = [/\d/, /\d/, '-', /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/];
    public isActionSuccess$: Observable<boolean> = observableOf(false);

    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

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

    constructor(
        private store: Store<AppState>,
        private _settingsTagActions: SettingsTagActions,
        private _ledgerService: LedgerService,
        private _accountService: AccountService,
        private _generalService: GeneralService
    ) {
        this.loadPaymentModes();
        this.flattenAccountsStream$ = this.store.pipe(select(s => s.general.flattenAccounts), takeUntil(this.destroyed$));

        this.paymentActionFormObj = new InvoicePaymentRequest();
        this.paymentActionFormObj.paymentDate = moment().toDate();
        this.isActionSuccess$ = this.store.pipe(select(s => s.invoice.invoiceActionUpdated), takeUntil(this.destroyed$));
        this.store.dispatch(this._settingsTagActions.GetALLTags());
        // get user country from his profile
        this.store.pipe(select(s => s.settings.profile), takeUntil(this.destroyed$)).subscribe(profile => {
            if (profile) {
                this.baseCurrencySymbol = profile.baseCurrencySymbol;
                this.companyCurrencyName = profile.baseCurrency;
            }
        });
        this.flattenAccountsStream$.subscribe(data => {
            if (data) {
                let paymentMode: IOption[] = [];
                data.forEach((item) => {
                    let findBankIndx = item.parentGroups.findIndex((grp) => grp.uniqueName === 'bankaccounts' || grp.uniqueName === 'cash');
                    if (findBankIndx !== -1) {
                        paymentMode.push({ label: item.name, value: item.uniqueName, additional: { parentUniqueName: item.parentGroups[1].uniqueName, currency: item.currency, currencySymbol: item.currencySymbol } });
                    }
                });
                this.paymentMode = paymentMode;
                this.originalPaymentMode = paymentMode;
            } else {
                this.paymentMode = [];
                this.originalPaymentMode = [];
            }
        });
    }

    public provideStrings = (arr: any[]) => {
        let o = { nameStr: [], uNameStr: [] };
        let b = { nameStr: '', uNameStr: '' };
        try {
            arr.forEach((item: INameUniqueName) => {
                o.nameStr.push(item.name);
                o.uNameStr.push(item.uniqueName);
            });
            b.nameStr = o.nameStr.join(', ');
            b.uNameStr = o.uNameStr.join(', ');
        } catch (error) {
            //
        }
        return b;
    };

    public ngOnInit() {
        this.store.pipe(select(s => s.settings.tags), takeUntil(this.destroyed$)).subscribe((tags => {
            if (tags && tags.length) {
                let arr: IOption[] = [];
                tags.forEach(tag => {
                    arr.push({ value: tag.name, label: tag.name });
                });
                this.tags = orderBy(arr, 'name');
            }
        }));

        this.isActionSuccess$.subscribe(a => {
            if (a) {
                this.resetFrom();
            }
        });

        this._generalService.invokeEvent.subscribe(value => {
            if (value === 'loadPaymentModes') {
                this.loadPaymentModes();
            }
        });
    }

    public onConfirmation(formObj) {
        formObj.paymentDate = moment(formObj.paymentDate).format(GIDDH_DATE_FORMAT);
        formObj.exchangeRate = this.exchangeRate;
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
        this.paymentActionFormObj.paymentDate = _.cloneDeep(moment(date).format(GIDDH_DATE_FORMAT));
        this.showDatePicker = !this.showDatePicker;
    }

    public setClearanceDate(date) {
        this.showClearanceDatePicker = !this.showClearanceDatePicker;
        this.paymentActionFormObj.chequeClearanceDate = _.cloneDeep(moment(date).format(GIDDH_DATE_FORMAT));
    }

    public onSelectPaymentMode(event) {
        if (event && event.value) {
            this.paymentActionFormObj.accountUniqueName = event.value;
            if (event.additional.parentUniqueName === 'bankaccounts') {
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

    }

    public onTagSelected(ev) {
        //
    }

    public resetFrom() {
        this.paymentActionFormObj = new InvoicePaymentRequest();
        this.paymentActionFormObj.paymentDate = moment().toDate();

        if (this.allShSelectComponents) {
            this.allShSelectComponents.forEach(sh => {
                sh.clear();
            });
        }

        this.isBankSelected = false;
        this.ngOnDestroy();
    }

    public ngOnDestroy() {
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }

    public ngOnChanges(c: SimpleChanges) {
        if (c.selectedInvoiceForPayment.currentValue) {
            this.loadPaymentModes();
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
            let date = moment().format('DD-MM-YYYY');
            this._ledgerService.GetCurrencyRateNewApi(from, to, date).subscribe(response => {
                let rate = response.body;
                if (rate) {
                    this.originalExchangeRate = rate;
                    this.exchangeRate = rate;
                }
            }, (error => {

            }));
        }
    }

    public focusAmountField() {
        this.amountField.nativeElement.focus();
    }

    public loadPaymentModes() {
        this._accountService.getFlattenAccounts().subscribe((res) => {
            if (res.status === 'success') {
                let arr = res.body.results;
                arr.map((item: any) => {
                    let o: any = this.provideStrings(item.parentGroups);
                    item.nameStr = o.nameStr;
                    item.uNameStr = o.uNameStr;
                    return item;
                });

                let paymentMode: IOption[] = [];
                arr.forEach((item) => {
                    let findBankIndx = item.parentGroups.findIndex((grp) => grp.uniqueName === 'bankaccounts' || grp.uniqueName === 'cash');
                    if (findBankIndx !== -1) {
                        paymentMode.push({ label: item.name, value: item.uniqueName, additional: { parentUniqueName: item.parentGroups[1].uniqueName, currency: item.currency, currencySymbol: item.currencySymbol } });
                    }
                });

                this.paymentModes$ = observableOf(paymentMode);
            }
        });
    }
}
